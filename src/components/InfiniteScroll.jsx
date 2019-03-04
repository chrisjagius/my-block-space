import React, { Component } from 'react';
import Post from './Post';
import { getFile, lookupProfile, Person } from 'blockstack';


export default class InfiniteScroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: {},
            counter: 0,
            loadPost: false,
            first: false
        }
    }
    // Here I fetch the post from the this.props.username - I need the username and postid to do this I get this as postIdAndName I also need an array with ids(aka timestamps) for the order
    loadMore = () => {
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

    // Here I fetch the person and post - I need the username and postid to do this I get this as postIdAndName I also need an array with ids(aka timestamps) for the order
    loadFeed = () => {
        let posts = { ...this.state.posts }
        for (let i = this.state.counter; i < this.state.counter + 4; i++) {
            let id = this.props.order[i]
            let username = this.props.postIdAndName[id]
            let person;
            const options = { username: username, decrypt: false }
            lookupProfile(username)
            .then((profile) => {
                person = new Person(profile);
            })
            .then(() => {
                getFile(`post${id}.json`, options)
                    .then((file) => {
                        let post = JSON.parse(file)
                        return <Post person={person} username={username} status={post} key={post.created_at} />
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
            })
        }
    }

    // detect if user scrolled to bottom of the page
    handleScroll = () => {
        if (this.props.order.length - 1 > this.state.counter && !this.state.loadPost) {
            var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
            var clientHeight = document.documentElement.clientHeight || window.innerHeight;
            var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
            if (scrolledToBottom) {
                if (!this.props.array) {
                    this.loadMore()
                    this.setState({ loadPost: true })
                } else {
                    this.loadFeed();
                    this.setState({ loadPost: true })
                }
            }
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleOnScroll);
    }

    render() {
        // check if props posts are loaded, then trigger first fetch for posts
        if (this.props.doneLoading === true && this.state.counter === 0 && !this.state.first) {
            if (this.props.array) {
                this.loadFeed();
                this.setState({ loadPost: true, first: true })
            } else {
                this.loadMore();
                this.setState({ loadPost: true, first: true })
            }
        }
        
        return(
            <div className='infinite-list'>
                {this.props.order.map(index => {return this.state.posts[index]})}
                {this.state.loadPost && <div className='feed-loader'></div>}
            </div>
        )
    }
}