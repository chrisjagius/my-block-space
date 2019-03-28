import React, { Component } from 'react';

export default class Loader extends Component {

    render() {
        return (<div className="container-myprofile"><div className='loader'>
            <div className='hollowLoader'>
                <div className='largeBox'></div>
                <div className='smallBox'></div>
        </div>
        </div></div>)
    }
    
}