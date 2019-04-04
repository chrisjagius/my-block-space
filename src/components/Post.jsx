import React, {Component} from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Options from '../assets/options.svg';
import PostEngagement from './PostEngagement';
import { loadUserData, putFile, getFile } from 'blockstack';
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now: Date.now(),
            fullText: false,
            toggleOptions: false,
            deleted: false,
            isLocal: false,
        }
    }

    parseDate = (time) => {
        const { now } = this.state;
        if (Math.floor((now - time) / (1000 * 60)) < 60) {
            if (Math.floor((now - time) / (1000 * 60)) < 1) {
                return `${Math.floor((now - time) / 1000)} s`
            } else {
                return `${Math.floor((now - time) / (1000 * 60))} m`
            }
        } else if (Math.floor((now - time) / (1000 * 60 * 60)) < 24) {
            return `${Math.floor((now - time) / (1000 * 60 * 60))} h`
        } else if (Math.floor((now - time) / (1000 * 60 * 60 * 24)) < 7) {
            return `${Math.floor((now - time) / (1000 * 60 * 60 * 24))} d`
        } else if (Math.floor((now - time) / (1000 * 60 * 60 * 24)) < 365) {
            return `${Math.floor(Math.floor((now - time) / (1000 * 60 * 60 * 24)) / 7)} w`
        }
    }
    showFulltext = () => {
        this.setState({ fullText: !this.state.fullText})
    }
    isLocal = () => {
        this.setState({isLocal: this.props.status.username === loadUserData().username ? true : false});
    }
    toggleOptions = () => {
        this.setState({toggleOptions: !this.state.toggleOptions})
    }
    handleDelete = () => {
        this.setState({deleted: !this.state.deleted});
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
            this.handleDelete();
        } catch (e) {
            console.log(`We had a problem deleting the post. message: ${e}`)
        }
    }
    componentDidMount() {
        this.isLocal();
        console.log(this.props.radiksId)
    }

    render() {
        const {status} = this.props;
        return (<div>
            {!this.state.deleted && <div className="my-post" >
                <Row className='poster-info-con'>
                    <Col xs={2}>
                        <Link className='post-link' to={`/users/${status.username}`}><img
                            src={status.imageUrl ? status.imageUrl : avatarFallbackImage}
                            alt=''
                            className="post-img"
                        /></Link>
                    </Col>
                    <Col xs={8} className='poster-info'>
                        <Link className='post-link' to={`/users/${status.username}`}>{status.fullName ? status.fullName : status.username}</Link>
                        <span className='post-date'>&nbsp;· {`${this.parseDate(status.created_at)} ago`}</span>
                    </Col>
                    <Col xs={2}>
                    {this.state.isLocal && <Col xs={{ span: 3, offset: 4 }}>
                        <img className='post-icon' onClick={this.toggleOptions} src={Options} alt='options' />
                        {this.state.toggleOptions && <Dropdown.Menu show>
                            <Dropdown.Item onClick={this.deletePost}>Delete post</Dropdown.Item>
                        </Dropdown.Menu>}
                    </Col>}
                    </Col>
                    <Col xs={0}></Col>
                </Row>
                <hr />
                { status.image &&
                    <div className='post-pic-container'>
                        <img alt='' className='post-pic' src={status.image} />
                        <hr />
                    </div>
                }
                {!this.state.fullText && (status.text.length > 500 ? (<pre>{status.text.substring(0, 500)}...<br/><strong className='show-more' onClick={this.showFulltext}>show more</strong></pre>) : <pre>{status.text}</pre>)}

                {this.state.fullText && <pre>{status.text} <br /><strong className='show-more' onClick={this.showFulltext}>show less</strong></pre>}
                
                <PostEngagement status={status} deleted={this.handleDelete} radiksId={this.props.radiksId}/>
            </div>}</div>
        )
    }
}