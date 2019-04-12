import React, { Component } from 'react';
import { getFile } from 'blockstack';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import InfiniteScroll from './InfiniteScroll';
import { mergeSort } from '../utils/reverseMergeSort.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Post from '../model/post';
import CommentForm from './CommentForm';

class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            postIds: [],
            postIdAndName: {}
        }
    }

    fetchCommentsForCurPost = async () => {
        this.setState({ isLoading: true, postIds: [] })
        let postTimes = [];
        let postIdAndName = {}
        try {
            const comments = await Post.fetchList({ is_comment: true, original_post_id: this.props.radiksId }, { decrypt: true });
            if (comments.length > 0) {
                for (let i = 0; i < comments.length; i++) {
                    postIdAndName[`${comments[i].attrs.createdAt}`] = [comments[i].attrs.username, comments[i]._id];
                    postTimes.push(comments[i].attrs.createdAt)
                }
            }
        } catch {
            // console.log('oepsie, could not fetch data')
        }
        return this.setState({
            isLoading: false,
            postIds: mergeSort(postTimes),
            postIdAndName: postIdAndName
        });
    }

    async componentDidMount() {
        this.fetchCommentsForCurPost()
    }


    render() {

        return (
            <div className='comments-container'>
                <CommentForm radiksId={this.props.radiksId} status={this.props.status} reload={this.props.reload} />
                {this.state.isLoading && <span>Loading...</span>}
                {!this.state.isLoading && this.state.postIds.length > 0 && <InfiniteScroll feed={false} order={this.state.postIds} postIdAndName={this.state.postIdAndName} doneLoading={true} />
                }
                {this.state.postIds.length === 0 && <h1>This Post has no comments yet</h1>}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Comments));