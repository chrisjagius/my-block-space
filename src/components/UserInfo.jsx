import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';


export default class UserInfo extends Component {

    render() {
        const { person, username } = this.props;
        return (
            <Container>
                <Row >
                    <Col xs={12} md={3} className="myprofile-bio-wrap">
                        <div className="myprofile-bio">
                            <div className='bio-left'>
                                <img
                                    src={person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage}
                                    className="avatar"
                                    alt='Avatar'
                                />
                            </div>
                            <span className="heading-name">{person.name() ? person.name()
                                : 'Nameless Person'}
                            </span><br />

                            <span className='display-username text-secondary'>{username}</span>
                        </div>
                    </Col>

                </Row>
            </Container>
        )
    }
}