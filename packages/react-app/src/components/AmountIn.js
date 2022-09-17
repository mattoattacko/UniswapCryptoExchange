import React, { useState, useEffect, useRef } from 'react';

import { chevronDown } from '../assets';
import { useOnClickOutside } from '../utils'; //closes menu bar when user clicks outside of it

import styles from '../styles';

const AmountIn = ({ value, onChange, currencyValue, onSelect , currencies, isSwapping }) => {

  const [showList, setShowList] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState('Select');
  const ref = useRef();

  useOnClickOutside(ref, () => setShowList(false));

  useEffect(() => {
    if(Object.keys(currencies).includes(currencyValue)) { //if the keys include the value that is currently selected, then set the active currency to that value
      setActiveCurrency(currencies[currencyValue])
    } else {
      setActiveCurrency('Select')
    }
  }, [currencies, currencyValue])

  return (
    <div className={styles.amountContainer}>
      <input 
        placeholder='0.0'
        type='number'
        value={value}
        disabled={isSwapping} //if we are swapping, we dont want people to be able to type into the input field
        onChange={(e) => typeof onChange === 'function' && onChange(e.target.value)} //sometimes we might not have the function (we will have something else), so if it is a function, we want to pass in the onChange callback
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
            {Object.entries(currencies).map(([token, tokenName], index) => ( //we have a bunch of different entries inside objects, and those are inside of currencies. This gives us the key and value for a specific token or currency. So we map through them and get a list of arrays. So we need to do array destructuring to get the token and tokenName.
              <li
                key={index}
                className={`${styles.currencyListItem} ${activeCurrency === tokenName ? 'bg-site-dim2' : ''} cursor-pointer`}

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

export default AmountIn