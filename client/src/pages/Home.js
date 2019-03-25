import React, { Component } from 'react';
import './pages_css/home.css'

class Home extends Component { 
    render(){
        return(
            <div className="main">
                <div className="header">
                    <h1 className="huge-heading">
                        WE ARE GAMERS
                    </h1>
                    <p className="heading-subtitle"> Egy Discord közösség amely megváltoztatja az életed. </p>
                    <a href="https://discordapp.com/api/oauth2/authorize?client_id=475031640205426718&redirect_uri=http%3A%2F%2F178.48.146.196%3A8080%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email%20guilds%20guilds.join" target="_blank" rel="noopener noreferrer" className="invite_button">CSATLAKOZZ MOST</a>
                    <div className="slider"></div> 
                </div>
                <div className="seperator"></div>
                <div className="infos-container">
                    <div className="first-info">
                        <div>
                            <h2>
                                Jó közösség
                            </h2>
                            <p> Szeretnél játéktársakat és jó barátokat találni? Akkor jó helyen vagy! </p>
                        </div>
                        <img src="images/good_community.png" alt="" />
                    </div>
                    <div className="second-info">
                        <div>
                            <h2> Segítőkész Adminok </h2>
                            <p> Az adminjaink kedvesek és segítőkészek minden esetben. Ha problémád akadt rögtön segitenek!</p>
                        </div>
                    </div>
                    <div className="third-info">
                        <img src="images/music_bot.png" alt="" />
                        <div>
                            <h2> Music Botok </h2>
                            <p> Kedved támadt zenét hallgatni? Használd a Music Botokat amikor csak szeretnéd!</p>
                        </div>
                    </div>
                </div>
                <div className="rules-container">
                    <div className="rules">
                        <center>
                            <div id="rules-image-box">
                                <div className="rules-image">
                                </div> 
                            </div>
                            <div className="rules-list-container">
                                <h1>
                                    Szabályok
                                </h1>
                                <p>
                                    Mint mindenhol itt is vannak szabályok amiket be kell tartani a jó hangulat megörzése képpen. <br /> <i>A szabályok megszegése a szerverről való kitiltással jár!</i>
                                </p>
                                <div className="rule-list">
                                    <div className="rule" id="first-rule">
                                        <div>
                                            <img src="images/point.png" width="120" height="120" alt=""/>
                                        </div>
                                        <h2>
                                            A szerveren nem szabad spamelni egyik chat szobában sem!
                                        </h2>
                                    </div>
                                    <div className="rule" id="second-rule">
                                        <div>
                                            <img src="images/point.png" width="120" height="120" alt=""/>
                                        </div>
                                        <h2>
                                            Rangot kéregetni adminoktól tilos!
                                        </h2>
                                    </div>
                                    <div className="rule" id="third-rule">
                                        <div>
                                            <img src="images/point.png" width="120" height="120" alt=""/>
                                        </div>
                                        <h2>
                                            A bot parancsait csak az arra megjelölt szobában lehet használni!
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </center>
                    </div>
                </div>
                <div className="seperator"></div>
            </div>
        )
        }
    }
          
export default Home
          