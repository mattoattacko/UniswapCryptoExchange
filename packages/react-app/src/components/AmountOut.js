import React, { useState, useEffect, useRef } from 'react';
import { formatUnits } from 'ethers/lib/utils';

import { chevronDown } from '../assets';
import { useOnClickOutside, useAmountsOut } from '../utils'; //closes menu bar when user clicks outside of it

import styles from '../styles';

const AmountOut = ({ fromToken, toToken, amountIn, pairContract, currencyValue, onSelect, currencies }) => {

  const [showList, setShowList] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState('Select');
  const ref = useRef();

  const amountOut = useAmountsOut(pairContract, amountIn, fromToken, toToken) ?? 0; //cant be undefined or null, so we use ?? to set it to 0 in case we dont have another value

  useEffect(() => {
    if(Object.keys(currencies).includes(currencyValue)) { //if the keys include the value that is currently selected, then set the active currency to that value
      setActiveCurrency(currencies[currencyValue])
    } else {
      setActiveCurrency('Select') //reset to Select
    }
  }, [currencies, currencyValue])

  useOnClickOutside(ref, () => setShowList(false));

  return (
    <div className={styles.amountContainer}>
      <input 
        placeholder='0.0'
        type='number'
        value={formatUnits(amountOut)}
        disabled
        className={styles.amountInput}
      />

      {/* choose token to swap */}
      <div className='relative' onClick={() => setShowList((prevState) => !prevState)}>
        <button className={styles.currencyButton}>
          {activeCurrency}
          <img 
            src={chevronDown}
            alt='chevron down'
            className={`w-4 h-4 object-contain ml-2 ${showList ? 'transform rotate-180' : 'rotate-0'}`} //if the menu is open, rotate the chevron down icon 180 degrees
          />
        </button>

        {/* if they do click the button, we want to show menu */}
        {showList && (
          <ul ref={ref} className={styles.currencyList}>
            {Object.entries(currencies).map(([token, tokenName], index) => (
              <li
                key={index}
                className={styles.currencyListItem}
                onClick={() => {
                  if(typeof onSelect === 'function') onSelect(token); //if typeof is a function, we want to call onSelect and pass in the token
                  setActiveCurrency(tokenName); //set the active currency to the token name
                  setShowList(false); //close the menu
                }}
              >
                {tokenName}
              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  )
}

export default AmountOut