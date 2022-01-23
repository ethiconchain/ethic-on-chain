import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EthicOnChainContract from "./contracts/EthicOnChain.json";
import EthicTokenContract from "./contracts/EthicToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import LayoutAdmin from "./components/LayoutAdmin";
import LayoutNpo from "./components/LayoutNpo";
import LayoutDonor from "./components/LayoutDonor";
import ViewProjects from "./pages/ViewProjects";
import ViewNpos from "./pages/admin/ViewNpos";
import ViewDonors from "./pages/admin/ViewDonors";
import Historic from "./pages/Historic";
import MakeDonation from "./pages/donor/MakeDonation";
import MyDonations from "./pages/donor/MyDonations";
import CreateProject from "./pages/npo/CreateProject";
import MyProjects from "./pages/npo/MyProjects";
import Withdrawal from "./pages/npo/Withdrawal";
import MyWithdrawals from "./pages/npo/MyWithdrawals";
import Page404 from "./pages/Page404";
import LoaderGlobal from "./components/LoaderGlobal";
import Homepage from "./pages/Homepage";

const theme = createTheme({
  palette: {
    primary: {
      main: '#100f0f',
    },
    secondary: {
      main: '#72A03E',
      light: '#a3d16c',
      lighten: '#dcedc8',
      lighten2: '#f1f8e9',
      dark: '#1b5e20',
      darken: '#154500'
      // light: '#A1E959',
    },
    cherry: {
      main: '#560027',
      light: '#87334f',
      dark: '#2f0000',
    },
    bckGrd: {
      main: '#605f5f',
      light: '#e9e7e7',
      lighten: '#f9f9f9',
      dark: '#363535',
    }
  },
  typography: {
    fontFamily: 'Mulish',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    upper: {
      fontFamily: 'Roboto Condensed',
      textTransform: 'uppercase',
      fontWeight: 400,
    },
  }
});

const App = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const addressZero = "0x0000000000000000000000000000000000000000"
  const [data, setData] = useState({
    web3: null,
    accounts: null,
    contract: null,
    contractTokenEOC: null,
    isAdmin: null,
    isNpo: null,
    isDonor: null
  });
  const [allNpos, setAllNpos] = useState(null)
  const [allDonors, setAllDonors] = useState(null)

  const causeList = {
    0: "Lutte contre la pauvreté et l'exclusion",
    1: "Environnement et animaux",
    2: "Éducation",
    3: "Art et culture",
    4: "Santé et recherche",
    5: "Droits de l'homme",
    6: "Infrastructure routière",
  }

  // convertit date epoch (ms) en date JJ/MM/YY
  const msToDate = (x) => new Date(x * 1000).toLocaleDateString()

  useEffect(() => {
    if (location.pathname !== "/") {
      init();
    }
  }, []);

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      // reload la page aprés changement de compte dans Metamask
      navigate("/routes/")
      window.location.reload()
    });
  });

  useEffect(() => {
    console.log(`Npos`, allNpos)
  }, [allNpos]);
  useEffect(() => {
    console.log(`Donors`, allDonors)
  }, [allDonors]);

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
      const deployedNetworkTokenEOC = EthicTokenContract.networks[networkId];
      const instanceTokenEOC = new web3.eth.Contract(
        EthicTokenContract.abi,
        deployedNetworkTokenEOC && deployedNetworkTokenEOC.address,
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
      await instance.methods.getDonor(account).call()
        .then(x => x[1] !== addressZero ? isADonor = true : isADonor = false)

      setData({ web3, accounts, contract: instance, contractTokenEOC: instanceTokenEOC, isAdmin: isAnAdmin, isNpo: isANpo, isDonor: isADonor });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  const { web3, isAdmin, isDonor, isNpo } = data
  return !web3 ? (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Homepage init={init} />} />
      </Routes>
      {location.pathname !== "/" &&
        <LoaderGlobal />
      }
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <Routes>
        {isAdmin &&
          <Route path="/routes/" element={<LayoutAdmin data={data} />}>
            <Route path="/routes/projets" element={<ViewProjects data={data} msToDate={msToDate} />} />
            <Route path="/routes/npos" element={<ViewNpos data={data} allNpos={allNpos} />} />
            <Route path="/routes/donateurs" element={<ViewDonors data={data} allDonors={allDonors} />} />
            <Route path="/routes/historique" element={<Historic data={data} msToDate={msToDate} allNpos={allNpos} />} />
            <Route path="/routes/*" element={<Page404 />} />
          </Route>}
        {isNpo &&
          <Route path="/routes/" element={<LayoutNpo data={data} />}>
            <Route path="/routes/mesprojets" element={<MyProjects data={data} msToDate={msToDate} />} />
            <Route path="/routes/creerprojet" element={<CreateProject data={data} />} />
            <Route path="/routes/mesretraits" element={<MyWithdrawals data={data} msToDate={msToDate} />} />
            <Route path="/routes/retrait/:id" element={<Withdrawal data={data} />} />
            <Route path="/routes/historique" element={<Historic data={data} msToDate={msToDate} allNpos={allNpos} />} />
            <Route path="/routes/*" element={<Page404 />} />
          </Route>}
        {isDonor &&
          <Route path="/routes/" element={<LayoutDonor data={data} />}>
            <Route path="/routes/projets" element={<ViewProjects data={data} msToDate={msToDate} />} />
            <Route path="/routes/mesdons" element={<MyDonations data={data} msToDate={msToDate} causeList={causeList} />} />
            <Route path="/routes/faireundon/:id" element={<MakeDonation data={data} />} />
            <Route path="/routes/historique" element={<Historic data={data} msToDate={msToDate} allNpos={allNpos} />} />
            <Route path="/routes/*" element={<Page404 />} />
          </Route>}
      </Routes>

      {!isAdmin && !isNpo && !isDonor &&
        <Box sx={{ bgcolor: 'bckGrd.lighten', display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: 25, textAlign: 'center' }} >
            Votre addresse n'est pas enregistrée
          </Typography>
          <Box sx={{ textAlign: "center", mt: `30px` }} >
            <img src="EthicOnChainLogoSquare.svg" alt="logo" height="150px" />
          </Box>
        </Box>
      }
    </ThemeProvider>
  );
}

export default App;
