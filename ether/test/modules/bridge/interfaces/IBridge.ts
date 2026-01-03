
/**
 * @dev Struct for initializing the Bridge contract.
 * @param mapperAddress Address of the Mapper contract used for token mapping.
 * @param emergencyAddress Address of the EMERGENCY role.
 * @param multisigAddress Address of the MULTISIG role.
 * @param relayerAddress Address of the RELAYER role.
 */
export interface InitParams {
    mapperAddress: string;
    emergencyAddress: string;
    multisigAddress: string;
    relayerAddress: string;
}

/**
 * @dev Struct for storing parameters of an ECDSA signature.
 * @param r Part of the ECDSA signature.
 * @param s Part of the ECDSA signature.
 * @param salt A random value that allows creating different signatures for the same message having
 * replay attack protection at the same time.
 * @param deadline Expiration timestamp for the signature.
 * @param v Recovery byte of the signature.
 */
export interface ECDSAParams {
    r: string;
    s: string;
    salt: string;
    deadline: bigint;
    v: bigint;
}

/**
 * @dev Struct for storing parameters of a token bridge request.
 * @param mapId ID of the token mapping in the Mapper contract.
 * @param amount Amount of tokens to be bridged.
 * @param toAddress Recipient's address on the target chain.
 */
export interface BridgeParams {
    mapId: bigint;
    amount: bigint;
    toAddress: string;
}

/**
 * @dev Struct for storing parameters of a token receiving request.
 * @param externalId External identifier for tracking the bridge transaction.
 * @param mapId ID of the token mapping in the Mapper contract.
 * @param amount Amount of tokens to be received.
 * @param fromAddress Sender's address on the origin chain.
 * @param toAddress Recipient's address on the target chain.
 */
export interface ReceiveTokensParams {
    externalId: string;
    mapId: bigint;
    amount: bigint;
    fromAddress: string;
    toAddress: string;
}

/**
 * @dev Struct for combining bridge parameters with ECDSA signature parameters.
 * @param bridgeParams Struct containing token bridge details.
 * @param ECDSAParams Struct containing ECDSA signature details.
 */
export interface BridgeTokensParams {
    bridgeParams: BridgeParams;
    ECDSAParams : ECDSAParams;
}

/**
 * @dev Struct for tracking daily volumes for a token/relayer combination.
 * @param dayStartTimestamp The timestamp when the 24-hour window started. 0 if not initialized.
 * @param dayVolume Volume for the current day. Reset to 0 when 24 hours have passed.
 */
export interface DailyVolumeTracker {
    dayStartTimestamp: bigint;
    dayVolume: bigint;
}

/**
 * @dev Struct for storing parameters of a daily limit.
 * @param token The token address (bytes32). Use bytes32(0) for native coin.
 * @param relayer The relayer address.
 * @param limit The daily limit amount.
 */
export interface DailyLimitParams {
    token: string;
    relayer: string;
    limit: bigint;
}