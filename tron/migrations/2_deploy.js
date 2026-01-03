const tronConfig = require('../tronbox.js');
const { TronWeb } = require('tronweb');

const MAPPER_CONTRACT_NAME = "Mapper";
const BRIDGE_CONTRACT_NAME = "Bridge";
const PROXY_CONTRACT_NAME = "ERC1967Proxy";
const Mapper = artifacts.require(MAPPER_CONTRACT_NAME);
const Bridge = artifacts.require(BRIDGE_CONTRACT_NAME);
const ERC1967Proxy = artifacts.require(PROXY_CONTRACT_NAME);

module.exports = async function (deployer, network) {
    let fullHost;
    if (network === 'mainnet') {
        fullHost = tronConfig.networks.mainnet.fullHost;
    } else if (network === 'nile') {
        fullHost = tronConfig.networks.nile.fullHost;
    }

    const tronWeb = new TronWeb({ fullHost: fullHost });

    if (getContractName() === MAPPER_CONTRACT_NAME) {
        await deployer.deploy(Mapper);
        const mapperImplContract = await Mapper.deployed();
        const EMERGENCY_ADDRESS = process.env[`${network.toUpperCase()}_EMERGENCY_ADDRESS`] || "";
        const MULTISIG_ADDRESS = process.env[`${network.toUpperCase()}_MULTISIG_ADDRESS`] || "";

        if (!EMERGENCY_ADDRESS || EMERGENCY_ADDRESS.trim() === "") {
            throw new Error('Environment variable EMERGENCY_ADDRESS is not set or empty');
        }

        if (!MULTISIG_ADDRESS || MULTISIG_ADDRESS.trim() === "") {
            throw new Error('Environment variable MULTISIG_ADDRESS is not set or empty');
        }

        const hexEmergencyAddress = '0x' + tronWeb.address.toHex(EMERGENCY_ADDRESS).slice(2);
        const hexMultisigAddress = '0x' + tronWeb.address.toHex(MULTISIG_ADDRESS).slice(2);

        const mapperInitData = Mapper.web3.eth.abi.encodeFunctionCall(
            {
                name: "initialize",
                type: "function",
                inputs: [{
                    name: "initParams",
                    type: "tuple",
                    components: [
                        { name: "emergencyAddress", type: "address" },
                        { name: "multisigAddress", type: "address" },
                    ]
                }]
            },
            [ [ hexEmergencyAddress, hexMultisigAddress ] ]
        );

        await deployer.deploy(ERC1967Proxy, mapperImplContract.address, mapperInitData);
        await ERC1967Proxy.deployed();
    }

    if (getContractName() === BRIDGE_CONTRACT_NAME) {
        await deployer.deploy(Bridge);
        const bridgeImplContract = await Bridge.deployed();
        const MAPPER_ADDRESS = process.env[`${network.toUpperCase()}_MAPPER_ADDRESS`] || "";
        const EMERGENCY_ADDRESS = process.env[`${network.toUpperCase()}_EMERGENCY_ADDRESS`] || "";
        const MULTISIG_ADDRESS = process.env[`${network.toUpperCase()}_MULTISIG_ADDRESS`] || "";
        const RELAYER_ADDRESS = process.env[`${network.toUpperCase()}_RELAYER_ADDRESS`] || "";

        if (!MAPPER_ADDRESS || MAPPER_ADDRESS.trim() === "") {
            throw new Error('Environment variable MAPPER_ADDRESS is not set or empty');
        }

        if (!EMERGENCY_ADDRESS || EMERGENCY_ADDRESS.trim() === "") {
            throw new Error('Environment variable EMERGENCY_ADDRESS is not set or empty');
        }

        if (!MULTISIG_ADDRESS || MULTISIG_ADDRESS.trim() === "") {
            throw new Error('Environment variable MULTISIG_ADDRESS is not set or empty');
        }

        if (!RELAYER_ADDRESS || RELAYER_ADDRESS.trim() === "") {
            throw new Error('Environment variable RELAYER_ADDRESS is not set or empty');
        }

        const hexMapperAddress = '0x' + tronWeb.address.toHex(MAPPER_ADDRESS).slice(2);
        const hexEmergencyAddress = '0x' + tronWeb.address.toHex(EMERGENCY_ADDRESS).slice(2);
        const hexMultisigAddress = '0x' + tronWeb.address.toHex(MULTISIG_ADDRESS).slice(2);
        const hexRelayerAddress = '0x' + tronWeb.address.toHex(RELAYER_ADDRESS).slice(2);

        const bridgeInitData = Bridge.web3.eth.abi.encodeFunctionCall(
            {
                name: "initialize",
                type: "function",
                inputs: [{
                    name: "initParams",
                    type: "tuple",
                    components: [
                        { name: "mapperAddress", type: "address" },
                        { name: "emergencyAddress", type: "address" },
                        { name: "multisigAddress", type: "address" },
                        { name: "relayerAddress", type: "address" }
                    ]
                }]
            },
            [ [ hexMapperAddress, hexEmergencyAddress, hexMultisigAddress, hexRelayerAddress ] ]
        );

        await deployer.deploy(ERC1967Proxy, bridgeImplContract.address, bridgeInitData);
        await ERC1967Proxy.deployed();
    }

     function getContractName() {
        if (!process.env.CONTRACT || process.env.CONTRACT.trim() === "") {
            throw new Error('Environment variable CONTRACT is not set or empty');
        }

        return process.env.CONTRACT;
    }

};

