import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';




export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now: Date.now(),
            fullText: false,
            person: false
        }
    }

    parseDate = (time) => {
        const { now } = this.state;
        if (Math.floor((now - time) / (1000 * 60)) < 60) {
            return `${Math.floor((now - time) / (1000 * 60))} m`
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

    componentDidMount() {
        
    }

    render() {
        const {person, username, status} = this.props;

        return (
            <div className="my-post" >
                <Row className='poster-info-con'>
                    <Col xs={2}>
                        <Link className='post-link' to={`/users/${username}`}><img
                            src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
                            alt=''
                            className="post-img"
                        /></Link>
                    </Col>
                    <Col xs={3} className='poster-info'>
                        <Link className='post-link' to={`/users/${username}`}>{username}</Link>
                    </Col>
                    <Col xs={4}></Col>
                    <Col xs={3}>
                        <span className='post-date'>{`${this.parseDate(status.created_at)} ago`}</span>
                    </Col>
                </Row>
                <hr />
                {
                    status.image &&
                    <div className='post-pic-container'>
                        <img alt='' className='post-pic' src={status.image} />
                        <hr /></div>}
                {!this.state.fullText && (status.text.length > 500 ? (<pre>{status.text.substring(0, 500)}...<br/><strong className='show-more' onClick={this.showFulltext}>show more</strong></pre>) : <pre>{status.text}</pre>)}

                {this.state.fullText && <pre>{status.text} <br /><strong className='show-more' onClick={this.showFulltext}>show less</strong></pre>}
            </div>
        )
    }
}