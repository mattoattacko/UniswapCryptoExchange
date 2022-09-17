import React, { useState, useEffect, useRef } from 'react';

import { chevronDown } from '../assets';
import { useOnClickOutside } from '../utils'; //closes menu bar when user clicks outside of it

import styles from '../styles';

const AmountOut = () => {

  const [showList, setShowList] = useState(false);

  return (
    <div className={styles.amountContainer}>
      <input 
        placeholder='0.0'
        type='number'
        value=''
        disabled={true} //because we dont want people typing into the output field
        className={styles.amountInput}
      />

      {/* choose token to swap */}
      <div className='relative' onClick={() => setShowList((prevState) => !prevState)}>
        <button className={styles.currencyButton}>
          {'ETH'}
          <img 
            src={chevronDown}
            alt='chevron down'
            className={`w-4 h-4 object-contain ml-2 ${showList ? 'transform rotate-180' : 'rotate-0'}`} //if the menu is open, rotate the chevron down icon 180 degrees
          />
        </button>

        {/* if they do click the button, we want to show menu */}
        {showList && (
          <ul className={styles.currencyList}>
            {[
              { token: 'ETH', tokenName: 'ETH'},
              { token: 'DAI', tokenName: 'DAI'},
              { token: 'USDC', tokenName: 'USDC'},
            ].map(({token, tokenName}, index) => (
              <li
                key={index}
                className={`${styles.currencyListItem} ${true ? 'bg-site-dim2' : ''} cursor-pointer`}
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