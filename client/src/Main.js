import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import MusicBot from './pages/MusicBot'
import Store from './pages/Store'
import Levels from './pages/Levels'
import MyStats from './pages/MyStats'

class Main extends Component { 
    render(){
      
        return(
            <main>
              <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/musicbot' component={MusicBot}/>
                <Route path='/store' component={Store}/>
                <Route path='/levels' component={Levels}/>
                <Route path='/mystats' component={MyStats}/>
              </Switch>
            </main>
          )
    }
}

export default Main
