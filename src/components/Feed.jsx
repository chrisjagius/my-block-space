import React, { Component } from 'react';
import { Person, lookupProfile, getFile } from 'blockstack';
import Post from './Post';
import Loader from './Loader';
import { Row, Col } from 'react-bootstrap';
import InfiniteScroll from './InfiniteScroll';
import { mergeSort } from '../utils/reverseMergeSort.js';

export default class Feed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allPosts: [],
            isLoading: false,
            order: [],
            noPosts: false
        }
    }

    fetchPostsFromFriends = () => {
        this.setState({isLoading: true})
        const { friends } = this.props;
        let unsortedPosts = {};
        let keyCreatedAt = []
        friends.forEach(async (username, index) => {
            let person = await lookupProfile(username)
                .then((profile) => {
                    return new Person(profile)
                })
                .catch((error) => {
                    console.log('could not resolve profile')
                })

            const options = { username: username, decrypt: false }

            getFile('postids.json', options)
            .then((file) => {
                let postIds = JSON.parse(file || '[]')
                if (postIds.length > 0) {
                    postIds.forEach((id, indexTwo) => {
                        getFile(`post${id}.json`, options)
                            .then((file) => {
                                let post = JSON.parse(file)
                                keyCreatedAt.push(id)
                                unsortedPosts[id] = <Post person={person} username={username} status={post} key={post.created_at} />
                                
                            })
                    })
                }
            })
            .catch((error) => {
                console.log('fail')
            })
            .finally(() => {
                setTimeout(() => { if (index === friends.length - 1) {
                    this.setState({
                        allPosts: unsortedPosts,
                        order: mergeSort(keyCreatedAt),
                        isLoading: false,
                        noPosts: unsortedPosts.length === 0 ? true : false
                    })
                }
                }, 1000)
            })
            
        })
    }

    componentDidMount() {
        this.fetchPostsFromFriends()
    }
    

    render() {
        

        return (
            <div className='feed-container'>
                <Row>
                    <Col md={1} xl={2}></Col>
                    <Col sm={12} md={10} xl={8}>
                        {this.state.isLoading && <Loader />}
                        {this.state.noPosts && !this.state.isLoading && <h1>Oepsie, you have no posts in your timeline yet</h1>}
                        {!this.state.noPosts && !this.state.isLoading && 
                        <InfiniteScroll array={false} order={this.state.order} allPosts={this.state.allPosts} />}
                    </Col>
                    <Col md={1} xl={2}></Col>
                </Row>
            </div>
        )
    }
}