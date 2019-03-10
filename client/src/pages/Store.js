import React, { Component } from 'react';
import './pages_css/store.css';
import Cookies from 'universal-cookie';
import socketio from 'socket.io-client';
import $ from 'jquery';


// Import Images
import Gold from "./images/Gold.png"
import Diamond from "./images/Diamond.png"
import DJ from "./images/DJ.png"
import Channel from "./images/Private.png"
import loading from "./images/loader.gif"

const cookies = new Cookies();
const io = socketio.connect("http://www.wearegamers.hu:8080");

let gold_price = 500
if(cookies.get('item_prices')){
    gold_price = cookies.get('item_prices').gold
}

let diamond_price = 2000
if(cookies.get('item_prices')){
    diamond_price = cookies.get('item_prices').diamond
}

let inv = cookies.get('inventory')

class Store extends Component { 
    render(){
        if(cookies.get('userinfos')){
            function buy(item){
                io.emit("buy", {
                    item: item,
                    userid: cookies.get('userinfos').userid
                })
                $('.loading_card').css('visibility', "visible")
                setTimeout(() => {
                    $('.loading_card').css('visibility', "hidden")
                }, 3000);
            }
            function sell(item){
                io.emit("sell", {
                    item: item,
                    userid: cookies.get('userinfos').userid
                })
                $('.loading_card').css('visibility', "visible")
                setTimeout(() => {
                    $('.loading_card').css('visibility', "hidden")
                }, 3000);
            }

            function gen_rand_string(string_length){
                let random_string = '';
                let random_ascii;
                let ascii_low = 65;
                let ascii_high = 90
                for(let i = 0; i < string_length; i++) {
                    random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
                    random_string += String.fromCharCode(random_ascii)
                }
                return random_string
            }

            io.on("NotEnoughMoney", a => {
                let id = gen_rand_string(10)
                $('#errors').append(`<div class='error ${id}'><h1>Nincs Elég Pénzed</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on("RankAlreadyGot", a => {
                let id = gen_rand_string(10)
                $('#errors').append(`<div class='error ${id}'><h1>Már megvan neked ez a tárgy!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on("NotEnoughItem", a => {
                let id = gen_rand_string(10)
                $('#errors').append(`<div class='error ${id}'><h1>Nincs elég tárgyad!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on("Sucess", a => {
                let id = gen_rand_string(10)
                $('#errors').append(`<div class='sucess ${id}'><h1>Tranzakció sikeres volt!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            return(
                <div>
                    <div id="store_header">
                        <h1 id="store_huge-heading">
                            BOLT
                        </h1>
                    </div>
                    <div id="errors">

                    </div>
                    <div id="store_con">
                        <div className="row">
                            <div className="column">
                                <div className="card">
                                    <div className="loading_card">
                                        <img alt="loading" className="loading_gif" src={loading}/>
                                    </div>
                                    <div className="imgbox">
                                        <img src={Gold} alt="Gold" style={{width: "85px", height: "80px", margin: "8px 5.5px"}} />
                                    </div>
                                    <h1 className="card_title">
                                        Arany Tömb
                                    </h1>
                                    <p className="item_desc">
                                        Folyamatosan változó árának köszönhetően 
                                        tudsz kereskedni vele hogy
                                        minnél több pénzt szerezz.
                                    </p>
                                    <div className="item_row">
                                        <div className="item_column">
                                            <h1>ÁR:</h1>
                                            <h1>${gold_price}</h1>
                                        </div>
                                        <div className="item_column">
                                            <h1>RAKTÁRADBAN:</h1>
                                            <h1 id="gold_db">{inv.gold} db</h1>
                                        </div>
                                    </div>
                                    <div className="item_btns">
                                        <button type="button" className="buy_btn" onClick={() => {buy("Arany"); }}>
                                            <h1 id="gold_buy">
                                                <i className="fas fa-shopping-cart"></i> VÁSÁRLÁS
                                            </h1>
                                        </button>
                                        <button type="button" className="sell_btn" onClick={() => {sell("Arany"); }}>
                                            <h1 id="gold_sell">
                                                <i className="fas fa-money-bill-alt"></i> ELADÁS
                                            </h1>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="card">
                                    <div className="loading_card">
                                        <img alt="loading" className="loading_gif" src={loading}/>
                                    </div>
                                    <div className="imgbox">
                                        <img src={Diamond} alt="Diamond" style={{width: "85px", height: "85px", margin: "8px 5px"}} />
                                    </div>
                                    <h1 className="card_title">
                                        Gyémánt
                                    </h1>
                                    <p className="item_desc">
                                        Folyamatosan változó árának köszönhetően 
                                        tudsz kereskedni vele hogy
                                        minnél több pénzt szerezz.
                                    </p>
                                    <div className="item_row">
                                        <div className="item_column">
                                            <h1>ÁR:</h1>
                                            <h1>${diamond_price}</h1>
                                        </div>
                                        <div className="item_column">
                                            <h1>RAKTÁRADBAN:</h1>
                                            <h1 id="diamond_db">{inv.diamond} db</h1>
                                        </div>
                                    </div>
                                    <div className="item_btns">
                                        <button type="button" className="buy_btn" onClick={() => {buy("Gyémánt")}}>
                                            <h1 id="diamond_buy">
                                                <i className="fas fa-shopping-cart"></i> VÁSÁRLÁS
                                            </h1>
                                        </button>
                                        <button type="button" className="sell_btn" onClick={() => {sell("Gyémánt")}}>
                                            <h1 id="diamond_sell">
                                                <i className="fas fa-money-bill-alt"></i> ELADÁS
                                            </h1>
                                        </button>
                                    </div>
                                </div>
                            </div>
                                
                            <div className="column">
                                <div className="card">
                                    <div className="loading_card">
                                        <img alt="loading" className="loading_gif" src={loading}/>
                                    </div>
                                    <div className="imgbox">
                                        <img src={DJ} alt="DJ" style={{width: "65px", height: "65px", margin: "15.5px"}} />
                                    </div>
                                    <h1 className="card_title">
                                        DJ Rang
                                    </h1>
                                    <p className="item_desc">
                                        Hozzáférhetsz a Music Bot fülhez az 
                                        oldalon és használhatod a Music Bot-ok
                                        parancsait.
                                    </p>
                                    <div className="item_row">
                                        <div className="item_column">
                                            <h1>ÁR:</h1>
                                            <h1>$500</h1>
                                        </div>
                                        <div className="item_column">
                                            <h1>RAKTÁRADBAN:</h1>
                                            <h1 id="dj_db">{inv.dj} db</h1>
                                        </div>
                                    </div>
                                    <div className="item_btns">
                                        <button type="button" id="dj_buy_btn" className="buy_btn" onClick={() => {buy("DJ");}}>
                                            <h1 id="dj_buy">
                                                <i className="fas fa-shopping-cart"></i> VÁSÁRLÁS
                                            </h1>
                                        </button>
                                    </div>
                                </div>
                            </div>
                                
                            <div className="column">
                                <div className="card">
                                    <div className="loading_card">
                                        <img alt="loading" className="loading_gif" src={loading}/>
                                    </div>
                                    <div className="imgbox">
                                        <img src={Channel} alt="Channel" style={{width: "85px", height: "85px", margin: "5.5px"}} />
                                    </div>
                                    <h1 className="card_title">
                                        Privát Szoba
                                    </h1>
                                    <p className="item_desc">
                                        Kapsz egy privát szobát a szerveren amibe
                                        csak te léphetsz be és csak te húzhatsz be
                                        embereket.
                                    </p>
                                    <div className="item_row">
                                        <div className="item_column">
                                            <h1>ÁR:</h1>
                                            <h1>$1000</h1>
                                        </div>
                                        <div className="item_column">
                                            <h1>RAKTÁRADBAN:</h1>
                                            <h1 id="channel_db">{inv.channel} db</h1>
                                        </div>
                                    </div>
                                    <div className="item_btns">
                                        <button type="button" className="buy_btn" onClick={() => {buy("channel")}}>
                                                <h1>
                                                    <i className="fas fa-shopping-cart"></i> VÁSÁRLÁS
                                                </h1>
                                            </button>
                                        <button type="button" className="sell_btn" onClick={() => {sell("channel")}}>
                                            <h1>
                                                <i className="fas fa-money-bill-alt"></i> ELADÁS
                                            </h1>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return(
            <div>

            </div>
        )
    }
}
          
export default Store
          