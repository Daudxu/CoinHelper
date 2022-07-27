import store from '@/store'
import Web3 from 'web3'
import Router from '@/router'
export const subscribeToEvents = async (provider) => {
  var injectedName = sessionStorage.getItem('injected')
  if (injectedName === 'walletconnect') {
    if (!provider.connector) {
      return false
    }
    provider.connector.on('session_update', async (error, payload) => {
      if (error) {
        throw error
      }

      const { chainId, accounts } = payload.params[0]
      onSessionUpdate(accounts, chainId, 2)
    })

    provider.connector.on('connect', (error, payload) => {
      if (error) {
        throw error
      }
      onConnect(payload)
    })

    // disconnect
    provider.connector.on('disconnect', (error) => {
      if (error) {
        throw error
      }
      onDisconnect()
    })

    if (provider.connector.connected) {
      const { chainId, accounts } = provider.connector
      const address = accounts[0]
      setApp(provider, accounts, address, chainId, true)
      onSessionUpdate(accounts, chainId)
    }
    store.dispatch('wallet/setProvider', provider)
  } else {
    const providerChainId = await provider.chainId
    const chainId = Web3.utils.hexToNumberString(providerChainId)
    // switchNetwork()
    provider.on('chainChanged', async (chain) => {
      var currentChain = await Web3.utils.hexToNumberString(chain)
      onSessionUpdate(accounts, currentChain)
    })

    // subscribe accountsChanged
    provider.on('accountsChanged', (accounts) => {
      console.log('accountsChanged', accounts)
      onSessionUpdate(accounts, chainId)
    })

    // subscribe connect
    provider.on('connect', (ConnectInfo) => {
      console.log('ConnectInfo', ConnectInfo)
    })

    // subscribe disconnect
    provider.on('disconnect', (error) => {
      console.log('disconnect', error)
    })
    const accounts = await provider.request({ method: 'eth_requestAccounts' })

    setApp(provider, accounts, accounts[0], chainId, true, 1)
  }
}

// Metamask subscribe to events
const onSessionUpdate = async (accounts, chainId) => {
  const address = accounts[0]
  store.dispatch('wallet/setWallettSate', {
    accounts: accounts,
    account: address,
    chainId: chainId
  })
  getBlockChainNameByChainId(chainId)
  store.dispatch('wallet/setAccount', address)
  // await getAccountAssets();
}

const onConnect = async (payload) => {
  const { chainId, accounts } = payload.params[0]
  const provider = store.getters.provider
  const account = accounts[0]
  const master = `0x${Number(process.env.VUE_APP_CHAINID).toString(16)}`
  const netId = `0x${Number(chainId).toString(16)}`
  if (netId === master) {
    setApp(provider, accounts, account, chainId, true)
    store.dispatch('wallet/setAccount', account)
  } else {
    killSession()
    return false
  }
}

const onDisconnect = async () => {
  resetApp()
}

const killSession = async () => {
  const provider = store.getters.provider
  if (provider.connector) {
    provider.connector.killSession()
    resetApp()
  }
}

const setApp = async (provider, accounts, address, chainId, connected) => {
  store.dispatch('wallet/setWallettSate', {
    provider: provider,
    account: accounts[0],
    accounts: accounts,
    address: address,
    chainId: chainId,
    connected: connected
  })
  getBlockChainNameByChainId(chainId)
  sessionStorage.setItem('account', accounts[0])
  store.dispatch('wallet/setAccount', address)
}

const resetApp = async () => {
  store.dispatch('wallet/setWallettSate', {
    provider: null,
    account: '',
    accounts: [],
    address: '',
    chainId: 1,
    connected: false,
    chainName: 'Unknown Network'
  })
  sessionStorage.removeItem('account')
  store.dispatch('nfts/setNftsSate', {
    collectionsGroupList: [],
    collectionsGroupAssets: [],
    collectionsAssets: [],
    nftItem: [],
    nftName: 'Digination',
    collections: [],
    slideCollection: JSON.parse(sessionStorage.getItem('allSupportCollection')),
    modelUrl: './default.glb'
  })
  Router.push({ name: 'home' })
}
// walletconnect & metamask disconnect Wallet
export const disconnectWallet = () => {
  const { provider, walletModalModel } = store.getters
  walletModalModel.disconnect(provider)
  const walletType = sessionStorage.getItem('injected')
  if (parseInt(walletType) === 'walletconnect') {
    killSession()
  } else {
    resetApp()
  }
}

export const getBlockChainNameByChainId = async (chainId = 4) => {
  const { walletModalModel } = store.getters
  const ChainDetail = await walletModalModel.getChainDetailById(parseInt(chainId))
  const netName = ChainDetail.name
  if (typeof (netName) !== 'undefined' && netName !== null && netName !== '') {
    store.dispatch('wallet/setWallettSate', {
      chainName: netName
    })
  } else {
    store.dispatch('wallet/setWallettSate', {
      chainName: 'Unknown Network'
    })
  }
}

export const switchNetwork = async function (chainId) {
  return await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: Web3.utils.toHex(chainId)
      }
    ]
  }).then(async () => {
    const { accounts } = store.getters
    await onSessionUpdate(accounts, await Web3.utils.hexToNumberString(chainId))
    return true
  }).catch(async (err) => {
    if (err.code === 4902) {
      return await addNetwork(chainId)
    } else {
      return Promise.reject(err)
    }
  })
}
// get chain list json
export const fetcher = async (...args) => fetch(...args).then((res) => res.json())
// add network
export const addNetwork = async function (chainId) {
  const { walletModalModel } = store.getters
  const ChainDetail = await walletModalModel.getChainDetailById(parseInt(chainId))
  const CONF = {
    chainId: Web3.utils.toHex(chainId),
    chainName: ChainDetail.name,
    title: ChainDetail.title,
    nativeCurrency: ChainDetail.nativeCurrency,
    rpcUrls: [ChainDetail.rpc[0]]
  }
  if (typeof (ChainDetail.rpc[0].explorers) !== 'undefined') {
    CONF.blockExplorerUrls = [ChainDetail.rpc[0].explorers.url]
  }
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [CONF]
  })
}
