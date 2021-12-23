import React, { useState, useEffect, useRef } from "react";
import EthicOnChainContract from "./contracts/EthicOnChain.json";
import EthicTokenContract from "./contracts/EthicToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {
  const [data, setData] = useState({
    web3: null,
    accounts: null,
    owner: null,
    contract: null,
  });

  const [actualAccount, setActualAccount] = useState(null)
  const [balance0, setBalance0] = useState(0)
  const [balanceActualAccount, setBalanceActualAccount] = useState(0)

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts) => {
      setActualAccount(accounts[0])
      console.log(accounts)
    });
  });

  useEffect(() => {
    if (data.accounts && !actualAccount) {
      setActualAccount(data.accounts)
    }
  }, [data.accounts]);

  useEffect(() => {
    if (data.accounts) {
      getBalanceOwner(data.accounts.toString())
      return () => getBalanceOwner()
    }
  }, [data.accounts]);

  useEffect(() => {
    if (actualAccount) {
      console.log(`actualAccount`, actualAccount)
      getBalanceActualAccount(actualAccount.toString())
      return () => getBalanceActualAccount()
    }
  }, [actualAccount]);

  const init = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      // const accounts = await web3.eth.getAccounts().then(console.log);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EthicTokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EthicTokenContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setData({ web3, accounts, contract: instance });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  const getBalanceOwner = async (acc) => {
    const { contract } = data
    await contract.methods.balanceOf(acc).call()
      .then(a => setBalance0(web3.utils.fromWei(a)))
  };

  const getBalanceActualAccount = async (acc) => {
    const { contract } = data
    await contract.methods.balanceOf(acc).call()
      .then(a => setBalanceActualAccount(web3.utils.fromWei(a)))
  };

  const { accounts, web3 } = data
  return !web3 ? (
    <div>Loading Web3, accounts, and contract...</div>
  ) : (
    <div className="App">
      <h3>Owner account : {accounts[0]}</h3>
      <p>Balance of Owner : {balance0}</p>
      <h3>Actual account : {actualAccount}</h3>
      <p>Balance of Actual account : {balanceActualAccount}</p>
    </div>
  );

}

export default App;
