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
        this.setState({isLocal: this.props.username === loadUserData().username ? true : false});
    }

    deletePost = async () => {
        const { status } = this.props;
        const optionsSend = { encrypt: false }
        const optionsReceive = { decrypt: false }
        await putFile(`post${status.created_at}.json`, '', optionsSend);
        let file = await getFile('postids.json', optionsReceive)
        try {
            file = JSON.parse(file);
            file = file.filter(postId => postId !== status.created_at);
            await putFile('postids.json', JSON.stringify(file), optionsSend)
            this.setState({deleted: true});
        } catch (e) {
            console.log(`We had a problem deleting the post. message: ${e}`)
        }
    }
    toggleOptions = () => {
        this.setState({toggleOptions: !this.state.toggleOptions})
    }

    componentDidMount() {
        this.isLocal();
    }

    render() {
        return (
        <div>
            <Row >
                <Col xs={4}>
                    <Row >
                        <Col  xs={2}>
                            <HeartEngagement />
                        </Col>
                        <Col xs={2}><img className='post-icon' src={Comment} alt='comment' /></Col>
                    </Row>
                </Col>
                {this.state.isLocal && <Col xs={{ span: 4, offset: 4 }}>
                    <img className='post-icon' onClick={this.toggleOptions} src={Options} alt='options' />
                    {this.state.toggleOptions && <Dropdown.Menu show>
                        <Dropdown.Item onClick={this.deletePost}>Delete post</Dropdown.Item>
                    </Dropdown.Menu>}
                </Col>}
            </Row>
        </div>)
    }
}