const moment = require('moment');
const Discord = require('discord.js');
const editJsonFile = require("edit-json-file");
const bot1 = require('../MusicBots/musicbot')
const bot2 = require('../MusicBots/musicbot1')
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

        bot.user.setActivity("We Are Gamers", {type: "WATCHING"}) //Beállitja a Bot tevékenységét

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