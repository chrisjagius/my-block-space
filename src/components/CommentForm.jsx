import React, { Component } from 'react';
import { putFile } from 'blockstack';
// import {  } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Post from '../model/post';
import { Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import cameraIcon from '../assets/camera.svg'
const uuidv4 = require('uuid/v4');

class CommentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newStatus: "",
            newImage: false,
            isLoading: false
        }
    }

    async saveNewStatus() {
        let text = this.state.newStatus.trim();
        if (text.length === 0) { return false };
        let createdAt = Date.now();
        const id = uuidv4();
        const options = { encrypt: false }

        let post = {
            id: id,
            text: text,
            created_at: createdAt,
            image: this.state.newImage,
            imageUrl: this.props.curUserInfo.person.avatarUrl(),
            username: this.props.curUserInfo.username,
            fullName: this.props.curUserInfo.person.name()
        }
        const radiksPost = new Post({
            _id: id,
            username: this.props.curUserInfo.username,
            is_post: false,
            is_repost: false,
            is_comment: true,
            original_post_id: this.props.radiksId,
            original_poster_username: this.props.status.username 
        })
        //TODO: Add comment_cnt++ to original post
        const postInfo = await Post.findById(this.props.radiksId);
        postInfo.update({ comment_cnt: postInfo.attrs.comment_cnt + 1 })
        try {
            await putFile(`post${id}.json`, JSON.stringify(post), options)
            await radiksPost.save()
            await postInfo.save()
        } catch {
            console.log('somehthing went wrong with creating the post please try again')
        }
        //TODO create a callback function to refresh comments after post
        return [this.setState({ isLoading: true, newStatus: "", newImage: false }), this.props.reload()]
    }

    handleNewStatusChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    captureFile = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({ newImage: `data:image/jpeg;base64,${Buffer(reader.result).toString("base64")}` });
        };
    };

    handleNewStatusSubmit(event) {
        event.preventDefault();
        this.saveNewStatus();
    }

    deleteImage = () => {
        this.setState({ newImage: false })
    }

    render() {

        return (
            <div className='comment-form'>
                <div className="new-comment-status">
                    <Row>
                        <Col md={12} xl={12}>
                            {
                                this.state.newImage &&
                                <div className='post-pic-container'>
                                    <Button onClick={this.deleteImage} variant="outline-danger" className='delete-img'>X</Button>
                                    <img alt='' className='post-pic' als='' src={this.state.newImage} />
                                </div>}
                            <InputGroup>
                                <FormControl
                                    as='textarea'
                                    className="input-status-comment"
                                    value={this.state.newStatus}
                                    name='newStatus'
                                    onChange={e => this.handleNewStatusChange(e)}
                                    placeholder="Reply to this post!"
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={3} className='input-btn-wrapper'>
                            <label className="btn btn-outline-secondary">
                                <img alt='' src={cameraIcon} /> <input type="file" onChange={this.captureFile} hidden />
                            </label>
                        </Col>
                        <Col xs={5}></Col>
                        <Col xs={4} className=" input-btn-wrapper">
                            <Button variant="outline-success"
                                className=""
                                onClick={e => this.handleNewStatusSubmit(e)}
                            >
                                POST
                            </Button>
                        </Col>
                    </Row>
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentForm));