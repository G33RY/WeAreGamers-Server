import React, { Component } from 'react';
import socketio from 'socket.io-client';
import './pages_css/musicbot.css';
import Cookies from 'universal-cookie';
import $ from 'jquery';
import 'jquery-ui-bundle'


const cookies = new Cookies();
const asd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
let QueueList = ""

class MusicBot extends Component { 
    componentDidMount(){
        if(cookies.get('userinfos')){
            var userid = cookies.get('userinfos').userid
            var io = socketio.connect(`http://178.48.146.196:8080?userid=${userid}`);

            $( "#Queue").sortable({
                update: function (event, ui) {
                    $('.SongNumber').each(function (i) {
                            var numbering = i + 1;
                            $(this).text( "#" + numbering);
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
            io.on('OnChange_NewQueue', data => {
                let number = 0
                console.log("fasy")
                data.map((m) =>{
                    number++;
                    return  QueueList += `
                    <li key="${number}" class="Song">
                        <div class="SongNumber">
                            #${number}
                        </div>
                        <div class="SongTitle">
                            <a href="${m.url}" target="_blank" rel="noopener noreferrer">
                                ${m.title}
                            </a>
                        </div>
                        <div class="SongButtons">
                            <button><i class="fas fa-play"></i></button>
                            <button><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </li>
                    `
                })
                document.getElementById('Queue').innerHTML = QueueList
            })
            $("#AddSong").submit(function(e) {
                e.preventDefault();
            });
            

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
            // })
            // $("#Add").click(function () {
            //     io.emit('add', {
            //         url: "https://www.youtube.com/watch?v=Z_fNOPwGI7k"
            //     })
            // })
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
            return(
                <div>
                    <div id="musicbot_header">
                        <h1 id="musicbot_huge-heading">
                            MUSIC BOTS
                        </h1>
                    </div>
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
                                {asd.map((number) =>
                                    <tr key={number} className="Song">
                                        <td className="SongNumber">
                                            #{number}
                                        </td>
                                        <td className="SongTitle">
                                            <a href="https://www.youtube.com/watch?v=02ROotiuyZU" target="_blank" rel="noopener noreferrer">
                                                EZ A HÉT MÁR ILYEN!!! BUKJUK LE AZT A RANK-OT!!! RAINBOW SIX SIEGE!
                                            </a>
                                        </td>
                                        <td className="SongButtons">
                                            <div>
                                                <button><i className="fas fa-play"></i></button>
                                                <button><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div id="SecondCardBox" className="collumn">
                            <form id="AddSong" action="">
                                <label>
                                    <h1>
                                        Hozzáadás a Lejátszási Listádhoz
                                    </h1>
                                    <input type="url" name="url" id="AddBox"/>
                                    <input type="submit" id="SubmitBox" value="Hozzáadás" />
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
}
          
export default MusicBot

















          