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
                <p>Create, Follow, and Share. You always decide with who. </p>
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
                                            <img src={freeSpeech} alt='free speech icon' />
                                            <hr/>
                                            <p>Take a stand against government surveillance or companies using your social media data without your consent. You decide what you share and with who you share it.</p>
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
                                            <img src={privacy} alt='privacy-icon' />
                                            <hr />
                                            <p>We use Blockstack’s decentralized identity and storage system, giving you total ownership of your data. You control who can access your data, not us.</p>
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
                                            <img src={tracking} alt='no tracking icon' />
                                            <hr/>
                                            <p>My Block Space is an open source project created by the community for the community. The goal is to make an easy to use social platform for free where the user is <strong>not</strong> the product.</p>
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
