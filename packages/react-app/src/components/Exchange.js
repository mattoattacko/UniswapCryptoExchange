import React, { useState } from 'react';
import { useEthers, ERC20, useContractFunction, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { abis } from '@my-app/contracts';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils'; //parses our strings into big numbers

import { ROUTER_ADDRESS } from '../config';

import { AmountIn, AmountOut, Balance } from './';
import { getAvailableTokens, getCounterpartTokens, findPoolByTokens, isOperationPending, getFailureMessage, getSuccessMessage } from '../utils';
//'getCounterpartTokens' is useful when we have one token we want to change to something else. We need to know which other tokens can we change it to. 
//'findPoolByTokens' is useful when we have two tokens we want to change from one to another. We need to know which pool we can use to do that.
//'isOperationPending' is useful when we want to know if the transaction is pending.


import styles from '../styles'

const Exchange = ({ pools }) => {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="mb-8">
        <AmountIn />

        <Balance />
      </div>      
      <div className='mb-8 w-[100%]'>
        <AmountOut />

        <Balance />
      </div>
    </div>
  )
}

export default Exchange