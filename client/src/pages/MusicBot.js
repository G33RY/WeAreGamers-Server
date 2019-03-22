import React, { Component } from 'react';
import socketio from 'socket.io-client';
import './pages_css/musicbot.css';
import Cookies from 'universal-cookie';
import $ from 'jquery';
import 'jquery-ui-bundle';


const cookies = new Cookies();

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

class MusicBot extends Component { 
    componentDidMount(){
        if(cookies.get('userinfos')){
            var userid = cookies.get('userinfos').userid
            var io = socketio.connect(`http://wearegamers.hu:8080?userid=${userid}`);

            $( "#Queue").sortable({
                update: function (event, ui) {
                    $('.SongNumber').each(function (i) {
                            var numbering = i;
                            document.getElementById(this.id).innerHTML = ('#' + numbering).toString()
                            numbering++
                    });
                    let Queue = []
                    for(let i=0; i<$('.SongTitle a').length; i++){ 
                        Queue.push({
                            title: $('.SongTitle a')[i].innerHTML,
                            url: $('.SongTitle a')[i].getAttribute('href')
                        })
                    }
                    io.emit('queuechange', Queue)
                }   
            });
            io.on('OnChange_NewQueue', async data => {
                cookies.set('queue', data)
                let number = 0
                let QueueList = ''
                await data.map((m) =>{
                    return QueueList += `
                    <tr key="${number}" class="Song" >
                        <td class="SongNumber" id="${gen_rand_string(10)}" >#${number}</td>
                        <td class="SongTitle" id="${gen_rand_string(10)}">
                            <a href="${m.url}" target="_blank" rel="noopener noreferrer">${m.title}</a>
                        </td>
                        <td class="SongButtons" id="${number++}asd"}>
                            <div>
                                <button class="Play"><i class="fas asd fa-play"></i></button>
                                <button class="Remove"><i class="fas fasz fa-trash-alt"></i></button>
                            </div>
                        </td> 
                    </tr>
                    `
                })
                document.getElementById('Queue').innerHTML = QueueList
            })
            $("#AddSong").submit(function(e) {
                io.emit('add', {
                    url: $('#AddBox').val()
                })
                document.getElementById("SubmitBox").innerHTML = '<i class="rolling"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 16px')
                e.preventDefault()
                $('#AddBox').val("")
            });

            //! Errors
            io.on('SomethingWentWrong', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Valami hiba történt! Probáld újra!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on('UserNotInChannel', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Be kell lépned egy szobába!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on('BotsNotInChannels', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Egyik bot sincs benne a szobában!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })

            //! Add Errors
            io.on('Add_UrlNotValid', data =>{
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Valós email címet kell megadnod!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on('Add_LimitReached', data =>{
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Nincs több hely a Lejátszási Listádban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on('Add_SongAlreadyIn', data =>{
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>A szám már benne van a Lejátszási Listádban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            //! Add Sucess
            io.on('Add_Sucess', async data =>{
                let number = document.getElementById('Queue').childElementCount
                document.getElementById('Queue').innerHTML += `
                <tr key="${number}" class="Song" >
                    <td class="SongNumber" id="${gen_rand_string(10)}" >#${number}</td>
                    <td class="SongTitle" id="${gen_rand_string(10)}">
                        <a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.title}</a>
                    </td>
                    <td class="SongButtons" id="${number++}asd"}>
                        <div>
                            <button class="Play"><i class="fas asd fa-play"></i></button>
                            <button class="Remove"><i class="fas fasz fa-trash-alt"></i></button>
                        </div>
                    </td> 
                </tr>
                `
                $('.SongNumber').each(function (i) {
                    var numbering = i;
                    document.getElementById(this.id).innerHTML = ('#' + numbering).toString()
                    numbering++
                });
                let Queue = []
                for(let i=0; i<$('.SongTitle a').length; i++){ 
                    Queue.push({
                        title: $('.SongTitle a')[i].innerHTML,
                        url: $('.SongTitle a')[i].getAttribute('href')
                    })
                }
                io.emit('queuechange', Queue)
                cookies.set('queue', Queue)
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                window.location.reload()

            })

            //! Remove Errors
            io.on('Remove_NumberError', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Nincs ilyen sorszámú zene a Lejátszási Listádban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on('Remove_PlaylistBlank', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Nincs több zene a Lejátszási Listádban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            //! Remove Sucess
            io.on('Remove_Sucess', data =>{
                $('.SongNumber').each(function (i) {
                    var numbering = i;
                    document.getElementById(this.id).innerHTML = ('#' + numbering).toString()
                    numbering++
                });
                let Queue = []
                for(let i=0; i<$('.SongTitle a').length; i++){ 
                    Queue.push({
                        title: $('.SongTitle a')[i].innerHTML,
                        url: $('.SongTitle a')[i].getAttribute('href')
                    })
                }
                io.emit('queuechange', Queue)
                cookies.set('queue', Queue)
                document.getElementById(data.id).remove()
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='sucess ${id}'><h1>${data.title} című zene sikeresen eltávolítva a Lejátszási Listádból!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
        
            //! Join Errors
            io.on('Join_BotsInUse', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Botok használatban vannak másik szobákban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
        
            //! Leave Errors
            io.on('Leave_BotsInUse', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Botok használatban vannak másik szobákban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
        
            //! Play Errors
            io.on('Play_UrlNotValid', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Valami Hiba történt! Probáld újra!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
            io.on('Play_BotsInUse', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Botok használatban vannak másik szobákban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
            })
        
            //! Play
            $('.Play').click(function (){
                const num = this.parentElement.parentElement.parentElement.firstChild.textContent.slice(1,2)
                io.emit('play', {
                    num: num
                })
                const queue = cookies.get('queue')
                document.getElementById('MusicTitle').innerHTML = `<h1>${queue[num].title}</h1>`
                document.getElementById('MusicThumbnail').innerHTML = `<img alt="MusicThumbnail" src="${queue[num].thumbnail}" />`
                cookies.set('LastSong', {
                    url: queue[num].url,
                    title: queue[num].title,
                    thumbnail_url: queue[num].thumbnail
                })
            })

            //! Remove
            $('.Remove').click(function (){
                const num = this.parentElement.parentElement.parentElement.firstChild.textContent.slice(1,2)
                io.emit('remove', {
                    num: num,
                    id: this.parentElement.parentElement.parentElement.id || ''
                })
            })

            //! On Song End
            io.on('songend', function(data){
                console.log(data)
            })
            

            if ($('#MusicTitle h1')[0].scrollWidth >  $('#MusicTitle h1').innerWidth()) {
                $('#MusicTitle h1').addClass('Scroller')
            }
            if($('#MusicTitle h1')[0].scrollWidth <=  $('#MusicTitle h1').innerWidth()){
                $('#MusicTitle h1').removeClass('Scroller')
            }    

            $(window).resize(function (w, h) {
                $('#MusicTitle h1').css({left: "0px"})
                if ($('#MusicTitle h1')[0].scrollWidth >  $('#MusicTitle h1').innerWidth()) {
                    $('#MusicTitle h1').addClass('Scroller')
                }else{
                    $('#MusicTitle h1').removeClass('Scroller')
                }   
            })
            

            // $("#Join").click(function () {
            //     console.log('fasz')
            //     io.emit('join', "")
            // })
            // $("#Leave").click(function () {
            //     io.emit('leave', "")
            // })
            // $("#Play").click(function () {
            //     io.emit('play', {
            //         url: "https://www.youtube.com/watch?v=ytdONGz3r50"
            //     })
            // })
            // $("#Stop").click(function () {
            //     io.emit('stop', "")
            // })
            // $("#Skip").click(function () {
            //     io.emit('skip', "")
            // })
            // $("#Back").click(function () {
            //     io.emit('back', "")
            // })
            // $("#Pause").click(function () {
            //     io.emit('pause', "")
            // })
            // $("#Resume").click(function () {
            //     io.emit('resume', "")
            // }
            // $("#Remove").click(function () {
            //     io.emit('remove', {
            //         num: 1
            //     })
            // })
            // $("#Shuffle").click(function () {
            //     io.emit('shuffle', "")
            // })
            // $("#Repeat").click(function () {
            //     io.emit('repeat', "")
            // })
            // $("#NoRepeat").click(function () {
            //     io.emit('norepeat', "")
            // })
            // $("#AddUser").click(function () {
            //     io.emit('adduser', {
            //         member: "553900948104151051"
            //     })
            // })
            // $("#RemoveUser").click(function () {
            //     io.emit('removeuser', {
            //         member: "553900948104151051"
            //     })
            // })
        
        }
    }
    render(){

        if(cookies.get('userinfos')){
            let queue = cookies.get('queue')
            let number = 0
            let LastSong = {
                url: null,
                title: 'Válassz zenét!',
                thumbnail_url: 'https://i.imgur.com/dVSCYU4.png'
            }
            if(cookies.get('LastSong')){
                const LastSongCookie = cookies.get('LastSong')
                LastSong = {
                    url: LastSongCookie.url,
                    title: LastSongCookie.title,
                    thumbnail_url: LastSongCookie.thumbnail_url
                }
            }
            if(queue){
                return(
                    <div>
                        <div id="MusicPlayer">
                            <div id="MusicProfile">
                                <div id="MusicThumbnail">
                                    <img alt="MusicThumbnail" src={LastSong.thumbnail_url} />
                                </div>
                                <div id="MusicTitle">
                                    <h1>{LastSong.title}</h1>
                                </div>
                            </div>
                            <div id="MusicPlayMain">
                                <div id='MPFirstRow'>
                                    <span className="visibleonmobile">
                                        <i className="fas fa-step-backward"></i>
                                    </span>
                                    <span className="visibleonmobile">
                                        <i className="fas fa-play"></i>
                                    </span>
                                    <span className="visibleonmobile">
                                        <i className="fas fa-pause"></i>
                                    </span>
                                    <span className="visibleonmobile">
                                        <i className="fas fa-step-forward"></i>
                                    </span>
                                    <span className="notonmobile">
                                        <i className="fas fa-redo-alt"></i>
                                    </span>
                                    <span className="notonmobile">
                                        <i className="fas fa-random"></i>
                                    </span>
                                    <span className="notonmobile">
                                        <i className="fas fa-sync"></i>
                                    </span>
                                    <div id="VolumeChanger" className="notonmobile">
                                        <div id="VolumeIcon">
                                            <i className="fas fa-volume-up"></i>
                                        </div>
                                        <div id="VolumeSliderBox">
                                            <input type="range" min="1" max="100" step="1" className="volume_slider" />
                                        </div>
                                    </div>
                                </div>
                                <div id="MPSecondRow">
                                    <input type="range" min="1" max="100" step="1" className="music_slider" />
                                </div>
                                
                            </div>
                        </div>
                        <div id="musicbot_header">
                            <h1 id="musicbot_huge-heading">
                                MUSIC BOTS
                            </h1>
                        </div>
                        <div id="mb_errors"></div>
                        <div id="MB_Main" className="row">
                            <table id="QueueBox" className="collumn">
                                <thead> 
                                    <tr>
                                        <td colSpan={3}>
                                            <h1>
                                                Lejátszási Listád
                                            </h1>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody id="Queue">
                                    {
                                        queue.map((m) =>
                                            <tr key={number} className="Song" id={gen_rand_string(10)} >
                                                <td className="SongNumber" id={gen_rand_string(10)}>
                                                    #{number}
                                                </td>
                                                <td className="SongTitle" id={gen_rand_string(10)}>
                                                    <a href={m.url} target="_blank" rel="noopener noreferrer">
                                                        {m.title}
                                                    </a>
                                                </td>
                                                <td className="SongButtons" id={`asd${number++}`}>
                                                    <div>
                                                        <button className="Play"><i className="fas asd fa-play"></i></button>
                                                        <button className="Remove"><i className="fas fasz fa-trash-alt"></i></button>
                                                    </div>
                                                </td> 
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                            <div id="SecondCardBox" className="collumn">
                                <form id="AddSong" action="">
                                    <label>
                                        <h1>
                                            Hozzáadás a Lejátszási Listádhoz
                                        </h1>
                                        <input type="url" name="url" id="AddBox"/>
                                        <button type="submit" id="SubmitBox">
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </label>
                                    <div></div>
                                </form>
                                <div id="Commands">
                                    <h1 id="CommandsTitle">
                                        Discord Chat-ben Használható Parancsok
                                        <p>
                                            <u>
                                                <b>  
                                                    Jelek jelentései: 
                                                </b>
                                            </u>
                                            <br/>
                                            {"{ }"} = Nem muszály megadnod ezt a paramétert <br/> 
                                            [ ] = Meg kell adnod ezt a paramétert <br/>
                                            <i>(Ne ird oda a jelet!)</i>
                                        </p>
                                    </h1>
                                    <dl>
                                        <dt>
                                            !help
                                        </dt>
                                        <dd>
                                            Segitseg a szerverrel és parancsokkal kapcsolatban.
                                        </dd>
                                        <dt>
                                            !musichelp
                                        </dt>
                                        <dd>
                                            Segitseg a MusicBot parancsaival kapcsolatban.
                                        </dd>
                                        <h1 className="CommandsSubTitle">
                                            MusicBot-hoz Tartozó Parancsok
                                        </h1>
                                        <dt>
                                            !join
                                        </dt>
                                        <dd>
                                            Valamelyik elérhető bot becsatlakozik a szobádba ha nincs bent egyik bot sem.
                                        </dd>
    
                                        <dt>
                                            !leave
                                        </dt>
                                        <dd>
                                            Szobádban lévő bot kilép.
                                        </dd>
    
                                        <dt>
                                            !play [lejátszani kívánt zene száma vagy YouTube URL]
                                        </dt>
                                        <dd>
                                            Valamelyik elérhető bot becsatlakozik a szobádba ha nincs bent egyik bot sem és lejátssza a megadott zenét.
                                        </dd>
    
                                        <dt>
                                            !stop
                                        </dt>
                                        <dd>
                                            Leállítja a jelenleg játszott zenét.
                                        </dd>
    
                                        <dt>
                                            !skip
                                        </dt>
                                        <dd>
                                            Lejátssza a következő zenét.
                                        </dd>
    
                                        <dt>
                                            !back
                                        </dt>
                                        <dd>
                                            Lejátssza az előző zenét.
                                        </dd>
    
                                        <dt>
                                            !pause
                                        </dt>
                                        <dd>
                                            Megállitja a jelenleg játszott zenét.
                                        </dd>
    
                                        <dt>
                                            !resume
                                        </dt>
                                        <dd>
                                            Elindítja a jelenleg játszott zenét.
                                        </dd>
    
                                        <dt>
                                            !shuffle
                                        </dt>
                                        <dd>
                                            Ha vége a zenének akkor véletlenszerűen választ következő zenét.
                                        </dd>
    
                                        <dt>
                                            !repeat
                                        </dt>
                                        <dd>
                                            Ha vége a zenének akkor lejátssza újra.
                                        </dd>
    
                                        <dt>
                                            !norepeat
                                        </dt>
                                        <dd>
                                            Ha vége a zenének akkor a lejátszási listádban a jelenlegi zene után következőt.
                                        </dd>
    
                                        <dt>
                                            !add [YouTube URL]
                                        </dt>
                                        <dd>
                                            Hozzáadadja a megadott zenét a lejátszási listádhoz ha van még benne hely. (Lejátszási Listád maximum 20 zenét tartalmazhat!)
                                        </dd>
    
                                        <dt>
                                            !remove [Törölni kívánt zene száma a Lejátszási Listádból]
                                        </dt>
                                        <dd>
                                            Eltávolítja a megadott zenét a Lejátszási Listádból.
                                        </dd>
    
                                        <dt>
                                            !queue
                                        </dt>
                                        <dd>
                                            Elküldi a bot privát üzenetben a Lejátszási Listádat.
                                        </dd>
    
                                        <dt>
                                            !search [Keresendő szó/szavak]
                                        </dt>
                                        <dd>
                                            Youtube keresés.
                                        </dd>
    
    
                                        <h1 className="CommandsSubTitle">
                                            Szerverhez Tartozó Parancsok
                                        </h1>
                                        <dt>
                                            !ping
                                        </dt>
                                        <dd>
                                            Megnézheted a bot válasz idejét a szerverhez.
                                        </dd>
    
                                        <dt>
                                            !store {"{tárgy neve}"}
                                        </dt>
                                        <dd>
                                            Áruház ahol felhasználhatod a pénzedet.
                                        </dd>
    
                                        <dt>
                                            !bank
                                        </dt>
                                        <dd>
                                            Megnézheted a bank egyenlegedet.
                                        </dd>
    
                                        <dt>
                                            !leaderboard
                                        </dt>
                                        <dd>
                                            Nézd meg a szerver 5 leggazdagabb felasználóját!
                                        </dd>
    
                                        <dt>
                                            !suggest [üzenet]
                                        </dt>
                                        <dd>
                                            Ha szeretnél az adminokkal megosztani valami javaslatot/problémát a szerverrel vagy a bot-okkal kapcsolatban, akkor használd egyszerűen ezt parancsot a <b/>javaslatok<b/> szobába és üzenj névtelenül egyszerre az összes elérhető adminnak!
                                        </dd>
    
                                        <dt>
                                            !serverinfo
                                        </dt>
                                        <dd>
                                            Szerver Statisztikái.
                                        </dd>
    
                                        <dt>
                                            !serverinfo
                                        </dt>
                                        <dd>
                                            Szerver Statisztikái.
                                        </dd>
    
                                        <dt>
                                            !userinfo [@felhasználó]
                                        </dt>
                                        <dd>
                                            Egy felhasználó statisztikái.
                                        </dd>
    
                                        <dt>
                                            !transfer [@felhasználó] [mennyiség]
                                        </dt>
                                        <dd>
                                            Pénz utalás egy felhasználónak.
                                        </dd>
    
    
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="separator"></div>
                    </div>
                )
            }
            return(
                <div>
                    
                </div>
            )
        }
        return(
            <div>
                
            </div>
        )
    }
}
          
export default MusicBot
