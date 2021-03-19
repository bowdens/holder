import './App.css';
import { Route, BrowserRouter as Router, Switch, Link, Redirect } from "react-router-dom";
import Bag from "./features/bag/Bag";
import BagSettings from "./features/bag/BagSettings";

import Container from "react-bootstrap/Container";
import ConnectToBag from './components/ConnectToBag';
import CreateBag from './components/CreateBag';
import { useSelector } from 'react-redux';
import { selectCurrentCode } from './features/auth/authSlice';
import TopNav from './components/TopNav';
import Toasts from "./features/toasts/Toasts";
import { useEffect } from 'react';
import { createOrGetSocket } from './socket';
import RecentBags from './components/RecentBags';
import About from "./pages/About";
import Legal from './pages/Legal';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';

function App() {
  const currentCode = useSelector(selectCurrentCode);

  useEffect(() => {
    console.log("creating or getting socket");
    const { socket } = createOrGetSocket();
  }, [])

  return (
    <Router>
      <TopNav />
      <Container>
        <Switch>
          <Route path="/bag/:code/settings">
            <BagSettings />
          </Route>
          <Route path="/bag/:code">
            <Bag />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/legal">
            <Legal />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/feedback">
            <Feedback />
          </Route>
          <Route exact path="/">
            {currentCode === null ?
              <>
                <ConnectToBag />
                <hr />
                <RecentBags />
                <hr />
                <CreateBag />
              </>
              :
              <Redirect to={`/bag/${currentCode}`} />
            }
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
        <Toasts />
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
