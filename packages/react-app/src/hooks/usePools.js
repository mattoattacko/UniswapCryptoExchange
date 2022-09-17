import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { useConfig } from '@usedapp/core';

import { ROUTER_ADDRESS } from '../config';
import { getFactoryInfo, getRouterInfo } from '../utils';

//fetches our liquidity pools
export const loadPools = async (providerUrl) => {
  const provider = new Web3.providers.HttpProvider(providerUrl);
  
  //creates a new instance of Web3
  const web3 = new Web3(provider);

  //grabs router and factory info. Tricky shit.
  const routerInfo = await getRouterInfo(ROUTER_ADDRESS, web3);
  const factoryInfo = await getFactoryInfo(routerInfo.factory, web3);

  return factoryInfo.pairsInfo;
}

export const usePools = () => {

  const { readOnlyChainId, readOnlyUrls } = useConfig();
  const [loading, setLoading] = useState(true)
  const [pools, setPools] = useState([])

  useEffect(() => {
    //we load up the pools anytime the readOnlyUrls or readOnlyChainId changes
    loadPools(readOnlyUrls[readOnlyChainId]) //this returns the exact provider url we need from loadPools
      .then((pools) => {
        setPools(pools);
        setLoading(false);
      })
  }, [readOnlyChainId, readOnlyUrls])

  return [ loading, pools ] //we return the loading and pools whenever we call usePools custom hook
}