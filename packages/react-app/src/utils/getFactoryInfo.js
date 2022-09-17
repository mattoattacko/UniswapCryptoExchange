//here we need to get all the fees and liquidity pairs

import { abis } from '@my-app/contracts';
import { getPairsInfo } from './getPairsInfo'; 

//first we get the instance of the factory. 
export const getFactoryInfo = async (factoryAddress, web3) => {
  const factory = new web3.eth.Contract(abis.factory, factoryAddress);

  const factoryInfo = {
    fee: await factory.methods.feeTo().call(),
    feeToSetter: await factory.methods.feeToSetter().call(),
    allPairsLength: await factory.methods.allPairsLength().call(),
    allPairs: [],
  }

  //loops through all our liquidity pairs. We tap into our factoryInfo object and loop through them by increasing the i. So we keep adding new liquidity pairs for however many pairs there are. 
  for (let i = 0; i < factoryInfo.allPairsLength; i++) {
    factoryInfo.allPairs[i] = await factory.methods.allPairs(i).call();
  }

  //now that we have the pairs, we want additional pairs info. We pass 2 params, 'allPairs' and 'web3'. So the pairs we looped through above we pass them over as the first param to our own 'getPairInfo' function. We also pass the instance of web3 as the second param.
  factoryInfo.pairsInfo = await getPairsInfo(factoryInfo.allPairs, web3);

  return factoryInfo;
}



// factoryAddress was created in CRANQ

//we leave the allPairs array empty because we are going to dynamically go through it to fetch all the liquidity pairs