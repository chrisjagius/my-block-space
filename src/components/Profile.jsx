import React, { Component } from 'react';
import {
    loadUserData,
    Person,
    getFile,
    lookupProfile,
    putFile
} from 'blockstack';
import { Container, Row, Col, Button } from 'react-bootstrap';
import backPic from '../assets/standard-wallpaper.jpg';
import NoResult from './NoResult';
import Post from './Post';
import Loader from './Loader';

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
            isLoading: true,
            following: false,
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
                this.setState({
                    person: false
                })
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
        this.props.friends.includes(username) ? this.setState({ following: true }) : this.setState({ following: false });
    }
    addFriend = (event) => {
        event.preventDefault();
        let friends = this.props.friends
        friends.push(this.state.username)
        const options = { encrypt: false }
        putFile('friends.json', JSON.stringify(friends), options)
            .then((result) => {
                console.log('res ,', result)
                this.setState({ following: true })
            })
        this.setState({following: true})
    }
    unFriend = (event) => {
        event.preventDefault();
        let friends = this.props.friends
        let user = this.state.username
        friends = friends.filter(username => username !== user)
        this.props.updateFriends(friends);
        const options = { encrypt: false }
        putFile('friends.json', JSON.stringify(friends), options)
        .then((result) => {
            console.log('res ,', result)
            this.setState({ following: false })
        })
    }

    componentDidMount() {
        this.fetchData();
    }
    componentWillReceiveProps() {
        this.fetchData()
    }
    logUserInfo = () => {
        console.log(loadUserData());
    }
    

    render() {
        const { person, username, isLoading } = this.state;
        const backgroundStyle = {
            'backgroundImage': `url("${backPic}"`
        }
        
        return (

            <div>
            {isLoading && <Loader/>}
            {!isLoading && person ?
                    <div className="container-myprofile">
                        <div style={backgroundStyle} className='container-desc-prof'>
                            <Container>
                                <Row className="myprofile-bio">

                                    <Col xs={12} md={3} className='bio-left'>
                                        <img alt=''
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
                                        {!this.state.following ? <Button variant="outline-success"
                                            className=""
                                            onClick={this.addFriend}
                                        >
                                        Follow
                                        </Button> : <Button variant="outline-danger"
                                        className=""
                                        onClick={this.unFriend}
                                    >
                                        Unfollow
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
                                        <Post person={person} username={username} status={status} key={status.created_at} />
                                    )
                                    )}
                                </Col>
                                <Col xs={1} md={2}></Col>
                            </Row>
                        </div>
                    </div> : <NoResult username={username}/>}
            </div>
        );
    }
}