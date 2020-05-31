import React from 'react';
import axios from 'axios';
import Config from '../config';
import LoginBox, { authHeaders } from './login-box';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'publish',
            eventman_type: [],
            eventman_cat: [],
            tags: [],
            eventman_locations: [],
            eventman_organizers: [],
        };
    }

    componentDidMount() {
        this.getResources();
    }

	handleChange = (event) => {
        if (event.target.tagName.toLowerCase() == 'input' && event.target.type == 'checkbox') {
            event.target.value = event.target.checked ? 'yes' : 'no';
        }
        if (/^([^\.]+)\.(.+)$/.test(event.target.id)) {
            let { $1, $2 } = RegExp, obj = this.state[$1];
            obj[$2] = event.target.value;
            this.setState({ [$1]: obj });
        } else {
            this.setState({ [event.target.id]: event.target.value });
        }
        return true;
	};

    onFormSubmit = event => {
        event.preventDefault();
        axios.post(Config.api_events_url, this.state, authHeaders())
        .then(({ data }) => {
            console.log('DATA', data);
        });
	};

    getResources(type) {
        const resources = ['eventman_type', 'eventman_cat', 'tags', 'eventman_locations', 'eventman_organizers'];
        resources.forEach(type => {
            axios.get(Config.api_url + '/' + type, authHeaders())
            .then(({ data }) => {
                let items = [], index;
                for (let i = 0; i < data.length; i++) {
                    index = data[i].title ?? data[i].name;
                    items.push(<option key={i} value={data[i].id}>{index}</option>);
                }
                this.setState({ [type]: items });
            });
        });
    }

    render() {
        if (!this.props.getAppState('logged_in')) {
            return (
                <Container className="create-event">
                    <Row><Col><strong>Only authenticated users can publish events</strong></Col></Row>
                </Container>
            );
        }
        return (
            <Container className="create-event">
                <Row>
                    <Col>
                        <Form className="creare-event-form" onSubmit={this.onFormSubmit}>
                            <Form.Group controlId="title">
                                Event Name
                                <Form.Control onChange={ this.handleChange } />
                            </Form.Group>
                            <Form.Group controlId="content">
                                Content
                                <Form.Control as="textarea" onChange={ this.handleChange } />
                            </Form.Group>
                            <Form.Group controlId="from">
                                Event starts at
                                <Form.Control type="datetime" onChange={ this.handleChange } />
                            </Form.Group>
                            <Form.Group controlId="to">
                                Event ends at
                                <Form.Control type="datetime" onChange={ this.handleChange } />
                            </Form.Group>
                            <Form.Group controlId="undefined_end">
                                <Form.Check type="checkbox" onChange={ this.handleChange } label="Undefined end time" />
                            </Form.Group>
                            {!!this.state.eventman_locations.length && (
                                <Form.Group controlId="eventman_location">
                                    Location
                                    <Form.Control as="select" onChange={ this.handleChange }>
                                        {this.state.eventman_locations}
                                    </Form.Control>
                                </Form.Group>
                            )}
                            {!!this.state.eventman_organizers.length && (
                                <Form.Group controlId="eventman_organizer">
                                    Organizer
                                    <Form.Control as="select" onChange={ this.handleChange }>
                                        {this.state.eventman_organizers}
                                    </Form.Control>
                                </Form.Group>
                            )}
                            {!!this.state.eventman_type.length && (
                                <Form.Group controlId="eventman_type">
                                    Event type
                                    <Form.Control as="select" onChange={ this.handleChange }>
                                        {this.state.eventman_type}
                                    </Form.Control>
                                </Form.Group>
                            )}
                            {!!this.state.eventman_cat.length && (
                                <Form.Group controlId="eventman_cat">
                                    Categories
                                    <Form.Control as="select" onChange={ this.handleChange } multiple>
                                        {this.state.eventman_cat}
                                    </Form.Control>
                                </Form.Group>
                            )}
                            {!!this.state.tags.length && (
                                <Form.Group controlId="post_tag">
                                    Tags
                                    <Form.Control as="select" onChange={ this.handleChange } multiple>
                                        {this.state.tags}
                                    </Form.Control>
                                </Form.Group>
                            )}

                            <Form.Group controlId="status">
                                Status
                                <Form.Control as="select" onChange={ this.handleChange }>
                                    <option value="publish">Publish</option>
                                    <option value="draft">Draft</option>
                                </Form.Control>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Publish Event
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default CreateEvent