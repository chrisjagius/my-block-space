import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import logo from '../assets/2.png';
import freeSpeech from '../assets/free-speech-icon.svg';
import privacy from '../assets/privacy-icon.svg';
import tracking from '../assets/tracking-icon.svg'

export default class Signin extends Component {
    

    render() {
        const { handleSignIn } = this.props;

        return (
            <div className="panel-landing">
                <div className='landing-container'>
                <div className='landing-logo-container'>
                    <img className='landing-logo' src={logo} alt='logo' />
                </div>
                <h1>The Decentralized Social Network</h1>
                </div>
                <div className='landing-square-container'>
                    <div className='square-container'>
                        <div className='landing-square-text'>
                            <Button
                                className='signin-button'
                                onClick={handleSignIn.bind(this)}
                            >
                                Sign In with Blockstack
                        </Button>
                        </div>
                        <div className='landing-square'>

                        </div>
                    </div>
                </div>
                <div className='card-container-back'>
                <Container className='card-container'>
                    <Row>
                        <Col md={12} lg={4}>
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                            <img src={freeSpeech} alt='free speech icon' />
                                            <span>Free Speech</span>
                                    </div>
                                    <div className="flip-card-back">
                                        <p>NO Service Fee</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={12} lg={4}>
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={privacy} alt='privacy-icon' />
                                            <span>You own your data</span>
                                    </div>
                                    <div className="flip-card-back">
                                        <p>NO Service Fee</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={12} lg={4}>
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={tracking} alt='no tracking icon' />
                                            <span>No tracking</span>
                                    </div>
                                    <div className="flip-card-back">
                                        <p>NO Service Fee</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                </div>
            </div>
        );
    }
}
