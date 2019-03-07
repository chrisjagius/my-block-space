import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    loadUserData,
    Person,
    getFile,
    lookupProfile,
    putFile
} from 'blockstack';
import { Row, Col, Button } from 'react-bootstrap';
import backPic from '../assets/standard-wallpaper.jpg';
import NoResult from './NoResult';
import Loader from './Loader';
import UserInfo from './UserInfo';
import InfiniteScroll from './InfiniteScroll';

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
            postIds: [],
            posts: [],
            postIdAndName: {},
            isLocal: false
        };
        this.fetchData = this.fetchData.bind(this);
    }

    isLocal = () => {
        this.setState({isLocal: this.props.match.params.username === loadUserData().username ? true : false});
    }

    async fetchData() {
        const username = this.props.match.params.username;
        this.setState({ isLoading: true, username: username, postIds: [] })
        let profile = await lookupProfile(username)
        try {
            this.setState({person: new Person(profile)})
        } catch {
            this.setState({person: false})
        }
        const options = { username: username, decrypt: false }
        let postIds = [];
        let postIdAndName = {}
        let resp = await getFile('postids.json', options);
        try {
            postIds = JSON.parse(resp || '[]')
            if (postIds.length > 0) {
                for (let i = 0; i < postIds.length; i++) {
                    postIdAndName[`${postIds[i]}`] = username;
                }
            }
        } catch {
            console.log('oepsie, could not fetch data')
        }
        this.props.friends.includes(username) ? this.setState({ following: true }) : this.setState({ following: false });
        return this.setState({
                    isLoading: false,
                    postIds: postIds,
                    postIdAndName: postIdAndName
                });
    }
    addFriend = async (event) => {
        event.preventDefault();
        let friends = this.props.friends
        friends.push(this.state.username)
        const options = { encrypt: false }
        await putFile('friends.json', JSON.stringify(friends), options)
        this.setState({following: true})
    }
    unFriend = async (event) => {
        event.preventDefault();
        let friends = this.props.friends
        let user = this.state.username
        friends = friends.filter(username => username !== user)
        this.props.updateFriends(friends);
        const options = { encrypt: false }
        await putFile('friends.json', JSON.stringify(friends), options)
        this.setState({ following: false })
    }

    componentDidMount() {
        this.isLocal();
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
        if (this.props.match.params.username !== username) { this.isLocal();this.fetchData()}
        return (

            <div>
            {this.state.isLocal && <Redirect to={`/${loadUserData().username}`} />}
            {isLoading && <Loader/>}
            {!isLoading && person ?
                    <div className="container-myprofile">
                        <div className='container-desc-prof'>
                            <div style={backgroundStyle} className="background-image"></div>
                            <UserInfo person={person} username={username} />
                            <div className='myprofile-options'>
                                <Row className='my-options' >
                                    <Col xs={3}>

                                    </Col>
                                    <Col xs={2}>
                                        <p className='text-secondary'>Posts: {this.state.postIds.length}</p>
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
                                <Col xs={1} md={1} xl={2}></Col>
                                <Col sm={12} md={10} xl={8}>
                                    {this.state.isLoading && <span>Loading...</span>}
                                    {!this.state.isLoading && this.state.postIds.length > 0 && <InfiniteScroll feed={false} order={this.state.postIds} postIdAndName={this.state.postIdAndName} person={person} username={username} doneLoading={true} />
                                    }
                                    {this.state.postIds.length === 0 && <h1>This user has no posts yet.</h1>}
                                </Col>
                                <Col xs={1} md={1}></Col>
                            </Row>
                        </div>
                    </div> : <NoResult username={username}/>}
            </div>
        );
    }
}