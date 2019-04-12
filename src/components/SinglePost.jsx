import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    getFile,
} from 'blockstack';
import { Row, Col } from 'react-bootstrap';
import Loader from './Loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Post from './Post';
import Comments from './Comments';
import _ from 'lodash';

class SinglePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postLoaded: false,
            post: {}
        };
    }

    fetchPost = async() => {
        this.setState({postLoaded: false})
        const options = { username: this.props.match.params.username, decrypt: false }
        const file = await getFile(`post${this.props.match.params.postId}.json`, options);
        const post = JSON.parse(file)
        return this.setState({
            post,
            postLoaded: true
        })
    }

    async componentDidMount() {
        this.fetchPost()
    }

    render() {
        const radiksId = this.props.match.params.postId;
        return (
            <div className='feed-container'>   
                {this.state.postLoaded && 
                <div>
                    <Row>
                        <Col md={1} xl={2}></Col>
                            <Col sm={12} md={10} xl={8}>
                            <Post status={this.state.post} key={radiksId} radiksId={radiksId} reload={this.fetchPost} />
                            <Comments radiksId={radiksId} status={this.state.post} reload={this.fetchPost} />
                            </Col>
                        <Col md={1} xl={2}></Col>
                    </Row>
                </div>
                }
                {!this.state.postLoaded && <Loader/>}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

const mapStateToProps = (state) => {
    return ({
        curUserInfo: state.curuserInfo
    })
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SinglePost));