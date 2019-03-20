import React, { Component } from 'react';
import { getFile } from 'blockstack';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import InfiniteScroll from './InfiniteScroll';
import { mergeSort } from '../utils/reverseMergeSort.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Feed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allPosts: {},
            isLoading: false,
            order: [],
            noPosts: false,
            counter: 0,
            doneLoading: false
        }
    }

    // here I call the fetch functions, if counter === friends.length, stop calling fetch functions and setState
    fetchPostsFromFriends = () => {
        let postIdAndName = this.state.allPosts;
        let postids = this.state.order;
        let counter = this.state.counter;
        let friends = this.props.curUserInfo.friends;
        if (counter < friends.length) {
            const options = { username: friends[counter], decrypt: false }
            this.getPostIds(options, postids, postIdAndName, friends[counter])
        } else {
            this.setState({ order: mergeSort(this.state.order), isLoading: false, noPosts: postids.length === 0 ? true : false, doneLoading: true});
        }
    }

    // here I fetch the postids from a username, then call the fetchPostsfromFriends again till counter === friends.length
    getPostIds = async(options, postids, postIdAndName, username) => {
        let resp = await getFile('postids.json', options)
        try {
            let file = JSON.parse(resp || '[]');
            this.setState({ counter: this.state.counter + 1 })
            if (file.length > 0) {
                this.concatPostIds(file, postids)
                this.connectIdWithName(file, postIdAndName, username)
                this.fetchPostsFromFriends()
            } else {
                this.fetchPostsFromFriends()
            }
        } catch (e) {
            console.log(`can't fetch postids. message: ${e}`)
        }
    }

    // add post ids to existing array with prev postids
    concatPostIds = (postId, postids) => {
        this.setState({ order: [...postids, ...postId]})
    }

    // connectPostId with username for quick loop-up in the infinite scroll component
    connectIdWithName = (postId, postIdAndName, username) => {
        let result = postIdAndName;
        if (postId.length > 0) {
            // here I will have to add the postid into the postIdAndName object with a loop
            for (let i = 0; i < postId.length; i++) {
                result[`${postId[i]}`] = username;
            }
        }
        return this.setState({allPosts: result})
    }

    componentDidMount() {
        this.setState({isLoading: true})
        this.fetchPostsFromFriends()
    }
    

    render() {
        let now = ((100 / parseInt(this.props.curUserInfo.friends.length)) * parseInt(this.state.counter)).toFixed(2);

        return (
            <div className='feed-container'>
                <Row>
                    <Col md={1} xl={2}></Col>
                    <Col sm={12} md={10} xl={8}>
                        {this.state.isLoading && <div><ProgressBar className='prog-bar' striped variant="success" now={now} /><p>Loaded {this.state.counter} of {this.props.curUserInfo.friends.length} friends.</p></div>}
                        {this.state.noPosts && !this.state.isLoading && <h1>Oepsie, you have no posts in your timeline yet</h1>}
                        {!this.state.noPosts && !this.state.isLoading && 
                            <InfiniteScroll feed={true} order={this.state.order} postIdAndName={this.state.allPosts} doneLoading={this.state.doneLoading} />
                        }
                    </Col>
                    <Col md={1} xl={2}></Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch);

const mapStateToProps = (state) => {
    return ({
        curUserInfo: state.curuserInfo
    })
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Feed));