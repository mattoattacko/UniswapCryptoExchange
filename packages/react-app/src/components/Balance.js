import React from 'react'
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import styles from '../styles'

const Balance = ({ tokenBalance }) => {

  return (
    <div className={styles.balance}>
      <p className={styles.balanceText}>
        {/* check if token balance exists. If it does, show react fragment */}
        {tokenBalance && (
          <>
            <span className={styles.balanceBold}>Balance: </span>
            {formatUnits(tokenBalance || parseUnits('0'))} {/* if tokenBalance exists, format it. If it doesnt, parseUnits('0') which will make sure we dont have any errors because 'formatUnits' always expects one big number value. */}
          </>
        )}
      </p>
    </div>
  )
}

export default Balance