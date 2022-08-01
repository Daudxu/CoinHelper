const { ethers, upgrades } = require("hardhat");

// proxy address
const myContractProxyAddr = "0xaBe35a08F4AB31c49dF23DD6A1528A5b0851894D"

async function main() {
    const MyContractV2 = await ethers.getContractFactory("CoinTokenToolsV2");
    // update
    const myContractV2 = await upgrades.upgradeProxy(myContractProxyAddr, MyContractV2);

    console.log("myContractV2 upgraded");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });