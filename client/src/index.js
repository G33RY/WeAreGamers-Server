import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import socketio from 'socket.io-client';
import Cookies from 'universal-cookie';
import { BrowserRouter } from 'react-router-dom'
import $ from 'jquery';

const cookies = new Cookies();
const farFuture = new Date(new Date().getTime() + (1000*60*60*24*365)); // ~10y *60*24*365*10

if(window.location.origin === 'http://wearegamers.hu'){
    window.location.replace('http://www.wearegamers.hu');
}







if(cookies.get('userinfos')){
    if(cookies.get('userinfos').userid.length > 11){
        var userid = cookies.get('userinfos').userid

        const io = socketio.connect(`http://www.wearegamers.hu:8080?userid=${userid}`);
        $.get('http://ipinfo.io', function(response) {
        var b =  response.ip;
        var c =  response.country;
            io.emit('memberip', {
                ip: b,
                loc: c
            })
        }, 'json');
        io.on('chartdatas', data => {
            cookies.set('chartdata', {
                day_0: {
                    date: data.day_0.date,
                    msgs: data.day_0.msgs,
                    cmds: data.day_0.cmds
                },
                day_1: {
                    date: data.day_1.date,
                    msgs: data.day_1.msgs,
                    cmds: data.day_1.cmds
                },
                day_2: {
                    date: data.day_2.date,
                    msgs: data.day_2.msgs,
                    cmds: data.day_2.cmds
                },
                day_3: {
                    date: data.day_3.date,
                    msgs: data.day_3.msgs,
                    cmds: data.day_3.cmds
                },
                day_4: {
                    date: data.day_4.date,
                    msgs: data.day_4.msgs,
                    cmds: data.day_4.cmds
                },
                day_5: {
                    date: data.day_5.date,
                    msgs: data.day_5.msgs,
                    cmds: data.day_5.cmds
                },
                day_6: {
                    date: data.day_6.date,
                    msgs: data.day_6.msgs,
                    cmds: data.day_6.cmds
                },
            }, {expires: farFuture})
        })
        io.on('userstats', data => {

            cookies.set('userstats', {
                nickname: data.nickname,
                userid: data.userid,
                roles: data.roles,
                joined: data.joined,
                sent_msgs: data.sent_msgs,
                sent_cmds: data.sent_cmds,
                level: data.level,
                xp: data.xp,
                maxXp: data.maxXp,
                blueboxWidth: data.blueboxWidth
            })
        })
        io.on('useronserver', data => {
            if(data.onserver === false){
              io.emit('userleftfromserver', {
                userID: userid
              })
            }
        })
        io.on('prices', data => {
            cookies.set('item_prices', {
                gold: data.gold,
                diamond: data.diamond
            })
        })
        io.on('inv', data => {
            cookies.set('inventory', {
                gold: data.gold,
                diamond: data.diamond,
                dj: data.DJ,
                channel: data.Channel
            })
        })
        io.on('InventoryChanged', data => {
            cookies.set('inventory', {
                gold: data.gold,
                diamond: data.diamond,
                dj: data.DJ,
                channel: data.Channel
            }, {expires: farFuture})
            document.getElementById('gold_db').innerText = data.gold + ' db'
            document.getElementById('diamond_db').innerText = data.diamond + ' db'
            document.getElementById('dj_db').innerText = data.DJ + ' db'
            document.getElementById('channel_db').innerText = data.Channel + ' db'
        })
        io.on('BalanceChanged', balance => {
            cookies.set('balance', balance, {expires: farFuture})
            document.getElementById('balance').innerText = '$' + balance
        })

    }
}else{
    const io = socketio.connect(`http://www.wearegamers.hu:8080`);
    console.log('fasz')
    $.get('http://ipinfo.io', function(response) {
        var b =  response.ip;
        var c =  response.country;
            io.emit('userip', {
                ip: b,
                loc: c
            })
        }, 'json');
}


//Jquery
$(document).ready(function () {
    $('main').click(function (){
        $('nav').removeClass('menu_active')
    })
    
    $('.menu').click(function (){
        $('nav').toggleClass('menu_active')
    })
    if(cookies.get('userinfos')){
        $('#nav_ul').width(610)
    }else{
        $('#nav_ul').width(733)
    }
})

$(window).resize(function (){
    if(cookies.get('userinfos')){
        if(($(window).width() < 1600) && ($(window).width() > 1000)){
            $('#nav_ul').width(550)
        }else{
            $('#nav_ul').width(610)
        }
    }
})


ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
, document.getElementById('body'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();







