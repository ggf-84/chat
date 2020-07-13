import React from 'react'
import './App.css'

import Home from './pages/HomePage'
import Login from './pages/LoginPage'
import SignUp from './pages/SignUpPage'
import Chat from './pages/ChatPage'
import Profile from './pages/ProfilePage'
import Gallery from './pages/GalleryPage'
import Default from './pages/DefaultPage'

import {Route, Switch} from 'react-router-dom'

import Navbar from './components/Navbar'

function App() {
  return (
  <div className="mine-container">
    <Navbar/>
    <Switch>
      <Route path="/" exact render={ ()=><Home/>} />
      <Route path="/chat/:id" exact render={ ()=><Chat/>} /> 
      <Route path="/profile/:id" exact render={ ()=><Profile/>} />
      <Route path="/gallery/:id" exact render={ ()=><Gallery/>} />
      <Route path="/login" exact render={ ()=><Login/>} />
      <Route path="/sign-up" render={ ()=><SignUp/>} />
      <Route render={ ()=><Default/> } />
    </Switch>
  </div>
  );
}

export default App;
