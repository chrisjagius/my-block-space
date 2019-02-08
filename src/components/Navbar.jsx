import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import {signUserOut} from 'blockstack';
import { Link } from 'react-router-dom';


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
    handleKeyPress = (e) => {
        e.preventDefault();
        this.props.searchFor(this.state.searchUser);
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
        const { person, username } = this.props;
        
        return (
            <div>
                <Navbar bg="light" collapseOnSelect fixed="top" expand="sm" >
                        <Navbar.Brand>
                            My Block Space
                        </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='mr-auto'>

                            {/* <Form onSubmit={e => this.handleKeyPress(e)}>
                                <FormControl style={formStyle} type="text" value={this.state.searchUser} placeholder="Search for friends" 
                                    onChange={e => this.handleChange(e)}
                                />
                            </Form> */}

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
                                src={person.avatarUrl()}
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