import React, { Component } from 'react';
import {
    isSignInPending,
    loadUserData,
    Person,
    getFile,
    lookupProfile,
    putFile,

} from 'blockstack';
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import backPic from '../assets/standard-wallpaper.jpg';
import settingsIcon from '../assets/settings.svg';
import cameraIcon from '../assets/camera.svg';
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            newStatus: "",
            statuses: [],
            statusIndex: 0,
            isLoading: false
        };
        this.handleNewStatusChange = this.handleNewStatusChange.bind(this);
        this.handleNewStatusSubmit = this.handleNewStatusSubmit.bind(this);
        this.saveNewStatus = this.saveNewStatus.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    isLocal = () => {
        return this.props.match.params.username === loadUserData().username ? true : false;
    }

    fetchData() {
        this.setState({ isLoading: true })
        console.log('ik start')
        const options = { decrypt: false }
        getFile('statuses.json', options)
            .then((file) => {
                console.log('in the then')
                var statuses = JSON.parse(file || '[]')
                this.setState({
                    statusIndex: statuses.length,
                    statuses: statuses,
                    newImage: false,
                    newImage: false
                })
            })
            .finally(() => {
                this.setState({ isLoading: false })
            })
    }

    saveNewStatus() {
        let statuses = this.state.statuses

        let status = {
            id: this.state.statusIndex++,
            text: this.state.newStatus.trim(),
            created_at: Date.now(),
            image: this.state.newImage
        }

        statuses.unshift(status)
        const options = { encrypt: false }
        putFile('statuses.json', JSON.stringify(statuses), options)
            .then(() => {
                this.setState({
                    statuses: statuses
                })
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
        this.fetchData();
    }

    logUserInfo = () => {
        console.log(loadUserData());
    }
    parseDate = (time) => {
        let now = Date.now();
        if (Math.floor((now - time) / (1000 * 60)) < 60) {
            return `${Math.floor((now - time) / (1000 * 60))} m`
        } else if (Math.floor((now - time) / (1000 * 60 * 60)) < 24) {
            return `${Math.floor((now - time) / (1000 * 60 * 60))} h`
        } else if (Math.floor((now - time) / (1000 * 60 * 60 * 24)) < 7) {
            return `${Math.floor((now - time) / (1000 * 60 * 60 * 24))} d`
        }
    }

    render() {
        const { person, username } = this.props;
        const backgroundStyle = {
            'backgroundImage': `url("${backPic}"`
        }
        return (
            !isSignInPending() && person ?
                <div className="container-myprofile">
                    <div style={backgroundStyle} className='container-desc-prof'>
                    <Container>
                        <Row className="myprofile-bio">

                            <Col xs={12} md={3} className='bio-left'>
                                <img
                                    src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
                                    className="img-rounded avatar"
                                    id="avatar-image"
                                />
                            </Col>
                            <Col xs={12} md={9} className='bio-right'>
                                <h1>
                                    <span id="heading-name">{person.name() ? person.name()
                                        : 'Nameless Person'}</span>
                                </h1>
                            </Col>
                        </Row>
                    </Container>
                    <div className='myprofile-options'>
                            <Row className='my-options' >
                                <Col xs={3}>

                                </Col>
                                <Col xs={9}>
                                    <img src={settingsIcon} 
                                    onClick={this.logUserInfo}
                                    className='bio-icons'/>
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
                    <div className='profile-posts'>
                        <Row>
                        <Col xs={1} md={2}></Col>
                        <Col xs={10} md={8}>
                        {this.isLocal() &&
                            <div className="new-status">
                                <Row>
                                    <Col md={12}>
                                            {
                                                this.state.newImage &&
                                                <div className='post-pic-container'>
                                                    <Button onClick={this.deleteImage} variant="outline-danger" className='delete-img'>X</Button>
                                                    <img className='post-pic' src={this.state.newImage} />
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
                                <Col md={6} className='input-btn-wrapper"'>
                                    <label class="btn btn-outline-secondary">
                                        <img src={cameraIcon} /> <input type="file" onChange={this.captureFile} hidden/>
                                    </label>
                                </Col>
                                <Col md={4} className="text-right">
                                            <Button variant="outline-success"
                                        className=""
                                        onClick={e => this.handleNewStatusSubmit(e)}
                                    >
                                        POST
                                    </Button>
                                </Col>
                                </Row>
                            </div>
                        }</Col>
                        <Col xs={1} md={2}></Col>
                        </Row>
                        <Row>
                        <Col xs={1} md={2}></Col>
                        <Col xs={10} md={8}>
                                {this.state.isLoading && <span>Loading...</span>}
                                {this.state.statuses.map((status) => (
                                    <div className="my-post" key={status.id}>
                                        <Row>
                                            <Col xs={2}>
                                                <img
                                                    src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
                                                    className="post-img"
                                                />
                                            </Col>
                                            <Col xs={3} className='poster-info'>
                                                {username}
                                            </Col>
                                            <Col xs={4}></Col>
                                            <Col xs={3}>
                                                <span className='post-date'>{this.parseDate(status.created_at)}</span>
                                            </Col>
                                        </Row>
                                        <hr />
                                        {
                                            status.image &&
                                            <div className='post-pic-container'>
                                            <img className='post-pic' src={status.image} />
                                            <hr /></div>}
                                        <pre>{status.text}</pre>
                                    </div>
                                )
                                )}
                        </Col>
                        <Col xs={1} md={2}></Col>
                        </Row>
                    </div>
                    </div> : null
        );
    }
}
