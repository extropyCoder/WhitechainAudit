import * as hre from 'hardhat';
import * as Config from "./core/config";
import * as GlobalConfig from "../test/utils/GlobalConfig";
import * as deploymentCore from "./core/deployment";
import * as IBridge from "../test/modules/bridge/interfaces/IBridge";
import * as IMapper from "../test/modules/mapper/interfaces/IMapper";

async function main() {
    const IS_LOCALHOST: boolean = hre.network.name == Config.NETWORK_LOCALHOST;

    let {deployer} = await deploymentCore.start();
    let mapperContract: any;

    const EMERGENCY_ADDRESS: string = process.env[`${hre.network.name.toUpperCase()}_EMERGENCY_ADDRESS`] || "";
    const MULTISIG_ADDRESS: string = process.env[`${hre.network.name.toUpperCase()}_MULTISIG_ADDRESS`] || "";
    const RELAYER_ADDRESS: string = process.env[`${hre.network.name.toUpperCase()}_RELAYER_ADDRESS`] || "";

    if (deploymentCore.getContractName() == GlobalConfig.MAPPER_CONTRACT_NAME) {
        let mapperInitParams: IMapper.InitParams = {
            emergencyAddress: EMERGENCY_ADDRESS,
            multisigAddress: MULTISIG_ADDRESS
        };

        mapperContract = await deploymentCore.deployUUPSProxy(
            IS_LOCALHOST,
            "contracts/main/modules/mapper/Mapper.sol:Mapper",
            deployer,
            "initialize",
            mapperInitParams
        );
    }

    let bridgeContract: any;
    if (deploymentCore.getContractName() == GlobalConfig.BRIDGE_CONTRACT_NAME) {
        const MAPPER_ADDRESS: string = process.env[`${hre.network.name.toUpperCase()}_MAPPER_ADDRESS`] || "";

        let bridgeInitParams: IBridge.InitParams = {
            mapperAddress: MAPPER_ADDRESS,
            emergencyAddress: EMERGENCY_ADDRESS,
            multisigAddress: MULTISIG_ADDRESS,
            relayerAddress: RELAYER_ADDRESS
        };

        bridgeContract = await deploymentCore.deployUUPSProxy(
            IS_LOCALHOST,
            GlobalConfig.BRIDGE_CONTRACT_NAME,
            deployer,
            "initialize",
            bridgeInitParams
        );
    }

    console.log("");

    if (deploymentCore.getContractName() == GlobalConfig.MAPPER_CONTRACT_NAME) {
        await deploymentCore.showResult(mapperContract.contract, GlobalConfig.MAPPER_CONTRACT_NAME);
    }
    if (deploymentCore.getContractName() == GlobalConfig.BRIDGE_CONTRACT_NAME) {
        await deploymentCore.showResult(bridgeContract.contract, GlobalConfig.BRIDGE_CONTRACT_NAME);
    }

    await deploymentCore.finish();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});