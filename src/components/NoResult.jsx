import React, { Component } from 'react';

export default class NoResult extends Component {
    

    render() {
        return (
            <div className='no-res-container'>
                <p>Oopsie... <br /> We can't find the blockstack id <big>"{this.props.username}"</big>.</p>
                
            </div>
        )
    }
}