import React, { Component } from 'react';
import { putFile } from 'blockstack';
// import {  } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Post from '../model/post';

class CommentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    createComment = async () => {
        
    }

    render() {

        return (
            <div className='comment-form'>
                    <p>this is where the form will be</p>
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