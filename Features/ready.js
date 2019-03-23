const moment = require('moment');
const Discord = require('discord.js');
const Leveling = require('discord-leveling');
const editJsonFile = require("edit-json-file");
const bot1 = require('../MusicBots/musicbot')
const bot2 = require('../MusicBots/musicbot1')
const DB = require('./dbhandlers')

const edititems = editJsonFile(`../DataBases/items.json`, {
    autosave: true
})

module.exports = function (bot) {
    var s = 1000
    var min = s*60
    var h = min*60

    bot.on("ready", () => { //Ha a Bot elindult akkor ...  
        console.log('\x1b[42m%s\x1b[0m', moment().format('MMM DDD, HH:mm:ss'))
        console.log("Master Bot Ready") //Kiirja hogy készen áll
        bot1.bot()
        bot2.bot()

        bot.guilds.array()[0].members.map(async m => {
            const CountersDB = await DB.FindOneCounters({userid: m.user.id})
            const InvDB = await DB.FindOneInventory({userid: m.user.id})
            const EcoDB = await DB.FindOneEconomyDB({userid: m.user.id})
            const QueueDB = await DB.FindOneQueue({userid: m.user.id})
            const PrivateDB = await DB.FindOnePrivateChannels({userid: m.user.id})
            const LevelingDB = await DB.FindOneLevelingDB({userid: m.user.id})
            const VolumesDB = await DB.FindOneVolumes({userid: m.user.id})

            if(!CountersDB){
                await DB.CreateCounters({userid: m.user.id, commands: 0, messages: 0})
            }

            if(!InvDB){
                await DB.CreateInventory({userid: m.user.id, DJ: 0, channel: 0, Arany: 0, Gyémánt: 0})
            }

            if(!EcoDB){
                await DB.CreateEconomyDB({userid: m.user.id, balance: 0, daily: 0})
            }

            if(!QueueDB){
                await DB.CreateQueue({ userid: m.id, queue: []})
            }

            if(!PrivateDB){
                await DB.CreatePrivateChannels({ userid: m.id, channels: []})
            }

            if(!LevelingDB){
                Leveling.SetXp(m.user.id, 1)
            }

            if(!VolumesDB){
                await DB.CreateVolumes({ userid: m.id, volume: 50})
            }

        })

        bot.user.setActivity("www.wearegamers.hu", {type: "WATCHING"}) //Beállitja a Bot tevékenységét

        const requidedcmds = new Discord.RichEmbed()
            .setTitle("__**REQUIDED COMMANDS TO START:**__")
            .addField("!adverts", "Start features adverting", false)
        //bot.users.find(x => x.id === "352768085834334208").sendMessage(requidedcmds)


        setInterval(function () {
            var diamondrandom = Math.floor(Math.random() * (30 - -30) + -30)
            var goldrandom = Math.floor(Math.random() * (10 - -10) + -10)
            var diamondprice = edititems.get(`Gyémánt.price`)
            var goldprice = edititems.get(`Arany.price`)
            var newdiamondprice = parseInt(diamondprice) + parseInt(diamondrandom)
            var newgoldprice = parseInt(goldprice) + parseInt(goldrandom)
            edititems.set(`Arany.price`, newgoldprice)
            edititems.set(`Gyémánt.price`, newdiamondprice)
            console.log("Gold: " + edititems.get(`Arany.price`))
            console.log("Dia: " + edititems.get(`Gyémánt.price`))
        }, h)

        

        //* Send Member Count
        

        //* Send Members List
        var members = []
        var memberstoserver = ""
        bot.guilds.find(x => x.id === "440494010595803136").members.map(m => {
            if(!members.includes(m.user.username)){
                members.push(m.user.username)
            }
        })
        for(var i in members){
            memberstoserver += `\n${members[i]}`
        }
    })

}