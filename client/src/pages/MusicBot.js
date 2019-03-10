import React, { Component } from 'react';
import socketio from 'socket.io-client';
import './pages_css/musicbot.css';
import Cookies from 'universal-cookie';
import $ from 'jquery';

const cookies = new Cookies();

class MusicBot extends Component { 
    componentDidMount(){
        var userid = cookies.get('userinfos').userid
        var io = socketio.connect(`http://178.48.146.196:8080?userid=${userid}`);
        if(cookies.get('userinfos')){
            $("#Join").click(function () {
                console.log('fasz')
                io.emit('join', "")
            })
            $("#Leave").click(function () {
                io.emit('leave', "")
            })
            $("#Play").click(function () {
                io.emit('play', {
                    url: "https://www.youtube.com/watch?v=ytdONGz3r50"
                })
            })
            $("#Stop").click(function () {
                io.emit('stop', "")
            })
            $("#Skip").click(function () {
                io.emit('skip', "")
            })
            $("#Back").click(function () {
                io.emit('back', "")
            })
            $("#Pause").click(function () {
                io.emit('pause', "")
            })
            $("#Resume").click(function () {
                io.emit('resume', "")
            })
            $("#Add").click(function () {
                io.emit('add', {
                    url: "https://www.youtube.com/watch?v=Z_fNOPwGI7k"
                })
            })
            $("#Remove").click(function () {
                io.emit('remove', {
                    num: 1
                })
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
            return(
                <div>
                    <div id="asjdasdj">
                        <button id="Join">Join</button>
                        <button id="Leave">Leave</button>
                        <button id="Play">Play</button>
                        <button id="Stop">Stop</button>
                        <button id="Skip">Skip</button>
                        <button id="Back">Back</button>
                        <button id="Pause">Pause</button>
                        <button id="Resume">Resume</button>
                        <button id="Add">Add</button>
                        <button id="Remove">Remove</button>
                        <button id="Shuffle">Shuffle</button>
                        <button id="Repeat">Repeat</button>
                        <button id="NoRepeat">NoRepeat</button>
                    </div>
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
          