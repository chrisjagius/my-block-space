import React, { Component } from 'react';
import Post from './Post';
import { getFile } from 'blockstack';


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

    // Here I fetch the post - I need the username and postid to do this I get this as postIdAndName I also need an array with ids(aka timestamps) for the order
    loadFeed = async () => {
        let posts = { ...this.state.posts };
        let i = this.state.counter
        while (i < this.state.counter + 6 && i < this.props.order.length) {
            let id = this.props.order[i];
            let username = this.props.postIdAndName[id][0];
            let realId = this.props.postIdAndName[id][1];
            const options = { username: username, decrypt: false }
            let file = await getFile(`post${realId}.json`, options)
            try {
                let post = JSON.parse(file)
                if (post.id) { posts[id] = <Post status={post} key={realId} radiksId={realId}/>}
                i++
            } catch {
                i++
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
                this.loadFeed();
            }
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        // check if props posts are loaded, then trigger first fetch for posts
        if (this.props.doneLoading === true && this.state.counter === 0 && !this.state.first) {
            this.setState({ loadPost: true, first: true })
            this.loadFeed();
        }
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleOnScroll);
    }

    render() {
        
        return(
            <div className='infinite-list'>
                {this.props.order.map(index => {return this.state.posts[index]})}
                {this.state.loadPost && <div className='feed-loader'><div className='hollowLoader'>
                    <div className='largeBox'></div>
                    <div className='smallBox'></div>
                </div></div>}
            </div>
        )
    }
}