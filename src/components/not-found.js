import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: ''
        };
    }

    componentDidMount() {
        this.setState({ location: this.props.url });
    }

    render() {
        const url = this.props.url.replace(/^https?:\/\//, '');
        return (
            <Container className="not-found">
                <Row>
                    <Col>
                        <h2>This content was not Found!</h2>
                        <big>{url}</big>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default NotFound