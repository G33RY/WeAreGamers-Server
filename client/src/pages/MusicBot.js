import React, { Component } from 'react';
import socketio from 'socket.io-client';
import './pages_css/musicbot.css';
import Cookies from 'universal-cookie';
import $ from 'jquery';
import 'jquery-ui-bundle';


const cookies = new Cookies();
let LastSong = {
    url: null,
    title: 'Válassz zenét!',
    thumbnail_url: 'https://i.imgur.com/dVSCYU4.png'
}

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
            const farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*5)); // ~5y
            let userid = cookies.get('userinfos').userid
            let io = socketio.connect(`http://wearegamers.hu:8080?userid=${userid}`);

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
                cookies.set('queue', data, {
                    "expires": farFuture
                })
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
                $("#SubmitBox").attr('disabled', true)
                io.emit('add', {
                    url: $('#AddBox').val()
                })
                document.getElementById("SubmitBox").innerHTML = '<i class="rolling"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 16px')
                e.preventDefault()
                $('#AddBox').val("")
            });

            io.on('volume', data => {
                $('#VolumeSlider').val(data)
                cookies.set('volume', data, {
                    "expires": farFuture
                })
            })

            $('#VolumeSlider').change('mousestop', () => {
                io.emit('volumechanged', $('#VolumeSlider').val())
            })
            

            //! Errors
            io.on('SomethingWentWrong', data =>{
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Valami hiba történt! Probáld újra!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
                $("#SubmitBox").attr('disabled', false)
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
                $('#mb_errors').append(`<div class='error ${id}'><h1>Valós linket kell megadnod!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                $("#SubmitBox").attr('disabled', false)
            })
            io.on('Add_LimitReached', data =>{
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>Nincs több hely a Lejátszási Listádban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                $("#SubmitBox").attr('disabled', false)
            })
            io.on('Add_SongAlreadyIn', data =>{
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                let id = gen_rand_string(10)
                $('#mb_errors').append(`<div class='error ${id}'><h1>A szám már benne van a Lejátszási Listádban!</h1></div>`).fadeIn('slow')
                setTimeout(() => {
                    $(`.${id}`).fadeOut('slow')
                }, 5000);
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                $("#SubmitBox").attr('disabled', false)
            })
            //! Add Sucess
            io.on('Add_Sucess', async data =>{
                let number = document.getElementById('Queue').childElementCount
                document.getElementById('Queue').innerHTML += `
                <tr key="${number}" class="Song" id="${gen_rand_string(10)}">
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
                let Queue = cookies.get('queue')
                Queue.push({
                    title: data.title,
                    url: data.url,
                    thumbnail_url: data.thumbnail
                })
                io.emit('queuechange', Queue)
                cookies.set('queue', Queue, {
                    "expires": farFuture
                })
                document.getElementById("SubmitBox").innerHTML = '<i class="fas fa-plus"></i>'
                document.getElementById("SubmitBox").setAttribute('style', 'top: 1px')
                $("#SubmitBox").attr('disabled', false)
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
                let Queue = cookies.get('queue')
                if(Queue.length === 1){
                    Queue.pop()
                }else{
                    let index = 0
                    let i = 0
                    Queue.map(m => {
                        if(m.url === data.url) return index = i
                        return i++
                    })
                    Queue.splice(index, 1)
                }
                io.emit('queuechange', Queue)
                cookies.set('queue', Queue, {
                    "expires": farFuture
                })
                if(data.id){
                    document.getElementById(data.id).remove()
                }

                $('.SongNumber').each(function (i) {
                    var numbering = i;
                    document.getElementById(this.id).innerHTML = ('#' + numbering).toString()
                    numbering++
                });
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
            let PlayDisabled = false
            $('.Play').click(function (){
                if(!PlayDisabled){
                    const num = this.parentElement.parentElement.parentElement.firstChild.textContent.slice(1,2)
                    io.emit('play', {
                        num: num
                    })
                    const queue = cookies.get('queue')
                    LastSong = {
                        url: queue[num].url,
                        title: queue[num].title,
                        thumbnail_url: queue[num].thumbnail_url
                    }
                    document.getElementById('MusicTitle').innerHTML = `<h1 id="MusicTitleH1">${LastSong.title}</h1>`
                    document.getElementById('MusicThumbnail').innerHTML = `<div id="mask"><img alt="MusicThumbnail" src="${LastSong.thumbnail_url}" /></div>`
                    cookies.set('LastSong', LastSong, {
                        "expires": farFuture
                    })
                    PlayDisabled = true
                    setTimeout(() => {
                        PlayDisabled = false                 
                    }, 3000);
                }

            })

            //! Remove
            let RemoveDisabled = false
            $('.Remove').click(function (){
                if(!RemoveDisabled){
                    const num = this.parentElement.parentElement.parentElement.firstChild.textContent.slice(1,2)
                    io.emit('remove', {
                        num: num,
                        id: this.parentElement.parentElement.parentElement.id || ''
                    })
                    RemoveDisabled = true
                    setTimeout(() => {
                        RemoveDisabled = false
                    }, 500);
                }
            })

            //! On Song End
            io.on('songend', function(data){
                LastSong = {
                    url: data.url,
                    title: data.title,
                    thumbnail_url: data.thumbnail_url
                }
                cookies.set('LastSong', LastSong, {
                    "expires": farFuture
                })
                document.getElementById('MusicTitle').innerHTML = `<h1 id="MusicTitleH1">${LastSong.title}</h1>`
                document.getElementById('MusicThumbnail').innerHTML = `<div id="mask"><img alt="MusicThumbnail" src="${LastSong.thumbnail_url}" /></div>`
            })


            if($('#MusicTitle h1')[0]){
                if ($('#MusicTitle h1')[0].scrollWidth >  $('#MusicTitle h1').innerWidth()) {
                    $('#MusicTitle h1').addClass('Scroller')
                }else{
                    $('#MusicTitle h1').removeClass('Scroller')
                }    
            }


            $(window).resize(function (w, h) {
                $('#MusicTitle h1').css({left: "0px"})
                if ($('#MusicTitle h1')[0].scrollWidth >  $('#MusicTitle h1').innerWidth()) {
                    $('#MusicTitle h1').addClass('Scroller')
                }else{
                    $('#MusicTitle h1').removeClass('Scroller')
                }   
            })
            
            let StopDisabled = false
            $("#Stop").click(function () {
                if(!StopDisabled){
                    io.emit('stop', "")
                }
                StopDisabled = true
                setTimeout(() => {
                    StopDisabled = false
                }, 400);
            })
            let SkipDisabled = false
            $("#Skip").click(function () {
                if(!SkipDisabled){
                    io.emit('skip', "")
                }
                SkipDisabled = true
                setTimeout(() => {
                    SkipDisabled = false
                }, 200);
            })
            let BackDisabled = false
            $("#Back").click(function () {
                if(!BackDisabled){
                    io.emit('back', "")
                }
                BackDisabled = true
                setTimeout(() => {
                    BackDisabled = false
                }, 200);
            })
            let PauseDisabled = false
            $("#Pause").click(function () {
                if(!PauseDisabled){
                    io.emit('pause', "")
                }
                PauseDisabled = true
                setTimeout(() => {
                    PauseDisabled = false
                }, 1000);
            })
            let ResumeDisabled = false
            $("#Resume").click(function () {
                if(!ResumeDisabled){
                    io.emit('resume', LastSong.url)
                }
                ResumeDisabled = true
                setTimeout(() => {
                    ResumeDisabled = false
                }, 1000);
            })
            $("#Shuffle").click(function () {
                io.emit('shuffle', "")
            })
            $("#Repeat").click(function () {
                io.emit('repeat', "")
            })
            $("#NoRepeat").click(function () {
                io.emit('norepeat', "")
            })

        
        }
    }
    render(){

        if(cookies.get('userinfos')){
            let queue = cookies.get('queue')
            let number = 0
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
                                    <div id="mask"><img alt="MusicThumbnail" src={LastSong.thumbnail_url} /></div>
                                </div>
                                <div id="MusicTitle">
                                    <h1 id="MusicTitleH1">{LastSong.title}</h1>
                                </div>
                            </div>
                            <div id="MusicPlayMain">
                                <div id='MPFirstRow'>
                                    <span className="visibleonmobile">
                                        <button className="PlayerButton">
                                            <i id="Back" className="fas fa-step-backward"></i>
                                        </button>
                                    </span>
                                    <span className="visibleonmobile">
                                        <button className="PlayerButton">
                                            <i id="Resume" className="fas fa-play"></i>
                                        </button>
                                    </span>
                                    <span className="visibleonmobile">
                                        <button className="PlayerButton">
                                            <i id="Pause" className="fas fa-pause"></i>
                                        </button>
                                    </span>
                                    <span className="visibleonmobile">
                                        <button className="PlayerButton">
                                            <i id="Stop" className="fas fa-stop"></i>
                                        </button>
                                    </span>
                                    <span className="visibleonmobile">
                                        <button className="PlayerButton">
                                            <i id="Skip" className="fas fa-step-forward"></i>
                                        </button>
                                    </span>
                                    <span className="notonmobile">
                                        <button className="PlayerButton">
                                            <i id="NoRepeat" className="fas fa-redo-alt"></i>
                                        </button>
                                    </span>
                                    <span className="notonmobile">
                                        <button className="PlayerButton">
                                            <i id="Shuffle" className="fas fa-random"></i>
                                        </button>
                                    </span>
                                    <span className="notonmobile">
                                        <button className="PlayerButton">
                                            <i id="Repeat" className="fas fa-sync"></i>
                                        </button>
                                    </span>
                                    <div id="VolumeChanger" className="notonmobile">
                                        <div id="VolumeIcon">
                                            <i className="fas fa-volume-up"></i>
                                        </div>
                                        <div id="VolumeSliderBox">
                                            <input type="range" min="0" max="100" step="1" id="VolumeSlider" className="volume_slider" />
                                        </div>
                                    </div>
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
