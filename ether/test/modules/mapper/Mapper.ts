import hre from "hardhat";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import {ZeroAddress} from "ethers";
import * as coreDeployment from "../../../ignition/core/deployment";
import * as GlobalConfig from "../../utils/GlobalConfig";
import {SignerWithAddress} from "@nomicfoundation/hardhat-ethers/signers";
import * as IMapper from "./interfaces/IMapper";
import {Mapper, MapperTest} from "../../../typechain-types";

chai.use(chaiAsPromised);

describe("Mapper", function () {

  let IS_LOCALHOST = true;
  let MapperContract: any;
  let Token0: any;
  let Token1: any;
  let Token2: any;
  let Token3: any;
  let Token4: any;
  let newMapInfo: IMapper.MapInfo;

  let initParams: IMapper.InitParams;

  let deployer: SignerWithAddress;
  let emergencyAddress: SignerWithAddress;
  let multisigAddress: SignerWithAddress;
  let user1: SignerWithAddress;

  const EMERGENCY_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("EMERGENCY_ROLE"));
  const MULTISIG_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("MULTISIG_ROLE"));

  const MAP_ID_1 = 1;
  const MAP_ID_2 = 2;
  const MAP_ID_3 = 3;

  const failMapId = 11111;

  beforeEach(async function () {
    const accounts = await hre.ethers.getSigners();

    deployer = accounts[0];
    emergencyAddress = accounts[1];
    multisigAddress = accounts[2];
    user1 = accounts[3];

    Token0 = await deployExampleToken();
    Token1 = await deployExampleToken();
    Token2 = await deployExampleToken();
    Token3 = await deployExampleToken();
    Token4 = await deployExampleToken();

    initParams = {
      emergencyAddress: emergencyAddress.address,
      multisigAddress: multisigAddress.address
    };

    const {contract} = await coreDeployment.deployUUPSProxy(
        IS_LOCALHOST,
        GlobalConfig.MAIN_UTILS_ROUTE + "mapper/" + GlobalConfig.MAPPER_CONTRACT_NAME + ".sol:" + GlobalConfig.MAPPER_CONTRACT_NAME,
        deployer,
        'initialize',
        initParams
    );

    MapperContract = contract as unknown as Mapper;

    newMapInfo = await setMapInfo(0);
  });

  async function setMapInfo(mapId: number): Promise<IMapper.MapInfo> {
    const originTokens: any[] = [Token0, Token1, Token2, Token3, Token4];
    const targetTokens: any[] = [Token1, Token2, Token3, Token4, Token0];

    return {
      originChainId: BigInt(GlobalConfig.HARDHAT_ID),
      targetChainId: (mapId % 2 === 0) ? BigInt(GlobalConfig.WHITECHAIN_DEVNET_ID) : BigInt(GlobalConfig.ETHEREUM_MAINNET_ID),
      depositType: IMapper.DepositType.Lock,
      withdrawType: IMapper.WithdrawType.None,
      originTokenAddress: hre.ethers.zeroPadValue(await originTokens[mapId].getAddress(), 32),
      targetTokenAddress: hre.ethers.zeroPadValue(await targetTokens[mapId].getAddress(), 32),
      useTransfer: false,
      isAllowed: (mapId % 2 === 0),
      isCoin: !(mapId % 2 === 0)
    }
  }

  async function deployExampleToken(): Promise<any> {
    const contract = await coreDeployment.deployContract(
        IS_LOCALHOST,
        GlobalConfig.EXAMPLE_TOKEN_CONTRACT_NAME,
        deployer,
        [GlobalConfig.ETHER_1 * 100_000_000n]
    );
    return contract;
  }

  async function registerMappings() {
    for (let mapId = 0; mapId < 5; ++mapId) {
      let mapInfo = await setMapInfo(mapId);

      const registerMappingTransaction = await MapperContract.connect(multisigAddress).registerMapping(mapInfo);
      expect(registerMappingTransaction).to.not.be.reverted;

    }
  }

  describe("Deployment", function () {
    it("Should deploy successfully with valid arguments", async function () {
       expect(await MapperContract.getAddress()).to.be.properAddress;
    });

    it("Should upgrade Mapper contract successfully with valid arguments", async function () {
      const MapperTest =
          await hre.ethers.getContractFactory(GlobalConfig.MAPPER_TEST_CONTRACT_NAME);
      const contract = await hre.upgrades.upgradeProxy(
          MapperContract.target,
          MapperTest.connect(multisigAddress)
      );
      let UpgradedMapper = contract as unknown as MapperTest;
      await expect(UpgradedMapper).to.not.be.reverted;
      expect(
          await UpgradedMapper.test()
      ).to.be.equal(0);
    });

    it("Unable to _authorizeUpgrade without Multisig role", async function () {
      const MapperTest =
          await hre.ethers.getContractFactory(GlobalConfig.MAPPER_TEST_CONTRACT_NAME);
      await expect(
          hre.upgrades.upgradeProxy(
              MapperContract.target,
              MapperTest.connect(user1)
          ),
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role ${MULTISIG_ROLE}`);
    });
  });

  describe("Initialize", function () {
    it("Cannot re-initialize Mapper contract", async function () {
      await expect(
          MapperContract.initialize(initParams),
      ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("The Multisig address must be defined", async function () {
      expect(await MapperContract.hasRole(MULTISIG_ROLE, multisigAddress.address)).to.be.equal(true);
    });

    it("The Emergency address must be defined", async function () {
      expect(await MapperContract.hasRole(EMERGENCY_ROLE, emergencyAddress.address)).to.be.equal(true);
    });
  });

  describe("registerMapping", async function () {
    it("Should be able to registerMapping", async function () {
      const registerMappingTransaction = await MapperContract.connect(multisigAddress).registerMapping(newMapInfo);
      expect(registerMappingTransaction).to.not.be.reverted;

      let mapCounter = await MapperContract.mapCounter();

      await expect(registerMappingTransaction)
          .to.emit(MapperContract, "RegisteredMapping")
          .withArgs(mapCounter, [
            newMapInfo.originChainId,
            newMapInfo.targetChainId,
            newMapInfo.depositType,
            newMapInfo.withdrawType,
            newMapInfo.originTokenAddress,
            newMapInfo.targetTokenAddress,
            newMapInfo.useTransfer,
            newMapInfo.isAllowed,
            newMapInfo.isCoin
          ]);

    });

    it("Should fail registerMapping if sender has NOT Multisig role", async function () {
      await expect(
          MapperContract.connect(user1).registerMapping(newMapInfo)
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role ${MULTISIG_ROLE}`);
    });

    it("Should fail to registerMapping with zero originTokenAddress", async function () {
      newMapInfo.originTokenAddress = hre.ethers.zeroPadValue(ZeroAddress, 32);
      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: Bytes must be not equal zero");
    });

    it("Should fail to registerMapping with zero targetTokenAddress", async function () {
      newMapInfo.targetTokenAddress = hre.ethers.zeroPadValue(ZeroAddress, 32);
      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: Bytes must be not equal zero");
    });

    it("Should fail to registerMapping with newMapInfo.originChainId NOT equal block.chainid", async function () {
      newMapInfo.originChainId = BigInt(GlobalConfig.WHITECHAIN_DEVNET_ID);
      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: ChainId must be equal to originChainId");
    });

    it("Should fail to registerMapping with newMapInfo.targetChainId NOT equal block.chainid", async function () {
      newMapInfo.targetChainId = BigInt(GlobalConfig.WHITECHAIN_DEVNET_ID);
      newMapInfo.depositType = IMapper.DepositType.None;
      newMapInfo.withdrawType = IMapper.WithdrawType.Unlock;
      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: ChainId must be equal to targetChainId");
    });

    it("Should fail to registerMapping with newMapInfo.depositType && newMapInfo.withdrawType equal None", async function () {
      newMapInfo.depositType = IMapper.DepositType.None;
      newMapInfo.withdrawType = IMapper.WithdrawType.None;
      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: Invalid map types");
    });

    it("Should fail to registerMapping where tokenStorage is busy", async function () {

      const registerMappingTransaction = await MapperContract.connect(multisigAddress).registerMapping(newMapInfo);
      expect(registerMappingTransaction).to.not.be.reverted;

      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: MapId must be equal to 0");

      newMapInfo.depositType = IMapper.DepositType.None;
      newMapInfo.withdrawType = IMapper.WithdrawType.Unlock;
      let targetChainId = newMapInfo.targetChainId;
      let originChainId = newMapInfo.originChainId;
      newMapInfo.targetChainId = originChainId;
      newMapInfo.originChainId = targetChainId;
      const registerMappingTransaction2 = await MapperContract.connect(multisigAddress).registerMapping(newMapInfo);
      expect(registerMappingTransaction2).to.not.be.reverted;

      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: MapId must be equal to 0");

      const mapCounter = await MapperContract.mapCounter();

      expect(mapCounter).to.be.equal(2);
    });

    it("Should fail to registerMapping where depositType != Lock && isCoin == true", async function () {
      newMapInfo.isCoin = true;
      newMapInfo.depositType = IMapper.DepositType.Burn;
      newMapInfo.withdrawType = IMapper.WithdrawType.None;
      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: DepositType must be equal to Lock");

      newMapInfo.depositType = IMapper.DepositType.Lock;
      const registerMappingTransaction2 = await MapperContract.connect(multisigAddress).registerMapping(newMapInfo);
      expect(registerMappingTransaction2).to.not.be.reverted;
    });

    it("Should fail to registerMapping where WithdrawType != Unlock && isCoin == true", async function () {
      newMapInfo.isCoin = true;
      newMapInfo.depositType = IMapper.DepositType.None;
      newMapInfo.withdrawType = IMapper.WithdrawType.Mint;
      let targetChainId = newMapInfo.targetChainId;
      let originChainId = newMapInfo.originChainId;
      newMapInfo.targetChainId = originChainId;
      newMapInfo.originChainId = targetChainId;
      await expect(
          MapperContract.connect(multisigAddress).registerMapping(newMapInfo)
      ).to.be.revertedWith("Mapper: WithdrawType must be equal to Unlock");

      newMapInfo.withdrawType = IMapper.WithdrawType.Unlock;
      const registerMappingTransaction2 = await MapperContract.connect(multisigAddress).registerMapping(newMapInfo);
      expect(registerMappingTransaction2).to.not.be.reverted;
    });

    it("Should be able registerMapping where WithdrawType != Unlock && isCoin == false", async function () {
      newMapInfo.isCoin = false;
      newMapInfo.depositType = IMapper.DepositType.None;
      newMapInfo.withdrawType = IMapper.WithdrawType.Unlock;
      let targetChainId = newMapInfo.targetChainId;
      let originChainId = newMapInfo.originChainId;
      newMapInfo.targetChainId = originChainId;
      newMapInfo.originChainId = targetChainId;
      const registerMappingTransaction2 = await MapperContract.connect(multisigAddress).registerMapping(newMapInfo);
      expect(registerMappingTransaction2).to.not.be.reverted;
    });

  });

  describe("enableMapping", async function () {

    async function enableMappingAndCheck(mapId: number, expectedAllowedBefore: boolean, expectedAllowedAfter: boolean) {
      await registerMappings();

      let oldMapInfo: IMapper.MapInfo = await MapperContract.mapInfo(mapId);
      expect(oldMapInfo.isAllowed).to.be.equal(expectedAllowedBefore);

      const enableMappingTransaction = await MapperContract.connect(multisigAddress).enableMapping(mapId);
      expect(enableMappingTransaction).to.not.be.reverted;

      let newMapInfo: IMapper.MapInfo = await MapperContract.mapInfo(mapId);
      expect(newMapInfo.isAllowed).to.be.equal(expectedAllowedAfter);

      await expect(enableMappingTransaction)
          .to.emit(MapperContract, "EnabledMapping")
          .withArgs(mapId, [
            newMapInfo.originChainId,
            newMapInfo.targetChainId,
            newMapInfo.depositType,
            newMapInfo.withdrawType,
            newMapInfo.originTokenAddress,
            newMapInfo.targetTokenAddress,
            newMapInfo.useTransfer,
            newMapInfo.isAllowed,
            newMapInfo.isCoin
          ]);

    }

    it("Should be able to enableMapping", async function () {
      await enableMappingAndCheck(MAP_ID_2, false, true);
    });

    it("Should fail enableMapping if sender has NOT Multisig role", async function () {
      await registerMappings();
      await expect(
          MapperContract.connect(user1).enableMapping(MAP_ID_2)
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role ${MULTISIG_ROLE}`);
    });

    it("Should fail enableMapping if mapCounter >= mapId", async function () {
      await enableMappingAndCheck(MAP_ID_2, false, true);

      await MapperContract.mapCounter();

      await expect(
          MapperContract.connect(multisigAddress).enableMapping(failMapId)
      ).to.be.revertedWith("Mapper: MapCounter must be greater than or equal mapId");
    });

    it("Should fail enableMapping if isAllowed == true", async function () {
      await registerMappings();
      let oldMapInfo: IMapper.MapInfo = await MapperContract.mapInfo(MAP_ID_2);
      expect(oldMapInfo.isAllowed).to.be.equal(false);
      const enableMappingTransaction = await MapperContract.connect(multisigAddress).enableMapping(MAP_ID_2);
      expect(enableMappingTransaction).to.not.be.reverted;

      await expect(
          MapperContract.connect(multisigAddress).enableMapping(MAP_ID_2)
      ).to.be.revertedWith("Mapper: IsAllowed must be false");
    });

  });

  describe("disableMapping", async function () {

    async function disableMappingAndCheck(mapId: number, expectedAllowedBefore: boolean, expectedAllowedAfter: boolean) {
      await registerMappings();

      let oldMapInfo: IMapper.MapInfo = await MapperContract.mapInfo(mapId);
      expect(oldMapInfo.isAllowed).to.be.equal(expectedAllowedBefore);

      const disableMappingTransaction = await MapperContract.connect(emergencyAddress).disableMapping(mapId);
      expect(disableMappingTransaction).to.not.be.reverted;

      let newMapInfo: IMapper.MapInfo = await MapperContract.mapInfo(mapId);
      expect(newMapInfo.isAllowed).to.be.equal(expectedAllowedAfter);

      await expect(disableMappingTransaction)
          .to.emit(MapperContract, "DisabledMapping")
          .withArgs(mapId, [
            newMapInfo.originChainId,
            newMapInfo.targetChainId,
            newMapInfo.depositType,
            newMapInfo.withdrawType,
            newMapInfo.originTokenAddress,
            newMapInfo.targetTokenAddress,
            newMapInfo.useTransfer,
            newMapInfo.isAllowed,
            newMapInfo.isCoin
          ]);
    }

    it("Should be able to disableMapping", async function () {
      await disableMappingAndCheck(MAP_ID_3, true, false);
    });

    it("Should fail disableMapping if sender has NOT Emergency role", async function () {
      await registerMappings();
      await expect(
          MapperContract.connect(user1).disableMapping(MAP_ID_3)
      ).to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role ${EMERGENCY_ROLE}`);
    });

    it("Should fail disableMapping if mapCounter >= mapId", async function () {
      await disableMappingAndCheck(MAP_ID_3, true, false);

      let mapCounter = await MapperContract.mapCounter();
      await expect(
          MapperContract.connect(emergencyAddress).disableMapping(failMapId)
      ).to.be.revertedWith("Mapper: MapCounter must be greater than or equal mapId");
    });

    it("Should fail disableMapping if isAllowed == false", async function () {
      await registerMappings();
      let oldMapInfo: IMapper.MapInfo = await MapperContract.mapInfo(MAP_ID_1);
      expect(oldMapInfo.isAllowed).to.be.equal(true);
      const disableMappingTransaction = await MapperContract.connect(emergencyAddress).disableMapping(MAP_ID_1);
      expect(disableMappingTransaction).to.not.be.reverted;


      await expect(
          MapperContract.connect(emergencyAddress).disableMapping(MAP_ID_1)
      ).to.be.revertedWith("Mapper: IsAllowed must be true");
    });
  });
});