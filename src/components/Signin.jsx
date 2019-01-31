import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class Signin extends Component {
    

    render() {
        const { handleSignIn } = this.props;
        const buttonStyle = {
            color: 'rgb(8, 5, 5)',
            backgroundColor: '#f3f3f3ff'
        }

        return (
            <div className="panel-landing">
                <h1>Blockspace</h1>
                <h2>You own Your data</h2>
                
                <div className='square-container'>
                    <div className='landing-square-text'>
                        <Button
                            style={buttonStyle}
                            onClick={handleSignIn.bind(this)}
                        >
                            Sign In with Blockstack
                </Button>
                    </div>
                    <div className='landing-square'>

                    </div>
                </div>
                
            </div>
        );
    }
}
