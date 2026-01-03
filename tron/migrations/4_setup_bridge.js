const tronConfig = require('../tronbox.js');
const Config = require("./utils/config.js");
const { TronWeb } = require('tronweb');

const BRIDGE_CONTRACT_NAME = "Bridge";
const Bridge = artifacts.require(BRIDGE_CONTRACT_NAME);

module.exports = async function (deployer, network, accounts) {
    let fullHost;
    if (network === 'mainnet') {
        fullHost = tronConfig.networks.mainnet.fullHost;
    } else if (network === 'nile') {
        fullHost = tronConfig.networks.nile.fullHost;
    }
    const tronWeb = new TronWeb({ fullHost: fullHost });

    if (process.env.SETUP !== "Bridge") {
        console.log("Setup migration skipped");
        return;
    }

    let BridgeContract;
    let bridgeLimits;

    let bridgeAddress = process.env[`${network.toUpperCase()}_BRIDGE_ADDRESS`] || "";
    if (!bridgeAddress || bridgeAddress.trim() === "") {
        throw new Error(`Error: Environment variable ${network.toUpperCase()}_BRIDGE_ADDRESS is not set or empty`);
    }

    let relayerAddress = process.env[`${network.toUpperCase()}_RELAYER_ADDRESS`] || "";
    if (!relayerAddress || relayerAddress.trim() === "") {
        throw new Error(`Error: Environment variable ${network.toUpperCase()}_RELAYER_ADDRESS is not set or empty`);
    }

    BridgeContract = await Bridge.at(bridgeAddress);
    await getMultisigBalance(tronWeb, accounts);

    if (network == Config.NETWORK_MAINNET) {
        bridgeLimits = Config.MainnetBridgeLimits(relayerAddress);
    } else if (network == Config.NETWORK_NILE) {
        bridgeLimits = Config.NileBridgeLimits(relayerAddress);
    } else {
        throw new Error(`Error: Network not supported: ${network}`);
    }

    if (bridgeLimits.length == 0) {
        throw new Error(`Error: bridgeLimits is empty`);
    }

    let registerDailyLimitParams = formatParams(bridgeLimits);

    await registerDailyLimit(registerDailyLimitParams, BridgeContract);

    async function registerDailyLimit(bridgeLimits, Contract) {
        const results = [];

        for (let i = 0; i < bridgeLimits.length; i++) {
            const params = bridgeLimits[i];

            try {
                console.log("🔍 BridgeContract loaded:", Contract.address);

                const txid = await Contract.setDailyLimit(...params);
                if (!txid) throw new Error('No txid in response');
                console.log(`🚀 Sent tx hash: ${txid}`);

                const receipt = await waitTx(txid, tronWeb);

                if (receipt?.receipt.result !== 'SUCCESS') {
                    const msg = receipt?.resMessage ? Buffer.from(receipt.resMessage, 'hex').toString() : '';
                    throw new Error(`Error: Transaction failed (result=${receipt?.receipt.result || 'UNKNOWN'}) ${ msg ? `: ${msg}` : '' }`);
                }

                results.push({
                    index: i,
                    txHash: txid.hash,
                    status: receipt?.receipt.result,
                });
                console.log(`✅ Success sending`);
            } catch (err) {
                console.error(`❌ Error sending:`, err.message);
                results.push({
                    index: i,
                    status: 'error',
                    error: err.message,
                });
            }
        }
        await getMultisigBalance(tronWeb, accounts);
    }

    async function waitTx(txid, tronWeb, tries = 20, delayMs = 2000) {
        for (let i = 0; i < tries; i++) {
            const info = await tronWeb.trx.getTransactionInfo(txid);
            if (info && Object.keys(info).length) return info;
            process.stdout.write('.');
            await new Promise(r => setTimeout(r, delayMs));
        }
        console.log("");
        throw new Error(`Error: Timeout waiting for tx ${txid}`);
    }

    function formatParams(bridgeLimits) {
        const formatted = [];

        for (let i = 0; i < bridgeLimits.length; i++) {
            const tokenAddress = toBytes32(bridgeLimits[i].token);
            const relayerAddress = '0x' + tronWeb.address.toHex(bridgeLimits[i].relayer).slice(2);

            formatted.push([
                tokenAddress,
                relayerAddress,
                bridgeLimits[i].limit
            ]);
        }

        return formatted;
    }

    function toBytes32(address) {
        let hexPart;

        if (address.startsWith('T')) {
            const hexAddress = tronWeb.address.toHex(address);
            hexPart = hexAddress.slice(2);
        } else if (address.startsWith('0x')) {
            hexPart = address.slice(2).toLowerCase();
        } else {
            throw new Error(`Error: Unknown address format: ${address}`);
        }

        if (hexPart.length !== 40) {
            throw new Error(`Error: Invalid address length: ${address}`);
        }

        return '0x' + hexPart.padStart(64, '0');
    }

    async function getMultisigBalance(tronWeb, base58Address){
        const balanceSun = await tronWeb.trx.getBalance(base58Address);
        const balanceTRX = tronWeb.fromSun(balanceSun);
        console.log(`Account: ${base58Address} - Balance: ${balanceTRX} `);
        return balanceSun;
    }
};
