import React, { Component } from 'react';
import { Navbar, Nav, InputGroup, FormControl, Button } from 'react-bootstrap';
import {signUserOut} from 'blockstack';
import { Link } from 'react-router-dom';
import logo from '../assets/3.png';
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';




class Navigationbar extends Component {
    constructor() {
        super()
        this.state = {
            searchUser: undefined
        }
    }

    handleSignOut = (event) => {
        event.preventDefault();
        signUserOut(window.location.origin)
    }
    
    handleKeyPress = (e) => {
        e.preventDefault();
        const user = this.state.searchUser.trim();
        this.props.searchFor(user);
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            searchUser: event.target.value
        })
    }


    render() {
        
        const { person, username } = this.props;
        
        return (
            <div>
                <Navbar bg="light" collapseOnSelect fixed="top" expand="sm" className='navbar-con'>
                        <Navbar.Brand >
                        <Link className='nav-home-link' to='/feed'>
                            <img
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top logo-nav"
                                alt="MY BLOCK SPACE"
                            />
                        </Link>
                        </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='mr-auto'>
                            <InputGroup size="sm">
                                <FormControl
                                    type="text"
                                    placeholder="Search for friends"
                                    onChange={e => this.handleChange(e)}
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={e => this.handleKeyPress(e)} >Search</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Nav>
                        <Nav className='justify-content-end"'>
                            <Nav.Link onClick={this.handleSignOut}>
                                Sign-Out
                            </Nav.Link>
                            <Link to={`/${username ? username : null}`}>
                            <img
                                    src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
                                alt=''
                                className="nav-img"
                            />
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default Navigationbar;