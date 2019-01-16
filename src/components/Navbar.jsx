import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import {signUserOut} from 'blockstack';

class Navigationbar extends Component {
    constructor() {
        super()

    }

    handleSignOut = (event) => {
        event.preventDefault();
        signUserOut(window.location.href)
    }


    render() {

        return (
            <div>
                <Navbar inverse staticTop={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            My Block Space
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem onClick={this.handleSignOut}>
                            Sign-Out
                        </NavItem>
                    </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default Navigationbar;