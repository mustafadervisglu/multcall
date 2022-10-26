const {MultiCall} = require('@indexed-finance/multicall')
const {abi} = require("./AggegatorV3Interface.json");
const priceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
const ethers = require('ethers')
const fs = require('fs');

async function main() {
    let provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY')
    const multi = new MultiCall(provider)
    const inputs = []
    let numberOfRounds = 10
    let priceFeed = new ethers.Contract(priceFeedAddress, abi, provider)
    let latestRound = (await priceFeed.latestRoundData())[0]
    for (let round = latestRound.sub(numberOfRounds); round.lt(latestRound); round = round.add(1)) {
        inputs.push({target: priceFeedAddress, function: 'getRoundData', args: [round.toString()]})
    }
    const roundData = await multi.multiCall(abi, inputs)
    fs.writeFileSync('test.json', JSON.stringify(roundData))
    console.log(roundData)
    return roundData
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
