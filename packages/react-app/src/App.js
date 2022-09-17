import React from "react"
import { useEthers } from "@usedapp/core" //gives us access to our metamask account

import styles from './styles'
import { uniswapLogo } from "./assets";
import { Exchange, Loader, WalletButton } from "./components";

import { usePools } from "./hooks";


const App = () => {

  const { account } = useEthers(); //account is the address of our metamask account
  const [loading, pools] = usePools(); //we call our custom hook to get the pools

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          <img
            src={uniswapLogo}
            alt="Uniswap Logo"
            className='w-16 h-16 object-contain'
          />
          <WalletButton />
        </header>

        {/* Exchange Container */}
        <div className={styles.exchangeContainer}>
          <h1 className={styles.headTitle}>
            Uniswap 2.0
          </h1>
          <p className={styles.subTitle}>
            Exchange tokens in seconds
          </p>

          <div className={styles.exchangeBoxWrapper}>
            <div className={styles.exchangeBox}>
              <div className='pink_gradient' />

              {/* Exchange Box */}
              <div className={styles.exchange}>

                {/* if the account exists, and if pools are loading, then show the loader component. If we have the account and the pools are not loading, render the exchange component. If we dont have an account, we also show a Loader component */}
                {account ? (
                  loading ? (
                    <Loader title='Loading pools, please wait...' />
                  ) : <Exchange pools={pools} />
                ) : <Loader title='Please connect your wallet' /> 
                }

              </div>

              <div className='blue_gradient' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;