const GlobalConfig = require("./GlobalConfig");

const TEST_TOKEN_ADDRESS = "TF2UyUXtP8jfHekKm3tZnE4s8LakoWqC15";
const mapRouteTokens = [
    [
        GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
        GlobalConfig.TRON_USDT_ADDRESS
    ],
    [
        GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
        GlobalConfig.TRON_USDT_ADDRESS
    ],
    [
        GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
        TEST_TOKEN_ADDRESS
    ]
];

async function setMapInfo(mapId) {
    const originBytes32 = toBytes32(mapRouteTokens[mapId][0]);
    const targetBytes32 = toBytes32(mapRouteTokens[mapId][1]);

    return [
        BigInt(GlobalConfig.WHITECHAIN_TESTNET_ID),
        BigInt(GlobalConfig.TRON_NILE_ID),
        0,
        1,
        originBytes32,
        targetBytes32,
        true,
        false
    ];
}

function toBytes32(address) {
    let hexPart;

    if (address.startsWith('T')) {
        const hexAddress = tronWeb.address.toHex(address);
        hexPart = hexAddress.slice(2);
    } else if (address.startsWith('0x')) {
        hexPart = address.slice(2).toLowerCase();
    } else {
        throw new Error(`Unknown address format: ${address}`);
    }

    if (hexPart.length !== 40) {
        throw new Error(`Invalid address length: ${address}`);
    }

    return '0x' + hexPart.padStart(64, '0');
}

function bytes32ToAddress(bytes32, isTron = false) {
    const clean = bytes32.replace(/^0x/, '').slice(24);
    if (isTron) {
        return tronWeb.address.fromHex('41' + clean);
    } else {
        return '0x' + clean;
    }
}

module.exports = {
    mapRouteTokens,
    setMapInfo,
    toBytes32,
    bytes32ToAddress
};