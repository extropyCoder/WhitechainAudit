# WhitechainAudit


https://hackenproof.com/programs/whitechain-bridge

Based on the provided files, here is an overview of the Whitechain Bridge project from a business perspective, along with a security-focused analysis of its architecture and critical areas for auditing.

### **1. Business Overview**

**Project Scope:**
The Whitechain Bridge is a cross-chain interoperability protocol designed to facilitate the transfer of native coins and ERC20 tokens between the **Whitechain** network and other EVM-compatible chains (like Ethereum, Sepolia) as well as **Tron**.

**Core Value Proposition:**

* **Asset Portability:** Enables users to move liquidity between supported blockchains seamlessly.
* **Managed Security:** Utilizes a permissioned "Relayer" system and daily limits to mitigate the risk of catastrophic drains during security incidents.
* **Fee Abstraction/Management:** Includes logic for accumulating gas fees (`gasAccumulated`) natively within the contract, which can be withdrawn by the project admins to cover operational costs.

**Key Stakeholders & Roles:**

* **User:** Initiates transfers.
* **Relayer (`RELAYER_ROLE`):** A centralized off-chain server trusted to:
1. Sign permissions for users to *initiate* a bridge transaction (deposit).
2. Execute the finalization (withdrawal) of tokens on the destination chain.


* **Multisig (`MULTISIG_ROLE`):** High-level governance responsible for upgrading contracts, managing the "Mapper" (token registry), and setting daily limits.
* **Emergency Admin (`EMERGENCY_ROLE`):** A "circuit breaker" role capable of pausing specific token mappings, manually depositing liquidity, and withdrawing accumulated gas fees.

---

### **2. Architectural Highlights**

The system is split into two primary contract types for modularity:

1. **`Bridge.sol` (The Vault & Executor):**
* Holds the liquidity (for Lock/Unlock mechanisms).
* Has minting rights (for Mint/Burn mechanisms).
* Handles the entry (`bridgeTokens`) and exit (`receiveTokens`) logic.
* Manages daily volume limits per relayer.


2. **`Mapper.sol` (The Registry):**
* Acts as a database for supported token pairs.
* Defines the strategy for each token:
* **Lock/Unlock:** Tokens are locked in the bridge on the source chain and unlocked on the destination.
* **Mint/Burn:** Tokens are burned on the source and minted on the destination (requires the Bridge to have `MINTER` role).


* Stores chain IDs and token addresses to ensure tokens are sent to the correct corresponding contract.



---

### **3. Security Audit & Critical Attention Areas**

Based on the code provided, the following areas warrant specific attention during a security audit.

#### **A. High Centralization & Relayer Dependence**

The system is heavily reliant on the `RELAYER_ROLE`.

* **Inbound Risk (`receiveTokens`):** The `receiveTokens` function is protected *only* by `onlyRole(RELAYER_ROLE)`. It does not verify a cryptographic proof from the source chain (like a Merkle proof).
* *Risk:* If the Relayer's private key is compromised, an attacker can mint or unlock any amount of tokens (up to the daily limit) without spending funds on the origin chain.


* **Outbound Gating (`bridgeTokens`):** Unusually, the deposit function `bridgeTokens` requires a valid ECDSA signature from the Relayer to proceed.
* *Risk:* This creates a liveness dependency. If the Relayer goes offline, **users cannot bridge funds out** (DOS), effectively freezing their assets on that chain relative to the bridge.



#### **B. Daily Limits Implementation**

The contract implements a daily limit per token and relayer.

* *Implementation Check:* The logic relies on `block.timestamp`.
* `if (block.timestamp >= tracker.dayStartTimestamp + 1 days)` resets the volume.


* *Audit Point:* Verify if `tracker.dayStartTimestamp` is initialized correctly. If it defaults to 0, the first transaction might set it to the current block time. The logic appears to be a "rolling window" reset rather than strict 24-hour periods aligned to midnight. This is generally acceptable but should be noted.

#### **C. Fee-on-Transfer / Deflationary Token Support**

The `bridgeTokens` function explicitly handles tokens that take a fee on transfer.

* *Mechanism:* It calculates `balanceAfter - balanceBefore` to determine the `actualAmount` received.
* *Security Win:* This prevents the "unbacked minting" attack where a user sends 100 tokens, the bridge receives 99 (due to tax), but crediting 100 on the other side.
* *Audit Point:* Ensure `actualAmount` is used in the `Deposit` event and signature verification (if the signature commits to the *sent* amount vs *received* amount). Currently, the signature includes `bridgeTokensParams.bridgeParams.amount` (the input amount), but the event emits `actualAmount`. This discrepancy is handled but requires the Relayer to be aware of the taxation logic.

#### **D. Signature Replay Protection**

* *Mechanism:* The `_validateECDSA` function checks `usedHashes[hash]`.
* *Audit Point:* The hash includes `mapInfo.originChainId` and `mapInfo.targetChainId`.
* *Risk:* Ensure that `mapInfo.originChainId` is strictly checked against `block.chainid` inside the `bridgeTokens` function (or indirectly via `Mapper` logic). In `Mapper.registerMapping`, there is a check: `require(block.chainid == newMapInfo.originChainId...)`. This seems secure, preventing a signature intended for a testnet from being replayed on mainnet.



#### **E. Native Coin Handling (Ether/Tron)**

* The contract distinguishes between tokens and "coins" (Native currency) using `mapInfo.isCoin`.
* *Audit Point:* In `bridgeTokens`, if `isCoin` is true, it checks `msg.value >= _amount`. This allows users to send *more* ETH than required, with the excess treated as gas fee (`_gasAmount = msg.value - _amount`). This logic seems sound but assumes the user *intends* the surplus to be a donation/fee.

#### **F. Upgradability**

* The contracts are UUPS Upgradeable.
* *Risk:* The `_authorizeUpgrade` function is restricted to `onlyRole(MULTISIG_ROLE)`. This is best practice. However, users should be aware that the logic (and storage layout) can change entirely via the Multisig.

#### **G. Tron Specifics**

* The Tron files (`tron/.../Bridge.sol`) mirror the Ethereum files almost exactly.
* *Audit Point:* Tron Solidity compilers and EVM implementations have subtle differences (e.g., `msg.sender` vs `msg.sender` behavior in low-level calls, precompiled contracts). Ensure `SafeERC20Upgradeable` behaves as expected on the TRON Virtual Machine (TVM), particularly regarding TRC20 return values which can sometimes differ from strict ERC20 compliance.

### **Summary of Recommendation**

The project implements a **Trusted Relayer Bridge**. It prioritizes control and safety limits over decentralization. The code uses standard libraries (OpenZeppelin) and defensible patterns (Checks-Effects-Interactions, Fee-on-Transfer support). The primary risk is **operational**: the security of the Relayer and Multisig keys is synonymous with the security of the entire protocol.