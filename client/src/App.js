import React, { Component } from 'react';
import Navbar from "./Navbar"
import Main from "./Main"
import $ from 'jquery';
import Loading from './loading';
import {Helmet} from "react-helmet";

class App extends Component {  
    componentDidMount(){
        $("#se-pre-con").fadeOut(1500)
    }
    render() {
        return( 
            <div>
                <Helmet 
                    title= "We Are Gamers"
                    meta={[
                        {"name": "description", "content": "We Are Gamers Discord közösség/szerver hivatalos weboldala"},
                        {property: "og:type", content: "article"},
                        {property: "og:title", content: "We Are Gamers"},
                        {property: "og:image", content: "https://i.imgur.com/bGlJ0yb.png"},
                        {property: "og:url", content: "http://wearegamers.hu/"}
                    ]}
                />
                <Loading />
                <Navbar />
                <Main />
            </div>
        )
    }
}

export default App
