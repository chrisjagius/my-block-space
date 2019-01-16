import React, { Component, Link } from 'react';
import Profile from './components/Profile.jsx';
import Signin from './components/Signin.jsx';
import Navbar from './components/Navbar.jsx';
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
  loadUserData,
  lookupProfile
} from 'blockstack';
import { Switch, Route } from 'react-router-dom'
import './App.css';


export default class App extends Component {

  constructor(props) {
    super(props)

    let isSignedIn = this.checkSignedInStatus();

    this.state = {
      isSignedIn,
      person: undefined
    }

    if (isSignedIn) {
      this.loadPerson();
    }
  }

  checkSignedInStatus = () => {
    if (isUserSignedIn()) {
      return true;
    } else if (isSignInPending()) {
      handlePendingSignIn().then(function (userData) {
        window.location = window.location.origin
      })
      return false;
    }
  }

  loadPerson = () => {
    let username = loadUserData().username

    lookupProfile(username).then((person) => {
      this.setState({ person })
    })
  }

  handleSignIn = (event) => {
    event.preventDefault();
    const origin = window.location.origin;
    redirectToSignIn(origin, origin + "/manifesto.json", ['store_write', 'publish_data'])
  }

  handleSignOut = (event) => {
    event.preventDefault();
    signUserOut(window.location.href)
  }

  render() {
    return (
      <div className="App">
        {!this.state.isSignedIn ?
          <Signin handleSignIn={this.handleSignIn} />
          :
          (<div><Navbar />
          <Switch>
            <Route
              path='/:username?'
              render={
                props => <Profile handleSignOut={this.handleSignOut} {...props} />
              }
            />
          </Switch></div>)
        }
      </div>
    );
  }
}
