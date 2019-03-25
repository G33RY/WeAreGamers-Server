const btoa = require('btoa');
const DB = require("./dbhandlers")
const fetch = require('node-fetch'); 
const { catchAsync } = require('../utils');
const fs = require('fs');
const moment = require('moment');

const config = JSON.parse(fs.readFileSync("../config.json", "utf8"))

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = function(app){
    app.use('/api/discord/callback', catchAsync(async (req, res) => {

        if (!req.query.code) return res.redirect(`http://www.wearegamers.hu`); // ha nincs megadva discord altal kod akkor visszadob a kezdolapra
    
        const code = req.query.code; // a discord altal adott kodnak a valtozoja
        const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`); //url optimalissa konvertalja a user client idjat es a client secretet
        const redirect = encodeURIComponent(`http://www.wearegamers.hu:8080/api/discord/callback`); // Encode URL
    
    
        //Lekeri a Discord API bol a felhasznalo tokenjet
        const token_fetch = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
        {
            method: 'POST',
            headers: {
            Authorization: `Basic ${creds}`,
            },
        });
        const token_fetch_json = await token_fetch.json(); // lekeres json
        const token = token_fetch_json.access_token // felhasznalo tokenje
        
        // Lekeri a Discord API bol a felhasznalo informacioit
        const identify_fetch = await fetch(`http://discordapp.com/api/users/@me`,
        {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        const user = await identify_fetch.json(); // Felhasznalo informacioi json
        let avatarlink = ``; // a felhasznalo avatar linkje
        if(user.avatar == null){ //Ha nincs avatar beallitva neki akkor megnezi az alap avatarjat es annak a linkjet allitja be
            let discriminator = user.discriminator % 5 //Elosztja a felhasznalo discord tagjet 5el
            avatarlink = `https://cdn.discordapp.com/embed/avatars/${discriminator}.png` // A maradekot hozza adja az avatarok linkjehez es megkapja a felhasznalo alap avatarjat
        }else{// Ha van avatarja akkor annak az avatarnak allitja be a linkjet
            avatarlink = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`; // A felhasznalo idjet es az avatar idjet hozza adja az avatarok linkjehez es megkapja a felhasznalo egyedi avatarjat
        }
    
        const farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*5)); // ~5y
    
        // Hozza adja a usert a szerverhez
        await fetch(`http://discordapp.com/api/guilds/440494010595803136/members/${user.id}`,
        {
        method: 'PUT',
        headers: {
            'Authorization': `Bot ${config.token}`,
            'Content-Type': "application/json",
        },
        body: JSON.stringify({
            'access_token': token,
            "roles": ["440804615185760256"]
        }),
        })
    
           let Userinfos = await DB.FindOneUserInfos({userid: user.id}) // Lekerdezi az adatbazist a felhasznalo idvel
    
            if(Userinfos != null){ // ha a tablaba benne van a felhasznalo akkor updatel minden benne a biztonsag kedveert ha valtozna valami
                await DB.UpdateUserInfos({userid: user.id}, {usertoken: token, userid: user.id,username: user.username, email: user.email, avatar: avatarlink})
            }else{// ha nem akkor csinal egy dokumentum a userinfos tablaba es az economies tablaba is
                await DB.CreateUserInfos({usertoken: token, userid: user.id, username: user.username, email: user.email, avatar: avatarlink})
                await DB.CreateEconomyDB({userid: user.id, balance: 0, daily: 0})
            }
        // megkeresi az economies tablaban a felhasznalo dokomentumat
        if(res.headersSent === false){
            const economy = await DB.FindOneEconomyDB({userid: user.id})
                if(req.headers.cookie){ // Ha a bongeszoben be van allitva a userinfos cookie akkor kiirja konzolba hogy mar be van allitva a cookie
                    if(req.headers.cookie.includes('userinfos')){
                        console.log("cookie already set")
                    }else{ // ha nincs bellitva akkor bellitja a cookiet a felhasznalo adataival
                        await res.cookie('userinfos', { 
                                userid: user.id,
                                username: user.username,
                                email: user.email,
                                userbalance: economy.balance,
                                avatar: avatarlink
                        }, {expires: farFuture})
                        const UserQueue = await DB.FindOneQueue({userid: user.id})
                        const queue = UserQueue.queue
                        await res.cookie('queue', queue, {expires: farFuture})
                        const VolumeDB = await DB.FindOneVolumes({userid: user.id})
                        const Volume = VolumeDB.volume
                        await res.cookie('volume', Volume, {expires: farFuture})
                    }   
                }
        }
    
        //Bellitja a fuggvenyek adatait egy cookieba 7 napig
        res.cookie('chartdata', {
            day_0: {
                date: moment().subtract(0, "days").add(0, 'hours').format('MM-DD'),
                msgs: 0,
                cmds: 0
            },
            day_1: {
                date: moment().subtract(1, "days").add(0, 'hours').format('MM-DD'),
                msgs: 0,
                cmds: 0
            },
            day_2: {
                date: moment().subtract(2, "days").add(0, 'hours').format('MM-DD'),
                msgs: 0,
                cmds: 0
            },
            day_3: {
                date: moment().subtract(3, "days").add(0, 'hours').format('MM-DD'),
                msgs: 0,
                cmds: 0
            },
            day_4: {
                date: moment().subtract(4, "days").add(0, 'hours').format('MM-DD'),
                msgs: 0,
                cmds: 0
            },
            day_5: {
                date: moment().subtract(5, "days").add(0, 'hours').format('MM-DD'),
                msgs: 0,
                cmds: 0
            },
            day_6: {
                date: moment().subtract(6, "days").add(0, 'hours').format('MM-DD'),
                msgs: 0,
                cmds: 0
            },
        }, {expires: farFuture})
    
        return await res.redirect(`http://www.wearegamers.hu`) // Visszadobja a kezdo oldalra
        
        
    }));
    app.use('/api/countdown', catchAsync(async (req, res) => {
        const secondsAll = moment('2019-04-19 00:00').diff(moment(), 'seconds')
        let daysRes = 0
        let hoursRes = 0
        let minutesRes = 0
        let secondsRes = 0

        if(secondsAll % 60 == 0){
            let hours
            let minutes = secondsAll / 60
            secondsRes = 0
            if(minutes % 60 == 0){
                hours = minutes / 60
                minutesRes = 0
                if(hours % 24 == 0){
                    hoursRes = 0
                    daysRes = parseInt((hours / 24).toString())
                }else{
                    daysRes = parseInt((hours / 24).toString())
                    hoursRes = parseInt((hours % 24).toString())
                }
            }else{
                hours = minutes / 60
                minutesRes = parseInt((minutes % 60).toString()) + 1
                if(hours % 24 == 0){
                    hoursRes = 0
                    daysRes = parseInt((hours / 24).toString())
                }else{
                    daysRes = parseInt((hours / 24).toString())
                    hoursRes = parseInt((hours % 24).toString())
                }
            }
        }else{
            let hours
            let minutes = secondsAll / 60
            secondsRes = parseInt((secondsAll % 60).toString())
            if(minutes % 60 == 0){
                hours = minutes / 60
                minutesRes = 0
                if(hours % 24 == 0){
                    hoursRes = 0
                    daysRes = parseInt((hours / 24).toString())
                }else{
                    daysRes = parseInt((hours / 24).toString())
                    hoursRes = parseInt((hours % 24).toString())
                }
            }else{
                hours = minutes / 60
                minutesRes = parseInt((minutes % 60).toString()) + 1
                if(hours % 24 == 0){
                    hoursRes = 0
                    daysRes = parseInt((hours / 24).toString())
                }else{
                    daysRes = parseInt((hours / 24).toString())
                    hoursRes = parseInt((hours % 24).toString())
                }
            }
        }
        
        
        res.send({
            "messages": [
                {"text": `Már csak ${daysRes} nap, ${hoursRes} óra, ${minutesRes} perc, ${secondsRes} másodperc van hátra!`},
              ]
        })

        // return res.send({
        //     "days": daysRes,
        //     "hours": hoursRes,
        //     "minutes": minutesRes,
        //     "seconds": secondsRes,
        //     "text": `Már csak ${daysRes} nap, ${hoursRes} óra, ${minutesRes} perc, ${secondsRes} másodperc van hátra!`
        // })
    }))
}