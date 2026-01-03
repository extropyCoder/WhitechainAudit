import * as hre from 'hardhat';
import * as UtilsConfig from "./utils/config";
import * as GlobalConfig from "../../../test/utils/GlobalConfig";
import { Bridge } from "../../../typechain-types";
import * as Config from "../../../ignition/core/config";
import { _getTicker } from "../../../ignition/core/deployment";
import { DailyLimitParams } from "../../../test/modules/bridge/interfaces/IBridge";
import console from "node:console";

let multisig: any;
let BridgeContract: any;
let bridgeLimits: DailyLimitParams[];

async function main() {
  let bridgeAddress = process.env[`${hre.network.name.toUpperCase()}_BRIDGE_ADDRESS`] || "";
  if (!bridgeAddress || bridgeAddress.trim() === "") {
    throw new Error(`Error: Environment variable ${hre.network.name.toUpperCase()}_BRIDGE_ADDRESS is not set or empty`);
  }

  BridgeContract = await contractLoader<Bridge>(GlobalConfig.BRIDGE_CONTRACT_NAME);
  let startBalance = await getMultisigBalance();

  if (hre.network.name == Config.NETWORK_MAINNET) {
    bridgeLimits = UtilsConfig.MainnetBridgeLimits();
  } else if (hre.network.name == Config.NETWORK_SEPOLIA) {
    bridgeLimits = UtilsConfig.SepoliaBridgeLimits();
  } else if (hre.network.name == Config.NETWORK_WHITECHAIN) {
    bridgeLimits = UtilsConfig.WhitechainBridgeLimits();
  } else if (hre.network.name == Config.NETWORK_WHITECHAINTESTNET) {
    bridgeLimits = UtilsConfig.WhitechainTestnetBridgeLimits();
  } else if (hre.network.name == Config.NETWORK_WHITECHAINDEVNET) {
    bridgeLimits = UtilsConfig.WhitechainDevnetBridgeLimits();
  } else {
    throw new Error(`Network not supported: ${hre.network.name}`);
  }

  if (bridgeLimits.length == 0) {
    throw new Error(`Error: bridgeLimits is empty`);
  }

  await registerDailyLimit(bridgeLimits, BridgeContract);

  let endBalance = await getMultisigBalance(false);
  console.log(`Account: ${multisig.address} - GasFee: ${hre.ethers.formatEther(startBalance - endBalance)} ${_getTicker(hre.network.name)}`);
}

async function registerDailyLimit(bridgeLimits: DailyLimitParams[], Contract: any) {
  const results: {
    index: number;
    txHash?: string;
    status: 'success' | 'error';
    error?: string;
  }[] = [];

  for (let i = 0; i < bridgeLimits.length; i++) {
    const params = bridgeLimits[i];

    try {
      console.log("🔍 BridgeContract loaded:", await Contract?.getAddress());

      const tx = await Contract.setDailyLimit(params.token, params.relayer, params.limit);

      console.log(`🚀 Sent tx hash: ${tx.hash}`);
      await tx.wait();

      results.push({
        index: i,
        txHash: tx.hash,
        status: 'success',
      });
      console.log(`✅ Success sending`);
      await getMultisigBalance();
    } catch (err: any) {
      console.error(`❌ Error sending:`, err.message);
      results.push({
        index: i,
        status: 'error',
        error: err.message,
      });
    }
  }
}

async function contractLoader<T>(contractName: string): Promise<T> {
  if (hre.network.name === "hardhat") {
    throw new Error("Error: network is incorrect");
  }

  let secretKey: string = process.env[`SECRET_KEY`] || "";

  if (secretKey === "") {
    throw new Error("Error: secretKey is empty!");
  }

  multisig = new hre.ethers.Wallet(secretKey, hre.ethers.provider);

  const CONTRACT_ADDRESS: string = process.env[`${hre.network.name.toUpperCase()}_${contractName.toUpperCase()}_ADDRESS`] || "";
  if (CONTRACT_ADDRESS === "") {
    throw new Error(`Error: ${hre.network.name.toUpperCase()}_${contractName.toUpperCase()}_ADDRESS is empty!`);
  }

  let Factory = await hre.ethers.getContractFactory(
      GlobalConfig.MAIN_UTILS_ROUTE + "bridge/" + contractName + ".sol:" + contractName,
      multisig
  );
  return Factory.attach(CONTRACT_ADDRESS) as unknown as T;
}

async function getMultisigBalance(view: boolean = true): Promise<bigint> {
  const coinsBalance = await hre.ethers.provider.getBalance(multisig.address);

  if (view) {
    console.log(
      `Account: ${multisig.address} - Balance: ${hre.ethers.formatEther(coinsBalance)} ${_getTicker(hre.network.name)}`
    );
  }

  return coinsBalance;
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});