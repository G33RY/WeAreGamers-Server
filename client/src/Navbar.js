import React, { Component } from 'react';
import Login from './Login.js';
import Cookies from 'universal-cookie';
import ApolloClient from "apollo-boost";
import {ApolloProvider} from 'react-apollo';
import { Link } from 'react-router-dom';

import "./css/navbar.css";

const cookies = new Cookies();
const client = new ApolloClient({
  uri: "http://www.wearegamers.hu:4000"
});


class Navbar extends Component {  
  render() {
    if(cookies.get('userinfos')){
      function redirect() {
        window.location.reload()
      }
      return (
        <div className="navbar-container">
          <Link to="/">
              <div className="nav_logo">
                <img src="images/WAG_rectangle_logo.png" alt=""/>
              </div>
          </Link>
          <ApolloProvider client={client}>
            <Login />
          </ApolloProvider>
          <div className="toggle">
            <i className="fa fa-bars menu" aria-hidden="true"></i>
          </div>
          <nav role="navigation"  id="navbar">
              <ul className="navbar_ul" id="nav_ul">
                <Link to="/"  onClick={redirect}>
                  <li className="asd" id="home">
                    <div>
                        <span>
                            KEZDŐLAP
                        </span>
                    </div>
                  </li>
                </Link>
                <Link to="/musicbot">
                  <li className="asd" id="musicbot" onClick={redirect}>
                    <div>
                        <span>
                            MUSIC BOT
                        </span>
                    </div>
                  </li>
                </Link>
                <Link to="/store" onClick={redirect}>
                  <li className="asd" id="store">
                    <div>
                        <span>
                            BOLT
                        </span>
                    </div>
                  </li>
                </Link>
                <Link to="/levels" onClick={redirect}>
                  <li className="asd" id="levels">
                    <div>
                        <span>
                            SZINTEK
                        </span>
                    </div>
                  </li>
                </Link>
                <Link to="/mystats" onClick={redirect}>
                  <li className="asd" id="mystats">
                    <div>
                        <span>
                            STATISZTIKÁIM
                        </span>
                    </div>
                  </li> 
                </Link>
              </ul>
          </nav>
      </div>
      )
    }
    function alertbtn(){
      alert('Be kell jelentkezned!')
    }
    return (
    <div className="navbar-container">
      <Link to="/">
          <div className="nav_logo">
            <img src="images/WAG_rectangle_logo.png" alt=""/>
          </div>
      </Link>
      <div className="toggle">
        <i className="fa fa-bars menu" aria-hidden="true"></i>
      </div>
      <nav role="navigation"  id="navbar">
          <ul className="navbar_ul" id="nav_ul">
            <Link to="/">
              <li className="asd" id="home">
                <div>
                    <span>
                        KEZDŐLAP
                    </span>
                </div>
              </li>
            </Link>
              <li className="asd" id="musicbot" onClick={alertbtn}>
                <div>
                    <span>
                        MUSIC BOT
                    </span>
                </div>
              </li>
              <li className="asd" id="store" onClick={alertbtn}>
                <div>
                    <span>
                        BOLT
                    </span>
                </div>
              </li>
              <li className="asd" id="levels" onClick={alertbtn}>
                <div>
                    <span>
                        SZINTEK
                    </span>
                </div>
              </li>
              <li className="asd" id="mystats" onClick={alertbtn}>
                <div>
                    <span>
                        STATISZTIKÁIM
                    </span>
                </div>
              </li>
            <ApolloProvider client={client}>
                    <Login />
            </ApolloProvider>
          </ul>
      </nav>
    </div>
    )
    
  }
}

export default Navbar;

        
