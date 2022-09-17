import React, { useEffect, useState } from 'react';
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

  const { account } = useEthers();

  const [fromValue, setFromValue] = useState('0');
  const [fromToken, setFromToken] = useState(pools[0].token0Address); //immediately render the first token
  const [toToken, setToToken] = useState(''); //we don't know which token we want to change to yet
  const [resetState, setResetState] = useState(false); //we use this to reset the success message

  const fromValueBigNumber = parseUnits(fromValue); //parse the string into a big number

  //list of available tokens we can swap from
  const availableTokens = getAvailableTokens(pools);

  //list of available tokens we can swap to (counterpart tokens). We also pass in fromToken because we need to know which token we are trying to make the exchange from.
  const counterpartTokens = getCounterpartTokens(pools, fromToken);

  //once we know which token we want to make an exchange from/to, then we need to find a pair address for that specific liquidity pair. The '?' means we only get to this point if this function actually returns something. The '??' means if the function returns nothing, then we return an empty string.
  const pairAddress = findPoolByTokens(pools, fromToken, toToken)?.address ?? '';

  //get contract address
  const routerContract = new Contract(ROUTER_ADDRESS, abis.router02);

  //from which contract are we transacting from
  const fromTokenContract = new Contract(fromToken, ERC20.abi); 

  //know the balance of our token
  const fromTokenBalance = useTokenBalance(fromToken, account);
  const toTokenBalance = useTokenBalance(toToken, account);

  //know the allowance of our token. The swap is a two step process. First we approve, then we make a swap.
  const tokenAllowance = useTokenAllowance(fromToken, account, ROUTER_ADDRESS) || parseUnits('0');

  //now that we have the allowance. We need to check if the 'from' value is greater than the token allowance. If it is, then we need to approve the token. If it isn't, then we can make the swap.
  const approvalNeeded = fromValueBigNumber.gt(tokenAllowance); //gt = greater than
  const fromValueIsGreaterThan0 = fromValueBigNumber.gt(parseUnits('0'))

  // '??' means if the function returns nothing, then we return an empty string.
  const hasEnoughBalance = fromValueBigNumber.lte(fromTokenBalance ?? parseUnits('0')); //lte = less than or equal to

  const { state: swapApproveState, send: swapApproveSend } = useContractFunction(fromTokenContract, "approve", { 
    transactionName: 'onApproveRequested',
    gasLimitBufferPercentage: 10,
  });

  const { state: swapExecuteState, send: swapExecuteSend } = useContractFunction(routerContract, "swapExactTokensForTokens", { 
    transactionName: 'swapExactTokensForTokens',
    gasLimitBufferPercentage: 10,
  });

  const isApproving = isOperationPending(swapApproveState);
  const isSwapping = isOperationPending(swapExecuteState);

  //can we click the button to approve it? We can approve if we are not currently approving and if the approval is needed.
  const canApprove = !isApproving && approvalNeeded;
  const canSwap = !approvalNeeded && !isSwapping && fromValueIsGreaterThan0 && hasEnoughBalance;


  const successMessage = getSuccessMessage(swapApproveState, swapExecuteState); //make sure that the approval and execution went successfully
  const failureMessage = getFailureMessage(swapApproveState, swapExecuteState); 

  //once we request the approval, then call swapApproveSend
  const onApproveRequested = () => {
    swapApproveSend(ROUTER_ADDRESS, ethers.constants.MaxInt256); //we want to approve for the max integer value so that once we approve for the first time we can then simply swap without approving again.
  }

  const onSwapRequested = () => {
    swapExecuteSend(
      fromValueBigNumber, //amountIn
      0, //amountOutMin
      [fromToken, toToken], //path. array of addresses
      account, //to
      Math.floor(Date.now() / 1000) + 60 * 20, //2min deadline
    ).then(() => {
      setFromValue('0'); //reset the from value once swap completes
    })
  }

  //update the input field number. 
  //trimmed for ease of use
  const onFromValueChange = (value) => {
    const trimmedValue = value.trim();

    try {
      if(trimmedValue) { //if we have a trimmed value
        parseUnits(value);

        setFromValue(value);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //handlers for the dropdowns
  const onFromTokenChange = (value) => {
    setFromToken(value);
  }  
  const onToTokenChange = (value) => {
    setToToken(value);
  }

  //reset the success/failure message
  useEffect(() => {
    if(failureMessage || successMessage) {
      setTimeout(() => {
        setResetState(true);
        setFromValue('0');
        setToToken('');
      }, 5000)
    }
  }, [failureMessage, successMessage])

  return (
    <div className="flex flex-col w-full items-center">
      <div className="mb-8">
        <AmountIn 
          value={fromValue}
          onChange={onFromValueChange}
          currencyValue={fromToken} //which token are we changing
          onSelect={onFromTokenChange} 
          currencies={availableTokens} //list of available tokens we can swap
          isSwapping={isSwapping && hasEnoughBalance} //if we are swapping and we have enough balance
        />

        <Balance 
          tokenBalance={fromTokenBalance} //balance of the token
        />
      </div>      
      <div className='mb-8 w-[100%]'>
        <AmountOut 
          fromToken={fromToken} //which token are we changing
          toToken={toToken} //which token are we changing to
          amountIn={fromValueBigNumber} //amount we are changing
          pairContract={pairAddress}
          currencyValue={toToken} //which token are we changing to
          onSelect={onToTokenChange} //change the to token
          currencies={counterpartTokens} //counterpart tokens that we can use to swap too
        />

        <Balance 
          tokenBalance={toTokenBalance} //balance of the token
        />
      </div>


      {/* if approval is needed and we are not currently swapping, then render out the button that checks if we are approving. If so, render approving. Else just show swap button */}
      {/* for styles, if 'canApprove' is 'true', we render 'bg-site-pink' etc */}
      {approvalNeeded && !isSwapping ? (
        <button 
          onClick={onApproveRequested}
          disabled={!canApprove}
          className={
            `${
              canApprove ? 
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
          onClick={onSwapRequested}
          disabled={!canSwap}
          className={
            `${
              canSwap ? 
              'bg-site-pink text-white' : 
              'bg-site-dim2 text-site-dim2'
            } ${styles.actionButton}`          
          }
        >
          {isSwapping ? 'Swapping...' : hasEnoughBalance ? 'Swap' : 'Insufficient Balance'}
        </button>
      }

      {/* Failure or Success Messages */}
      {failureMessage && !resetState ? (
        <p className={styles.message}>
          {failureMessage}
        </p>
      ) : successMessage ? (
        <p className={styles.message}>
          {successMessage}
        </p>
      ) : "" }

    </div>
  )
}

export default Exchange