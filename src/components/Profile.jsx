import React, { Component } from 'react';
import {
    loadUserData,
    Person,
    getFile,
    lookupProfile,
    isSignInPending,
    putFile
} from 'blockstack';
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import backPic from '../assets/standard-wallpaper.jpg';
import NoResult from './NoResult';
import addIcon from '../assets/add.svg';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            person: undefined,
            username: "",
            checked: false,
            statuses: [],
            statusIndex: 0,
            isLoading: false,
            following: false
        };
        this.fetchData = this.fetchData.bind(this);
    }

    isLocal = () => {
        return this.props.match.params.username === loadUserData().username ? true : false;
    }

    fetchData() {
        const username = this.props.match.params.username
        this.setState({ isLoading: true, username: username })
        
        this.setState({  })
        lookupProfile(username)
            .then((profile) => {
                this.setState({
                    person: new Person(profile)
                })
            })
            .catch((error) => {
                console.log('could not resolve profile')
            })

        const options = { username: username, decrypt: false }
        getFile('statuses.json', options)
            .then((file) => {
                var statuses = JSON.parse(file || '[]')
                this.setState({
                    statusIndex: statuses.length,
                    statuses: statuses
                })
            })
            .catch((error) => {
                this.setState({ person: undefined })
            })
            .finally(() => {
                this.setState({ isLoading: false })
            })
        this.props.friends.map(x => {
            if (x === username) {
                this.setState({following: true})
                
            }
        })
    }
    addFriend = (event) => {
        event.preventDefault();
        let friends = this.props.friends
        friends.unshift(this.state.username)
        const options = { encrypt: false }
        putFile('friends.json', JSON.stringify(friends), options)
            .then((result) => {
                console.log('res ,', result)
            })
    }

    componentDidMount() {
        this.fetchData();
        this.parseDate()
    }
    componentWillReceiveProps() {
        this.fetchData()
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
        const { person, username } = this.state;
        const backgroundStyle = {
            'backgroundImage': `url("${backPic}"`
        }
        if (this.props.match.params.username !== username) {
            this.fetchData();
        }
        
        return (!isSignInPending() && person ?
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
                                    <Col xs={2}>
                                        <p className='text-secondary'>Posts: {this.state.statuses.length}</p>
                                    </Col>
                                    <Col xs={2}>
                                        {!this.state.following && <Button variant="outline-success"
                                            className=""
                                            onClick={this.addFriend}
                                        >
                                        Follow
                                        </Button>}
                                    </Col>
                                    <Col xs={5}>

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
                    </div> : <NoResult username={username}/>
            
        );
    }
}