import React, { Component } from 'react';


export default class InfiniteScroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    addFromArray = () => {
        
    }

    addFromObject = () => {
        
    }

    componentDidMount() {
        
    }
    componentWillReceiveProps() {
    }

    render() {
        
        
        return(
            <div className='infinite-list'>
                {this.props.order.map(index => {return this.props.allPosts[index]})}
            </div>
        )
    }
}