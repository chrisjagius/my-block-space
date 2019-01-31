import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import {signUserOut} from 'blockstack';

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
    // this is a work in progress
    handleSearch = (event) => {
        
    }
    handleKeyPress = (target) => {
        if (target.charCode == 13) {
        this.props.searchFor(this.state.searchUser);
    }

    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            searchUser: event.target.value
        })
    }


    render() {
        const formStyle = {
            'borderRadius': '30px',
            'border': 'solid 1px #f3f3f3ff',
            'height': '1.5em'
        }
        
        return (
            <div>
                <Navbar bg="dark" collapseOnSelect sticky="top" expand="sm" >
                        <Navbar.Brand>
                            My Block Space
                        </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='mr-auto'>
                            <Form >
                                <FormControl style={formStyle} type="text" placeholder="Search for friends"
                                    onChange={this.handleChange}
                                    onKeyPress={this.handleKeyPress}
                                />
                            </Form>
                        </Nav>
                        <Nav className='justify-content-end"'>
                            <Nav.Link onClick={this.handleSignOut}>
                                Sign-Out
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default Navigationbar;