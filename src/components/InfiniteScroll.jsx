import React, { Component } from 'react';
import Post from './Post';
import { getFile } from 'blockstack';


export default class InfiniteScroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: {},
            counter: 0,
            loadPost: false
        }
    }

    loadMore = () => {
        if (this.props.array) {return false}
        let posts = {...this.state.posts}
        for (let i = this.state.counter; i < this.state.counter + 2; i++) {
            let id = this.props.order[i]
            const options = { username: this.props.postIdAndName[id], decrypt: false }
            getFile(`post${id}.json`, options)
                .then((file) => {
                    let post = JSON.parse(file)
                    return <Post person={this.props.person} username={this.props.username} status={post} key={post.created_at} />
                })
                .then((post) => {
                    posts[id] = post;
                })
                .then(() => {
                    if (i === this.state.counter + 1) {
                        this.setState({
                            posts: posts,
                            counter: (i),
                            loadPost: false
                        })
                    }
                })
                .catch(() => {
                    this.setState({
                        posts: posts,
                        counter: (i - 1),
                        loadPost: false
                    })
                })
        }
    }
    loadFeed = () => {

    }
    handleScroll = () => {
        if (this.props.order.length - 1 > this.state.counter && !this.state.loadPost) {
            var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
            var clientHeight = document.documentElement.clientHeight || window.innerHeight;
            var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

            if (scrolledToBottom && !this.props.array) {
                this.loadMore();
                this.setState({ loadPost: true })
            }
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('load', (() => {
            setTimeout(() => {
                this.loadMore();
                this.setState({ loadPost: true })
            }, 300);
        })) 
        
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleOnScroll);
        window.removeEventListener('load', (() => {
            setTimeout(() => {
                this.loadMore();
            }, 300);
        })) 
    }

    render() {
        
        return(
            <div className='infinite-list'>
                {this.props.array && this.props.order.map(index => {return this.props.allPosts[index]})}
                {!this.props.array && this.props.order.map(index => {return this.state.posts[index]})}
                {this.state.loadPost && <div className='feed-loader'></div>}
            </div>
        )
    }
}