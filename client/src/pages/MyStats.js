import React, { Component } from 'react';
import './pages_css/mystats.css'
import Chart from 'chart.js';
import Cookies from 'universal-cookie';
import $ from 'jquery';

const cookies = new Cookies();

class MyStats extends Component { 
    render(){
        if(cookies.get('userinfos')){
            let data = cookies.get('chartdata')
            window.onload = function () {
                
                    let ctx = document.getElementById('mychart');
                    var mychart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: [
                                data.day_6.date, 
                                data.day_5.date, 
                                data.day_4.date, 
                                data.day_3.date, 
                                data.day_2.date,
                                data.day_1.date,
                                data.day_0.date,
                            ],
                            datasets: [
                                {
                                    label: 'ELKÜLDÖTT ÜZENETEK',
                                    data: [
                                        data.day_6.msgs, 
                                        data.day_5.msgs, 
                                        data.day_4.msgs, 
                                        data.day_3.msgs, 
                                        data.day_2.msgs,
                                        data.day_1.msgs,
                                        data.day_0.msgs,
                                    ],
                                    backgroundColor: 'rgba(200, 250, 200, .70)',
                                },
                                {
                                    label: 'ELKÜLDÖTT PARANCSOK',
                                    data: [
                                        data.day_6.cmds, 
                                        data.day_5.cmds, 
                                        data.day_4.cmds, 
                                        data.day_3.cmds, 
                                        data.day_2.cmds,
                                        data.day_1.cmds,
                                        data.day_0.cmds,
                                    ],
                                    backgroundColor: 'rgba(100, 100, 150, .70)',
                                },
                            ]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                    }
                                }],
                            },
                            title: {
                                display: true,
                                text: 'Chat Statisztikáim',
                                fontSize: 28,
                                fontColor: '#C0C0C0',
                                fontStyle: 'normal'
                            }
                        }
                    });
        
                    if($(window).width() < 750){
                        mychart.config.options.legend.labels.fontSize = 10;
                        mychart.config.options.legend.labels.boxWidth = 35;
                        mychart.config.options.title.fontSize = 20;
                    }
                    if($(window).width() < 400){
                        mychart.config.options.legend.labels.fontSize = 8;
                        mychart.config.options.legend.labels.boxWidth = 20;
                    }
        
                    $(window).resize(() => {
                        if($(window).width() < 750){
                            mychart.config.options.legend.labels.fontSize = 10;
                            mychart.config.options.legend.labels.boxWidth = 35;
                            mychart.config.options.title.fontSize = 20;
                        }
                        if($(window).width() < 400){
                            mychart.config.options.legend.labels.fontSize = 8;
                            mychart.config.options.legend.labels.boxWidth = 20;
                        }
                    }) 
            }
    
            const stats = cookies.get('userstats')
    
            return(
                <div>
                    <div id="mystats_header">
                        <h1 id="mystats_huge-heading">
                            STATISZTIKÁIM
                        </h1>
                    </div>
                    <div id="userstats">
                        <h1>
                            Általános Statisztikáim
                        </h1>
                        <ul id="list_1">
                            <div>
                                <li>
                                    <span></span>
                                    <p>
                                        <b className="stat_label">Becenevem: </b>
                                        <b className="stat_value">{stats.nickname}</b>
                                    </p>
                                </li>
                                <li>
                                    <span></span>
                                    <p>
                                        <b className="stat_label">Azonosítóm: </b>
                                        <b className="stat_value">{stats.userid}</b>
                                    </p>
                                </li>
                                <li>
                                    <span></span>
                                    <p>
                                        <b className="stat_label">Rangjaim: </b>
                                        <b className="stat_value">{stats.roles}</b>
                                    </p>
                                </li>
                            </div>
    
                        </ul>
                        <ul id="list_2">
                            <div>
                                <li>
                                    <span></span>
                                    <p>
                                        <b className="stat_label">Csatlakoztam: </b>
                                        <b className="stat_value">{stats.joined}</b>
                                    </p>
                                </li>
                                <li>
                                    <span></span>
                                    <p>
                                        <b className="stat_label">Összes Elküldött Üzenteim: </b>
                                        <b className="stat_value">{stats.sent_msgs}</b>
                                    </p>
                                </li>
                                <li>
                                    <span></span>
                                    <p>
                                        <b className="stat_label">Összes Elküldött Parancsaim: </b>
                                        <b className="stat_value">{stats.sent_cmds}</b>
                                    </p>
                                </li>
                            </div>
                        </ul>
                    </div>
                    <div id="mychart_box">
                        <canvas id='mychart' height="300">
                        </canvas>
                    </div>
                    <div className="seperator"></div>
                </div>
              )
        }
        return(
            <div>
                
            </div>
        )
    }
}
          
export default MyStats