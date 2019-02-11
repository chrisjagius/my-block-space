import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';




export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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

    componentDidMount() {

    }

    componentWillReceiveProps() {

    }

    render() {
        const {person, username, status} = this.props;

        return (
            <div className="my-post" key={status.id}>
                <Row className='poster-info'>
                    <Col xs={2}>
                        <img
                            src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
                            alt=''
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
                        <img alt='' className='post-pic' src={status.image} />
                        <hr /></div>}
                <pre>{status.text}</pre>
            </div>
        )
    }
}