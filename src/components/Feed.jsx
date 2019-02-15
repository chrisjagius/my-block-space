import React, { Component } from 'react';
import { Person, lookupProfile, getFile } from 'blockstack';
import Post from './Post';
import Loader from './Loader';
import { Row, Col } from 'react-bootstrap';

export default class Feed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allPosts: [],
            isLoading: false,
            order: [],
            noFriends: false
        }
    }

    fetchPostsFromFriends = () => {
        this.setState({isLoading: true})
        const { friends } = this.props;
        if (friends.length === 0) { return this.setState({ noFriends: true, isLoading: false})}
        let unsortedPosts = {};
        let keyCreatedAt = []
        friends.forEach(async (username) => {
            let person = await lookupProfile(username)
                .then((profile) => {
                    return new Person(profile)
                })
                .catch((error) => {
                    console.log('could not resolve profile')
                })

            const options = { username: username, decrypt: false }
            getFile('statuses.json', options)
                .then((file) => {
                    var statuses = JSON.parse(file || '[]')
                    if (statuses.length > 0) {
                        statuses.forEach((status) => {
                            keyCreatedAt.push(status.created_at)
                            unsortedPosts[status.created_at] =  <Post person={person} username={username} status={status} />
                        })
                    }
                })
                .catch((error) => {
                    console.log('fail')
                })
                .finally(async () => {
                    console.log(username, ' and ', friends[friends.length - 1])
                    if (username === friends[friends.length - 1]) {
                        let result = await this.mergeSort(keyCreatedAt)
                        this.setState({ 
                            allPosts: unsortedPosts, 
                            order: result, 
                            isLoading: false,
                            noFriends: false
                        })
                    }
                })
        })
    }
    mergeSort = (array) => {
        if (array.length === 1) {
            return array
        }
        // Split Array in into right and left
        const length = array.length;
        const middle = Math.floor(length / 2)
        const left = array.slice(0, middle)
        const right = array.slice(middle)

        return this.merge(
            this.mergeSort(left),
            this.mergeSort(right)
        )
    }

    merge = (left, right) => {
        const result = [];
        let leftIndex = 0;
        let rightIndex = 0;
        while (leftIndex < left.length &&
            rightIndex < right.length) {
            if (left[leftIndex] > right[rightIndex]) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++
            }
        }
        return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }

    componentDidMount() {
        this.fetchPostsFromFriends()
    }
    componentWillReceiveProps() {
        this.fetchPostsFromFriends()
    }

    render() {
        

        return (
            <div className='feed-container'>
                <Row>
                    <Col xs={1} md={2}></Col>
                    <Col xs={10} md={8}>
                        {this.state.isLoading && <Loader />}
                        {this.state.noFriends && <h1>Oepsie, you have no frinds yet</h1>}
                        {!this.state.noFriends && !this.state.isLoading && this.state.order.map((index) => this.state.allPosts[index])}
                    </Col>
                    <Col xs={1} md={2}></Col>
                </Row>
            </div>
        )
    }
}