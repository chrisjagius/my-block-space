import React, { Component } from 'react';
import {
    isSignInPending,
    loadUserData,
    Person,
    getFile,
    lookupProfile,
    putFile,

} from 'blockstack';
import {Container, Row, Col} from 'react-bootstrap';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class MyProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            person: {
                name() {
                    return 'Anonymous';
                },
                avatarUrl() {
                    return avatarFallbackImage;
                },
            },
            checked: false,
            username: "",
            newStatus: "",
            statuses: [],
            statusIndex: 0,
            isLoading: false
        };
        // this.handleNewStatusChange = this.handleNewStatusChange.bind(this);
        // this.handleNewStatusSubmit = this.handleNewStatusSubmit.bind(this);
        // this.saveNewStatus = this.saveNewStatus.bind(this);
        // this.fetchData = this.fetchData.bind(this);
    }

    isLocal = () => {
        console.log(this.props.person)
        return this.props.match.params.username ? true : false;
    }

    // fetchData() {
    //     this.setState({ isLoading: true })
    //     if (this.isLocal()) {
    //         const options = { decrypt: false }
    //         getFile('statuses.json', options)
    //             .then((file) => {
    //                 var statuses = JSON.parse(file || '[]')
    //                 this.setState({
    //                     person: new Person(loadUserData().profile),
    //                     username: loadUserData().username,
    //                     statusIndex: statuses.length,
    //                     statuses: statuses,
    //                 })
    //             })
    //             .finally(() => {
    //                 this.setState({ isLoading: false })
    //             })
    //     } else {
    //         const username = this.props.match.params.username

    //         lookupProfile(username)
    //             .then((profile) => {
    //                 console.log(new Person(profile))
    //                 this.setState({
    //                     person: new Person(profile),
    //                     username: username
    //                 })
    //             })
    //             .catch((error) => {
    //                 console.log('could not resolve profile')
    //             })

    //         const options = { username: username, decrypt: false }
    //         getFile('statuses.json', options)
    //             .then((file) => {
    //                 var statuses = JSON.parse(file || '[]')

    //                 console.log(statuses)
    //                 this.setState({
    //                     statusIndex: statuses.length,
    //                     statuses: statuses
    //                 })
    //             })
    //             .catch((error) => {
    //                 console.log('could not fetch statuses')
    //             })
    //             .finally(() => {
    //                 this.setState({ isLoading: false })
    //             })
    //     }
    // }

    // saveNewStatus(statusText) {
    //     let statuses = this.state.statuses

    //     let status = {
    //         id: this.state.statusIndex++,
    //         text: statusText.trim(),
    //         created_at: Date.now()
    //     }

    //     statuses.unshift(status)
    //     const options = { encrypt: false }
    //     putFile('statuses.json', JSON.stringify(statuses), options)
    //         .then(() => {
    //             this.setState({
    //                 statuses: statuses
    //             })
    //         })
    // }

    // handleNewStatusChange(event) {
    //     this.setState({ newStatus: event.target.value })
    // }

    // handleNewStatusSubmit(event) {
    //     this.saveNewStatus(this.state.newStatus)
    //     this.setState({
    //         newStatus: ""
    //     })
    // }

    // componentDidMount() {
    //     this.fetchData();
    // }

    logUserInfo = () => {
        console.log();
    }

    render() {
        const { person } = this.props;
        const { username } = this.props;
        return (
            !isSignInPending() && person ?
                <div className="container-myprofile">
                    <Container>
                        <Row className="justify-content-md-center myprofile-bio">

                            <Col xs={12} md={5} className='bio-left'>
                                <img
                                    src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
                                    className="img-rounded avatar"
                                    id="avatar-image"
                                />
                            </Col>
                            <Col xs={12} md={5} className='bio-right'>
                                <h1>
                                    <span id="heading-name">{person.name() ? person.name()
                                        : 'Nameless Person'}</span>
                                </h1>
                                <span>{username}</span>
                            </Col>
                        </Row>
                    </Container>
                    <Row className='myprofile-options'>
                        <Col md={{ span: 3, offset: 9 }}>
                            <button onClick={this.logUserInfo} >Click!</button>
                        </Col>
                    </Row>
                            {this.isLocal() &&
                                <div className="new-status">
                                    <div className="col-md-12">
                                        <textarea className="input-status"
                                            value={this.state.newStatus}
                                            onChange={e => this.handleNewStatusChange(e)}
                                            placeholder="What's on your mind?"
                                        />
                                    </div>
                                    <div className="col-md-12 text-right">
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={e => this.handleNewStatusSubmit(e)}
                                        >
                                            Submit
               </button>
                                    </div>
                                </div>
                            }
                            {/* <div className="col-md-12 statuses">
                                {this.state.isLoading && <span>Loading...</span>}
                                {this.state.statuses.map((status) => (
                                    <div className="status" key={status.id}>
                                        {status.text}
                                    </div>
                                )
                                )}
                            </div> */}
                        
                        
                    </div> : null
        );
    }
    // componentWillMount() {
    //     this.setState({
    //         person: new Person(loadUserData().profile),
    //         username: loadUserData().username
    //     });
    // }
}
