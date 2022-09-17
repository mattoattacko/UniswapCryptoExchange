import React, { useState } from 'react';
import { useEthers, ERC20, useContractFunction, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { abis } from '@my-app/contracts';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils'; //parses our strings into big numbers

import { ROUTER_ADDRESS } from '../config';

const Exchange = ({ pools }) => {
  return (
    <div>Exchange</div>
  )
}

export default Exchange