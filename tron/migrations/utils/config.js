const GlobalConfig = require("../../test/modules/utils/GlobalConfig");

const NETWORK_MAINNET = 'mainnet';
const NETWORK_NILE = 'nile';
const ZERO_HASH = "0x0000000000000000000000000000000000000000";

/*
 * @notice Enum representing the type of deposit.
 * Used to specify how tokens are handled during deposit.
 * - `None`: No deposit allowed.
 * - `Lock`: Tokens are locked in the contract.
 * - `Burn`: Tokens are burned from the user's balance.
 */
const DepositType = {
  None: 0,
  Lock: 1,
  Burn: 2
}

/*
 * @notice Enum representing the type of withdrawal.
 * Used to specify how tokens are handled during withdrawal.
 * - `None`: No withdrawal allowed.
 * - `Unlock`: Tokens are unlocked from the contract.
 * - `Mint`: New tokens are minted on the target chain.
 */
const WithdrawType = {
  None: 0,
  Unlock: 1,
  Mint: 2
}

const MainnetMapperRoutes = [
  // Bridge Tron >>> Whitechain WBT
  {
    originChainId: GlobalConfig.TRON_MAINNET_ID,
    targetChainId: GlobalConfig.WHITECHAIN_MAINNET_ID,
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.TRON_WBT_ADDRESS, // Tron WBT
    targetTokenAddress: GlobalConfig.WHITECHAIN_WWBT_ADDRESS, // Whitechain WWBT
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Receive Tron <<< Whitechain WBT
  {
    originChainId: GlobalConfig.WHITECHAIN_MAINNET_ID,
    targetChainId: GlobalConfig.TRON_MAINNET_ID,
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.WHITECHAIN_WWBT_ADDRESS, // Whitechain WWBT
    targetTokenAddress: GlobalConfig.TRON_WBT_ADDRESS, // Tron WBT
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  }
];

const NileMapperRoutes = [
  // Bridge Tron Nile >>> Whitechain Testnet USDT
  {
    originChainId: GlobalConfig.TRON_NILE_ID,
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID,
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.TRON_USDT_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
    useTransfer: true,
    isAllowed: true,
    isCoin: false
  },
  // Bridge Tron Nile >>> Whitechain Testnet WBT
  {
    originChainId: GlobalConfig.TRON_NILE_ID,
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID,
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.NILE_WBT_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Receive Tron Nile <<< Whitechain Testnet USDT
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID,
    targetChainId: GlobalConfig.TRON_NILE_ID,
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
    targetTokenAddress: GlobalConfig.TRON_USDT_ADDRESS,
    useTransfer: true,
    isAllowed: true,
    isCoin: false
  },
  // Receive Tron Nile <<< Whitechain Testnet WBT
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID,
    targetChainId: GlobalConfig.TRON_NILE_ID,
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
    targetTokenAddress: GlobalConfig.NILE_WBT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  }
];

const MainnetBridgeLimits = (relayerAddress) => [
  {
    token: ZERO_HASH, // Mainnet TRX
    relayer: relayerAddress,
    limit: GlobalConfig.TRX_1000 // 1000 TRX
  },
  {
    token: GlobalConfig.TRON_WBT_ADDRESS, // Mainnet WBT
    relayer: relayerAddress,
    limit: GlobalConfig.WBT_TOKEN_500 // 500 WBT
  }
];

const NileBridgeLimits = (relayerAddress) => [
  {
    token: ZERO_HASH, // Nile TRX
    relayer: relayerAddress,
    limit: GlobalConfig.TRX_1000 // 1000 TRX
  },
  {
    token: GlobalConfig.NILE_USDT_ADDRESS, // Nile USDT
    relayer: relayerAddress,
    limit: GlobalConfig.USDT_10_000 // 10000 USDT
  },
  {
    token: GlobalConfig.NILE_WBT_ADDRESS, // Nile WBT
    relayer: relayerAddress,
    limit: GlobalConfig.WBT_TOKEN_10_000 // 10000 WBT
  }
];

module.exports = {
  NETWORK_MAINNET,
  NETWORK_NILE,
  MainnetMapperRoutes,
  NileMapperRoutes,
  MainnetBridgeLimits,
  NileBridgeLimits
};