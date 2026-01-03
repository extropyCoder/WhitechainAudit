import {time} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";

export const TEST_UTILS_ROUTE = 'contracts/tests/modules/utils/';
export const MAIN_UTILS_ROUTE = 'contracts/main/modules/';
export const EXAMPLE_TOKEN_CONTRACT_NAME = 'ExampleToken';
export const EXAMPLE_UUPS_TOKEN_CONTRACT_NAME = 'ExampleUUPSToken';

export const MAPPER_CONTRACT_NAME = "Mapper";
export const MAPPER_TEST_CONTRACT_NAME = "MapperTest";
export const BRIDGE_CONTRACT_NAME = "Bridge";
export const BRIDGE_TEST_CONTRACT_NAME = "BridgeTest";

export const MINUT_1: number = 60;
export const DAY_1: number = 86400;
export const MONTH_1: number = 2592000;
export const PERCENT_100: bigint = BigInt(100);

export const HARDHAT_ID = 1337;
export const ETHEREUM_MAINNET_ID = 1;
export const ETHEREUM_SEPOLIA_ID = 11155111;
export const WHITECHAIN_MAINNET_ID = 1875;
export const WHITECHAIN_TESTNET_ID = 2625;
export const WHITECHAIN_DEVNET_ID = 1000001000;
export const TRON_NILE_ID = 3448148188;
export const TRON_MAINNET_ID = 728126428;

export const ETHER_1: bigint = hre.ethers.parseEther("1"); //1 ether
export const ETHER_10: bigint = hre.ethers.parseEther("10"); //10 ether
export const ETHER_100: bigint = hre.ethers.parseEther("100"); //100 ether
export const ETHER_1000: bigint = hre.ethers.parseEther("1000"); //1000 ether
export const ETHER_10_000: bigint = hre.ethers.parseEther("10000"); //10000 ether

export const USDT_1: bigint = hre.ethers.parseUnits("1", 6); //1 USDT
export const USDT_10: bigint = hre.ethers.parseUnits("10", 6); //10 USDT
export const USDT_100: bigint = hre.ethers.parseUnits("100", 6); //100 USDT
export const USDT_1000: bigint = hre.ethers.parseUnits("1000", 6); //1000 USDT
export const USDT_10_000: bigint = hre.ethers.parseUnits("10000", 6); //10000 USDT

export const USDC_1: bigint = hre.ethers.parseUnits("1", 6); //1 USDC
export const USDC_10: bigint = hre.ethers.parseUnits("10", 6); //10 USDC
export const USDC_100: bigint = hre.ethers.parseUnits("100", 6); //100 USDC
export const USDC_1000: bigint = hre.ethers.parseUnits("1000", 6); //1000 USDC
export const USDC_10_000: bigint = hre.ethers.parseUnits("10000", 6); //10000 USDC

export const WBT_TOKEN_1: bigint = hre.ethers.parseUnits("1", 8); //1 WBT TOKEN
export const WBT_TOKEN_10: bigint = hre.ethers.parseUnits("10", 8); //10 WBT TOKEN
export const WBT_TOKEN_100: bigint = hre.ethers.parseUnits("100", 8); //100 WBT TOKEN
export const WBT_TOKEN_500: bigint = hre.ethers.parseUnits("500", 8); //500 WBT TOKEN
export const WBT_TOKEN_1000: bigint = hre.ethers.parseUnits("1000", 8); //1000 WBT TOKEN
export const WBT_TOKEN_10_000: bigint = hre.ethers.parseUnits("10000", 8); //10000 WBT TOKEN

export const WWBT_1: bigint = hre.ethers.parseUnits("1", 18); //1 WWBT TOKEN
export const WWBT_10: bigint = hre.ethers.parseUnits("10", 18); //10 WWBT TOKEN
export const WWBT_100: bigint = hre.ethers.parseUnits("100", 18); //100 WWBT TOKEN
export const WWBT_500: bigint = hre.ethers.parseUnits("500", 18); //500 WWBT TOKEN
export const WWBT_1000: bigint = hre.ethers.parseUnits("1000", 18); //1000 WWBT TOKEN
export const WWBT_10_000: bigint = hre.ethers.parseUnits("10000", 18); //10000 WWBT TOKEN

export const WBT_1: bigint = hre.ethers.parseEther("1"); //1 WBT
export const WBT_10: bigint = hre.ethers.parseEther("10"); //10 WBT
export const WBT_100: bigint = hre.ethers.parseEther("100"); //100 WBT
export const WBT_1000: bigint = hre.ethers.parseEther("1000"); //1000 WBT
export const WBT_10_000: bigint = hre.ethers.parseEther("10000"); //10000 WBT

export const PRIVATE_KEY_ACC_0: string = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
export const PRIVATE_KEY_ACC_1: string = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
export const PRIVATE_KEY_ACC_2: string = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
export const PRIVATE_KEY_ACC_3: string = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';
export const PRIVATE_KEY_ACC_4: string = '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a';
export const PRIVATE_KEY_ACC_5: string = '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba';

export const ETHEREUM_MAINNET_USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
export const ETHEREUM_MAINNET_WBT_ADDRESS = "0x925206b8a707096Ed26ae47C84747fE0bb734F59";

export const SEPOLIA_USDC_ADDRESS = "0x91b2e38c9b9acf8ef2b2c549bf7f86ff5b0108fd";
export const SEPOLIA_USDT_ADDRESS = "0x11101b4a88093bebbd901be8cf398f64714a7009";
export const SEPOLIA_WBT_ADDRESS = "0x3c6bf6821d5cc721f6bf41490b0d2a6963d2b031";

export const WHITECHAIN_USDC_ADDRESS = "0xF97B9Bf62916f1EB42Dd906a7254603e7b9FC4a7";
export const WHITECHAIN_WWBT_ADDRESS = "0xb044a2a1e3C3deb17e3602bF088811d9bDc762EA";

export const WHITECHAIN_TESTNET_USDC_ADDRESS = "0x4320bdf56a5e84c631a990b51c489b9410b7a6cd";
export const WHITECHAIN_TESTNET_WWBT_ADDRESS = "0x1cd97ab75c1ffdfda5a231ee9626deec7d46165b";
export const WHITECHAIN_TESTNET_USDT_ADDRESS = "0xb029c90b1642b507ba924bfc8cbc2826dc19ec4b";

export const TRON_WBT_ADDRESS = "TFptbWaARrWTX5Yvy3gNG5Lm8BmhPx82Bt";
export const TRON_USDT_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";

export const NILE_WBT_ADDRESS = "TGa8yeUzkCmuajSedYoPiA9bA8YBnvXvEL";
export const NILE_USDT_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";

export const nowTime = async function ():Promise<any> {
    return await time.latest();
}

