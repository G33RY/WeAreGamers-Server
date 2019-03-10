import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class Login extends Component {  
  render() {
    if(cookies.get('userinfos')){
      if(cookies.get('userinfos').userid.length > 11){
        
        function logout() {
          cookies.remove("userinfos")
          cookies.remove("userstats")
          cookies.remove("chartdatas")
          cookies.remove("item_prices")
          cookies.remove("inventory")
          cookies.remove("balance")
          window.location.reload();
        }
  
        return(
          <div id="user">
            <div id="image_box">
                <img src={cookies.get("userinfos").avatar} alt=""  width="32px"/>
            </div>
            <div id="text_box">
              <span id="first_row">
                <b>Szia, </b><b id="username">{cookies.get("userinfos").username}</b><b id="exclamation_mark">!</b>
              </span>
              <span id="second_row">
                <b>Egyenleged: </b>
                <b id="balance">${cookies.get("balance") || cookies.get("userinfos").userbalance}</b>
              </span>
            </div>
            <i className="fas fa-sign-out-alt" id="logout_icon" onClick={logout}></i>
          </div>
        )
      }
      return (
        <a href="https://discordapp.com/api/oauth2/authorize?client_id=475031640205426718&redirect_uri=http%3A%2F%2F178.48.146.196%3A8080%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email%20guilds%20guilds.join">
          <li id="login">
              <span>
              <i class="fab fa-discord"></i> Belépés
              </span>
          </li>
        </a>
      );
    }

    return (
      <a href="https://discordapp.com/api/oauth2/authorize?client_id=475031640205426718&redirect_uri=http%3A%2F%2Fwww.wearegamers.hu%3A8080%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email%20guilds.join%20guilds">
        <li>
          <div>
            <span>
              <i className="fab fa-discord"></i> Belépés
            </span>
          </div>
        </li>
      </a>
    );
  }
}

export default Login;
