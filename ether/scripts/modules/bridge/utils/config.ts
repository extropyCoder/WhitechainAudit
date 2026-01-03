import * as hre from 'hardhat';
import { DailyLimitParams } from "../../../../test/modules/bridge/interfaces/IBridge";
import * as GlobalConfig from "../../../../test/utils/GlobalConfig";

let relayerAddress = process.env[`${hre.network.name.toUpperCase()}_RELAYER_ADDRESS`] || "";
if (!relayerAddress || relayerAddress.trim() === "") {
  throw new Error(`Error: Environment variable ${hre.network.name.toUpperCase()}_RELAYER_ADDRESS is not set or empty`);
}

export const MainnetBridgeLimits = (): DailyLimitParams[] => [
  {
    token: hre.ethers.ZeroHash, // Mainnet Ether
    relayer: relayerAddress,
    limit: GlobalConfig.ETHER_1000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.ETHEREUM_MAINNET_USDC_ADDRESS, 32), // Mainnet USDC
    relayer: relayerAddress,
    limit: GlobalConfig.USDC_10_000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.ETHEREUM_MAINNET_WBT_ADDRESS, 32), // Mainnet WBT
    relayer: relayerAddress,
    limit: GlobalConfig.WBT_TOKEN_500
  }
];

export const SepoliaBridgeLimits = (): DailyLimitParams[] => [
  {
    token: hre.ethers.ZeroHash, // Sepolia Ether
    relayer: relayerAddress,
    limit: GlobalConfig.ETHER_1000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.SEPOLIA_USDC_ADDRESS, 32), // Sepolia USDC
    relayer: relayerAddress,
    limit: GlobalConfig.USDC_10_000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.SEPOLIA_USDT_ADDRESS, 32), // Sepolia USDT
    relayer: relayerAddress,
    limit: GlobalConfig.USDT_10_000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.SEPOLIA_WBT_ADDRESS, 32), // Sepolia WBT
    relayer: relayerAddress,
    limit: GlobalConfig.WBT_TOKEN_1000
  }
];

export const WhitechainBridgeLimits = (): DailyLimitParams[] => [
  {
    token: hre.ethers.ZeroHash, // Whitechain WBT
    relayer: relayerAddress,
    limit: GlobalConfig.ETHER_1000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.WHITECHAIN_USDC_ADDRESS, 32), // Whitechain USDC
    relayer: relayerAddress,
    limit: GlobalConfig.USDC_10_000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.WHITECHAIN_WWBT_ADDRESS, 32), // Whitechain WWBT
    relayer: relayerAddress,
    limit: GlobalConfig.WWBT_500
  }
];

export const WhitechainTestnetBridgeLimits = (): DailyLimitParams[] => [
  {
    token: hre.ethers.ZeroHash, // Whitechain Testnet WBT
    relayer: relayerAddress,
    limit: GlobalConfig.ETHER_1000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS, 32), // Whitechain Testnet WWBT
    relayer: relayerAddress,
    limit: GlobalConfig.WWBT_10_000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS, 32), // Whitechain Testnet USDT
    relayer: relayerAddress,
    limit: GlobalConfig.USDT_10_000
  },
  {
    token: hre.ethers.zeroPadValue(GlobalConfig.WHITECHAIN_TESTNET_USDC_ADDRESS, 32), // Whitechain Testnet USDC
    relayer: relayerAddress,
    limit: GlobalConfig.USDC_10_000
  }
];

export const WhitechainDevnetBridgeLimits = (): DailyLimitParams[] => [];