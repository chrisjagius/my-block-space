import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { currentUserInformation } from '../actions';
import FollowInfo from '../model/followInfo';
import VriendUser from '../model/vriendUser';
import Post from '../model/post';
import _ from 'lodash';

class Profile extends Component {
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
            isLocal: false,
            settings: {
                backgroundImage: false,
            }
        };
        this.fetchData = this.fetchData.bind(this);
    }

    isLocal = () => {
        this.setState({isLocal: this.props.match.params.username === loadUserData().username ? true : false});
    }

    async fetchData() {
        const username = this.props.match.params.username;
        this.setState({ isLoading: true, username: username, postIds: [] })
        try {
            let profile = await lookupProfile(username)
            this.setState({person: new Person(profile)})
        } catch {
            this.setState({person: false, isLoading: false})
        }
        let settings = await this.fetchSettings();

        // const options = { username: username, decrypt: false }
        let postTimes = [];
        let postIdAndName = {}
        // let resp = await getFile('postids.json', options);
        try {
            // postIds = JSON.parse(resp || '[]')
            let postsMadeByUser = await Post.fetchList({ username: username, }, { decrypt: true })
            console.log({postsMadeByUser})
            if (postsMadeByUser.length > 0) {
                for (let i = 0; i < postsMadeByUser.length; i++) {
                    postIdAndName[`${postsMadeByUser[i].attrs.createdAt}`] = [username, postsMadeByUser[i]._id];
                    postTimes.push(postsMadeByUser[i].attrs.createdAt)
                }
            }
        } catch {
            // console.log('oepsie, could not fetch data')
        }
        this.props.curUserInfo.friends.includes(username) ? this.setState({ following: true }) : this.setState({ following: false });
        return this.setState({
                    isLoading: false,
                    postIds: postTimes.reverse(),
                    settings: settings,
                    postIdAndName: postIdAndName
                });
    }
    fetchSettings = () => {
        const options = { decrypt: false }
        return getFile('settings.json', options)
            .then((file) => {
                let settings = JSON.parse(file || false)
                return settings ? settings : this.state.settings
            })
    }
    addFriend = async (event) => {
        event.preventDefault();
        let friends = this.props.curUserInfo.friends
        friends.push(this.state.username)
        const options = { encrypt: false }
        await putFile('friends.json', JSON.stringify(friends), options)

        //cur user data radiks
        const myFollowInfoArray = await FollowInfo.fetchList({ username: this.props.curUserInfo.username,}, {decrypt: true})
        const myFollowInfo = myFollowInfoArray[0]
        myFollowInfo.attrs.following.push(this.state.username)
        myFollowInfo.attrs.following_cnt++

        //user of profile data radiks
        const otherFollowInfoArray = await FollowInfo.fetchList({ username: this.state.username, }, { decrypt: true })
        const otherFollowInfo = otherFollowInfoArray[0]
        otherFollowInfo.attrs.followers.push(this.props.curUserInfo.username)
        otherFollowInfo.attrs.follower_cnt++

        console.log({myFollowInfo, otherFollowInfo})
        await myFollowInfo.save();
        await otherFollowInfo.save();
        this.setState({following: true})
        this.props.currentUserInformation();
    }
    unFriend = async (event) => {
        event.preventDefault();
        let friends = this.props.curUserInfo.friends
        let user = this.state.username
        friends = friends.filter(username => username !== user)
        const options = { encrypt: false }
        await putFile('friends.json', JSON.stringify(friends), options)
        //curuser data radiks
        const myFollowInfoArray = await FollowInfo.fetchList({ username: this.props.curUserInfo.username, }, { decrypt: true })
        const myFollowInfo = myFollowInfoArray[0]
        myFollowInfo.attrs.following = myFollowInfo.attrs.following.filter(username => username !== user)
        myFollowInfo.attrs.following_cnt--
        //user of profile data radiks
        const otherFollowInfoArray = await FollowInfo.fetchList({ username: user, }, { decrypt: true })
        const otherFollowInfo = otherFollowInfoArray[0]
        otherFollowInfo.attrs.followers = otherFollowInfo.attrs.followers.filter(username => username !== this.props.curUserInfo.username)
        otherFollowInfo.attrs.follower_cnt--

        console.log({ myFollowInfo, otherFollowInfo })
        await otherFollowInfo.save();
        await myFollowInfo.save();
        this.setState({ following: false })
        this.props.currentUserInformation();
    }

    async componentDidMount() {
        this.isLocal();
        this.fetchData();
    }
    
    logUserInfo = () => {
        console.log(loadUserData());
    }
    

    render() {
        const { person, username, isLoading } = this.state;
        const backgroundStyle = {
            'backgroundImage': `url("${this.state.settings.backgroundImage ? this.state.settings.backgroundImage : backPic}"`
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
                                        <span className='text-secondary posts'>POSTS  <span className='text-secondary' id='post-count'>{this.state.postIds.length}</span></span>
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
                    </div> : <div>{!this.state.isLoading && <NoResult username={username}/>}</div>}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    currentUserInformation
}, dispatch);

const mapStateToProps = (state) => {
    return ({
        curUserInfo: state.curuserInfo
    })
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));