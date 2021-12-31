import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom';

import EthicOnChainContract from "./contracts/EthicOnChain.json";
import EthicTokenContract from "./contracts/EthicToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import LayoutAdmin from "./components/LayoutAdmin";
import LayoutNpo from "./components/LayoutNpo";
import LayoutDonor from "./components/LayoutDonor";
import ViewProjects from "./pages/admin/ViewProjects";
import ViewNpos from "./pages/admin/ViewNpos";
import ViewDonors from "./pages/admin/ViewDonors";
import Historic from "./pages/Historic";
import MakeDonation from "./pages/donor/MakeDonation";
import MyDonations from "./pages/donor/MyDonations";
import CreateProject from "./pages/npo/CreateProject";
import MyProjects from "./pages/npo/MyProjects";

const theme = createTheme({
  palette: {
    primary: {
      main: '#653442',
    },
    secondary: {
      // main: '#8C914E',
      main: '#11cb5f',
    },
  },
  typography: {
    fontFamily: 'Mulish',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  }
});

const App = () => {
  let navigate = useNavigate();
  const addressZero = "0x0000000000000000000000000000000000000000"
  const [data, setData] = useState({
    web3: null,
    accounts: null,
    contract: null,
    isAdmin: null,
    isNpo: null,
    isDonor: null
  });
  const [allNpos, setAllNpos] = useState(null)
  const [allDonors, setAllDonors] = useState(null)

  const [actualAccount, setActualAccount] = useState(null)
  const [balance0, setBalance0] = useState(0)
  const [balanceActualAccount, setBalanceActualAccount] = useState(0)

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts) => {
      setActualAccount(accounts[0])
      // reload la page aprés changement de compte dans Metamask
      navigate("/")
      window.location.reload()
    });
  });


  useEffect(() => {
    console.log(`Npos`, allNpos)
  }, [allNpos]);
  useEffect(() => {
    console.log(`Donors`, allDonors)
  }, [allDonors]);

  // useEffect(() => {
  //   if (data.accounts && !actualAccount) {
  //     setActualAccount(data.accounts)
  //   }
  // }, [data.accounts]);

  // useEffect(() => {
  //   if (data.accounts) {
  //     getBalanceOwner(data.accounts.toString())
  //     return () => getBalanceOwner()
  //   }
  // }, [data.accounts]);

  // useEffect(() => {
  //   if (actualAccount) {
  //     console.log(`actualAccount`, actualAccount)
  //     getBalanceActualAccount(actualAccount.toString())
  //     return () => getBalanceActualAccount()
  //   }
  // }, [actualAccount]);

  const init = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EthicOnChainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EthicOnChainContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const account = accounts[0];
      let isAnAdmin = false;
      let isANpo = false;
      let isADonor = false;
      let Admin = await instance.methods.owner().call()
        .then(x => x.toUpperCase())
      Admin === account.toUpperCase() ? isAnAdmin = true : isAnAdmin = false

      await instance.methods.getNpos().call()
        .then(x => setAllNpos(x))
      await instance.methods.getDonors().call()
        .then(x => setAllDonors(x))

      await instance.methods.getNpo(account).call()
        .then(x => x[1] !== addressZero ? isANpo = true : isANpo = false)
      // .then(x => console.log('getNpo', x))
      await instance.methods.getDonor(account).call()
        .then(x => x[1] !== addressZero ? isADonor = true : isADonor = false)
      // .then(x => console.log('getDonor', x))

      setData({ web3, accounts, contract: instance, isAdmin: isAnAdmin, isNpo: isANpo, isDonor: isADonor });

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  const getNpos = async () => {
    const { contract } = data
    await contract.methods.getNpos().call()
      .then(x => setAllNpos(x))
  }

  const getDonors = async () => {
    const { contract } = data
    await contract.methods.getDonors().call()
      .then(x => setAllDonors(x))
  }


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

  const { accounts, web3, isAdmin, isDonor, isNpo } = data
  return !web3 ? (
    <div>Loading Web3, accounts, and contract...</div>
  ) : (
    <ThemeProvider theme={theme}>
      <Routes>
        {isAdmin &&
          <Route path="/" element={<LayoutAdmin />}>
            <Route path="/projets" element={<ViewProjects />} />
            <Route path="/npos" element={<ViewNpos />} />
            <Route path="/donateurs" element={<ViewDonors />} />
            <Route path="/historique" element={<Historic />} />
          </Route>}
        {isNpo &&
          <Route path="/" element={<LayoutNpo />}>
            <Route path="/mesprojets" element={<MyProjects />} />
            <Route path="/creerprojet" element={<CreateProject />} />
            <Route path="/historique" element={<Historic />} />
          </Route>}
        {isDonor &&
          <Route path="/" element={<LayoutDonor />}>
            <Route path="/mesdons" element={<MyDonations />} />
            <Route path="/faireundon" element={<MakeDonation />} />
            <Route path="/historique" element={<Historic />} />
          </Route>}
      </Routes>
    </ThemeProvider>
  );

}

export default App;
