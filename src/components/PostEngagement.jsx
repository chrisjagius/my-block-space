import React, {Component} from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import Comment from '../assets/comment.svg';
import Options from '../assets/options.svg';
import { loadUserData, putFile, getFile } from 'blockstack';
import HeartEngagement from './HeartEngagement';


export default class PostEngagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLocal: false,
            toggleOptions: false
        }
    }

    isLocal = () => {
        this.setState({isLocal: this.props.status.username === loadUserData().username ? true : false});
    }
    toggleOptions = () => {
        this.setState({toggleOptions: !this.state.toggleOptions})
    }
    componentDidMount() {
        this.isLocal();
    }

    render() {
        return (
        <div className='post-engagement-con'>
            <Row >
                <Col xs={5}>
                    <Row >
                        <Col xs={{ span: 2, offset: 1 }}>
                            <HeartEngagement />
                        </Col>
                        <Col xs={2}><img className='post-icon' src={Comment} alt='comment' />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>)
    }
}