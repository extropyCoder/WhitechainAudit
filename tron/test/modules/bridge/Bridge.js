const tronConfig = require("../../../tronbox");
const Bridge = artifacts.require("Bridge");
const Mapper = artifacts.require("Mapper");
const { TronWeb } = require('tronweb');
const { ethers } = require("ethers");
const utils = require("../utils/utils");
const GlobalConfig = require("../utils/GlobalConfig");

contract("Bridge", (accounts) => {
    let BridgeContract;
    let MapperContract;
    let newMapInfo;
    const tronWeb = new TronWeb({ fullHost: tronConfig.networks.nile.fullHost });

    const EMERGENCY_ADDRESS = process.env[`NILE_EMERGENCY_ADDRESS`] || "";
    const MULTISIG_ADDRESS = process.env[`NILE_MULTISIG_ADDRESS`] || "";
    const RELAYER_ADDRESS = process.env[`NILE_RELAYER_ADDRESS`] || "";
    const BRIDGE_ADDRESS = process.env[`NILE_BRIDGE_ADDRESS`] || "";
    const MAPPER_ADDRESS = process.env[`NILE_MAPPER_ADDRESS`] || "";


    if (!BRIDGE_ADDRESS || BRIDGE_ADDRESS.trim() === "" ||
        !EMERGENCY_ADDRESS || EMERGENCY_ADDRESS.trim() === "" ||
        !MULTISIG_ADDRESS || MULTISIG_ADDRESS.trim() === "" ||
        !RELAYER_ADDRESS || RELAYER_ADDRESS.trim() === "" ||
        !MAPPER_ADDRESS || MAPPER_ADDRESS.trim() === "") {
        throw new Error('Environment variable BRIDGE_ADDRESS || MAPPER_ADDRESS || EMERGENCY_ADDRESS || MULTISIG_ADDRESS || RELAYER_ADDRESS is not set or empty');
    }

    before(async () => {
        newMapInfo = await utils.setMapInfo(0);
        BridgeContract = await Bridge.at(BRIDGE_ADDRESS);
        MapperContract = await Mapper.at(MAPPER_ADDRESS);
    });

    describe("Deployment", function () {

        it("should check MULTISIG_ROLE", async () => {
            const multisigAddress = await BridgeContract.hasRole(await BridgeContract.MULTISIG_ROLE(), MULTISIG_ADDRESS);

            assert.equal(multisigAddress, true, "Multisig address mismatch");
        });

        it("should check EMERGENCY_ROLE", async () => {
            const emergencyAddress = await BridgeContract.hasRole(await BridgeContract.EMERGENCY_ROLE(), EMERGENCY_ADDRESS);

            assert.equal(emergencyAddress, true, "Emergency address mismatch");
        });

        it("should check RELAYER_ROLE", async () => {
            const relayerAddress = await BridgeContract.hasRole(await BridgeContract.RELAYER_ROLE(), RELAYER_ADDRESS);

            assert.equal(relayerAddress, true, "Relayer address mismatch");
        });

    });

    describe("depositTokens", async function () {

        it.skip("depositTokens to BridgeContract", async function () {
            const amount = GlobalConfig.USDT_1;
            const mapId = await MapperContract.withdrawAllowedTokens(newMapInfo[0], newMapInfo[5]);
            const depositTokensTransaction = await BridgeContract.depositTokens(mapId[0], amount);
            console.log(depositTokensTransaction);
        });

    });

    describe("receiveTokens", async function () {

        it("Should be able to receiveTokens Tokens", async function () {
            newMapInfo = await utils.setMapInfo(1);
            let externalId = ethers.encodeBytes32String("externalId");
            let amount = 99999;
            const mapId = await MapperContract.withdrawAllowedTokens(newMapInfo[0], newMapInfo[5]);

            await BridgeContract.receiveTokens([
                externalId,
                mapId[0],
                amount,
                utils.toBytes32(RELAYER_ADDRESS),
                utils.toBytes32(RELAYER_ADDRESS)
            ]);
        });

    });

});