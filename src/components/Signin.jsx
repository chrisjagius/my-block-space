import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class Signin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { handleSignIn } = this.props;
        

        return (
            <div className="panel-landing">
                <div className='blockstack-box'>
                    <h2>Wlecome to My Block Space</h2>
                    <hr />
                    <Button
                        bsStyle="info"
                        onClick={handleSignIn.bind(this)}
                    >
                        Sign In with Blockstack
                    </Button>
                </div>;
            </div>
        );
    }
}
