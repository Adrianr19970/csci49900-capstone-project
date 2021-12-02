import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { useEffect, useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import {Link} from 'react-router-dom';
import Home from './pages'
import Products from './pages/products';
import About from './pages/about';
import {Redirect} from 'react-router-dom';
import background from './pages/Sky.jpg';

/* <Navbar /> */

function App() {
const [hide, setHide] = useState("none");

const hideLandPage = () => {
  setHide("none");
};

  return (
    
    <Router>
      <Redirect from='/' to='/index' exact component={Home}/>

      <div className='landing-Background'
        style={{ 
          height: '100%',
          backgroundImage: `url(${background})`,
          backgroundCover: `cover`,
          backgroundSize: '100% 100%',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000',
          paddingTop: '5%',
          paddingBottom: '10%',
          marginBottom: '-5%',
          display: hide
        }}>
          <h1>Welcome to TradeBreath</h1>   
          
          <Link id="buttons" to="/index">
            <button onClick={hideLandPage}><h3>Enter</h3></button>
          </Link>
        </div>

        <Switch>
          
          <Route path='/index' exact component={Home} />
          <Redirect from='/index' to='/index'/>
          <Route path='/products' exact component={Products} />
          <Redirect from='/products' to='/products'/>
          <Route path='/about' exact component={About} />
          <Redirect from='/about' to='/about'/>
        </Switch>
        <Footer />
    </Router>
    
  );
}

export default App;
