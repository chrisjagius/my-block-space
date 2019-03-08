import React, {Component} from 'react';
// import styled from 'styled-components';
import like from '../assets/like.svg';
import likeFull from '../assets/like-full.svg';

//I deletedd the style elements because I gave the img tag the same classname ass the other image tags that hold an icon in PostEngagement.jsx

export default class HeartEngagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false
        }
    }

    handleLike = () => {
        this.setState({liked: !this.state.liked});
    }

    render() {
        return (
            <img className='post-icon' src={!this.state.liked ? like : likeFull} alt='like' onClick={this.handleLike}/>
        )
    }
}