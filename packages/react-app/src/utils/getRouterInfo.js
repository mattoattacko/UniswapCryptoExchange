import { abis } from '@my-app/contracts';

// we get the info from the smart contract using 'abis' and the addresses and finally return the factory for the smart contract
export const getRouterInfo = async (routerAddress, web3) => {
  const router = new web3.eth.Contract(abis.router02, routerAddress);

  return {
    factory: await router.methods.factory().call(),
  }
}

// the factory address returned by getRouterInfo() is the address of the factory contract we compiled and deployed using CRANQ