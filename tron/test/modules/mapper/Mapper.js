const tronConfig = require("../../../tronbox");
const Mapper = artifacts.require("Mapper");
const { TronWeb } = require('tronweb');
const utils = require("../utils/utils");

contract("Mapper", (accounts) => {
    let MapperContract;
    let newMapInfo;
    const tronWeb = new TronWeb({ fullHost: tronConfig.networks.nile.fullHost });

    const EMERGENCY_ADDRESS = process.env[`NILE_EMERGENCY_ADDRESS`] || "";
    const MULTISIG_ADDRESS = process.env[`NILE_MULTISIG_ADDRESS`] || "";
    const MAPPER_ADDRESS = process.env[`NILE_MAPPER_ADDRESS`] || "";

    if (!MAPPER_ADDRESS || MAPPER_ADDRESS.trim() === "" || !EMERGENCY_ADDRESS || EMERGENCY_ADDRESS.trim() === "" || !MULTISIG_ADDRESS || MULTISIG_ADDRESS.trim() === "") {
        throw new Error('Environment variable MAPPER_ADDRESS || EMERGENCY_ADDRESS || MULTISIG_ADDRESS is not set or empty');
    }

    before(async () => {
        newMapInfo = await utils.setMapInfo(0);
        MapperContract = await Mapper.at(MAPPER_ADDRESS);
    });

    describe("Deployment", function () {

        it("should check MULTISIG_ROLE", async () => {
            const multisigAddress = await MapperContract.hasRole(await MapperContract.MULTISIG_ROLE(), MULTISIG_ADDRESS);

            assert.equal(multisigAddress, true, "Multisig address mismatch");
        });

        it("should check EMERGENCY_ROLE", async () => {
            const emergencyAddress = await MapperContract.hasRole(await MapperContract.EMERGENCY_ROLE(), EMERGENCY_ADDRESS);

            assert.equal(emergencyAddress, true, "Emergency address mismatch");
        });

    });

    describe("registerMapping", async function () {

        it.skip("Should be able to registerMapping", async function () {
            let oldMapCounter = await MapperContract.mapCounter();
            let newMapInfo = await utils.setMapInfo(1);
            await MapperContract.registerMapping(newMapInfo);
            let newMapCounter = await MapperContract.mapCounter();

            assert.equal(newMapCounter, oldMapCounter.add(1), "mapCounter should be incremented by 1");
        });

        it("Should return correct token addresses for given chain pair", async function () {
            let newMapInfo = await utils.setMapInfo(0);
            const mapId = await MapperContract.withdrawAllowedTokens(newMapInfo[0], newMapInfo[5]);
            const mapInfo = await MapperContract.mapInfo(mapId[0]);
            const originAddress = utils.bytes32ToAddress(mapInfo.originTokenAddress, false);
            const targetAddress = utils.bytes32ToAddress(mapInfo.targetTokenAddress, true);

            assert.equal(originAddress.toLowerCase(), utils.mapRouteTokens[0][0].toLowerCase(), "Origin address does not match the first origin address");
            assert.equal(targetAddress.toLowerCase(), utils.mapRouteTokens[0][1].toLowerCase(), "Еarget address does not match the first target address");
        });

    });

});