import { abis } from '@my-app/contracts'

export const getPairsInfo = async (pairAddresses, web3) => {

  const pairsInfo = [];
  const pairABI = abis.pair;
  const tokenABI = abis.erc20.abi

  //we need to loop over all the addresses to get more information on each specific liquidity pair
  for(let i = 0; i < pairAddresses.length; i++) {
    const pairAddress = pairAddresses[i]; //get current address of liquidity pair
    const pair = new web3.eth.Contract(pairABI, pairAddress);

    //there are 2 sides of the liquidity pair, we need to get the token addresses for each side
    const token0Address = await pair.methods.token0().call();
    const token1Address = await pair.methods.token1().call();

    //gets contract of each token
    const token0Contract = new web3.eth.Contract(tokenABI, token0Address);
    const token1Contract = new web3.eth.Contract(tokenABI, token1Address);

    //gets the name of each token
    const token0Name = await token0Contract.methods.name().call();
    const token1Name = await token1Contract.methods.name().call();

    //fills in our array
    pairsInfo.push({
      address: pairAddress,
      token0Address,
      token1Address,
      token0Name,
      token1Name
    });
  }

  return pairsInfo;
}