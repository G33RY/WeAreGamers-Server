// NODE MODULES INSTALL SCRIPT
//        - npm install btoa discord-auditlog discord-leveling discord-economy discord.js edit-json-file express ffmpeg-binaries form-data fs graphql-yoga jimp moment mongoose mongoose-ttl node-fetch nodemon opusscript react-helmet socket.io yt-search ytdl-core

// KNOW ERRORS: 
//        -Belejentekzes utan 'Cannot set headers after they are sent to the client' neha adja ki es varni kell 1-2 percet es jo lesz

//TODO: 
//TODO        - Nem mukodik a skip command
//TODO        - Mutassa hol tart a zene a client oldalon
//TODO        - MAYBE: JOIN & LEAVE Button

//! Import NPM Packages
    // WebSite
    const express = require('express');
    const socketio = require('socket.io');
    const { GraphQLServer } = require('graphql-yoga');
    const fetch = require('node-fetch'); 
    const api = require('./Features/api')

    // Discord
    const Discord = require('discord.js');
    const eco = require('discord-economy');
    const Auditlog = require('discord-auditlog');
    const Leveling = require('discord-leveling');

    // Music Bots
    const bot1 = require('./MusicBots/musicbot')
    const bot2 = require('./MusicBots/musicbot1')
    const ytdl = require('ytdl-core')
    const ee = require('./Features/events')

    // Mongoose
    const DB = require('./Features/dbhandlers')
    const mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://G33RY:LOLminecraft.1@wearegamerswebsite-kidmz.mongodb.net/WeAreGamers_Website?retryWrites=true', { useNewUrlParser: true });
    const LevelingDB = mongoose.model('levelings')
    const EconomyDB = mongoose.model('economies')
    const MessageCounters = mongoose.model('MessageCounters')
    const CommandCounters = mongoose.model('CommandCounters')
    const Inventory = mongoose.model('inventorys')
    const Queues = mongoose.model('queues')

    // File Handlers
    const fs = require('fs');
    const editJsonFile = require('edit-json-file');

    // Others
    const moment = require('moment');


// Define Main Variables
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
const bot = new Discord.Client()
let levels = [0, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 6400, 6700, 7000, 7300, 7700, 8100, 8500, 8900, 9300, 9700, 10100, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000, 15500, 16000, 20000]
const bots = ['500017855631327232', '500021011387908116'];

// GraphQL Yoga
const typeDefs = `type Query{ Userinfos: [userinfo] } type userinfo{ usertoken: String userid: String username: String mail: String onserver: Boolean }`;
const resolvers = {
    Query: {
        Userinfos: async () =>{ await DB.FindUserInfos('')}
    }
}
const GraphQLserver = new GraphQLServer({typeDefs, resolvers})
GraphQLserver.start({port: 4000}, () => console.log(`GraphQL Server is running on wearegamers.hu:4000`))


//Express Handlers
const app = express();
const server = app.listen(8080, () => {
    console.log('BackEnd Server is running on wearegamers.hu:8080')
});
api(app)


function l(log){
    console.log(log)
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
        break;
        }
    }
}


// WebSocket Handlers
const io = socketio(server)
io.on('connection',  async (socket) => {
    let items = JSON.parse(fs.readFileSync('DataBases/items.json', 'utf8'))

    // Log ip
    socket.on('userip', function (data) {
        console.log(`User Connected: ${data.loc} - ${data.ip}`)
    })

    // Handle Buy/Sell
    socket.on('buy', function(data){
        if(data){ // If data exits     
            let item = eval('items.' + data.item) // Get item from the json
            if(item){
                eco.FetchBalance(data.userid).then(async a => { // Fetch User's money
                    if(item.price > a){ // If item's price more than the user's money
                        socket.emit('NotEnoughMoney', null) // Send error message
                        return
                    }else{
                        const inv = await DB.FindOneInventory({userid: data.userid}) // Get user's inventory
                        if((data.item == 'DJ') && (inv.DJ != 0)){ // If user have a dj item and the response is a dj item
                            socket.emit('RankAlreadyGot', null) // Send error message
                        }else if((data.item == 'DJ') && (inv.DJ == 0)){ // If the item is the DJ  and user dont have it
                            eco.AddToBalance(data.userid, -(item.price)) // Subtrack the item's price from the user's money
                            await DB.UpdateInventory({userid: data.userid}, {DJ: 1}) // Update his inventory
                            socket.emit('Sucess', null) // Send sucess message
                            bot.guilds.array()[0].members.get(data.userid).addRole('480752423556874250')
                        }
                        
                        else if((data.item == 'channel') && (inv.channel != 0)){ // If user have a dj item and the response is a dj item
                            socket.emit('RankAlreadyGot', null) // Send error message
                        }else if((data.item == 'channel') && (inv.channel == 0)){ // If the item is the channel  and user dont have it
                            eco.AddToBalance(data.userid, -(item.price)) // Subtrack the item's price from the user's money
                            await DB.UpdateInventory({userid: data.userid}, {channel: 1}) // Update his inventory
                            socket.emit('Sucess', null) // Send sucess message
                            let guild = bot.guilds.array()[0]
                            let user = guild.members.get(data.userid)
                            
                            guild.createChannel(`${user.displayName} Privát Szobája`, 'voice', [{
                                id: guild.id,
                                deny: ['CONNECT'],
                                allow: ['VIEW_CHANNEL', 'SPEAK']
                            }]).then(async m => {
                                if(m){
                                    m.setParent('554713698015510558')
                                    m.overwritePermissions(user.id, {
                                        SPEAK: true,
                                        VIEW_CHANNEL: true,
                                        CONNECT: true,
                                        CREATE_INSTANT_INVITE: true,
                                        MOVE_MEMBERS: true
                                    })
                                    await DB.UpdatePrivateChannels({userid: user.id}, {$push: {channels: {id: m.id, users: []}}})
                                }
                            })
                        }

                        else{
                            eco.AddToBalance(data.userid, -(item.price)) // Subtrack the item's price from the user's money
                            await DB.UpdateInventory({userid: data.userid}, {[data.item]: eval(`inv.${data.item}`) + 1}) // Update his inventory
                            socket.emit('Sucess', null) // Send sucess message
                        }
                    }
                    return
                })
            }
        }
    })
    socket.on('sell', function(data){
        if(data){ // If data exits
            let item = eval('items.' + data.item) // Get item from the json
            if(item){
                eco.FetchBalance(data.userid).then(async a => { // Fetch User's money
                    const inv = await DB.FindOneInventory({userid: data.userid}) // Get user's inventory

                    if((data.item == 'channel') && (inv.channel != 0)){ // If user have a dj item and the response is a dj item
                        eco.AddToBalance(data.userid, ((item.price) - 200)) // Subtrack the item's price from the user's money
                        let ChannelsDB = await DB.FindOnePrivateChannels({userid: data.userid})
                        await DB.UpdateInventory({userid: data.userid}, {channel: 0}) // Update his inventory
                        socket.emit('Sucess', null) // Send sucess message
                        let guild = bot.guilds.array()[0]
                        let user = guild.members.get(data.userid)
                        let Channels = ChannelsDB.channels
                
                        Channels.forEach(async el => {
                            await DB.UpdatePrivateChannels({userid: user.id}, {$pull: {channels: {id: el.id, users: el.users}}}) 
                            guild.channels.get(el.id).delete()
                        })
                    }
                    
                    else if(eval(`inv.${data.item}`) === 0){
                        socket.emit('NotEnoughItem', null)
                    }
                    else{
                        eco.AddToBalance(data.userid, (item.price)) // Subtrack the item's price from the user's money
                        await DB.UpdateInventory({userid: data.userid}, {[data.item]: eval(`inv.${data.item}`) - 1}) // Update his inventory
                        socket.emit('Sucess', null) // Send sucess message
                    }
                })
            }
        }
    })

    if(socket.handshake.query.userid && bot.guilds.array()[0]){
        let userid = socket.handshake.query.userid
        const member = bot.guilds.array()[0].members.get(userid)

        // on song end
        ee.on('songend', function (data) {
            if(data.userid === userid){
                ytdl.getBasicInfo(data.song).then(m =>{
                    socket.emit('songend', {
                        url: data.song,
                        title: m.title,
                        thumbnail_url: m.thumbnail_url
                    })
                })
                socket.emit('songend', data)
            }
        })
        // Log User's ip
        socket.on('memberip', function (data) {
            console.log(`${bot.guilds.array()[0].members.get(userid).displayName} Connected: ${data.loc} - ${data.ip}`)
        })

        // Send Volumes
        const VolumeDB = await DB.FindOneVolumes({userid: userid})
        socket.emit('volume', VolumeDB.volume)

        // Send Items Price
        items = JSON.parse(fs.readFileSync('DataBases/items.json', 'utf8'))
        socket.emit('prices', {
            gold: items.Arany.price,
            diamond: items.Gyémánt.price
        })

        // Send User's Inventory
        const userinv = await DB.FindOneInventory({userid: userid})
        socket.emit('inv', {
            gold: userinv.Arany,
            diamond: userinv.Gyémánt,
            DJ: userinv.DJ,
            Channel: userinv.channel
        })

        // Private Channels Add/Remove User
        socket.on('adduser', async (data) => {
            if(data.member){
                let guild = bot.guilds.array()[0]
                let ChannelsDB = await DB.FindOnePrivateChannels({userid: userid})
                let Channels = ChannelsDB.channels
                let num = 0
 
                Channels.forEach(async el => {
                    guild.channels.get(el.id).overwritePermissions(data.member, {
                        CONNECT: true
                    })
                    await DB.UpdatePrivateChannels({userid: userid}, { $push: { ['channels.' + num + '.users']: data.member}})
                    num++
                })
                
                
            }
        })
        socket.on('removeuser', async (data) => {
            if(data.member){
                let guild = bot.guilds.array()[0]
                let ChannelsDB = await DB.FindOnePrivateChannels({userid: userid})
                let Channels = ChannelsDB.channels
                let num = 0
        
                Channels.forEach(async el => {
                    guild.channels.get(el.id).overwritePermissions(data.member, {
                        CONNECT: false
                    })
                    await DB.UpdatePrivateChannels({userid: userid}, { $pull: { ['channels.' + num + '.users']: data.member}})
                    num++
                })
            }   
        })


        // Handle Music Bots
        let artificallyQueueUpdate = false
        socket.on('join', async (data) => {
            console.log('join' + ' ' + bot.guilds.array()[0].members.get(userid).displayName)
            if(!bot.guilds.array()[0].members.get(userid).voiceChannel) return socket.emit('UserNotInChannel', null)
            console.log('join0')
            const UserVoice = bot.guilds.array()[0].members.get(userid).voiceChannel
            let avaiableBots = []
            if(!bot.guilds.array()[0].members.get(bots[0]).voiceChannel){
                avaiableBots.push(bots[0])
            }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel){
                UserVoice.members.map(m => {
                    if(m.id === bots[0]){
                        avaiableBots.push(bots[0])
                    }else if(m.id === bots[1]){
                        if(avaiableBots.includes(bots[0])){
                            avaiableBots.splice(avaiableBots.indexOf(bots[0]), 1)
                        }
                    }
                })
            }
            if(!bot.guilds.array()[0].members.get(bots[1]).voiceChannel){
                avaiableBots.push(bots[1])
            }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel){
                UserVoice.members.map(m => {
                    if(m.id === bots[1]){
                        avaiableBots.push(bots[1])
                    }else if(m.id === bots[0]){
                        if(avaiableBots.includes(bots[0])){
                            avaiableBots.splice(avaiableBots.indexOf(bots[0]), 1)
                        }
                    }
                })
            }
            if(avaiableBots.length === 0) return socket.emit('Join_BotsInUse', null)

            if(avaiableBots.length === 2){
                let rand = Math.round(Math.random())
                console.log('join1')
                if(rand === 0){
                    bot1.join(member)
                    console.log('join2')
                    return socket.emit('Join_Sucess', bot.guilds.array()[0].members.get(bots[0]).displayName)
                }else if(rand === 1){
                    console.log('join3')
                    bot2.join(member)
                    return socket.emit('Join_Sucess', bot.guilds.array()[0].members.get(bots[1]).displayName)
                }
            }else if(avaiableBots.length === 1){
                if(avaiableBots[0] === bots[0]){
                    bot1.join(member)
                    console.log('join4')
                    return socket.emit('Join_Sucess', bot.guilds.array()[0].members.get(bots[0]).displayName)
                }else if(avaiableBots[0] === bots[1]){
                    bot2.join(member)
                    console.log('join5')
                    return socket.emit('Join_Sucess', bot.guilds.array()[0].members.get(bots[1]).displayName)
                }
            }
        })
        socket.on('leave', async (data) => {
            const UserVoiceID = member.voiceChannelID
            let bot1NotIn = false
            let bot2NotIn = false
            let bot1NotInThis = false
            let bot2NotInThis = false

            if(!bot.guilds.array()[0].members.get(bots[0]).voiceChannel){
                bot1NotIn = true
            }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel.id === UserVoiceID){
                bot1.leave()
                return socket.emit('Leave_Sucess', bot.guilds.array()[0].members.get(bots[0]).displayName)
            }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel.id != UserVoiceID){
                bot1NotInThis = true
            }

            if(!bot.guilds.array()[0].members.get(bots[1]).voiceChannel){
                bot2NotIn = true
            }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel.id === UserVoiceID){
                bot2.leave()
                return socket.emit('Leave_Sucess', bot.guilds.array()[0].members.get(bots[0]).displayName)
            }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel.id != UserVoiceID){
                bot2NotInThis = true
            }

            
            if(bot1NotIn && bot2NotIn) return socket.emit('BotsNotInChannels', null)
            if(bot1NotInThis && bot2NotInThis) return socket.emit('Leave_BotsInUse', null)
        })
        socket.on('play', async (data) => {
            let num = data.num
            if(num){
                num = parseInt(num)
                if(isNaN(num)) return socket.emit('SomethingWentWrong', null)
                if(!bot.guilds.array()[0].members.get(userid).voiceChannel) return socket.emit('UserNotInChannel', null)
                const UserQueue = await DB.FindOneQueue({userid: userid})
                const Queue = UserQueue.queue
                const Url = Queue[num].url
                if (!ytdl.validateURL(Url)) return socket.emit('Play_UrlNotValid', null)
    
                const User = bot.guilds.array()[0].members.get(userid)
                const Bot1Voice = bot.guilds.array()[0].members.get(bots[0]).voiceChannel
                const Bot2Voice = bot.guilds.array()[0].members.get(bots[1]).voiceChannel
                let avaiableBots = []
    
                if(Bot1Voice){
                    if(Bot1Voice.members.get(User.id)){
                        avaiableBots.push(bots[0])
                    }
                }else if(!Bot1Voice){
                    avaiableBots.push(bots[0])
                }
                if(avaiableBots.length === 0){
                    if(Bot2Voice){
                        if(Bot2Voice.members.get(User.id)){
                            avaiableBots.push(bots[1])
                        }
                    }else if(!Bot2Voice){
                        avaiableBots.push(bots[1])
                    }
                }

                if(avaiableBots.length === 0) return socket.emit('Play_BotsInUse', null)
    
                if(avaiableBots.length === 2){
                    let rand = Math.round(Math.random())
    
                    if(rand === 0){
                        bot1.play(`${Url};${userid}`)
                        console.log( '3 ' + avaiableBots)
                        return socket.emit('Play_Sucess', bot.guilds.array()[0].members.get(bots[0]).displayName)
                    }else if(rand === 1){
                        bot2.play(`${Url};${userid}`)
                        console.log( '4 ' + avaiableBots)
                        return socket.emit('Play_Sucess', bot.guilds.array()[0].members.get(bots[1]).displayName)
                    }
                }else if(avaiableBots.length === 1){
                    if(avaiableBots[0] === bots[0]){
                        bot1.play(`${Url};${userid}`)
                        return socket.emit('Play_Sucess', bot.guilds.array()[0].members.get(bots[0]).displayName)
                    }else if(avaiableBots[0] === bots[1]){
                        bot2.play(`${Url};${userid}`)
                        return socket.emit('Play_Sucess', bot.guilds.array()[0].members.get(bots[1]).displayName)
                    }
                }
            }
            
        })
        socket.on('stop', async (data) => {
            const UserVoiceID = member.voiceChannelID
            let bot1NotInThis = false
            let bot2NotInThis = false

            if(!bot.guilds.array()[0].members.get(bots[0]).voiceChannel){
            }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel.id === UserVoiceID){
                bot1.stop()
                return socket.emit('Stop_Sucess', bot.guilds.array()[0].members.get(bots[0]).displayName)
            }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel.id != UserVoiceID){
                bot1NotInThis = true
            }

            if(!bot.guilds.array()[0].members.get(bots[1]).voiceChannel){
            }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel.id === UserVoiceID){
                bot2.stop()
                return socket.emit('Stop_Sucess', bot.guilds.array()[0].members.get(bots[0]).displayName)
            }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel.id != UserVoiceID){
                bot2NotInThis = true
            }
            if(bot1NotInThis && bot2NotInThis) return socket.emit('BotsNotInChannels', null)
        })
        socket.on('skip', async (data) => {
            if(!member.voiceChannel) return socket.emit('UserNotInChannel', null)
            let botWhoIn = null
            member.voiceChannel.members.map(m => {
                if(m.id === bots[0]){
                    botWhoIn = 1
                }else if(m.id === bots[1]){
                    botWhoIn = 2
                }
            })
            if(botWhoIn){
                if(botWhoIn === 1){
                    bot1.skip(member)
                }else if(botWhoIn === 2){
                    bot2.skip(member)
                }
            }else{
                return socket.emit('BotsNotInChannels', null)
            }  
        })
        socket.on('back', async (data) => {
            if(!member.voiceChannel) return socket.emit('UserNotInChannel', null)
            let botWhoIn = null
            member.voiceChannel.members.map(m => {
                if(m.id === bots[0]){
                    botWhoIn = 1
                }else if(m.id === bots[1]){
                    botWhoIn = 2
                }
            })
            if(botWhoIn){
                if(botWhoIn === 1){
                    bot1.back(member)
                }else if(botWhoIn === 2){
                    bot2.back(member)
                }
            }else{
                return socket.emit('BotsNotInChannels', null)
            }  
        })
        socket.on('pause', async (data) => {
            if(!member.voiceChannel) return socket.emit('UserNotInChannel', null)
            let botWhoIn = null
            member.voiceChannel.members.map(m => {
                if(m.id === bots[0]){
                    botWhoIn = 1
                }else if(m.id === bots[1]){
                    botWhoIn = 2
                }
            })
            if(botWhoIn){
                if(botWhoIn === 1){
                    bot1.pause()
                }else if(botWhoIn === 2){
                    bot2.pause()
                }
            }else{
                return socket.emit('BotsNotInChannels', null)
            }
        })
        socket.on('resume', async (data) => {
            if(!member.voiceChannel) return socket.emit('UserNotInChannel', null)
            let botWhoIn = null
            member.voiceChannel.members.map(m => {
                if(m.id === bots[0]){
                    botWhoIn = 1
                }else if(m.id === bots[1]){
                    botWhoIn = 2
                }
            })
            if(botWhoIn){
                if(botWhoIn === 1){
                    bot1.resume(data, member)
                }else if(botWhoIn === 2){
                    bot2.resume(data, member)
                }
            }else{
                const User = bot.guilds.array()[0].members.get(userid)
                const Bot1Voice = bot.guilds.array()[0].members.get(bots[0]).voiceChannel
                const Bot2Voice = bot.guilds.array()[0].members.get(bots[1]).voiceChannel
                let avaiableBots = []
    
                if(Bot1Voice){
                    if(Bot1Voice.members.get(User.id)){
                        avaiableBots.push(bots[0])
                    }
                }else if(!Bot1Voice){
                    avaiableBots.push(bots[0])
                }
                if(avaiableBots.length === 0){
                    if(Bot2Voice){
                        if(Bot2Voice.members.get(User.id)){
                            avaiableBots.push(bots[1])
                        }
                    }else if(!Bot2Voice){
                        avaiableBots.push(bots[1])
                    }
                }

                if(avaiableBots.length === 0) return socket.emit('Play_BotsInUse', null)
    
                if(avaiableBots.length === 2){
                    let rand = Math.round(Math.random())
    
                    if(rand === 0){
                        bot1.resume(data, member)
                    }else if(rand === 1){
                        bot2.resume(data, member)
                    }
                }else if(avaiableBots.length === 1){
                    if(avaiableBots[0] === bots[0]){
                        bot1.resume(data, member)
                    }else if(avaiableBots[0] === bots[1]){
                        bot2.resume(data, member)
                    }
                }
            }
        })
        socket.on('shuffle', async (data) => {
            if(!member.voiceChannel) return socket.emit('UserNotInChannel', null)
            let botWhoIn = null
            member.voiceChannel.members.map(m => {
                if(m.id === bots[0]){
                    botWhoIn = 1
                }else if(m.id === bots[1]){
                    botWhoIn = 2
                }
            })
            if(botWhoIn){
                if(botWhoIn === 1){
                    bot1.shuffle()
                }else if(botWhoIn === 2){
                    bot2.shuffle()
                }
            }else{
                return socket.emit('BotsNotInChannels', null)
            }   
        })
        socket.on('repeat', async (data) => {
            if(!member.voiceChannel) return socket.emit('UserNotInChannel', null)
            let botWhoIn = null
            member.voiceChannel.members.map(m => {
                if(m.id === bots[0]){
                    botWhoIn = 1
                }else if(m.id === bots[1]){
                    botWhoIn = 2
                }
            })
            if(botWhoIn){
                if(botWhoIn === 1){
                    bot1.repeat()
                }else if(botWhoIn === 2){
                    bot2.repeat()
                }
            }else{
                return socket.emit('BotsNotInChannels', null)
            }   
        })
        socket.on('norepeat', async (data) => {
            if(!member.voiceChannel) return socket.emit('NoUserNotInChannel', null)
            let botWhoIn = null
            member.voiceChannel.members.map(m => {
                if(m.id === bots[0]){
                    botWhoIn = 1
                }else if(m.id === bots[1]){
                    botWhoIn = 2
                }
            })
            if(botWhoIn){
                if(botWhoIn === 1){
                    bot1.norepeat()
                }else if(botWhoIn === 2){
                    bot2.norepeat()
                }
            }else{
                return socket.emit('BotsNotInChannels', null)
            }   
        })
        socket.on('add', async (data) => {
            const url = data.url
            if (!url) return socket.emit('SomethingWentWrong', null)
            if (!ytdl.validateURL(url)) return socket.emit('Add_UrlNotValid', null)
            ytdl.getBasicInfo(url).then(async m => {
                if(m.livestream || (m.length_seconds === 0)) return socket.emit('SomethingWentWrong', null)
                const UserQueue = await DB.FindOneQueue({userid: userid})
                const Queue = UserQueue.queue
                if(Queue.length < 21){
                    let asd = false
                    Queue.forEach(async el => {
                        if(el.url == m.video_url){                   
                            asd = true
                        }
                    });
                    if(asd){ 
                        return socket.emit('Add_SongAlreadyIn', null)
                    }else{
                        const asd = await DB.UpdateQueue({userid: userid}, {$push: {queue: {title: m.title, url: m.video_url}}})
                        if(asd){
                            return socket.emit('Add_Sucess', {title: m.title, url: m.video_url, thumbnail: m.thumbnail_url})
                        }else{
                            return socket.emit('SomeThingWentWrong', null)
                        }
                    }
    
    
                }else{
                    return socket.emit('Add_LimitReached', null)
                }
                
            })
        })
        socket.on('remove', async (data) => {
            const url = data.url
            let num = data.num
            if(url){
                if (!ytdl.validateURL(url)) return socket.emit('Remove_UrlNotValid', null)
                ytdl.getBasicInfo(url).then(async m => {
                    const UserQueue = await DB.FindOneQueue({userid: member.user.id})
                    const Queue = UserQueue.queue
                    if(Queue.length < 0){
                        let asd = false
                        Queue.forEach(async el => {
                            if(el.url === m.video_url){                   
                                asd = true
                            }
                        });
                        if(!asd){ 
                            return socket.emit('Remove_SongNotInQueue', null)
                        }else{
                            await DB.UpdateQueue({userid: member.user.id}, {$pull: {queue: {title: m.title, url: m.video_url}}})
                            UserQueue = await DB.FindOneQueue({userid: member.user.id})  
                            return socket.emit('Remove_Sucess', {title: m.title, url: url, thumbnail: m.thumbnail_url})
                        }
        
        
                    }else{
                        return socket.emit('Remove_PlaylistBlank', null)
                    }
                    
                })
            }else if(num){
                num = parseInt(num)
                const UserQueue = await DB.FindOneQueue({userid: member.user.id})
                const Queue = UserQueue.queue
                if((num > Queue.length) || (num < 0)) return socket.emit('Remove_NumberError', Queue.length)
                if(!Queue[num]) return socket.emit('SomethingWentWrong', null)
                
                ytdl.getBasicInfo(Queue[num].url).then(async m => {      
                    await DB.UpdateQueue({userid: member.user.id}, {$pull: {queue: {title: m.title, url: m.video_url}}})
                    if(data.id){
                        return socket.emit('Remove_Sucess', {title: m.title, url: m.video_url, id: data.id})
                    }else{
                        return socket.emit('Remove_Sucess', {title: m.title, url: m.video_url})
                    }
                })
            }else{
                return socket.emit('SomethingWentWrong', null)
            }
        })
        socket.on('volumechanged', async (data) => {
            if(data){
                await DB.UpdateVolumes({userid: userid}, {userid: userid, volume: data})
                ee.emit('volumechange', data)
            }
        })
        socket.on('queuechange', async (data) => {
            if(!data) return socket.emit('OnChangeByClient_Error', null)
            artificallyQueueUpdate = true
            data.map(m =>{
                m.title.replace(' ' + ' ', '')
            })
            const asd = await DB.UpdateQueue({userid: member.user.id}, {queue: data})
            if(asd){
                setTimeout(() => {
                    artificallyQueueUpdate = false
                }, 500);
                return socket.emit('OnChangeByClient_Sucess', null)
            }else{
                console.log('fasz2')                
                return socket.emit('OnChangeByClient_Error', null)
            }
        })
        Queues.watch({
            fullDocument: 'updateLookup'
        }).on('change', change => {
            if (change.fullDocument.userid === userid) {
                if(!artificallyQueueUpdate){
                    return socket.emit('OnChange_NewQueue', change.fullDocument.queue)
                }
            }
        })

        // Track Balance Change
        EconomyDB.watch({
            fullDocument: 'updateLookup'
        }).on('change', async change => {
            if (change.fullDocument.userid === userid) {
                socket.emit('BalanceChanged', change.fullDocument.balance)
            }
        })

        // Track Inventory Change
        Inventory.watch({
            fullDocument: 'updateLookup'
        }).on('change', async change => {
            if (change.fullDocument.userid == userid) {
                    socket.emit('InventoryChanged', {
                        gold: change.fullDocument.Arany,
                        diamond: change.fullDocument.Gyémánt,
                        DJ: change.fullDocument.DJ,
                        Channel: change.fullDocument.channel
                    })
            }
        })

        // Send User Infos
        let user = bot.guilds.get('440494010595803136').members.get(userid)
        let roles_raw = ''
        user.roles.array().map(m => {
            roles_raw += ', ' + m.name
        })
        let roles = roles_raw.substr(12)
        const Counters = await DB.FindOneCounters({userid: userid})
        const leveling = await DB.FindOneLevelingDB({userid: userid})
        socket.emit('userstats', {
            nickname: user.displayName,
            userid: user.id,
            roles: roles,
            joined: moment(user.joinedAt).format('MMM DD YYYY, HH:mm'),
            sent_msgs: Counters.messages,
            sent_cmds: Counters.commands,
            level: leveling.level,
            xp: leveling.xp,
            maxXp: levels[leveling.level+1],
            blueboxWidth: [((leveling.xp - levels[leveling.level])*100), (levels[leveling.level+1] - levels[leveling.level])]
        })

        // Send Chart Datas
        let msg_day_0 = await MessageCounters.countDocuments({userid: userid, added_on: moment().subtract(0, 'days').add(0, 'hours').format('YYYY MM DD')})
        let msg_day_1 = await MessageCounters.countDocuments({userid: userid, added_on: moment().subtract(1, 'days').add(0, 'hours').format('YYYY MM DD')})
        let msg_day_2 = await MessageCounters.countDocuments({userid: userid, added_on: moment().subtract(2, 'days').add(0, 'hours').format('YYYY MM DD')})
        let msg_day_3 = await MessageCounters.countDocuments({userid: userid, added_on: moment().subtract(3, 'days').add(0, 'hours').format('YYYY MM DD')})
        let msg_day_4 = await MessageCounters.countDocuments({userid: userid, added_on: moment().subtract(4, 'days').add(0, 'hours').format('YYYY MM DD')})
        let msg_day_5 = await MessageCounters.countDocuments({userid: userid, added_on: moment().subtract(5, 'days').add(0, 'hours').format('YYYY MM DD')})
        let msg_day_6 = await MessageCounters.countDocuments({userid: userid, added_on: moment().subtract(6, 'days').add(0, 'hours').format('YYYY MM DD')})

        let cmd_day_0 = await CommandCounters.countDocuments({userid: userid, added_on: moment().subtract(0, 'days').add(0, 'hours').format('YYYY MM DD')})
        let cmd_day_1 = await CommandCounters.countDocuments({userid: userid, added_on: moment().subtract(1, 'days').add(0, 'hours').format('YYYY MM DD')})
        let cmd_day_2 = await CommandCounters.countDocuments({userid: userid, added_on: moment().subtract(2, 'days').add(0, 'hours').format('YYYY MM DD')})
        let cmd_day_3 = await CommandCounters.countDocuments({userid: userid, added_on: moment().subtract(3, 'days').add(0, 'hours').format('YYYY MM DD')})
        let cmd_day_4 = await CommandCounters.countDocuments({userid: userid, added_on: moment().subtract(4, 'days').add(0, 'hours').format('YYYY MM DD')})
        let cmd_day_5 = await CommandCounters.countDocuments({userid: userid, added_on: moment().subtract(5, 'days').add(0, 'hours').format('YYYY MM DD')})
        let cmd_day_6 = await CommandCounters.countDocuments({userid: userid, added_on: moment().subtract(6, 'days').add(0, 'hours').format('YYYY MM DD')})
        socket.emit('chartdatas', {
            day_0: {
                date: moment().subtract(0, 'days').add(0, 'hours').format('MM-DD'),
                msgs: msg_day_0,
                cmds: cmd_day_0
            },
            day_1: {
                date: moment().subtract(1, 'days').add(0, 'hours').format('MM-DD'),
                msgs: msg_day_1,
                cmds: cmd_day_1
            },
            day_2: {
                date: moment().subtract(2, 'days').add(0, 'hours').format('MM-DD'),
                msgs: msg_day_2,
                cmds: cmd_day_2
            },
            day_3: {
                date: moment().subtract(3, 'days').add(0, 'hours').format('MM-DD'),
                msgs: msg_day_3,
                cmds: cmd_day_3
            },
            day_4: {
                date: moment().subtract(4, 'days').add(0, 'hours').format('MM-DD'),
                msgs: msg_day_4,
                cmds: cmd_day_4
            },
            day_5: {
                date: moment().subtract(5, 'days').add(0, 'hours').format('MM-DD'),
                msgs: msg_day_5,
                cmds: cmd_day_5
            },
            day_6: {
                date: moment().subtract(6, 'days').add(0, 'hours').format('MM-DD'),
                msgs: msg_day_6,
                cmds: cmd_day_6
            },
        })
    }

    // Detect if user leave from the server
    socket.on('userleftfromserver', async function (data) {
        const userinfos = await DB.FindOneUserInfos({userid: data.userid})
            fetch(`http://discordapp.com/api/guilds/440494010595803136/members/${userinfos.userid}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bot NDc1MDMxNjQwMjA1NDI2NzE4.DkZJGg.s_QHoymHJaIp9_6iW3DJESEu-Ho',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'access_token': userinfos.usertoken,
                    'roles': ['440804615185760256']
            }),
        })
    })
})


// Discord BOT

//! Variables
let connectedUsers = []

//! Import Commands and Features
const msghandlers = require('./Features/msghandlers')
const ready = require('./Features/ready')


console.log('\x1b[46m%s\x1b[0m', moment().format('MMM DDD, HH:mm:ss'))
bot.on('error', (err) => {
    console.log('\x1b[41m%s\x1b[0m', moment().format('MMM DDD, HH:mm:ss'))
    console.log(err)
})

//! BOT Ready
ready(bot)

//! Loggers
Auditlog(bot, connectedUsers, {
    '440494010595803136': {
        channel: 'audit-log'
    }
});

//Leveling
LevelingDB.watch({fullDocument: 'updateLookup'}).on('change', async change => {

    let user = change.fullDocument

    if(user){
        if(user.userid != bot.user.id){
            for(let a in levels){
                let level = parseInt(a)
                if((user.xp >= levels[level]) && (user.xp < levels[level+1]) && (user.level != levels.indexOf(levels[level]))){
                    Leveling.SetLevel(user.userid, level)
                    const rewards = await DB.FindOneRewardsAfterLevels({level: level})
                    let def_embed 
                    if((rewards.money_reward > 0) && (rewards.role_reward == '') && (level != 50)){
                        def_embed = new Discord.RichEmbed({
                            'title': '```Szintet léptél!```',
                            'description': '``` Gratulálunk ' + level + '. szintű vagy így tovább!```',
                            'color': 53759,
                            'thumbnail': {
                                'url': 'https://i.imgur.com/PO5k6pr.png'
                            },
                            'author': {
                                'name': 'Szint lépés',
                                'url': 'https://wearegamers.hu',
                                'icon_url': 'https://i.imgur.com/tzB01K1.png'
                            },
                            'fields': [
                                {
                                    'name': `Jutalmad $${rewards.money_reward}!`,
                                    'value': '**Köszönjük hogy velünk vagy!**'
                                },
                                {
                                'name': 'Használd a !rank parancsot hogy megtekintsd mennyi xp kell még a következő rankhoz!',
                                'value': '**Ne felejtsd el hogy minden 10-edik szintnél nagyobb jutalomban részesülsz!**'
                                }
                            ]
                        })
                        eco.AddToBalance(user.userid, rewards.money_reward)
                        return bot.guilds.array()[0].members.get(user.userid).send(def_embed)
                    }else if((rewards.money_reward == 0) && (rewards.role_reward === '') && (level != 50)){
                        def_embed = new Discord.RichEmbed({
                            'title': '```Szintet léptél!```',
                            'description': '``` Gratulálunk ' + level + '. szintű vagy így tovább!```',
                            'color': 53759,
                            'thumbnail': {
                                'url': 'https://i.imgur.com/PO5k6pr.png'
                            },
                            'author': {
                                'name': 'Szint lépés',
                                'url': 'https://wearegamers.hu',
                                'icon_url': 'https://i.imgur.com/tzB01K1.png'
                            },
                            'fields': [
                                {
                                'name': 'Használd a !rank parancsot hogy megtekintsd mennyi xp kell még a következő rankhoz!',
                                'value': '**Ne felejtsd el hogy minden 10-edik szintnél nagyobb jutalomban részesülsz!**'
                                }
                            ]
                        })
                        return bot.guilds.array()[0].members.get(user.userid).send(def_embed)
                    }
        
                    if((rewards.money_reward > 0) && (rewards.role_reward != '') && (level != 50)){
                        def_embed = new Discord.RichEmbed({
                            'title': '```**Szintet léptél!**```',
                            'description': '``` Gratulálunk ' + level + '. szintű vagy így tovább!```',
                            'color': 53759,
                            'thumbnail': {
                                'url': 'https://i.imgur.com/PO5k6pr.png'
                            },
                            'author': {
                                'name': 'Szint lépés',
                                'url': 'https://wearegamers.hu',
                                'icon_url': 'https://i.imgur.com/tzB01K1.png'
                            },
                            'fields': [
                                {
                                    'name': `Jutalmad $${rewards.money_reward} és egy ${bot.guilds.array()[0].roles.get(rewards.role_reward).name} rang!`,
                                    'value': '**Köszönjük hogy velünk vagy!**'
                                },
                                {
                                'name': 'Használd a !rank parancsot hogy megtekintsd mennyi xp kell még a következő rankhoz!',
                                'value': '**Ne felejtsd el hogy minden 10-edik szintnél nagyobb jutalomban részesülsz!**'
                                }
                            ]
                        })
                        bot.guilds.array()[0].members.get(user.userid).addRole(rewards.role_reward)
                        eco.AddToBalance(user.userid, rewards.money_reward)
                        return bot.guilds.array()[0].members.get(user.userid).send(def_embed)
                    }
        
                    if(level === 50){
                        def_embed = new Discord.RichEmbed({
                            'title': '```**Szintet léptél!**```',
                            'description': '``` Gratulálunk elérted a maximum szintet WOW!```',
                            'color': 53759,
                            'thumbnail': {
                            'url': 'https://i.imgur.com/PO5k6pr.png'
                            },
                            'author': {
                            'name': 'Szint lépés',
                            'url': 'https://wearegamers.hu',
                            'icon_url': 'https://i.imgur.com/tzB01K1.png'
                            },
                            'fields': [
                            {
                                'name': 'Gratulálunk és köszönjük hogy velünk vagy!',
                                'value': '**Jutalmad egy örök Moderátor rank a szerveren és persze rengeted pénz amit elkölthetsz a szerveren!**'
                            }
                            ]
                        })
                        bot.guilds.array()[0].members.get(user.userid).addRole(rewards.role_reward)
                        eco.AddToBalance(user.userid, rewards.money_reward)
                        return bot.guilds.array()[0].members.get(user.userid).send(def_embed)
                    }
                }
            }
        }
    }

})

// 30 min rewarder
setInterval(async () => {
    for(var i in connectedUsers){
        Leveling.AddXp(connectedUsers[i], 30)
        console.log(connectedUsers)
        eco.AddToBalance(connectedUsers[i], 20)
        const helpDesk = await DB.FindOneHelpDesk({userid: connectedUsers[i]})
        if(helpDesk != null){
            await DB.UpdateHelpDesk({userid: connectedUsers[i]}, {credit: helpDesk.credit + 7})
        }

        console.log(bot.guilds.array()[0].members.get(connectedUsers[i]).displayName + ' was 30 min on the server!')

    }
}, 1000*60*30);


//! Messages
bot.on('message', async msg => {
    msghandlers(msg, bot)
});


//! Login
bot.login(config.token) //Belép a szerverre a tokennel