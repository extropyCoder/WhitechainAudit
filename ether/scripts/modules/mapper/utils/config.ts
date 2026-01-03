import {DepositType, MapInfo, WithdrawType} from "../interfaces/IMapper";
import * as GlobalConfig from "../../../../test/utils/GlobalConfig";

export const MainnetMapperRoutes = (): MapInfo[] => [
  // Bridge Mainnet >>> Whitechain USDC
  {
    originChainId: GlobalConfig.ETHEREUM_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.ETHEREUM_MAINNET_USDC_ADDRESS, // Mainnet USDC
    targetTokenAddress: GlobalConfig.WHITECHAIN_USDC_ADDRESS, // Whitechain USDC
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Bridge Mainnet >>> Whitechain WBT
  {
    originChainId: GlobalConfig.ETHEREUM_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.ETHEREUM_MAINNET_WBT_ADDRESS, // Mainnet WBT
    targetTokenAddress: GlobalConfig.WHITECHAIN_WWBT_ADDRESS, // Whitechain WWBT
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Receive Mainnet <<< Whitechain USDC
  {
    originChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_MAINNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.WHITECHAIN_USDC_ADDRESS, // Whitechain USDC
    targetTokenAddress: GlobalConfig.ETHEREUM_MAINNET_USDC_ADDRESS, // Mainnet USDC
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Receive Mainnet <<< Whitechain WBT
  {
    originChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_MAINNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.WHITECHAIN_WWBT_ADDRESS, // Whitechain WWBT
    targetTokenAddress: GlobalConfig.ETHEREUM_MAINNET_WBT_ADDRESS, // Mainnet WBT
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  }
];

export const SepoliaMapperRoutes = (): MapInfo[] => [
  // Bridge Sepolia >>> Whitechain Testnet USDT
  {
    originChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.SEPOLIA_USDT_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Bridge Sepolia >>> Whitechain Testnet USDC
  {
    originChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.SEPOLIA_USDC_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDC_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Bridge Sepolia >>> Whitechain Testnet WBT
  {
    originChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.SEPOLIA_WBT_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Receive Sepolia <<< Whitechain Testnet USDT
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
    targetTokenAddress: GlobalConfig.SEPOLIA_USDT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Receive Sepolia <<< Whitechain Testnet USDC
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDC_ADDRESS,
    targetTokenAddress: GlobalConfig.SEPOLIA_USDC_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  },
  // Receive Sepolia <<< Whitechain Testnet WBT
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
    targetTokenAddress: GlobalConfig.SEPOLIA_WBT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false
  }
];

export const WhitechainMapperRoutes = (): MapInfo[] => [
  // Bridge Whitechain >>> Mainnet USDC
  {
    originChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_MAINNET_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.WHITECHAIN_USDC_ADDRESS, // Whitechain USDC
    targetTokenAddress: GlobalConfig.ETHEREUM_MAINNET_USDC_ADDRESS, // Mainnet USDC
    useTransfer: false,
    isAllowed: true,
    isCoin: false,
  },
  // Bridge Whitechain >>> Mainnet WBT
  {
    originChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_MAINNET_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.WHITECHAIN_WWBT_ADDRESS, // Whitechain WWBT
    targetTokenAddress: GlobalConfig.ETHEREUM_MAINNET_WBT_ADDRESS, // Mainnet WBT
    useTransfer: false,
    isAllowed: true,
    isCoin: true,
  },
  // Bridge Whitechain >>> Tron WBT
  {
    originChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.TRON_MAINNET_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.WHITECHAIN_WWBT_ADDRESS, // Whitechain WWBT
    targetTokenAddress: GlobalConfig.TRON_WBT_ADDRESS, // Tron WBT
    useTransfer: false,
    isAllowed: true,
    isCoin: true,
  },
  // Receive Whitechain <<< Mainnet USDC
  {
    originChainId: GlobalConfig.ETHEREUM_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.ETHEREUM_MAINNET_USDC_ADDRESS, // Mainnet USDC
    targetTokenAddress: GlobalConfig.WHITECHAIN_USDC_ADDRESS, // Whitechain USDC
    useTransfer: false,
    isAllowed: true,
    isCoin: false,
  },
  // Receive Whitechain <<< Mainnet WBT
  {
    originChainId: GlobalConfig.ETHEREUM_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.ETHEREUM_MAINNET_WBT_ADDRESS, // Mainnet WBT
    targetTokenAddress: GlobalConfig.WHITECHAIN_WWBT_ADDRESS, // Whitechain WWBT
    useTransfer: false,
    isAllowed: true,
    isCoin: true,
  },
  // Receive Whitechain <<< Tron WBT
  {
    originChainId: GlobalConfig.TRON_MAINNET_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_MAINNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.TRON_WBT_ADDRESS, // Tron WBT
    targetTokenAddress: GlobalConfig.WHITECHAIN_WWBT_ADDRESS, // Whitechain WWBT
    useTransfer: false,
    isAllowed: true,
    isCoin: true,
  }
];

export const WhitechainTestnetMapperRoutes = (): MapInfo[] => [
  // Bridge Whitechain Testnet >>> Sepolia USDT
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
    targetTokenAddress: GlobalConfig.SEPOLIA_USDT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false,
  },
  // Bridge Whitechain Testnet >>> Sepolia USDC
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDC_ADDRESS,
    targetTokenAddress: GlobalConfig.SEPOLIA_USDC_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false,
  },
  // Bridge Whitechain Testnet >>> Sepolia WBT
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    targetChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
    targetTokenAddress: GlobalConfig.SEPOLIA_WBT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: true,
  },
  // Bridge Whitechain Testnet >>> Tron Nile USDT
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    targetChainId: GlobalConfig.TRON_NILE_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
    targetTokenAddress: GlobalConfig.NILE_USDT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false,
  },
  // Bridge Whitechain Testnet >>> Tron Nile WBT
  {
    originChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    targetChainId: GlobalConfig.TRON_NILE_ID.toString(),
    depositType: DepositType.Lock,
    withdrawType: WithdrawType.None,
    originTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
    targetTokenAddress: GlobalConfig.NILE_WBT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: true,
  },
  // Receive Whitechain Testnet <<< Sepolia USDT
  {
    originChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.SEPOLIA_USDT_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false,
  },
  // Receive Whitechain Testnet <<< Sepolia USDC
  {
    originChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.SEPOLIA_USDC_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDC_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false,
  },
  // Receive Whitechain Testnet <<< Sepolia WBT
  {
    originChainId: GlobalConfig.ETHEREUM_SEPOLIA_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.SEPOLIA_WBT_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: true,
  },
  // Receive Whitechain Testnet <<< Tron Nile USDT
  {
    originChainId: GlobalConfig.TRON_NILE_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.NILE_USDT_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_USDT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: false,
  },
  // Receive Whitechain Testnet <<< Tron Nile WBT
  {
    originChainId: GlobalConfig.TRON_NILE_ID.toString(),
    targetChainId: GlobalConfig.WHITECHAIN_TESTNET_ID.toString(),
    depositType: DepositType.None,
    withdrawType: WithdrawType.Unlock,
    originTokenAddress: GlobalConfig.NILE_WBT_ADDRESS,
    targetTokenAddress: GlobalConfig.WHITECHAIN_TESTNET_WWBT_ADDRESS,
    useTransfer: false,
    isAllowed: true,
    isCoin: true,
  }
];

export const WhitechainDevnetMapperRoutes = (): MapInfo[] => [];