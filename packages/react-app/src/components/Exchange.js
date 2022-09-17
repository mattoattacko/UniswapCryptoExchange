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

  const isApproving = isOperationPending('approve');
  const isSwapping = isOperationPending('swap');

  // const successMessage = getSuccessMessage();
  // const failureMessage = getFailureMessage();


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


      {/* if approval is needed and we are not currently swapping, then render out the button that checks if we are approving. If so, render approving. Else just show swap button */}
      {/* for styles, if 'canApprove' is 'true', we render 'bg-site-pink' etc */}
      {'approvedNeeded' && !isSwapping ? (
        <button 
          onClick={() => {}}
          disabled={!'canApprove'}
          className={
            `${
              'canApprove' ? 
              'bg-site-pink text-white' : 
              'bg-site-dim2 text-site-dim2'
            } ${styles.actionButton}`          
          }
        >
          {isApproving ? 'Approving...' : 'Approve'}
        </button>
      ) : 
      //if we are not approving, then render out the button that checks if we are swapping. If so, render swapping. Else just say 'swap'
        <button 
          onClick={() => {}}
          disabled={!'canSwap'}
          className={
            `${
              'canSwap' ? 
              'bg-site-pink text-white' : 
              'bg-site-dim2 text-site-dim2'
            } ${styles.actionButton}`          
          }
        >
          {isSwapping ? 'Swapping...' : 'hasEnoughBalance' ? 'Swap' : 'Insufficient Balance'}
        </button>
      }

      {/* Failure or Success Messages */}
      {"failureMessage" && !"resetState" ? (
        <p className={styles.message}>
          {"failureMessage"}
        </p>
      ) : "successMessage" ? (
        <p className={styles.message}>
          {"successMessage"}
        </p>
      ) : '' }

    </div>
  )
}

export default Exchange