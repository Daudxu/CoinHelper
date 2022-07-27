import axios from 'axios';
import { ChainId, chains } from 'eth-chains';
import { BigNumber} from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import {
  COVALENT_SUPPORTED_NETWORKS,
  DAPP_LIST_BASE_URL,
  ETHEREUM_LISTS_CONTRACTS,
  ETHERSCAN_SUPPORTED_NETWORKS,
  NODE_SUPPORTED_NETWORKS,
  PROVIDER_SUPPORTED_NETWORKS,
  INFURA_API_KEY,
} from './constants';

// Check if a token is verified in the token mapping
export function isVerified(tokenAddress, tokenMapping) {
  // If we don't know a verified token mapping, we skip checking verification
  if (!tokenMapping) return true;
  return tokenMapping[getAddress(tokenAddress)] !== undefined;
}

export function shortenAddress(address) {
  return address && `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`;
}

export function compareBN(a, b) {
  a = BigNumber.from(a);
  b = BigNumber.from(b);
  const diff = a.sub(b);
  return diff.isZero() ? 0 : diff.lt(0) ? -1 : 1;
}

// Look up an address' App Name using the dapp-contract-list
export async function addressToAppName(address, chainId) {
  if (!chainId) return undefined;
  const name = (await getNameFromDappList(address, chainId)) ?? (await getNameFromEthereumList(address, chainId));
  return name;
}

async function getNameFromDappList(address, chainId) {
  try {
    const { data } = await axios.get(`${DAPP_LIST_BASE_URL}/${chainId}/${getAddress(address)}.json`);
    return data.appName;
  } catch {
    return undefined;
  }
}

async function getNameFromEthereumList(address, chainId) {
  try {
    const contractRes = await axios.get(`${ETHEREUM_LISTS_CONTRACTS}/contracts/${chainId}/${getAddress(address)}.json`);

    try {
      const projectRes = await axios.get(`${ETHEREUM_LISTS_CONTRACTS}/projects/${contractRes.data.project}.json`);
      return projectRes.data.name;
    } catch {}

    return contractRes.data.project;
  } catch {
    return undefined;
  }
}

export async function lookupEnsName(address, provider) {
  try {
    return await provider.lookupAddress(address);
  } catch {
    return undefined;
  }
}

export function getExplorerUrl(chainId) {
  const overrides = {
    [ChainId.EthereumTestnetRopsten]: 'https://ropsten.etherscan.io',
    [ChainId.EthereumTestnetKovan]: 'https://kovan.etherscan.io',
    [ChainId.SmartBitcoinCash]: 'https://smartscan.cash',
    [ChainId.Moonbeam]: 'https://moonbeam.moonscan.io',
    [ChainId.Moonriver]: 'https://moonriver.moonscan.io',
  };

  const [explorer] = chains.get(chainId)?.explorers ?? [];

  return overrides[chainId] ?? explorer?.url;
}

export function getRpcUrl(chainId, infuraKey){
  // These are not in the eth-chains package, so manually got from chainlist.org
  const overrides = {
    [ChainId.ArbitrumOne]: 'https://arb1.arbitrum.io/rpc',
    [ChainId.Moonbeam]: 'https://moonbeam.public.blastapi.io',
    [ChainId.PalmMainnet]: 'https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b',
    [ChainId.EthereumTestnetGörli]: `https://goerli.infura.io/v3/${infuraKey}`,
    [ChainId.EthereumTestnetKovan]: `https://kovan.infura.io/v3/${infuraKey}`,
  };

  const [rpcUrl] = chains.get(chainId)?.rpc ?? [];
  return overrides[chainId] ?? rpcUrl?.replace(`${INFURA_API_KEY}`, infuraKey);
}

export function getTrustWalletName(chainId) {
  const mapping = {
    [ChainId.EthereumMainnet]: 'ethereum',
    [ChainId.Rinkeby]: 'Rinkeby',
    [ChainId.EthereumClassicMainnet]: 'classic',
  };
  return mapping[chainId];
}

// TODO: Replace these with just chain ID rather than name (breaking)
export function getDappListName(chainId) {
  const mapping = {
    [ChainId.EthereumMainnet]: 'ethereum',
    [ChainId.Rinkeby]: 'Rinkeby',
    [ChainId.PolygonMainnet]: 'matic',
  };

  return mapping[chainId];
}

export function isProviderSupportedNetwork(chainId) {
  return PROVIDER_SUPPORTED_NETWORKS.includes(chainId);
}

export function isBackendSupportedNetwork(chainId) {
  return isCovalentSupportedNetwork(chainId) || isEtherscanSupportedNetwork(chainId) || isNodeSupportedNetwork(chainId);
}

export function isCovalentSupportedNetwork(chainId) {
  return COVALENT_SUPPORTED_NETWORKS.includes(chainId);
}

export function isEtherscanSupportedNetwork(chainId) {
  return ETHERSCAN_SUPPORTED_NETWORKS.includes(chainId);
}

export function isNodeSupportedNetwork(chainId) {
  return NODE_SUPPORTED_NETWORKS.includes(chainId);
}

export async function getFullTokenMapping(chainId) {
  const erc20Mapping = await getTokenMapping(chainId, 'ERC20');
  const erc721Mapping = await getTokenMapping(chainId, 'ERC721');

  if (erc20Mapping === undefined && erc721Mapping === undefined) return undefined;

  const fullMapping = { ...erc721Mapping, ...erc20Mapping };
  return fullMapping;
}

async function getTokenMapping(chainId, standard = 'ERC20') {
  const url = getTokenListUrl(chainId, standard);

  try {
    const res = await axios.get(url);
    const tokens = res.data.tokens;

    const tokenMapping = {};
    for (const token of tokens) {
      tokenMapping[getAddress(token.address)] = token;
    }

    return tokenMapping;
  } catch {
    // Fallback to 1inch token mapping
    return getTokenMappingFrom1inch(chainId);
  }
}

async function getTokenMappingFrom1inch(chainId) {
  try {
    const { data: mapping } = await axios.get(`https://tokens.1inch.io/v1.1/${chainId}`);

    const tokenMapping = Object.fromEntries(
      Object.entries(mapping).map(([address, token]) => [getAddress(address), token])
    );

    return tokenMapping;
  } catch {
    return undefined;
  }
}

function getTokenListUrl(chainId, standard = 'ERC20') {
  const mapping = {
    ERC20: {
      [ChainId.HarmonyMainnetShard0]:
        'https://raw.githubusercontent.com/DefiKingdoms/community-token-list/main/src/defikingdoms-default.tokenlist.json',
      [ChainId.MetisAndromedaMainnet]:
        'https://raw.githubusercontent.com/MetisProtocol/metis/master/tokenlist/toptoken.json',
    },
    ERC721: {
      [ChainId.EthereumMainnet]:
        'https://raw.githubusercontent.com/vasa-develop/nft-tokenlist/master/mainnet_curated_tokens.json',
    },
  };

  return mapping[standard][chainId];
}

// export function getTokenType(tokenAddress, chainId) {
export function getTokenType(chainId) {
  const networkName = getTrustWalletName(chainId);
  return networkName;
}

export function toFloat(n, decimals) {
  return (n / 10 ** decimals).toFixed(3);
}

export function fromFloat(floatString, decimals) {
  const sides = floatString.split('.');
  if (sides.length === 1) return floatString.padEnd(decimals + floatString.length, '0');
  if (sides.length > 2) return '0';

  return sides[1].length > decimals
    ? sides[0] + sides[1].slice(0, decimals)
    : sides[0] + sides[1].padEnd(decimals, '0');
}

export const unpackResult = async (promise) => (await promise)[0];

export const withFallback = async (promise, fallback) => {
  try {
    return await promise;
  } catch {
    return fallback;
  }
};

export const convertString = async (promise) => String(await promise);

export const emitAnalyticsEvent = (eventName) => {
  if (window && (window).sa_event) {
    (window).sa_event(eventName);
  }
};

export const getLogs = async (
  provider,
  baseFilter,
  fromBlock,
  toBlock,
  chainId
) => {
  if (isBackendSupportedNetwork(chainId)) {
    provider = new BackendProvider(chainId);
  }

  return getLogsFromProvider(provider, baseFilter, fromBlock, toBlock);
};

export const getLogsFromProvider = async (
  provider,
  baseFilter,
  fromBlock,
  toBlock
) => {
  const filter = { ...baseFilter, fromBlock, toBlock };
  try {
    const result = await provider.getLogs(filter);
    return result;
  } catch (error) {
    const errorMessage = error?.error?.message ?? error?.data?.message ?? error?.message;
    if (errorMessage !== 'query returned more than 10000 results') {
      throw error;
    }

    const middle = fromBlock + Math.floor((toBlock - fromBlock) / 2);
    const leftPromise = getLogsFromProvider(provider, baseFilter, fromBlock, middle);
    const rightPromise = getLogsFromProvider(provider, baseFilter, middle + 1, toBlock);
    const [left, right] = await Promise.all([leftPromise, rightPromise]);
    return [...left, ...right];
  }
};

class BackendProvider {
    constructor(chainId) {
         this.chainId = chainId
    }
  
    async getLogs(filter) {
      try {
        const { data } = await axios.post(`/api/${this.chainId}/logs`, filter);
        return data;
      } catch (error) {
        throw new Error(error?.response?.data ?? error?.message);
      }
    }
  }

export const parseInputAddress = async (
  inputAddressOrName,
  provider
) => {
  // If the input is an ENS name, validate it, resolve it and return it
  if (inputAddressOrName.endsWith('.eth')) {
    try {
      const address = await provider.resolveName(inputAddressOrName);
      return address ? address : undefined;
    } catch {
      return undefined;
    }
  }
  try {
    return getAddress(inputAddressOrName.toLowerCase());
  } catch {
    return undefined;
  }
};

export const getChainLogo = (chainId) => {
  const mapping = {
    [ChainId.EthereumMainnet]: '/logos/ethereum.png',
    [ChainId.EthereumTestnetRopsten]: '/logos/ethereum.png',
    [ChainId.EthereumTestnetRinkeby]: '/logos/ethereum.png',
    [ChainId.EthereumTestnetGörli]: '/logos/ethereum.png',
    [ChainId.EthereumTestnetKovan]: '/logos/ethereum.png',
    [ChainId.TelosEVMMainnet]: '/logos/telos.png',
    [ChainId.TelosEVMTestnet]: '/logos/telos.png',
    [ChainId.XDAIChain]: '/logos/gnosis-chain.png',
    [ChainId.MetisAndromedaMainnet]: '/logos/metis.png',
    [ChainId.MetisStardustTestnet]: '/logos/metis.png',
    [ChainId.SmartBitcoinCash]: '/logos/smartbch.png',
    [ChainId.SmartBitcoinCashTestnet]: '/logos/smartbch.png',
    [ChainId.FuseMainnet]: '/logos/fuse.png',
    [ChainId.FuseSparknet]: '/logos/fuse.png',
    [ChainId.BinanceSmartChainMainnet]: '/logos/binance.png',
    [ChainId.BinanceSmartChainTestnet]: '/logos/binance.png',
    [ChainId.PolygonMainnet]: '/logos/polygon.png',
    [ChainId.PolygonTestnetMumbai]: '/logos/polygon.png',
    [ChainId.AvalancheMainnet]: '/logos/avalanche.png',
    [ChainId.AvalancheFujiTestnet]: '/logos/avalanche.png',
    [ChainId.FantomOpera]: '/logos/fantom.png',
    [ChainId.FantomTestnet]: '/logos/fantom.png',
    [ChainId.ArbitrumOne]: '/logos/arbitrum.svg',
    [ChainId.ArbitrumTestnetRinkeby]: '/logos/arbitrum.svg',
    [ChainId.HuobiECOChainMainnet]: '/logos/heco.png',
    [ChainId.HuobiECOChainTestnet]: '/logos/heco.png',
    [ChainId.Moonbeam]: '/logos/moonbeam.png',
    [ChainId.Moonriver]: '/logos/moonriver.png',
    [ChainId.MoonbaseAlpha]: '/logos/moonbeam.png',
    [ChainId.CronosMainnetBeta]: '/logos/cronos.jpeg',
    [ChainId.RSKMainnet]: '/logos/rootstock.png',
    [ChainId.HarmonyMainnetShard0]: '/logos/harmony.png',
    [ChainId.IoTeXNetworkMainnet]: '/logos/iotex.png',
    [ChainId.KlaytnMainnetCypress]: '/logos/klaytn.png',
    [ChainId.PalmMainnet]: '/logos/palm.jpeg',
    [ChainId.OptimisticEthereum]: '/logos/optimism.jpeg',
    9001: '/logos/evmos.png',
  };

  return mapping[chainId];
};
