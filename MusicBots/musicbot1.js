//! Import NPM Packages
    // Discord
    const Discord = require(`discord.js`);

    // YouTube
    const Searcher = require(`yt-search`);
    const ytdl = require(`ytdl-core`);

    // DB
    const DB = require("../Features/dbhandlers")

    // Voice Recognition
    const ffmpegInstaller = require(`@ffmpeg-installer/ffmpeg`);
    const ffmpeg = require(`fluent-ffmpeg`)
    ffmpeg.setFfmpegPath(ffmpegInstaller.path)
    const speech = require(`@google-cloud/speech`).v1p1beta1;
    const decode = require(`./decodeOpus.js`);

    // Others
    const moment = require(`moment`);
    const fs = require(`fs`);
    const fs_extra = require(`fs-extra`);
    const path = require(`path`);
    // const socketio = require(`socket.io-client`).connect(`http://178.48.146.196:8080`)
  
// Define Main Variables
    const bot = new Discord.Client()
    const client = new speech.SpeechClient();
    const bots = [`500017855631327232`, `500021011387908116`]
    const Token = `NTAwMDIxMDExMzg3OTA4MTE2.D2UylQ.ixFSwbYu2LZIm-1Y9hhP6eiWkmc`
    const ThisBot = 2
    let currentChannel = null
    let con = null
    let listenStream = null;
    let Gconnection = null;
    let LastSong = null;
    let dispatcher = null
    let artificallySongChange = false
    let OpusStringPath = ""
    let CurrentUser = null
    let UserSpeaking = false
    let OnSongEnd = "norepeat"

// Functions
function processRawToWav(filepath, outputpath, cb) {
    fs.closeSync(fs.openSync(outputpath, `w`));
    var command = ffmpeg(filepath)
    .addInputOptions([
        `-f s32le`,
        `-ar 48k`,
        `-ac 1`
    ]).on(`end`,async function() {

        const audioBytes = fs.readFileSync(outputpath).toString(`base64`);

        const audio = {
        content: audioBytes,
        };
        const config = {
        encoding: `LINEAR16`,
        sampleRateHertz: 48000,
        languageCode: `hu-HU`
        };
        const request = {
        audio: audio,
        config: config,
        };

        // Translate Audio to Text
        var parseSpeech =  new Promise(async (ressolve, reject) => {
        const [response] = await client.recognize(request);
        const transcription = response.results.map(result => result.alternatives[0].transcript).join(`\n`);
        ressolve(transcription);
        });


        parseSpeech.then((data) => {
            cb(data);
            fs_extra.remove(outputpath) // Delete WAV File
            fs_extra.remove(filepath) // Delete RAW PCM File
            fs_extra.remove(OpusStringPath) // Delete Opus String File
        }).catch((err) => {
        console.log(err);
        cb(null);
        })
    }).on(`error`, function(err) {
        console.log(`an error happened: ` + err.message);
    }).addOutput(outputpath).run();
}

function makeDir(dir) {
    try {
        fs.mkdirSync(dir);
    } catch (err) {}
}

function JoinChannel(member, url) {
    var recordingsPath = path.join(`.`, `recordings`);
    makeDir(recordingsPath);

    bot.guilds.array()[0].channels.get(member.voiceChannelID).join().then(async connection => {

        currentChannel = bot.guilds.array()[0].me.voiceChannel
        Gconnection = connection
        con = bot.voiceConnections.array()[0]

        if(url){
            Play(url, member)
        }

        // Create Receiver
        const receiver = connection.createReceiver()
        receiver.on(`opus`, function(user, data) {
        let hexString = data.toString(`hex`);
        let stream = listenStream;
        if (!stream) {
            if (hexString === `f8fffe`) {
            return;
            }
            let outputPath = path.join(recordingsPath, `${user.id}-${Date.now()}.opus_string`);
            stream = fs.createWriteStream(outputPath);
            listenStream = stream;
        }
        stream.write(`,${hexString}`);
        });
    }).catch(console.error);
}

async function SkipSong(member){
    let Queue = []
    const UserQueue = await DB.FindOneQueue({userid: CurrentUser})
    const DefQueue = UserQueue.queue
    await DefQueue.map(m => { Queue.push(m.url)})
    songIndex = Queue.indexOf(LastSong)
    let nextSong = null
    if(!Queue[songIndex + 1]){
        nextSong = Queue[0]
    }else{
        nextSong = Queue[songIndex + 1]
    }
    artificallySongChange = true
    Play(nextSong, member)
    artificallySongChange = false
}

async function BackSong(member){
    let Queue = []
    const UserQueue = await DB.FindOneQueue({userid: CurrentUser})
    const DefQueue = UserQueue.queue
    await DefQueue.map(m => { Queue.push(m.url)})
    songIndex = Queue.indexOf(LastSong)
    let nextSong = null
    if(!Queue[songIndex - 1]){
        nextSong = Queue[Queue.length-1]
    }else{
        nextSong = Queue[songIndex - 1]
    }
    artificallySongChange = true
    Play(nextSong, member)
    artificallySongChange = false
}

async function ChangeTrack(num, member){
    let Queue = []
    const UserQueue = await DB.FindOneQueue({userid: CurrentUser})
    const DefQueue = UserQueue.queue
    await DefQueue.map(m => { Queue.push(m.url)})
    artificallySongChange = true
    Play(Queue[num], member)
    artificallySongChange = false
}

async function Play(url, member){
    if(!Gconnection){
        JoinChannel(member, url)
    }else{
        let CurrentMember = bot.guilds.array()[0].members.get(CurrentUser)
        LastSong = url
        dispatcher = Gconnection.playStream(ytdl(url, {filter: "audioonly"}))
        dispatcher.setVolume(0.050)
        ytdl.getBasicInfo(LastSong).then(m => {
            const embed = new Discord.RichEmbed({
                "title": m.title,
                "description": `Feltöltő: __**[${m.author.name}](${m.author.user_url})**__ \nIdőtartam: **${moment(m.length_seconds * 1000).subtract(1, "hours").format(`HH:mm:ss`)}**`,
                "url": m.video_url,
                "color": 3145472,
                "thumbnail": {
                "url": m.thumbnail_url
                },
                "author": {
                    "name": `Music Bot #${ThisBot} | Most Játszott:`,
                    "icon_url": "https://i.imgur.com/Pxk3gPQ.jpg"
                },
                "footer": {
                    "icon_url": CurrentMember.user.displayAvatarURL,
                    "text": CurrentMember.displayName
                },
            })
            bot.guilds.array()[0].channels.get("549304802459385897").send(embed)

        })
        dispatcher.on(`end`, async function(){
            console.log(`artificallyEnd: ` + artificallySongChange)
            if(OnSongEnd === "norepeat"){
                if(artificallySongChange == false){
                    let Queue = []
                    const UserQueue = await DB.FindOneQueue({userid: CurrentUser})
                    const DefQueue = UserQueue.queue
                    await DefQueue.map(m => { Queue.push(m.url)})
                    let nextSong = null
                    let songIndex = Queue.indexOf(LastSong)
                    if(!Queue[songIndex + 1]){
                        nextSong = Queue[0]
                    }else{
                        nextSong = Queue[songIndex + 1]
                    }
                    Play(nextSong, member)
                    ytdl.getBasicInfo(nextSong).then(m => {
                        const embed = new Discord.RichEmbed({
                            "title": m.title,
                            "description": `Feltöltő: __**[${m.author.name}](${m.author.user_url})**__ \nIdőtartam: **${moment(m.length_seconds * 1000).subtract(1, "hours").format(`HH:mm:ss`)}**`,
                            "url": m.video_url,
                            "color": 3145472,
                            "thumbnail": {
                            "url": m.thumbnail_url
                            },
                            "author": {
                                "name": `Music Bot #${ThisBot} | Most Játszott:`,
                                "icon_url": "https://i.imgur.com/Pxk3gPQ.jpg"
                            },
                            "footer": {
                                "icon_url": CurrentMember.user.displayAvatarURL,
                                "text": CurrentMember.displayName
                            },
                        })
                    })
                }
            }else if(OnSongEnd === "repeat"){
                if(artificallySongChange == false){
                    Play(LastSong, member)
                }
            }else if(OnSongEnd === "shuffle"){
                if(artificallySongChange == false){
                    let Queue = []
                    const UserQueue = await DB.FindOneQueue({userid: CurrentUser})
                    const DefQueue = UserQueue.queue
                    await DefQueue.map(m => { Queue.push(m.url)})
                    let nextSong = null
                    let rand = Math.floor(Math.random() * (Queue.length)) 
                    nextSong = Queue[rand]
                    Play(nextSong, member)
                    ytdl.getBasicInfo(nextSong).then(m => {
                        const embed = new Discord.RichEmbed({
                            "title": m.title,
                            "description": `Feltöltő: __**[${m.author.name}](${m.author.user_url})**__ \nIdőtartam: **${moment(m.length_seconds * 1000).subtract(1, "hours").format(`HH:mm:ss`)}**`,
                            "url": m.video_url,
                            "color": 3145472,
                            "thumbnail": {
                            "url": m.thumbnail_url
                            },
                            "author": {
                                "name": `Music Bot #${ThisBot} | Most Játszott:`,
                                "icon_url": "https://i.imgur.com/Pxk3gPQ.jpg"
                            },
                            "footer": {
                                "icon_url": CurrentMember.user.displayAvatarURL,
                                "text": CurrentMember.displayName
                            },
                        })
                    })
                }
            }
        })
    }
}

async function handleSpeech(member, text){
    const TextList = text.split(` `)
    console.log(TextList)
    if(TextList.includes(`zene`)){
        const CmdIndex = TextList.indexOf("zene")
        let command = TextList[CmdIndex+1]
        let parsed = await TryParse(command)

        if(parsed || (parsed === 0)){
            const UserQueue = await DB.FindOneQueue({userid: member.id})
            let QueueLenght = UserQueue.queue.length

            if((parsed <= (QueueLenght-1)) && (parsed >= 0)){
                ChangeTrack(parsed, member)
            }else{
                member.send(`A Lejátszási Listád csak ${QueueLenght} elemet tartalmaz!`)
            }
        }else{
            switch(command){
                case "ki":
                    if(con){
                        artificallySongChange = true
                        con.dispatcher.end()
                        bot.guilds.array()[0].me.voiceChannel.leave()
                        Gconnection = null
                    }
                    break
                case "szünet":
                    if(!con.dispatcher.paused){
                        con.dispatcher.pause()
                    }
                    break
                case "folytat":
                    if(con.dispatcher.paused){
                        con.dispatcher.resume()
                    }
                    break
                case "tovább":
                    artificallySongChange = true
                    con.dispatcher.end()
                    SkipSong(member)
                    artificallySongChange = false
                    break
                case "vissza":
                    artificallySongChange = true
                    con.dispatcher.end()
                    BackSong(member)
                    artificallySongChange = false
                    break
                case "újra":
                    artificallySongChange = true
                    con.dispatcher.end()
                    Play(LastSong, member)
                    artificallySongChange = false
                    break
            }
        }
    }
}

function TryParse(x) {
var parsed = parseInt(x);
if (isNaN(parsed)) { return false }
return parsed;
}

function deleteFolder(directory_path) {
    if (fs.existsSync(directory_path)) {
        fs.readdirSync(directory_path).forEach(function (file, index) {
            var currentPath = path.join(directory_path, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                deleteFolder(currentPath);
            } else { 
                fs.unlinkSync(currentPath); // delete file
            }
        });
        fs.rmdirSync(directory_path); // delete directories
    }
};


module.exports = {
    bot: async function(){
        bot.on(`ready`, () => {
            console.log(`Music Bot #${ThisBot} Ready`)
            bot.user.setActivity("We Are Gamers", {type: "LISTENING"}) //Beállitja a Bot tevékenységét
        })

        bot.on(`voiceStateUpdate`, (oldMember, newMember) =>{

            // On Switch
            if (oldMember.voiceChannelID && newMember.voiceChannelID) 
            {	
                if (oldMember.voiceChannelID != newMember.voiceChannelID)
                {

                    // If User`s new Channel is the AFK channel leave
                    if((oldMember.id == bot.user.id) && (newMember.voiceChannelID === "440495178969513986")){
                        artificallySongChange = true
                        if(con){
                            con.dispatcher.end()
                        }
                        currentChannel.leave()
                        Gconnection = null
                        con = null
                        dispatcher = null
                        LastSong = null
                        CurrentUser = null
                        artificallySongChange = false
                        return
                    }

                    // When the user switch
                    if(CurrentUser === oldMember.id){
                        console.log("1")
                        currentChannel = newMember.voiceChannel
                        artificallySongChange = true
                        if(con){
                            con.dispatcher.pause()
                            bot.guilds.array()[0].channels.get(newMember.voiceChannelID).join()
                            setTimeout(() => {
                                con.dispatcher.resume()
                            }, 100);
                        }
                        artificallySongChange = false
                        return 
                    }

                    // When the bot switch
                    if(oldMember.id === bot.user.id){
                        console.log("3")
                        artificallySongChange = true
                        if(con){
                            con.dispatcher.pause()
                            currentChannel.join()
                            setTimeout(() => {
                                if(con){
                                    con.dispatcher.resume()
                                }
                            }, 100);
                        }
                        artificallySongChange = false
                    }
                }
            }

            // When User Quit bot will Quit too
            if (oldMember.voiceChannelID && !newMember.voiceChannelID) {
                if(CurrentUser){
                    if(CurrentUser === oldMember.id){
                            artificallySongChange = true
                            if(con){
                                con.dispatcher.end()
                            }
                            bot.guilds.array()[0].me.voiceChannel.leave()
                            Gconnection = null
                            con = null
                            dispatcher = null
                            LastSong = null
                            artificallySongChange = false
                            CurrentUser = null
                    } 
                }
            }
        })

        bot.on(`guildMemberSpeaking`, (member, speaking) => {
            if ((!speaking && member.voiceChannel) && (member.id === CurrentUser)) {
                let stream = listenStream
                if (stream) {
                    listenStream = null
                    stream.end(err => {
                        if (err) {
                            console.error(err);
                        }
                        let basename = path.basename(stream.path, `.opus_string`);
                        OpusStringPath = stream.path

                        // decode file into pcm
                        decode.convertOpusStringToRawPCM(stream.path, basename, (function() {
                            processRawToWav( path.join(`./recordings`, basename + `.raw_pcm`), path.join(`./recordings`, basename + `.wav`), (function(data) {
                                if (data != null) {
                                    handleSpeech(member, data);
                                }
                            }).bind(this))
                        }).bind(this));
                    });
                }
            }
        })

        bot.on(`disconnect`, () => {
            console.log(`#${ThisBot} I just disconnected, making sure you know, I will reconnect now...`)
        })

        bot.on(`reconnecting`, () => {
            console.log(`#${ThisBot} I am reconnecting now!`)
        });
        
        bot.login(Token)
    },
    join: async function(member){
        JoinChannel(member, null)
    },
    leave: async function(){
        artificallySongChange = true
        if(con){
            if(con.dispatcher){
                con.dispatcher.end()
            }
        }

        bot.guilds.array()[0].me.voiceChannel.leave()
        Gconnection = null
        con = null
        dispatcher = null
        LastSong = null
        CurrentUser = null
        artificallySongChange = false
    },
    play: async function(args){
        if(typeof args === "string"){
            const datas = args.split(';')
            const url = datas[0]
            const userid = datas[1]
            const member = bot.guilds.array()[0].members.get(userid)
            CurrentUser = member.id
            artificallySongChange = true
            Play(url, member)
            artificallySongChange = false
            ytdl.getBasicInfo(url).then(async m => {
                const UserQueue = await DB.FindOneQueue({userid: member.id})
                const Queue = UserQueue.queue
                if(Queue.length <= 21){
                    let SongInQueue = false
                    Queue.forEach(async e => {
                        if(e.url === url){
                            SongInQueue = true
                        }
                    })
                    if(!SongInQueue){
                        await DB.UpdateQueue({userid: member.id}, {$push: {queue: {title: m.title, url: m.video_url}}})
                    }
                }
            })
        }else{
            const url = args.url
            const member = args.member
            CurrentUser = member.id
            artificallySongChange = true
            Play(url, member)
            artificallySongChange = false
            ytdl.getBasicInfo(url).then(async m => {
                const UserQueue = await DB.FindOneQueue({userid: member.id})
                const Queue = UserQueue.queue
                if(Queue.length <= 21){
                    let SongInQueue = false
                    Queue.forEach(async e => {
                        if(e.url === url){
                            SongInQueue = true
                        }
                    })
                    if(!SongInQueue){
                        await DB.UpdateQueue({userid: member.id}, {$push: {queue: {title: m.title, url: m.video_url}}})
                    }
                }
            })
        }

    },
    stop: async function(){
        artificallySongChange = true
        if(con){
            if(con.dispatcher){
                con.dispatcher.end()
            }
        }
        artificallySongChange = false
    },
    skip: async function(member){
        SkipSong(member)
    },
    back: async function(member){
        BackSong(member)
    },
    pause: async function(){
        if(con){
            if(!con.dispatcher.paused){
                con.dispatcher.pause()
            }
        }
    },
    resume: async function(){
        if(con){
            if(con.dispatcher.paused){
                con.dispatcher.resume()
            }
        }
    },
    shuffle: async function(){
        OnSongEnd = "shuffle"
    },
    repeat: async function(){
        OnSongEnd = "repeat"
    },
    norepeat: async function(){
        OnSongEnd = "norepeat"
    },
    queue: async function(msg){
        var UserQueue1 = await DB.FindOneQueue({userid: msg.author.id})
        let queue_list = ""
        for (let i = 0; i < UserQueue1.queue.length; i++) {
            const e = UserQueue1.queue[i];
            let title = ""
            if(e.title.length){
                const titleList = e.title.split(` `)
                for (let i = 0; i < 5; i++) {
                    const el = titleList[i];
                    title += el + " "
                }
                title += "..."
            }else{
                title = e.title
            }
            queue_list += `${i}. ➤  __**[${title}](${e.url})**__\n`
        }
        const embed1 = new Discord.RichEmbed({
            "title": "Hozzáadva a Lejátszási Listához:",
            "description": `Lejátszási Listád: \n${queue_list}`,
            "color": 3145472,
            "author": {
                "name": msg.member.displayName,
                "icon_url": msg.author.displayAvatarURL
            }
        })
        msg.author.send(embed1)
    }
}