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
} from 'blockstack';
import { Switch, Route, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { currentUserInformation } from './actions';
import './App.css';



class App extends Component {

  constructor(props) {
    super(props)

    let isSignedIn = this.checkSignedInStatus();

    this.state = {
      isSignedIn
    }

    if (isSignedIn) {
      this.props.currentUserInformation();
    }
  }

  // function checks if user is signed in.
  // then calls function to load current user info
  checkSignedInStatus = () => {
    if (isUserSignedIn()) {
      return true;
    } else if (isSignInPending()) {
      handlePendingSignIn().then(function (userData) {
        window.location.reload();
      })
      return false;
    }
  }

  //search by blockstack id, by pushing blockstack id in url, route users handles search
  searchFor = (name) => {
    this.props.history.push(`/users/${name}`)
  }

  render() {
    const {loaded} = this.props.curUserInfo;

    return (
      <div className="App">
        {!this.state.isSignedIn ?
          <Signin handleSignIn={this.handleSignIn} />
          :
          (<div><Navbar
            searchFor={this.searchFor}
           />
          <Switch>
            <Route
              path='/users/:username'
              render={
                props => <Profile {...props} />
              }
            />
              {loaded && <Route
              exact path='/feed'
              render={
                props => <Feed
                  searchFor={this.searchFor}
                  {...props} />
              }
            />}
            <Route
              path='/:username'
              render={
                props => <MyProfile
                  searchFor={this.searchFor}
                  {...props} />
              }
            />
              {loaded && <Route
              exact path='/'
              render={
                props => <Feed
                  searchFor={this.searchFor}
                  {...props} />
              }
            />}
            
          </Switch></div>)
        }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  currentUserInformation
}, dispatch);

const mapStateToProps = (state, ownProps) => {
  return ({
    history: ownProps.history,
    curUserInfo: state.curuserInfo
  })
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
