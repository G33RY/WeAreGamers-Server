import React, { Component } from 'react';
import './pages_css/levels.css'
import Cookies from 'universal-cookie';
import $ from 'jquery';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
// Import Levels
import level_1 from   "./levels/level_1.png";
import level_2 from   "./levels/level_2.png";
import level_3 from   "./levels/level_3.png";
import level_4 from   "./levels/level_4.png";
import level_5 from   "./levels/level_5.png";
import level_6 from   "./levels/level_6.png";
import level_7 from   "./levels/level_7.png";
import level_8 from   "./levels/level_8.png";
import level_9 from   "./levels/level_9.png";
import level_10 from "./levels/level_10.png";
import level_11 from "./levels/level_11.png";
import level_12 from "./levels/level_12.png";
import level_13 from "./levels/level_13.png";
import level_14 from "./levels/level_14.png";
import level_15 from "./levels/level_15.png";
import level_16 from "./levels/level_16.png";
import level_17 from "./levels/level_17.png";
import level_18 from "./levels/level_18.png";
import level_19 from "./levels/level_19.png";
import level_20 from "./levels/level_20.png";
import level_21 from "./levels/level_21.png";
import level_22 from "./levels/level_22.png";
import level_23 from "./levels/level_23.png";
import level_24 from "./levels/level_24.png";
import level_25 from "./levels/level_25.png";
import level_26 from "./levels/level_26.png";
import level_27 from "./levels/level_27.png";
import level_28 from "./levels/level_28.png";
import level_29 from "./levels/level_29.png";
import level_30 from "./levels/level_30.png";
import level_31 from "./levels/level_31.png";
import level_32 from "./levels/level_32.png";
import level_33 from "./levels/level_33.png";
import level_34 from "./levels/level_34.png";
import level_35 from "./levels/level_35.png";
import level_36 from "./levels/level_36.png";
import level_37 from "./levels/level_37.png";
import level_38 from "./levels/level_38.png";
import level_39 from "./levels/level_39.png";
import level_40 from "./levels/level_40.png";
import level_41 from "./levels/level_41.png";
import level_42 from "./levels/level_42.png";
import level_43 from "./levels/level_43.png";
import level_44 from "./levels/level_44.png";
import level_45 from "./levels/level_45.png";
import level_46 from "./levels/level_46.png";
import level_47 from "./levels/level_47.png";
import level_48 from "./levels/level_48.png";
import level_49 from "./levels/level_49.png";
import level_50 from "./levels/level_50.png";



const cookies = new Cookies();
class Levels extends Component { 
    componentDidMount(){
        if(cookies.get('userstats')){
        let list = [cookies.get('userstats').blueboxWidth[0], cookies.get('userstats').blueboxWidth[1]]
        let blueboxWidth = $("#level_pos").width()
        let NewBlueBoxWidth = (((blueboxWidth * list[0]) / list[1]) / 100)
        $('#level_bluebox').width(NewBlueBoxWidth)
        console.log(NewBlueBoxWidth)
        $(window).resize(() => {
            blueboxWidth = $("#level_pos").width()
            NewBlueBoxWidth = (((blueboxWidth * list[0]) / list[1]) / 100)
            $('#level_bluebox').width(NewBlueBoxWidth)
        })
    }
    }
    render(){
        if(cookies.get('userinfos')){
            let avatar = cookies.get('userinfos').avatar
            return(
                <div>
                    <div id="userlevel_container">
                        <div id="avatar_con">
                            <img alt="avatar" src={avatar} />
                        </div>
                        <span id="cur_level">
                            Szint: {cookies.get('userstats').level}
                        </span>
                        <span id="level_xp">
                            {cookies.get('userstats').xp}/{cookies.get('userstats').maxXp}XP
                        </span>
                        <div id="level_pos">
                            <div id="level_bluebox" style={{width: `${cookies.get('userstats').blueboxWidth}%`}}></div>                        
                        </div>
                    </div>
                    <div id="levels_container">
                        <OwlCarousel 
                        className="levels"
                        margin={-1}
                        nav
                        startPosition={(((cookies.get('userstats').level)-1) || 0)}
                        navText = {['<i class="fas fa-chevron-circle-left"></i>', '<i class="fas fa-chevron-circle-right"></i>']} 
                        lazyLoad
                        mouseDrag={false}
                        touchDrag={false}
                        pullDrag={false}
                        slideBy={10}
                        fluidSpeed={200}
                        smartSpeed={200}
                        dots={false}
                        mergeFit={false}
                        responsive={{
                            0: {
                            items: 2
                            },
                            400: {
                            items: 3
                            },
                            600: {
                            items: 5
                            },
                            800: {
                            items: 6
                            },
                            1000:{
                            items: 7
                            },
                            1400: {
                            items: 10
                            }
                        }}
                        > 
                            <div className="item"> <img draggable="false" alt="kep" src={level_1}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_2}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_3}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_4}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_5}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_6}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_7}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_8}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_9}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_10}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_11}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_12}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_13}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_14}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_15}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_16}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_17}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_18}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_19}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_20}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_21}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_22}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_23}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_24}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_25}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_26}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_27}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_28}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_29}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_30}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_31}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_32}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_33}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_34}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_35}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_36}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_37}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_38}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_39}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_40}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_41}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_42}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_43}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_44}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_45}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_46}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_47}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_48}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_49}/> </div>
                            <div className="item"> <img draggable="false" alt="kep" src={level_50}/> </div>
                        </OwlCarousel>
                     </div>
                </div>
            )
        }
        return(
            <div></div>
        )
    }
}
          
export default Levels