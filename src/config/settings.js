export const   AIRDROPPER_ABI = [{"inputs":[{"internalType":"address","name":"tokenAddr","type":"address"},{"internalType":"address[]","name":"toAddr","type":"address[]"},{"internalType":"uint256[]","name":"value","type":"uint256[]"}],"name":"batch","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

export const  ERC20TOKEN_ABI = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

export const  AIRDROPPER_CONTRACT = "0x7676E945bF3E4a128171efbc8a1887e44cE5eF8F";

export const curve = [
    {id: 1, name:'Token', title: "Token"},
    {id: 2, name:'RewardToken', title: "Reward Token"},
    {id: 3, name:'LiquidityPoolFee', title: "Liquidity Pool Fee"},
    {id: 4, name:'DexAmmProtocol', title: "Dex Amm Protocol"},
    {id: 5, name:'UsageMetricsDailySnapshot', title: "Usage Metrics Daily Snapshot"},
    {id: 6, name:'UsageMetricsHourlySnapshot', title: "Usage Metrics Hourly Snapshot"},
    {id: 7, name:'FinancialsDailySnapshot', title: "Financials Daily Snapshot"},
    {id: 8, name:'LiquidityPool', title: "Liquidity Pool"},
    {id: 9, name:'LiquidityPoolDailySnapshot', title: "Liquidity Pool Daily Snapshot"},
    {id: 10, name:'LiquidityPoolHourlySnapshot', title: "Liquidity Pool Hourly Snapshot"},
    {id: 11, name:'Deposit', title: "Deposit"},
    {id: 12, name:'Withdraw', title: "Withdraw"},
    {id: 13, name:'Swap', title: "Swap"},
    {id: 14, name:'Account', title: "Account"},
    {id: 15, name:'ActiveAccount', title: "Active Account"},
    {id: 16, name:'Platform', title: "Platform"},
    {id: 17, name:'Registry', title: "Registry"},
    {id: 18, name:'Factory',title: "Factory"},
    {id: 19, name:'BasePool',title: "Base Pool"},
    {id: 20, name:'TokenSnapshot',title: "Token Snapshot"},
    {id: 21, name:'GaugePool', title: "Gauge Pool"},
    {id: 22, name:'Protocol', title: "Protocol"},
    {id: 23, name:'Event', title: "Event"},
    {id: 24, name:'_Meta_', title: "Meta"},
]