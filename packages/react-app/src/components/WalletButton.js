import React, { useState, useEffect } from 'react'
import { shortenAddress, useEthers, useLookupAddress } from '@usedapp/core'

import styles from '../styles'

const WalletButton = () => {

  const [accountAddress, setAccountAddress] = useState('') //helps us determine if we want to show an actual button, or the address of the account that is already connected. Starts as an empty string, which means that "Connect Wallet" button will be rendered.
  const { ens } = useLookupAddress() //ens = ethereum name service lookup
  const { activateBrowserWallet, account, deactivate } = useEthers()

  // if ENS exists, then we want to set the account address = to ENS. Else if account exists, we want to set the account address = to account, but we want to shorten it first (which comes from usedapp). Else, we want to set the account address = to an empty string.
  useEffect(() => {
    if(ens) {
      setAccountAddress(ens)
    } else if(account) {
      setAccountAddress(shortenAddress(account))
    } else {
      setAccountAddress('')
    }
  }, [account, ens, setAccountAddress])


  return (

    // if there is no account, call activateBrowserWallet. Else call deactivate
    <button
      onClick={() => {
        if (!account) {
          activateBrowserWallet(); //causes a button click to create an account
        } else {
          deactivate();
        }
      }}
      className={styles.walletButton}
    >
      {/* if theres no account address (meaning its an empty string), render 'Connect Wallet' button. Else just render the account address.
      {!accountAddress ? "Connect Wallet" : accountAddress}

      We can also write it as "if there is an account address, show the address. Otherwise just show the 'Connect Wallet' button".
      {accountAddress ? accountAddress : "Connect Wallet"}

      Even better! If our first parameter and second parameter of the ternary are the same, we can say "show the account address or show connect wallet". 
      */}
      { accountAddress || "Connect Wallet" }
      
    </button>
  )
}

export default WalletButton