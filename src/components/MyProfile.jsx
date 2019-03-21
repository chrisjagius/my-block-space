import React, { Component } from 'react';
import {
    loadUserData,
    getFile,
    putFile,
} from 'blockstack';
import { Row, Col, ListGroup, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import backPic from '../assets/standard-wallpaper.jpg';
import settingsIcon from '../assets/settings.svg';
import cameraIcon from '../assets/camera.svg';
import usersIcon from '../assets/users.svg';
import UserInfo from './UserInfo';
import InfiniteScroll from './InfiniteScroll';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { currentUserInformation, addToCurrentUserPosts } from '../actions';
import { withRouter } from 'react-router-dom';


class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newStatus: "",
            isLoading: false,
            changeInfo: false,
            newImage: false,
            settings: {
                backgroundImage: false,
            },
            displayFriends: false
        };
        this.handleNewStatusChange = this.handleNewStatusChange.bind(this);
        this.handleNewStatusSubmit = this.handleNewStatusSubmit.bind(this);
        this.saveNewStatus = this.saveNewStatus.bind(this);
    }

    isLocal = () => {
        return this.props.match.params.username === loadUserData().username ? true : false;
    }

    fetchData = async () => {
        console.log('fetch data is called')
        let postIds;
        let postIdAndName = {}
        const options = { decrypt: false }
        let settings = await this.fetchSettings();
        let file = await getFile('postids.json', options)
        try {
            postIds = JSON.parse(file || '[]')
            if (postIds.length > 0) {
                for (let i = 0; i < postIds.length; i++) {
                    postIdAndName[`${postIds[i]}`] = this.props.curUserInfo.username;
                }
            }
        } catch (e) {
            console.log(`Couldn't fetch postids. message: ${e}`)
        } 
        return [this.props.addToCurrentUserPosts(postIds, postIdAndName) ,this.setState({
            isLoading: false,
            settings: settings
        })];
    }
    fetchSettings = () => {
        const options = { decrypt: false }
        return getFile('settings.json', options)
            .then((file) => {
                let settings = JSON.parse(file || false)
                return settings ? settings : this.state.settings
            })
    }

    saveNewStatus() {
        let postIds = this.props.curUserOwnPosts.postIDs;
        let text = this.state.newStatus.trim();
        if (text.length === 0) {return false};
        let createdAt = Date.now();
        let idNumber = postIds.length

        let post = {
            id: idNumber++,
            text: text,
            created_at: createdAt,
            image: this.state.newImage,
            imageUrl: this.props.curUserInfo.person.avatarUrl(),
            username: this.props.curUserInfo.username
        }
        postIds.unshift(createdAt);
        const options = {encrypt: false }
        putFile(`post${createdAt}.json`, JSON.stringify(post), options)
        .then((resp) => {
            console.log(resp)
            putFile('postids.json', JSON.stringify(postIds), options)
            .then(() => {
                this.setState({
                    isLoading: true
                })
                this.fetchData()
            })
            .catch(() => {
                console.log('something went wrong with saving your post id')
            })
        })
        .catch(() => {
            console.log('something went wrong with saving your post')
        })
    }

    handleNewStatusChange(event) {
        this.setState({ newStatus: event.target.value })
    }
    captureFile = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({newImage: `data:image/jpeg;base64,${Buffer(reader.result).toString("base64")}`});
        };
    };
    captureFileBackground = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({ 
                settings: {
                    backgroundImage: `data:image/jpeg;base64,${Buffer(reader.result).toString("base64")}`
                }
            });
        };
    }
    defaultBackground = (event) => {
        event.preventDefault();
        this.setState({
            settings: {
                backgroundImage: false
            }
        })
    }

    handleNewStatusSubmit(event) {
        this.saveNewStatus()
        this.setState({
            newStatus: "",
            newImage: false
        })
    }
    deleteImage = () => {
        this.setState({ newImage: false})
    }

    componentDidMount() {
        if (!this.props.curUserOwnPosts.loaded) { this.fetchData()};
    }

    logUserInfo = () => {
        console.log(loadUserData());
    }
    toggleSettings = () => {
        this.setState({changeInfo: !this.state.changeInfo})
    }
    saveSettings = () => {
        let settings = this.state.settings

        const options = { encrypt: false }
        putFile('settings.json', JSON.stringify(settings), options)
        .then(() => {
            this.setState({
                changeInfo: false
            })
        })
    }
    displayFriends = () => {
        this.setState({displayFriends: !this.state.displayFriends})
    }

    render() {
        const { person, username, friends } = this.props.curUserInfo;
        const backgroundStyle = {
            'backgroundImage': `url("${this.state.settings.backgroundImage ? this.state.settings.backgroundImage : backPic}"`
        }
        const settingsForm = (<div className="new-status settings">
            <Row>
                <Col md={12}>
                    <Form>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="12">
                                To change the display name, image or bio press <a target='_blank' href='https://browser.blockstack.org/profiles' rel="noopener noreferrer" >here</a>.
                            </Form.Label>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Background image
                            </Form.Label>
                            <Col sm="9">
                                <label className="btn btn-outline-success">
                                    Upload <input type="file" onChange={this.captureFileBackground} hidden />
                                </label>
                                {'     '}
                                <label className="btn btn-outline-danger" onClick={this.defaultBackground}>
                                    Default
                                </label>
                            </Col>
                        </Form.Group>
                        <hr />
                        <Button variant="success" onClick={this.saveSettings}>
                            Save
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>);
        const friendDisplay = friends.length > 0 ? (<div className='profile-posts'>
            <div className="my-post"><h1>Friends</h1>
            <ListGroup variant="flush">
            {friends.map((friend) => (
                <div className="my-friend" key={friend}>
                    <Row>
                        <Col xs={12}>
                            <ListGroup.Item onClick={() => { this.props.searchFor(friend) }}>{friend}</ListGroup.Item>
                        </Col>
                    </Row>
                </div>
            )
                    )}</ListGroup></div>
        </div>) : (
                <div className='profile-posts'>
                    <div className="my-post"><h1>Friends</h1>
                        <ListGroup variant="flush">
                            <Row>
                                <Col xs={12}>
                                <ListGroup.Item>You don't have any friends yet.</ListGroup.Item>
                                </Col>
                            </Row>
                        </ListGroup>
                    </div>
                </div>);
        return (
            <div>
            {person &&
                <div className="container-myprofile">
                    <div className='container-desc-prof'>
                    <div style={backgroundStyle} className="background-image"></div>
                    <UserInfo person={person} username={username} />
                    <div className='myprofile-options'>
                            <Row className='my-options' >
                                <Col xs={3}>
                                    
                                </Col>
                                <Col xs={1}>
                                    <img src={settingsIcon} 
                                    onClick={this.toggleSettings}
                                    alt=''
                                    className='bio-icons'/>
                                </Col>
                                <Col xs={8}>
                                    <img src={usersIcon}
                                        onClick={this.displayFriends}
                                        alt=''
                                        className='bio-icons' />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}></Col>
                                <Col xs={12} md={8}><hr /> </Col>
                                <Col md={1}>

                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <p className='text-secondary'>{person.description() ? person.description()
                                            : 'You have no bio.'}
                                    </p> 
                                </Col>
                            </Row>
                    </div>
                    
                    </div>

                    {this.state.displayFriends && friendDisplay}
                    {!this.state.displayFriends && <div className='profile-posts'>
                        <Row>
                        <Col xs={1} md={1} xl={2}>
                                
                        </Col>
                        <Col sm={12} md={10} xl={8}>
                        {this.isLocal() &&
                            <div>
                                {this.state.changeInfo && settingsForm }
                            <div className="new-status">
                                <Row>
                                    <Col md={12}>
                                            {
                                                this.state.newImage &&
                                                <div className='post-pic-container'>
                                                    <Button onClick={this.deleteImage} variant="outline-danger" className='delete-img'>X</Button>
                                                    <img alt='' className='post-pic' als='' src={this.state.newImage} />
                                                </div>}
                                            <InputGroup>
                                                <FormControl
                                                    as='textarea'
                                                    className="input-status"
                                                    value={this.state.newStatus}
                                                    onChange={e => this.handleNewStatusChange(e)}
                                                    placeholder="What's on your mind?"
                                                />
                                            </InputGroup>
                                    </Col>
                                </Row>
                                
                                <Row>
                                <Col xs={3} className='input-btn-wrapper'>
                                    <label className="btn btn-outline-secondary">
                                        <img alt='' src={cameraIcon} /> <input type="file" onChange={this.captureFile} hidden/>
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
                        }</Col>
                        <Col xs={1} md={1}></Col>
                        </Row>
                        <Row>
                        <Col xs={1} md={1} xl={2}></Col>
                            <Col sm={12} md={10} xl={8}>
                                {this.props.curUserOwnPosts.postIDs.length > 0 && this.props.curUserOwnPosts.loaded && !this.state.isLoading && <InfiniteScroll order={this.props.curUserOwnPosts.postIDs} postIdAndName={this.props.curUserOwnPosts.postIDAndName} doneLoading={this.props.curUserOwnPosts.loaded}/>}
                        </Col>
                        <Col xs={1} md={1}></Col>
                        </Row>
                    </div>}
                </div>}
            </div>

        );
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    currentUserInformation,
    addToCurrentUserPosts
}, dispatch);

const mapStateToProps = (state) => {
    return ({
        curUserInfo: state.curuserInfo,
        curUserOwnPosts: state.curUserOwnPosts
    })
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyProfile));