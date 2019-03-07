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
    loadMore = async () => {
        let posts = {...this.state.posts}
        let i = this.state.counter;
        while (i < this.state.counter + 3 && i < this.props.order.length) {
            let id = this.props.order[i]
            let username = this.props.postIdAndName[id]
            const options = { username: username, decrypt: false }
            let file = await getFile(`post${id}.json`, options);
            try {
                let post = JSON.parse(file)
                posts[id] = <Post person={this.props.person} username={username} status={post} key={post.created_at} />
                i++
            } catch {
                console.log(`Something went wrong with fetshing post ${id}. message: ${file}`)
            }
        }
        return this.setState({ posts: posts, counter: i, loadPost: false })
    }

    // Here I fetch the person and post - I need the username and postid to do this I get this as postIdAndName I also need an array with ids(aka timestamps) for the order
    loadFeed = async () => {
        let posts = { ...this.state.posts };
        let i = this.state.counter
        while (i < this.state.counter + 6 && i < this.props.order.length) {
            let id = this.props.order[i];
            let username = this.props.postIdAndName[id];
            let profile = await lookupProfile(username);
            let person = await new Person(profile);
            const options = { username: username, decrypt: false }
            let file = await getFile(`post${id}.json`, options)
            try {
                let post = JSON.parse(file)
                posts[id] = <Post person={person} username={username} status={post} key={post.created_at} />
                i++
            } catch {
                console.log(`Something went wrong with fetching post ${id}. message: ${file}`)
            }
        }
        return this.setState({ posts: posts, counter: i, loadPost: false })
    }

    // detect if user scrolled to bottom of the page
    handleScroll = () => {
        if (this.props.order.length - 1 > this.state.counter && !this.state.loadPost) {
            var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
            var clientHeight = document.documentElement.clientHeight || window.innerHeight;
            var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
            if (scrolledToBottom) {
                this.setState({ loadPost: true })
                if (!this.props.feed) {
                    this.loadMore()
                } else {
                    this.loadFeed();
                }
            }
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        // check if props posts are loaded, then trigger first fetch for posts
        if (this.props.doneLoading === true && this.state.counter === 0 && !this.state.first) {
            this.setState({ loadPost: true, first: true })
            if (this.props.feed) {
                this.loadFeed();
            } else {
                this.loadMore();
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleOnScroll);
    }

    render() {
        
        return(
            <div className='infinite-list'>
                {this.props.order.map(index => {return this.state.posts[index]})}
                {this.state.loadPost && <div className='feed-loader'></div>}
            </div>
        )
    }
}