import { Route, Routes, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import Sidebar from "./Sidebar";
import styled from "styled-components";

// Css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './assets/css/style.css'

//Logger
import { LogProvider } from './logger/LogContext';

// Pages
import Auth from "./pages/auth";

import Home from "./pages/home";
import Timing from "./pages/timing";
import News from "./pages/news";
import Profile from "./pages/profile";
import Settings from "./pages/settings";

const Pages = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  z-index: 0;
  margin-left: 10%;
  h1 {
    font-size: calc(2rem + 2vw);
    background: linear-gradient(to right, #803bec 30%, #1b1b1b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;


function App() {
  const location = useLocation();

  const [user, setUser] = useState();
  const [manifest, setManifest] = useState();

  useEffect(() => {
    window.serialAPI.connectToDevice(window.Store.get('comPort'));
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
     setUser(user);
    }
    const getData = async () => {
      try {
        const response = await axios.get(
          `https://download.vg-racing.com/streaming/manifest.json`
        );
        setManifest(response.data);
      } catch (err) {
        setManifest(null);
      }
    };
    getData();
  }, []);

  if (manifest) {
    if (!user) {
      return <Auth onAuth={(user) => setUser(user)} />;
    } else {
      async function logOut() {
        if (user) {
          localStorage.removeItem('user');
          setUser(null);
          console.log('Logout sucessfully')
        }
      }
      return (
        <>
          <LogProvider>
            <Sidebar/>
            <Pages>
              <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                  <Route exact path="/" element={<Home onLogout={() => logOut()} user={user} />} />
                  <Route path="/timing" element={<Timing/>} />
                  <Route path="/news" element={<News/>} />
                  <Route path="/profile" element={<Profile user={user}/>} />
                  <Route path="/settings" element={<Settings/>} />
                </Routes>
              </AnimatePresence>
            </Pages>
          </LogProvider>
        </>
      );
    }
  }
}

export default App;
