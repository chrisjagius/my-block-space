import React, { Component } from 'react';
import MyProfile from './components/MyProfile';
import Signin from './components/Signin';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Feed from './components/Feed';
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  loadUserData,
  getFile,
  Person
} from 'blockstack';
import { Switch, Route } from 'react-router-dom'
import './App.css';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';


export default class App extends Component {

  constructor(props) {
    super(props)

    let isSignedIn = this.checkSignedInStatus();

    this.state = {
      isSignedIn,
      person: {
        name() {
          return 'Anonymous';
        },
        avatarUrl() {
          return avatarFallbackImage;
        },
        description() {
          return 'No description'
        }
      },
      username: null,
      friends: []
    }

    if (isSignedIn) {
      this.loadPerson();
    }
  }

  // function checks if user is signed in.
  checkSignedInStatus = () => {
    if (isUserSignedIn()) {
      return true;
    } else if (isSignInPending()) {
      handlePendingSignIn().then(function (userData) {
        this.props.history.push('/')
      })
      return false;
    }
  }

  loadPerson = async () => {
    let userData = loadUserData()
    let person = await new Person(userData.profile)
    this.loadFriends();
    let username = await userData.username
    // let urlusername = username.slice(0, -11);
    this.setState({ person, username })
    this.props.history.push(`/${username}`)
  }

  loadFriends = () => {
    const options = { decrypt: false }
    getFile('friends.json', options)
      .then((file) => {
        let friends = JSON.parse(file || '[]')
        this.setState({
          friends: friends
        })
      })
  }

  handleSignIn = (e) => {
    e.preventDefault();
    const origin = window.location.origin
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  }

  searchFor = (name) => {
    this.props.history.push(`/users/${name}`)
  }
  updateFriends = (friends) => {
    this.setState({friends: friends})
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        // not sure what to do with user data
        window.location = window.location.origin;
      });
    }
  }

  componentDidMount() {
    // this.loadPerson()
  }

  render() {
    let friends = this.state.friends
    if (!friends.includes(this.state.username)) {friends.push(this.state.username)}
    return (
      <div className="App">
        {!this.state.isSignedIn ?
          <Signin handleSignIn={this.handleSignIn} />
          :
          (<div><Navbar
            searchFor={this.searchFor}
            person={this.state.person}
            username={this.state.username}
           />
          <Switch>
            <Route
              path='/users/:username'
              render={
                props => <Profile
                  updateFriends={this.updateFriends}
                  friends={this.state.friends}
                  person={this.state.person}
                  username={this.state.username}
                  {...props} />
              }
            />
            <Route
              exact path='/feed'
              render={
                props => <Feed
                  searchFor={this.searchFor}
                  friends={friends}
                  person={this.state.person}
                  username={this.state.username}
                  {...props} />
              }
            />
            <Route
              path='/:username'
              render={
                props => <MyProfile
                  searchFor={this.searchFor}
                  friends={this.state.friends}
                  person={this.state.person}
                  username={this.state.username}
                  {...props} />
              }
            />
            <Route
              exact path='/'
              render={
                props => <Feed
                  searchFor={this.searchFor}
                  friends={friends}
                  person={this.state.person}
                  username={this.state.username}
                  {...props} />
              }
            />
            
          </Switch></div>)
        }
      </div>
    );
  }
}
