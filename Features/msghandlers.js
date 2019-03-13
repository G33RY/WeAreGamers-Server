// Import Packages
const fs = require('fs');
const Jimp = require('Jimp');
const Discord = require('discord.js');
const eco = require('discord-economy');
const Leveling = require('discord-leveling');

// Import Modules
const DB = require('./dbhandlers')
const MusicBot = require('./musicbot')

// Import JSON files
let items = JSON.parse(fs.readFileSync('../DataBases/items.json', 'utf8'))
const help = JSON.parse(fs.readFileSync('../Features/helpcmd.json', 'utf8'))
const config = JSON.parse(fs.readFileSync('../config.json', 'utf8'))

// Define Main Variables
const modRole = 'Master Admin'
const prefix = config.prefix
let levels = [0, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 6400, 6700, 7000, 7300, 7700, 8100, 8500, 8900, 9300, 9700, 10100, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000, 15500, 16000, 20000]



module.exports = async function(msg, bot) {

    //? variables
    let args = msg.content.slice(prefix.length).split(' ').slice(1)
    let commands = [
        'help', 'suggest',        // 0 1
        'ping', 'store',          // 2 3
        'bank', 'leaderboard',    // 4 5
        'serverinfo', 'userinfo', // 6 7
        'purge', 'allmoney',      // 8 9
        'addmoney', 'takemoney',  // 10 11
        'inventory', 'sale',      // 12 13
        'transfer', 'rank',       // 14 15

        'join', 'leave',          // 16 17
        'play', 'stop',           // 18 19
        'skip', 'back',           // 20 21
        'resume', 'pause',        // 22 23
        'shuffle', 'repeat',      // 24 25
        'norepeat', 'queue',      // 26 27
        'add', 'remove',          // 28 29
        'create', 'delete',       // 30 31
        'add', 'remove'           // 32 33
    ]
    let msgcreatedAt = msg.createdAt.toString().split(' ')
    let msgFinalCreatedAt = `${msgcreatedAt[1]} ${msgcreatedAt[2]} ${msgcreatedAt[3]}, ${msgcreatedAt[4]}`

    //? Log Messages
    if(!msg.author.bot){
        let channelName = ''
        if(msg.channel.name){
            channelName = msg.channel.name
        }else{
            channelName = msg.author.username
        }
        console.log(`(${msgFinalCreatedAt})`, `[${channelName}]`, `[${msg.author.username}]`, msg.content)
    }

    if((msg.channel.type != 'dm') && (!msg.author.bot)){
        if((msg.guild.id === '440494010595803136')){
            Leveling.AddXp(msg.author.id, 3)

            MusicBot(bot, msg, commands, prefix)

            //? Count Messages
            if((msg.channel.type != 'dm') && (msg.embeds.length == 0)){

                const usercounters = await DB.FindOneCounters({userid: msg.author.id})
                await DB.UpdateCounters({userid: msg.author.id}, {messages: usercounters.messages + 1})
                const usergcounters = await DB.FindOneGlobalCounters()
                await DB.UpdateGlobalCounters({id: 1}, {messages: usergcounters.messages + 1})
                await DB.CreateMessageCounters({userid: msg.author.id, score: 1})
    
            }

            //? Count Commands
            for(i in commands){
                if((msg.embeds.length == 0) && (msg.content.startsWith(config.prefix + commands[i]))){    
    
                    const usercounters = await DB.FindOneCounters({userid: msg.author.id})
                    await DB.UpdateCounters({userid: msg.author.id}, {commands: usercounters.commands + 1})
    
                    const usergcounters = await DB.FindOneGlobalCounters()
                    await DB.UpdateGlobalCounters({id: 1}, {commands: usergcounters.commands + 1})
                    await DB.CreateCommandCounters({userid: msg.author.id, score: 1})

                }
            }

            //? Devare links
            if ((msg.embeds.length == 1) && (msg.channel.name != 'belépő') && (msg.channel.name != 'config-chat')  && (msg.channel.name != 'zene') && (msg.channel.type != 'dm') &&(!msg.author.bot)) { 
                msg.delete()
                ErrorMsg('Elküldtél egy linket!', 'Abban a szobába nem szabad linket beküldeni!')
                return console.log('Deleted link from', msg.author.username, 'in', msg.channel.name)
            }

            //? Advertisment
            if ((msg.content.startsWith(prefix + 'adverts')) && (msg.member.roles.find(x => x.name === modRole))) {
                msg.channel.sendMessage('@everyone ' + adtext)
                msg.devare()
                setInterval(function () {
                    msg.channel.sendMessage('@everyone ' + adtext) 
                }, min * 180)
            }

            //? Command Rewards
            for (i in commands) {
                if ((msg.content.startsWith(config.prefix + commands[i])) && (!msg.author.bot) && (msg.channel.name == 'bot-parancsok')) {
                    eco.AddToBalance(msg.author.id, cmdreward)
                    console.log(msg.author.username + ' got awarded by message reward')
                }
            }

            //? Commands limiter for bot-parancsok channel
            if ((msg.channel.name == 'bot-parancsok') || (msg.channel.name == 'config-chat')) {
                
                // Ping
                if(msg.content.startsWith(prefix + commands[2])) { 
                    msg.author.send('A pingem:' + bot.ping) 
                    msg.delete() 
                }

                // Store
                if (msg.content.startsWith(prefix + commands[3])) {
                    // Variables
                    let names = []

                    items = JSON.parse(fs.readFileSync('../DataBases/items.json', 'utf8'))

                    if (!args.join(' ')) {
                        for (var i in items) {
                            if (!names.includes(items[i].name)) {
                                names.push(items[i].name)
                            }
                        }
                        const embed = new Discord.RichEmbed()
                            .setTitle('Elérhető tárgyak:\n\n\n')
                            .setColor(0xD4AF37)
                        for (var i = 0; i < names.length; i++) {
                            //Variables 
                            var tempDesc

                            for (var c in items) {
                                if (names[i] === items[c].name) {
                                    tempDesc = '```fix\n' + '$' + items[c].price + '```' + items[c].desc
                                }
                            }
                            embed.addField(names[i], tempDesc)
                        }
                        return msg.channel.send(embed)
                    }
                    // Item Infos
                    let itemName = ''
                    let itemPrice = 0
                    let itemDesc = ''

                    for (var i in items) {
                        if (args.join(' ').trim() === items[i].name) {
                            itemName = items[i].name
                            itemPrice = items[i].price
                            itemDesc = items[i].desc
                        }
                    }
                    if (itemName === '') {
                        return ErrorMsg('Store Parancs', `A(z) ${args.join(' ').trim()} tárgy nem található.`, msg.author.id)
                    }
                    eco.FetchBalance(msg.author.id).then(async (i) => {
                            const member = await DB.FindOneInventory({userid: msg.author.id})
                            if((itemName == 'DJ') && (member.DJ == 0)){
                                if (i.balance < itemPrice){
                                    ErrorMsg('Store Parancs', 'Nincs elég pénzed!', msg.member.id)
                                    
                                }else if(i.balance >= itemPrice){
                                    await DB.UpdateInventory({userid: msg.author.id}, {DJ: 1})
                                    msg.member.addRole('DJ')
                                    msg.author.send('Megvetted a DJ tárgyat.')
                                    eco.AddToBalance(i.userid, itemPrice - (itemPrice * 2))
            
                                }
                            }else if((itemName == 'DJ') && (member.DJ == 1)){
                                ErrorMsg('Store Parancs', 'Neked már meg van ez a tárgy!', msg.author.id)
                                
                            }else if(itemName != 'DJ'){
                                if (i.balance < itemPrice){
                                    ErrorMsg('Store Parancs', 'Nincs elég pénzed!', msg.member.id)
                                }else if((i.balance > itemPrice) || (i.balance = itemPrice)){
                                    if(itemName == 'Arany'){
                                        await DB.UpdateInventory({userid: msg.author.id}, {Arany: member.Arany + 1})
                                        msg.author.send(`Megvetted az Arany tárgyat.`)
                                    }
                                    if(itemName == 'Gyémánt'){
                                        await DB.UpdateInventory({userid: msg.author.id}, {Gyémánt: member.Gyémánt + 1})
                                        msg.author.send(`Megvetted a Gyémánt tárgyat.`)
                                    }
                                    eco.AddToBalance(i.userid, itemPrice - (itemPrice * 2))

                                }
                            }
                    })
                }

                // Inventory
                if (msg.content.startsWith(prefix + commands[12])) { 
                            
                    items = JSON.parse(fs.readFileSync('../DataBases/items.json', 'utf8'))
                    const member = await DB.FindOneInventory({userid: msg.author.id})
                    var embed = new Discord.RichEmbed()
                        .setTitle('**Raktárad:**')
                    var gold = member.Arany
                    var diamond = member.Gyémánt
                    var goldprice = items.Arany.price
                    var diamondprice = items.Gyémánt.price
                    embed.addField('Arany:', `${gold} db. - ${goldprice * gold}$`)
                    embed.addField('Gyémánt:', `${diamond} db. - ${diamondprice * diamond}$`)
                    msg.channel.send(embed) 

                }   

                // Sale
                if (msg.content.startsWith(prefix + commands[13])) { 
                    items = JSON.parse(fs.readFileSync('../DataBases/items.json', 'utf8'))

                    var allitem = []
                    for(var i in items){
                        if(!allitem.includes(items[i].name)){
                            allitem.push(items[i].name)
                        }
                    }
                    
                    const member = await DB.FindOneInventory({userid: msg.author.id})
                        if(allitem.includes(args[0])){
                            var asd = eval(`member.${args[0]}`)

                            if((args[1]) && (args[1] > 0)){
                                if(args[1] <= parseInt(asd)){
                                    var itemprice = edititems.get(`${args[0]}.price`)
                                    var pricetoadd = itemprice * args[1]
                                    if(args[0] == 'Arany'){
                                        await DB.UpdateInventory({userid: msg.author.id}, {Arany: asd-args[1]})
                                    }
                                    if(args[0] == 'Gyémánt'){
                                        await DB.UpdateInventory({userid: msg.author.id}, {Gyémánt: asd-args[1]})
                                    }

                                    // invs.set(`${msg.author.id}.${args[0]}`, asd-args[1])
                                    eco.AddToBalance(msg.author.id, pricetoadd)
                                    msg.author.send(`Eladtad ${args[1]} ${args[0]} tárgyad ${pricetoadd}$-ért!`)
                                }else if(args[1] > parseInt(asd)){
                                    ErrorMsg('Sale Parancs', 'Csak annyi tárgyat adhatsz el amennyi a raktáradban megtalálható!', msg.author.id)
                                }
                            
                            }else if(args[1] <= 0){
                                ErrorMsg('Sale Parancs', 'Negativ számot nem adhatsz meg!', msg.author.id)
                            }else if((args[1] != Number.isInteger()) || (!args[1])){
                                ErrorMsg('Sale Parancs', 'Meg kell adnod egy számot!', msg.author.id)
                            }
            
                        }else if(!allitem.includes(args[0])){
                            ErrorMsg('Sale Parancs', 'Meg kell adnod egy létező tárgy nevét!', msg.author.id)
                        }

                }

                // Bank
                if (msg.content.startsWith(prefix + commands[4])) { 
                    eco.FetchBalance(msg.author.id).then((i) => { 
                        var embed = new Discord.RichEmbed()
                            .setDescription(`**${msg .guild.name} Bank**`)
                            .setColor(0xD4AF37)
                            .addField('Számla Tulajdonos: ', msg.member.displayName, true) 
                            .addField('Számla Egyenleg: ', i.balance, true)
                        msg.channel.send(embed)
                    })
                }

                // Leaderboard
                if(msg.content.startsWith(prefix + commands[5])){ 
                    //? Variables
                    var i
                    eco.Leaderboard().then(a => {
                        
                        var embed = new Discord.RichEmbed()
                            .setTitle(`**${msg.guild.name} Leaderboard**`)
                            .setDescription('**======__TOP 5 LIST__======**') 
                        for(i = 0; i < 5; i ++){
                            embed.addField(`**${i+1}.**`, `**${msg.guild.members.find(x => x.id === a[i].userid).displayName}:** $${a[i].balance}`)
                        }
                        msg.channel.send(embed)
                    })
                }

                // Serverinfo
                if(msg.content.startsWith(prefix + commands[6])){
                    const m = await DB.FindGlobalCounters()
                        //? Variables
                        var createdAt = msg.guild.createdAt.toString().split(' ')
                        var FinalCreatedAt = `${createdAt[1]} ${createdAt[2]} ${createdAt[3]}, ${createdAt[4].substring(0, createdAt[4].length-3)}`
                        
                        var embed = new Discord.RichEmbed()
                            .setTitle('__**Szerver Információk:**__')
                            .addField('Szerver neve:', msg.guild.name, true)
                            .addField('Szerver létrehozva:', FinalCreatedAt, true)
                            .addField('Szerver tulaj:', msg.guild.owner.displayName, true)
                            .addField('Felhasználók:', msg.guild.memberCount, true)
                            .addField('Rangok:', msg.guild.roles.map(m => m.name).slice(1), true)
                            .addField('Adminok:', 'GERY,' + msg.guild.roles.find(x => x.name === 'Admin').members.map(m => '\n' + m.displayName), true)
                            .addField('Elküldött üzenetek:', m.messages, true)
                            .addField('Elküldött parancsok:', m.commands, true)
                        msg.channel.send(embed)
                }

                // Userinfos
                if(msg.content.startsWith(prefix + commands[7])){

                    //` Variables
                    var mentioned
            
                    if((args.toString().startsWith('<@&')) || (args.toString().startsWith('@')) || (!args[0])){
                        mentioned = msg.member
                    }
                    if((args.toString().startsWith('<@')) && (!args.toString().startsWith('<@&'))){
                        mentioned = msg.mentions.members.first()
                    }
            
                    var userCreated = mentioned.joinedAt.toString().split(' ')
                    var FinalCreatedTime = `${userCreated[1]} ${userCreated[2]} ${userCreated[3]}, ${userCreated[4].substring(0, userCreated[4].length-3)}`
                
                    const m = await DB.FindOneCounters({userid: mentioned.user.id})
                        var embed = new Discord.RichEmbed()
                        .setTitle(`__**${mentioned.displayName} Statisztikái:**__`)
                        .addField('A felhasználó ID-je:', mentioned.user.id, true)
                        .addField('A felhasználó státusza:', mentioned.presence.status, true)
                        .addField('Csatlakozott:', FinalCreatedTime, true)
                        .addField('A felhasználó rangjai:',  mentioned.roles.map(m => m.name).slice(1), true)
                        .addField('Elküldött üzenetek:', m.messages, true)
                        .addField('Elküldött parancsok:', m.commands, true)
                        msg.channel.send(embed)
                }

                // Allmoney
                if((msg.content.startsWith(prefix + commands[9])) && (msg.member.roles.find(x => x.name === modRole))) {
                    //? Variables
                    var i
            
                    eco.Leaderboard().then(a => {

                        console.log()
                        var embed = new Discord.RichEmbed()
                            .setTitle(`**${msg.guild.name} Leaderboard**`)
                            .setDescription('**======__TOP 5 LIST__======**') 
                        for(i = 0; i < a.lenght; i ++){
                            embed.addField(`**${i+1}.**`, `**${msg.guild.members.find(x => x.id === a[i].userid).displayName}:** $${a[i].balance}`)
                        }
                        msg.channel.send(embed)
                    })     
                }

                // Addmoney
                if (msg.content.startsWith(prefix + commands[10])) { 
                    if (!msg.member.roles.find(x => x.name === modRole)) { 
                        ErrorMsg('Addmoney Parancs', 'Te nem használhatod ezt a parancsot!', msg.author.id)
                    }
                    if (!args[0]) {
                        ErrorMsg('Addmoney Parancs', `Megkell adnod egy számot a parancs után! Használat: ${prefix}addmoney <mennyiség> @<felhasználó>`, msg.author.id)
                    }
                    if (isNaN(args[0])) {
                        ErrorMsg('Addmoney Parancs', `Megkell adnod egy **SZÁMOT** a parancs után! Használat: ${prefix}addmoney <mennyiség> @<felhasználó>`, msg.author.id)
                    }
                    
                    var defineduser = ''
                    if (!args[1]) { 
                        defineduser = msg.author.id 
                    } else { 
                        var firstMentioned = msg.mentions.users.first() 
                        defineduser = firstMentioned.id
                    }
                    eco.AddToBalance(defineduser, parseInt(args[0])).then((i) => {
                        console.log(`User ${defineduser} defined had ${args[0]} added to his account.`) 
                        msg.delete()
                    })
                }

                // Transfer
                if (msg.content.startsWith(prefix + commands[14])) { 
                    if((args[0].startsWith('<@')) && (args[0].endsWith('>'))){
                        eco.FetchBalance(msg.author.id).then(i => {
                            if((!isNaN(args[1])) && (args[1] > 0) && (args[1] <= i.balance)){
                                var createdAt = msg.createdAt.toString().split(' ')
                                var FinalCreatedAt = `${createdAt[1]} ${createdAt[2]} ${createdAt[3]}, ${createdAt[4].substring(0, createdAt[4].length-3)}`        
                                var embed = new Discord.RichEmbed()
                                    .setTitle('**Utalási Jóváirás**')
                                    .setDescription(`**Neved:** ${msg.author.username} \n\n**Kedvezményezett neve:** ${msg.mentions.users.first().username} \n\n**Kelte:** ${FinalCreatedAt} \n\n**Összeg:** $${args[1]}`)
                                msg.author.send(embed)
                                eco.Transfer(msg.author.id.toString(), msg.mentions.users.first().id.toString(), parseInt(args[1]))
                            }else if((!isNaN(args[2])) && (args[2] > 0) && (args[2] <= i.balance)) {
                                var createdAt = msg.createdAt.toString().split(' ')
                                var FinalCreatedAt = `${createdAt[1]} ${createdAt[2]} ${createdAt[3]}, ${createdAt[4].substring(0, createdAt[4].length-3)}`        
                                var embed = new Discord.RichEmbed()
                                .setTitle('**Utalási Jóváirás**')
                                .setDescription(`**Neved:** ${msg.author.username} \n\n**Kedvezményezett neve:** ${msg.mentions.users.first().username} \n\n**Kelte:** ${FinalCreatedAt} \n\n**Összeg:** $${args[2]}`)
                                msg.author.send(embed)
                                eco.Transfer(msg.author.id, msg.mentions.users.first().id, parseInt(args[2]))
                            }else if((args[1] > i.balance) || (args[2] > i.balance)){
                                var embed = new Discord.RichEmbed()
                                    .setTitle('**Figyelmeztetés**')
                                    .setDescription('Nincs ennyi pénzed!')
                            }else {
                                var embed = new Discord.RichEmbed()
                                    .setTitle('**Figyelmeztetés**')
                                    .setDescription('Meg kell adnod egy pozitiv számot!')
                                msg.author.send(embed)
                            }
                        })
                        

                    }else if((!args[0].startsWith('<@!')) && (!args[0].endsWith('>'))){
                        var embed = new Discord.RichEmbed()
                            .setTitle('**Figyelmeztetés**')
                            .setDescription('Meg kell adnod egy felhasználót és egy mennyiséget!')
                        msg.author.send(embed)
                    }

                }

                // Rank
                if (msg.content.startsWith(prefix + commands[15])) { 
                    
                    // Import Rank Images
                    let level_bg_path = Jimp.read('https://i.imgur.com/QlJSV4q.png')
                    let avatar_path = Jimp.read(bot.guilds.array()[0].members.get(msg.author.id).user.displayAvatarURL)
                    let avatar_mask_path = Jimp.read('https://i.imgur.com/LjeFrU2.png')
                    let blue_mask_path = Jimp.read('https://i.imgur.com/KAvpncK.png')
                    let bluebox_path = Jimp.read('https://i.imgur.com/0QkLb2g.png')

                    Promise.all([level_bg_path, avatar_path, avatar_mask_path, blue_mask_path, bluebox_path]).then(images => {
                        let bg = images[0]
                        let avatar = images[1]
                        let avatar_mask = images[2]
                        let blue_mask = images[3]
                        let blue = images[4]

                        // Resize
                        avatar_mask.resize(205, 205)
                        avatar.resize(205, 205)
                        blue.resize(400, 35)

                        // Mask
                        avatar.mask(avatar_mask, 0, 0)
                        blue.mask(blue_mask, 0, 0)

                        // Composite
                        bg.composite(avatar, 45, 39.5)

                        // Load White Name Font
                        Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then( async name_font => {

                            // Find in Leveling DataBase
                            const res = await DB.FindOneLevelingDB({userid: msg.author.id})
                                Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then( async num_font => {
                                    let userrank = await Leveling.Leaderboard({search: msg.author.id})

                                    let XP = `${res.xp}/${levels[res.level+1]}XP`
                                    let XP_per_blueWidth = ((614 * ((res.xp - levels[res.level])*100) / (levels[res.level+1] - levels[res.level])) / 100)

                                    // Resize Blue Box
                                    blue.resize(XP_per_blueWidth, 35)

                                    // Composite Blue Box
                                    bg.composite(blue, 275, 185)

                                    // Print text
                                    bg.print(name_font, 280, 140, msg.member.displayName) //Name
                                    bg.print(num_font, 600, 40, '#' + (userrank.placement || 0)) //Rank
                                    bg.print(num_font, 820, 40, res.level) //Level
                                    bg.print(name_font, 700, 140, XP) //XP
                                    
                                    // Save file
                                    bg.write('../rank.png')
            
                                    // Send file
                                    msg.channel.sendFile('../rank.png')

                                })

                            })


                        })

                }

                // Add User
                if (msg.content.startsWith(prefix + commands[32])) {
                    let ChannelsDB = await DB.FindOnePrivateChannels({userid: msg.author.id})
                    if(!ChannelsDB) return ErrorMsg('Add Parancs', 'Nincs még Privát Szobád! Venni www.wearegamers.hu weboldalon, bejelentkezés után a Bolt fülnél tudsz!', msg.author.id)
                    if(ChannelsDB.channels.length === 0) return ErrorMsg('Add Parancs', 'Nincs még Privát Szobád! Venni www.wearegamers.hu weboldalon, bejelentkezés után a Bolt fülnél tudsz!', msg.author.id)
                    if(!msg.mentions.members.first() || !args[0]) return ErrorMsg('Add Parancs', 'Meg kell adnod egy felhasználót!')
                    let mentioned = msg.mentions.members.first()
                    let guild = bot.guilds.array()[0]
                    let Channels = ChannelsDB.channels
            
                    Channels.forEach( el => {
                        guild.channels.get(el.id).overwritePermissions(mentioned.id, {
                            CONNECT: true
                        })
                    })
                }

                // Remove User
                if (msg.content.startsWith(prefix + commands[33])) {
                    let ChannelsDB = await DB.FindOnePrivateChannels({userid: msg.author.id})
                    if(!ChannelsDB) return ErrorMsg('Remove Parancs', 'Nincs még Privát Szobád! Venni www.wearegamers.hu weboldalon, bejelentkezés után a Bolt fülnél tudsz!', msg.author.id)
                    if(ChannelsDB.channels.length === 0) return ErrorMsg('Remove Parancs', 'Nincs még Privát Szobád! Venni www.wearegamers.hu weboldalon, bejelentkezés után a Bolt fülnél tudsz!', msg.author.id)
                    if(!msg.mentions.members.first() || !args[0]) return ErrorMsg('Remove Parancs', 'Meg kell adnod egy felhasználót!')
                    let mentioned = msg.mentions.members.first()
                    let guild = bot.guilds.array()[0]
                    let Channels = ChannelsDB.channels
            
                    Channels.forEach( el => {
                        guild.channels.get(el.id).overwritePermissions(mentioned.id, {
                            CONNECT: false
                        })
                    })
                }


            //? Devare commands in another channels
            } else if ((msg.content.startsWith(prefix)) && !(msg.content.startsWith(prefix + 'purge')) && (msg.channel.type != 'dm') && !(msg.channel.name == 'javaslatok') && !(msg.channel.name == 'zene')) {
                ErrorMsg('Link elküldés', 'Abban a szobában nem szabad parancsokat használni!', msg.author.id)
                msg.delete()
            }
        
            // Suggest
            if((msg.content.startsWith(prefix + commands[1])) && (msg.channel.name == 'javaslatok')) {

                //` Variables      
                var suggested = []
                var suggest = []
                var aftertext = msg.content.slice(prefix.length)
                var aftercmd = aftertext.slice(8)
        
                var newembed = new Discord.RichEmbed()
                    .setTitle('**A javaslatod a szerverhez:**')
                    .setDescription(aftercmd + '\n\n **Kézbesitve**')
                msg.author.send(newembed)
        
                var newembed2 = new Discord.RichEmbed()
                    .setTitle('**Egy felhasználó javaslata a szerverhez:**')
                    .setDescription(aftercmd)
                msg.guild.roles.find(x => x.name === 'Admin').members.map(m => {
                    if((m.user.presence.status == 'online') || (m.user.presence.status == 'idle')){
                        m.user.send(newembed2)
                    }
                })
                msg.guild.roles.find(x => x.name === modRole).members.map(m => m.user.send(newembed2))
                msg.delete()
            }

            // Purge
            if(msg.content.startsWith(prefix + commands[8])) {
                msg.delete()
                if((msg.member.roles.find(x => x.name === modRole)) && (msg.channel.type != 'dm')) {
                    msg.channel.bulkDelete(100, true)
                        .catch(console.error, 'Messages have to be under 14 days old.')
                }else if(!msg.member.roles.find(x => x.name === modRole)){
                    console.log('The member dont have permisson to purge!') 
                    ErrorMsg('Purge Parancs', 'Te nem használhatod ezt a parancsot!', msg.author.id)
                }
            }

        }
    }

    // Help
    if((msg.content.startsWith(prefix + commands[0])) && (msg.embeds.length == 0)) { 
        var embed = new Discord.RichEmbed()
            .setAuthor(help.author_name, help.author_icon, help.author_url) 
            .setColor(0xff0000)
            .addField(help.serverinfo_title, help.serverinfo)
            .addField(help.szervercmd_title, help.arrows)
        
        var helpcommands = []
        for(var i in help.commands){
            if(!helpcommands.includes(help.commands[i])){
                helpcommands.push(help.commands[i])
            }
        }
        var helpdescriptions = []
        for(var i in help.descriptions){
            if(!helpdescriptions.includes(help.descriptions[i])){
                helpdescriptions.push(help.descriptions[i])
            }
        }

        for(var i=0;i<helpcommands.length;i++){
            embed.addField(helpcommands[i], helpdescriptions[i])
        }

        msg.channel.send(embed)
    }


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
    
}


