
module.exports = function (bot, msg, config, musiccommands, ytdl, args, Discord, Searcher, infos) {
    var bigvolume = infos.get("infos.musicvolume")
    var volume = bigvolume / 1000

    //! Search
    if((msg.content.startsWith(config.prefix + musiccommands[4])) && (msg.member.roles.find(x => x.name === "DJ"))){
        if(args[0]){
            var search = ""
            for(var i in args){
                search += ` ${args[i]}`
            }
            Searcher(search, function(err, r){
                var videos = r.videos

                var embed = new Discord.RichEmbed()
                    .setTitle("**Találatok:**")
                    .setAuthor("Youtube", "https://i.imgur.com/EsrPSdx.png", "https://www.youtube.com")

                for(var i=0; i<10; i++){
                    embed.addField(`**${i+1}.** ` + videos[i].title, `https://www.youtube.com${videos[i].url}`)
                }
                msg.channel.sendMessage(embed)
            })
        }else{
            msg.author.sendMessage("Meg kell adnod egy szót vagy kifejezést a kereséshez.")
        }

    }else if(!msg.member.roles.find(x => x.name === "DJ")){
        msg.author.sendMessage("Nincs meg a DJ rangod hogy használd a Music Bot-ok parancsait! Meg tudod venni a boltban ha van rá elég pénzed.")
    }

    //! Volume
    if((msg.content.startsWith(config.prefix + musiccommands[5])) && (msg.member.roles.find(x => x.name === "DJ"))){
        if(!args[0]) return msg.author.sendMessage("Meg kell adnod egy számot!")

        if(msg.guild.me.voiceChannelID != msg.member.voiceChannelID) return msg.author.sendMessage("Egy szobában kell lenned a bot-tal!")

        if(isNaN(args[0])) return msg.author.sendMessage("Meg kell adnod egy **számot**!")

        infos.set("infos.musicvolume", args[0])
    }

    //! Play
    if((msg.content.startsWith(config.prefix + musiccommands[0])) && (msg.member.roles.find(x => x.name === "DJ"))){
        if(!msg.member.voiceChannel) return msg.author.sendMessage("Be kell lépned egy szobába!")

        if((msg.guild.me.voiceChannelID != msg.member.voiceChannelID) && (msg.guild.me.voiceChannel)) return msg.author.sendMessage("A bot már használatban van egy másik szobában!")

        if(!args[0]) return msg.author.sendMessage("Meg kell adnod egy létező YouTube linket!")

        var validate = ytdl.validateURL(args[0])

        if(!validate) return msg.author.sendMessage("Meg kell adnod egy **létező** YouTube linket!")

        msg.member.voiceChannel.join()

        msg.guild.voiceConnection.playArbitraryInput(ytdl(args[0], {filter: "audioonly"})).setVolume(volume)
        console.log(volume)
    }

    //! Leave
    if((msg.content.startsWith(config.prefix + musiccommands[6])) && (msg.member.roles.find(x => x.name === "DJ"))){
        if(!msg.guild.me.voiceChannel) return msg.author.sendMessage("A bot nincs benne egy szobában sem!")

        if(msg.guild.me.voiceChannelID != msg.member.voiceChannelID) return msg.author.sendMessage("A bot egy másik szobában van használatban!")

        msg.member.voiceChannel.leave()

    }

    //! Join
    if((msg.content.startsWith(config.prefix + musiccommands[7])) && (msg.member.roles.find(x => x.name === "DJ"))){
        if(msg.guild.me.voiceChannel) return msg.author.sendMessage("A bot már benne van egy szobában!")

        msg.member.voiceChannel.join()

    }
}