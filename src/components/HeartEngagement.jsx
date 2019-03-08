import React, {Component} from 'react';
import styled from 'styled-components';
import like from '../assets/like.svg'

const Like = styled.div`
    margin-top: 5px;
    margin-left: 3px;
    &:hover {
        fill: red;
        fill-opacity: 1;
    }
`
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
        let likedButton;
        if (this.state.liked) {
            likedButton = <svg xmlns="http://www.w3.org/2000/svg"
                            width="20" 
                            height="20"
                            viewBox="0 0 492.719 492.719">
                            <path d="M492.719,166.008c0-73.486-59.573-133.056-133.059-133.056c-47.985,
                            0-89.891,25.484-113.302,63.569 c-23.408-38.085-65.332-63.569-113.316-63.569C59.556,
                            32.952,0,92.522,0,166.008c0,40.009,17.729,75.803,45.671,100.178
                            l188.545,188.553c3.22,3.22,7.587,5.029,12.142,5.029c4.555,0,8.922-1.809,
                            12.142-5.029l188.545-188.553
                            C474.988,241.811,492.719,206.017,492.719,166.008z"/>
                        </svg>
        
        } else {
            likedButton = <svg xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20"
                            viewBox="0 0 471.701 471.701">
        
                            <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
                                c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
                                l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
                                C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
                                s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
                                c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
                                C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                        </svg>
        }

        return (
                <Like onClick={this.handleLike}>
                    {likedButton}
                </Like>
        )
    }
}