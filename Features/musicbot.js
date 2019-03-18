const bot1 = require('../MusicBots/musicbot')
const bot2 = require('../MusicBots/musicbot1')
const DB = require('./dbhandlers')
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const Searcher = require('yt-search')
const bots = ['500017855631327232', '500021011387908116']

module.exports = async function (bot, msg, commands, prefix){
    function ErrorMsg(Title, Desc, userid){
        const member = bot.guilds.array()[0].members.get(userid)
        const embed = new Discord.RichEmbed({
                'title': Title,
                'description': '```diff\n' + Desc + '\n```',
                'color': 16711680,
                'timestamp': '2019-03-07T17:28:20.057Z',
                'footer': {
                  'icon_url': member.user.displayAvatarURL,
                  'text': member.displayName
                },
                'author': {
                  'name': 'HIBA',
                  'icon_url': 'https://i.imgur.com/Os153d8.png'
                }
        })
        member.send(embed)
    }
    function TryParse(x) {
        var parsed = parseInt(x);
        if (isNaN(parsed) && (parsed !== 0)) { return false }
        return parsed;
    }
    let cont = msg.content.slice(prefix.length).split(' ')
    let args = cont.slice(1)
    
    if ((msg.channel.name == 'zene')) {

        const command = cont[0]

        console.log(command)
        switch (command){
            case commands[18]:{
                if (!msg.member.voiceChannel) return ErrorMsg('Join Parancs', 'Be kell lépned egy szobába!', msg.author.id)
                const UserVoice = msg.member.voiceChannel
                let avaiableBots = []
                if(!bot.guilds.array()[0].members.get(bots[0]).voiceChannel){
                    avaiableBots.push(bots[0])
                }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel){
                    UserVoice.members.map(m => {
                        if(m.user.id === bots[0]){
                            avaiableBots.push(bots[0])
                        }else if(m.user.id === bots[1]){
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
                        if(m.user.id === bots[1]){
                            avaiableBots.push(bots[1])
                        }else if(m.user.id === bots[0]){
                            if(avaiableBots.includes(bots[0])){
                                avaiableBots.splice(avaiableBots.indexOf(bots[0]), 1)
                            }
                        }
                    })
                }
                if(avaiableBots.length === 0){
                    return ErrorMsg('Join Parancs', 'A botok használatban vannak másik szobákban!', msg.author.id)
                }
                if(avaiableBots.length === 2){
                    let rand = Math.round(Math.random())
                    if(rand === 0){
                        bot1.join(msg.member)
                    }else if(rand === 1){
                        bot2.join(msg.member)
                    }
                }else if(avaiableBots.length === 1){
                    if(avaiableBots[0] === bots[0]){
                        bot1.join(msg.member)
                    }else if(avaiableBots[0] === bots[1]){
                        bot2.join(msg.member)
                    }
                }
            }
            break
            case commands[19]:{
                const UserVoiceID = msg.member.voiceChannel.id
                let bot1NotIn = false
                let bot2NotIn = false
                let bot1NotInThis = false
                let bot2NotInThis = false
    
                if(!bot.guilds.array()[0].members.get(bots[0]).voiceChannel){
                    bot1NotIn = true
                }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel.id === UserVoiceID){
                    bot1.leave()
                }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel.id != UserVoiceID){
                    bot1NotInThis = true
                }
    
                if(!bot.guilds.array()[0].members.get(bots[1]).voiceChannel){
                    bot2NotIn = true
                }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel.id === UserVoiceID){
                    bot2.leave()
                }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel.id != UserVoiceID){
                    bot2NotInThis = true
                }
                if(bot1NotIn && bot2NotIn) return ErrorMsg('Leave Parancs', 'A botok nincsenek egy szobában sem!', msg.author.id)
                if(bot1NotInThis && bot2NotInThis) return ErrorMsg('Leave Parancs', 'A botok használatban vannak másik szobákban!', msg.author.id)
            }
            break
            case commands[20]:{
                if (!msg.member.voiceChannel) return ErrorMsg('Play Parancs', 'Be kell lépned egy szobába!', msg.author.id)
                if (args[0] == null) return ErrorMsg('Play Parancs', 'Meg kell adnod egy létező YouTube linket vagy egy Zene számát a Lejátszási Listádból!', msg.author.id)
                if ((!ytdl.validateURL(args[0])) && (TryParse(args[0]) === false)) return ErrorMsg('Play Parancs', 'Meg kell adnod egy létező YouTube linket vagy egy Zene számát a Lejátszási Listádból!', msg.author.id)
                const User = msg.member
                const Bot1Voice = bot.guilds.array()[0].members.get(bots[0]).voiceChannel
                const Bot2Voice = bot.guilds.array()[0].members.get(bots[1]).voiceChannel
                let avaiableBots = []
                let url = null
                let num = await TryParse(args[0])
                console.log(num)
                if(num || (num === 0)){
                    const UserQueue = await DB.FindOneQueue({userid: msg.author.id})
                    const Queue = UserQueue.queue
                    if((num < 0) || (num > Queue.length)) return ErrorMsg('Play Parancs', `Számot 0 és maximum ${Queue.length} között adhatsz meg!`, msg.author.id)
                    url = Queue[num].url
                }else {
                    url = args[0]
                }
    
                if(Bot1Voice){
                    if(Bot1Voice.members.get(User.id)){
                        avaiableBots.push(bots[0])
                    }
                }else if(!Bot1Voice){
                    avaiableBots.push(bots[0])
                }
                if(avaiableBots.length === 0){
                    console.log( '1 ' + avaiableBots)
                    if(Bot2Voice){
                        if(Bot2Voice.members.get(User.id)){
                            avaiableBots.push(bots[1])
                        }
                    }else if(!Bot2Voice){
                        avaiableBots.push(bots[1])
                    }
                }
                if(avaiableBots.length === 0){
                    return ErrorMsg('Play Parancs', 'A botok használatban vannak másik szobákban!', msg.author.id)
                }
                if(avaiableBots.length === 2){
                    let rand = Math.round(Math.random())
    
                    if(rand === 0){
                        console.log('rand 1')
                        bot1.play({
                            url: url,
                            member: msg.member
                        })
                    }else if(rand === 1){
                        console.log('rand 2')
                        bot2.play({
                            url: url,
                            member: msg.member
                        })
                    }
                }else if(avaiableBots.length === 1){
                    if(avaiableBots[0] === bots[0]){
                        console.log('1')
                        bot1.play({
                            url: url,
                            member: msg.member
                        })
                    }else if(avaiableBots[0] === bots[1]){
                        console.log('2')
                        bot2.play({
                            url: url,
                            member: msg.member
                        })
                    }
                }
            }
            break
            case commands[21]:{
                const UserVoiceID = msg.member.voiceChannel.id
                let bot1NotInThis = false
                let bot2NotInThis = false
    
                if(!bot.guilds.array()[0].members.get(bots[0]).voiceChannel){
                }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel.id === UserVoiceID){
                    bot1.stop()
                }else if(bot.guilds.array()[0].members.get(bots[0]).voiceChannel.id != UserVoiceID){
                    bot1NotInThis = true
                }
    
                if(!bot.guilds.array()[0].members.get(bots[1]).voiceChannel){
                }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel.id === UserVoiceID){
                    bot2.stop()
                }else if(bot.guilds.array()[0].members.get(bots[1]).voiceChannel.id != UserVoiceID){
                    bot2NotInThis = true
                }
                if(bot1NotInThis && bot2NotInThis) return ErrorMsg('Stop Parancs', 'Egyik bot sincs a szobádban!', msg.author.id)
            }
            break
            case commands[22]:{
                if(!msg.member.voiceChannel) return ErrorMsg('Skip Parancs', 'Nem vagy benne egy szobában sem!', msg.author.id)
                let botWhoIn = null
                msg.member.voiceChannel.members.map(m => {
                    if(m.user.id === bots[0]){
                        botWhoIn = 1
                    }else if(m.user.id === bots[1]){
                        botWhoIn = 2
                    }
                })
                if(botWhoIn){
                    if(botWhoIn === 1){
                        bot1.skip(msg.member)
                    }else if(botWhoIn === 2){
                        bot2.skip(msg.member)
                    }
                }else{
                    return ErrorMsg('Skip Parancs', 'A szobádban nincs egy Music Bot sem!', msg.author.id)
                }  
            }
            break
            case commands[23]:{
                if(!msg.member.voiceChannel) return ErrorMsg('Back Parancs', 'Nem vagy benne egy szobában sem!', msg.author.id)
                let botWhoIn = null
                msg.member.voiceChannel.members.map(m => {
                    if(m.user.id === bots[0]){
                        botWhoIn = 1
                    }else if(m.user.id === bots[1]){
                        botWhoIn = 2
                    }
                })
                if(botWhoIn){
                    if(botWhoIn === 1){
                        bot1.back(msg.member)
                    }else if(botWhoIn === 2){
                        bot2.back(msg.member)
                    }
                }else{
                    return ErrorMsg('Back Parancs', 'A szobádban nincs egy Music Bot sem!', msg.author.id)
                }  
            }
            break
            case commands[24]:{
                if(!msg.member.voiceChannel) return ErrorMsg('Pause Parancs', 'Nem vagy benne egy szobában sem!', msg.author.id)
                let botWhoIn = null
                msg.member.voiceChannel.members.map(m => {
                    if(m.user.id === bots[0]){
                        botWhoIn = 1
                    }else if(m.user.id === bots[1]){
                        botWhoIn = 2
                    }
                })
                if(botWhoIn){
                    if(botWhoIn === 1){
                        bot1.resume()
                    }else if(botWhoIn === 2){
                        bot2.resume()
                    }
                }else{
                    return ErrorMsg('Pause Parancs', 'A szobádban nincs egy Music Bot sem!', msg.author.id)
                }  
            }
            break
            case commands[25]:{
                if(!msg.member.voiceChannel) return ErrorMsg('Pause Parancs', 'Nem vagy benne egy szobában sem!', msg.author.id)
                let botWhoIn = null
                msg.member.voiceChannel.members.map(m => {
                    if(m.user.id === bots[0]){
                        botWhoIn = 1
                    }else if(m.user.id === bots[1]){
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
                    return ErrorMsg('Pause Parancs', 'A szobádban nincs egy Music Bot sem!', msg.author.id)
                }
            }
            break
            case commands[26]:{
                if(!msg.member.voiceChannel) return ErrorMsg('Shuffle Parancs', 'Nem vagy benne egy szobában sem!', msg.author.id)
                let botWhoIn = null
                msg.member.voiceChannel.members.map(m => {
                    if(m.user.id === bots[0]){
                        botWhoIn = 1
                    }else if(m.user.id === bots[1]){
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
                    return ErrorMsg('Shuffle Parancs', 'A szobádban nincs egy Music Bot sem!', msg.author.id)
                }   
            }
            break
            case commands[27]:{
                if(!msg.member.voiceChannel) return ErrorMsg('Repeat Parancs', 'Nem vagy benne egy szobában sem!', msg.author.id)
                let botWhoIn = null
                msg.member.voiceChannel.members.map(m => {
                    if(m.user.id === bots[0]){
                        botWhoIn = 1
                    }else if(m.user.id === bots[1]){
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
                    return ErrorMsg('Repeat Parancs', 'A szobádban nincs egy Music Bot sem!', msg.author.id)
                }  
            }
            break
            case commands[28]:{
                if(!msg.member.voiceChannel) return ErrorMsg('NoRepeat Parancs', 'Nem vagy benne egy szobában sem!', msg.author.id)
                let botWhoIn = null
                msg.member.voiceChannel.members.map(m => {
                    if(m.user.id === bots[0]){
                        botWhoIn = 1
                    }else if(m.user.id === bots[1]){
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
                    return ErrorMsg('NoRepeat Parancs', 'A szobádban nincs egy Music Bot sem!', msg.author.id)
                }  
            }
            break
            case commands[29]:{
                var UserQueue1 = await DB.FindOneQueue({userid: msg.author.id})
                let queue_list = ''
                for (let i = 0; i < UserQueue1.queue.length; i++) {
                    const e = UserQueue1.queue[i];
                    let title = ''
                    if(e.title.length){
                        const titleList = e.title.split(` `)
                        for (let i = 0; i < 5; i++) {
                            const el = titleList[i];
                            title += el + ' '
                        }
                        title += '...'
                    }else{
                        title = e.title
                    }
                    queue_list += `${i}. ➤  __**[${title}](${e.url})**__\n`
                }
                const embed1 = new Discord.RichEmbed({
                    'title': '__Lejátszási Listád:__',
                    'description': `${queue_list}`,
                    'color': 3145472,
                    'author': {
                        'name': msg.member.displayName,
                        'icon_url': msg.author.displayAvatarURL
                    }
                })
                msg.author.send(embed1)
            }
            break
            case commands[30]:{
                if(args[0]){
                    var search = ''
                    for(var i in args){
                        search += ` ${args[i]}`
                    }
                    Searcher(search, function(err, r){
                        var videos = r.videos
    
                        var embed = new Discord.RichEmbed()
                            .setTitle('**Találatok:**')
                            .setAuthor('Youtube', 'https://i.imgur.com/D5GfocZ.png', 'https://www.youtube.com')
    
                        for(var i=0; i<10; i++){
                            embed.addField(`**${i+1}.** ` + videos[i].title, `https://www.youtube.com${videos[i].url}`)
                        }
                        msg.channel.sendMessage(embed)
                    })
                }else{
                    return ErrorMsg('Search Parancs', 'Meg kell adnod egy szót vagy kifejezést a kereséshez.', msg.author.id)
                }
            }
            break
            case commands[31]:{
                if (!args[0]) return ErrorMsg('Add Parancs', 'Meg kell adnod egy létező YouTube linket!', msg.author.id)
                if (!ytdl.validateURL(args[0])) return ErrorMsg('Add Parancs', 'Meg kell adnod egy létező YouTube linket!', msg.author.id)
                ytdl.getBasicInfo(args[0]).then(async m => {
                    const UserQueue = await DB.FindOneQueue({userid: msg.author.id})
                    const Queue = UserQueue.queue
                    if(Queue.length < 21){
                        let asd = false
                        Queue.forEach(async el => {
                            if(el.url == m.video_url){                   
                                asd = true
                            }
                        });
                        if(asd){ 
                            return ErrorMsg('Add Parancs', 'Már benne van a Lejátszási Listádban!', msg.author.id)
                        }else{
                            await DB.UpdateQueue({userid: msg.author.id}, {$push: {queue: {title: m.title, url: m.video_url}}})
                            UserQueue1 = await DB.FindOneQueue({userid: msg.author.id})  
                            let queue_list = ''
                            for (let i = 0; i < UserQueue1.queue.length; i++) {
                                const e = UserQueue1.queue[i];
                                let title = ''
                                if(e.title.length){
                                    const titleList = e.title.split(` `)
                                    for (let i = 0; i < 5; i++) {
                                        const el = titleList[i];
                                        title += el
                                    }
                                    title += '...'
                                }else{
                                    title = e.title
                                }
                                queue_list += `${i}. ➤  __**[${title}](${e.url})**__\n`
                            }
                            const embed1 = new Discord.RichEmbed({
                                'title': 'Hozzáadva a Lejátszási Listához:',
                                'description': `Lejátszási Listád: \n${queue_list}`,
                                'color': 3145472,
                                'author': {
                                    'name': msg.member.displayName,
                                    'icon_url': msg.author.displayAvatarURL
                                }
                            })
                            msg.author.send(embed1)
                        }
                    }else{
                        return ErrorMsg('Add Parancs', 'Nincs Több hely a Lejátszási Listádban!', msg.author.id)
                    }
                    
                })
            }
            break
            case commands[32]:{
                if (!args[0]) return ErrorMsg('Remove Parancs', 'Meg kell adnod egy létező YouTube linket!', msg.author.id)
                if (!ytdl.validateURL(args[0])) return ErrorMsg('Remove Parancs', 'Meg kell adnod egy létező YouTube linket!', msg.author.id)
                ytdl.getBasicInfo(args[0]).then(async m => {
                    const UserQueue = await DB.FindOneQueue({userid: msg.author.id})
                    const Queue = UserQueue.queue
                    if(Queue.length < 0){
                        let asd = false
                        Queue.forEach(async el => {
                            if(el.url === m.video_url){                   
                                asd = true
                            }
                        });
                        if(!asd){ 
                            return ErrorMsg('Remove Parancs', 'A szám nincs benne a Lejátszási Listádban!', msg.author.id)
                        }else{
                            await DB.UpdateQueue({userid: msg.author.id}, {$pull: {queue: {title: m.title, url: m.video_url}}})
                            UserQueue1 = await DB.FindOneQueue({userid: msg.author.id})  
                            let queue_list = ''
                            for (let i = 0; i < UserQueue1.queue.length; i++) {
                                const e = UserQueue1.queue[i];
                                let title = ''
                                if(e.title.length){
                                    const titleList = e.title.split(` `)
                                    for (let i = 0; i < 5; i++) {
                                        const el = titleList[i];
                                        title += el
                                    }
                                    title += '...'
                                }else{
                                    title = e.title
                                }
                                queue_list += `${i}. ➤  __**[${title}](${e.url})**__\n`
                            }
                            const embed1 = new Discord.RichEmbed({
                                'title': 'Törölve a Lejátszási Listádból:',
                                'description': `Lejátszási Listád: \n${queue_list}`,
                                'color': 3145472,
                                'author': {
                                    'name': msg.member.displayName,
                                    'icon_url': msg.author.displayAvatarURL
                                }
                            })
                            msg.author.send(embed1)
                        }
        
        
                    }else{
                        return ErrorMsg('Remove Parancs', 'A Lejátszási Listád üres!', msg.author.id)
                    }
                    
                })
            }
            break
        }

    }
}

