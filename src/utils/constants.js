import { ChainId } from 'eth-chains';

export const TRUSTWALLET_BASE_URL = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';
export const DAPP_LIST_BASE_URL = '/dapp-contract-list';
export const ETHEREUM_LISTS_CONTRACTS = 'https://raw.githubusercontent.com/ethereum-lists/contracts/main';

export const ADDRESS_ZERO_PADDED = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export const INFURA_API_KEY = 'fe4b3cd922484bd084c50da206d64cb6';
export const DUMMY_ADDRESS = '0x0000000000000000000000000000000000000001';
export const DUMMY_ADDRESS_2 = '0x0000000000000000000000000000000000000002';

export const PROVIDER_SUPPORTED_NETWORKS = [
  ChainId.EthereumMainnet,
  ChainId.EthereumTestnetRopsten,
  ChainId.EthereumTestnetRinkeby,
  ChainId.EthereumTestnetGörli,
  ChainId.EthereumTestnetKovan,
  ChainId.TelosEVMMainnet,
  ChainId.TelosEVMTestnet,
  ChainId.XDAIChain,
  ChainId.MetisAndromedaMainnet,
  ChainId.MetisStardustTestnet,
  ChainId.SmartBitcoinCash,
  ChainId.SmartBitcoinCashTestnet,
  ChainId.FuseMainnet,
  ChainId.FuseSparknet,
];

export const ETHERSCAN_SUPPORTED_NETWORKS = [
  ChainId.BinanceSmartChainMainnet,
  ChainId.BinanceSmartChainTestnet,
  ChainId.PolygonMainnet,
  ChainId.PolygonTestnetMumbai,
  ChainId.AvalancheMainnet,
  ChainId.AvalancheFujiTestnet,
  ChainId.FantomOpera,
  ChainId.FantomTestnet,
  ChainId.ArbitrumOne,
  ChainId.ArbitrumTestnetRinkeby,
  ChainId.HuobiECOChainMainnet,
  ChainId.HuobiECOChainTestnet,
  ChainId.Moonbeam,
  ChainId.Moonriver,
  ChainId.MoonbaseAlpha,
  ChainId.CronosMainnetBeta,
];

export const COVALENT_SUPPORTED_NETWORKS = [
  ChainId.RSKMainnet,
  // ChainId.RSKTestnet,
  ChainId.HarmonyMainnetShard0,
  // ChainId.HarmonyTestnetShard0,
  ChainId.IoTeXNetworkMainnet,
  // ChainId.IoTeXNetworkTestnet,
  ChainId.KlaytnMainnetCypress,
  // ChainId.KlaytnTestnetBaobab,
  9001, // Evmos Mainnet (not in the eth-chains library)
  ChainId.PalmMainnet,
  // ChainId.PalmTestnet,
  // ChainId.PolyjuiceTestnet,
  // ChainId.AuroraMainNet,
];

export const NODE_SUPPORTED_NETWORKS = [ChainId.OptimisticEthereum];

export const SUPPORTED_NETWORKS = [
  ...PROVIDER_SUPPORTED_NETWORKS,
  ...ETHERSCAN_SUPPORTED_NETWORKS,
  ...COVALENT_SUPPORTED_NETWORKS,
  ...NODE_SUPPORTED_NETWORKS,
];
