import React from 'react';
import axios from 'axios';
import Config from '../config';
import { authHeaders } from './login-box';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';

class PublishBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal_show: false,
            eventman_type: [],
            eventman_cat: [],
            tags: [],
            eventman_locations: [],
            eventman_organizers: []
        };
    }

    componentDidMount() {
        this.getResources();
    }

    openModal = (event) => {
        event.preventDefault();
        this.setState({ modal_show: true });
    };
    
    closeModal = () => {
        this.setState({ modal_show: false });
    };
    
    selectValues(select) {
        const selected = select.querySelectorAll('option:checked');
        const values = Array.from(selected).filter(el => !!el.selected).map(el => el.value);
        return values.join(',');
    }
    
    getFormValues = form => {
        const elements = form.querySelectorAll('select,input,textarea');
        let ret = {};
        Array.from(elements).map(el => {
            let value = el.value;
            let id = el.name ? el.name : el.id;
            if (el.tagName.toLowerCase() == 'select') {
                value = this.selectValues(el);
            }
            if (el.tagName.toLowerCase() == 'input' && /^checkbox|radio$/.test(el.type)) {
                value = el.checked ? (el.value ?? 'on') : 'off';
            }
            ret[id] = value;
        });
        return ret;
    }

    onFormSubmit = event => {
        // console.log(this.getFormValues(event.target.form)); 
        // return false;
        event.preventDefault();
        axios.post(Config.api_events_url, this.getFormValues(event.target.form), authHeaders())
        .then(({ data }) => {
            this.showResult(data);        
        });
    };
    
    showResult(data) {
        // console.log('DATA', data);

    }

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
        if (!this.props.logged_in || !this.props.remote_create) {
            return ('');
        }
        return (
            <div className="publish-area">         
                <a href="#publish" onClick={this.openModal}>Create event</a>
                <Modal show={this.state.modal_show} keyboard={true} size="lg" onHide={this.closeModal} aria-labelledby="modal-title" className="login-box" centered>
                    <form className="create-event-form" onSubmit={this.onFormSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title id="modal-title">
                                Create Event
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container className="publish-event">
                                <Row>
                                    <Col>
                                        <div className="results"></div>
                                        <div className="form-fields">
                                            <Form.Group controlId="title">
                                                Event Name
                                                <Form.Control />
                                            </Form.Group>
                                            <Form.Group controlId="content">
                                                Content
                                                <Form.Control as="textarea" />
                                            </Form.Group>
                                            <Form.Group controlId="from">
                                                Event starts at
                                                <Form.Control type="datetime" />
                                            </Form.Group>
                                            <Form.Group controlId="to">
                                                Event ends at
                                                <Form.Control type="datetime" />
                                            </Form.Group>
                                            <Form.Group controlId="undefined_end">
                                                <Form.Check type="checkbox" label="Undefined end time" />
                                            </Form.Group>
                                            {!!this.state.eventman_locations.length && (
                                                <Form.Group controlId="eventman_location">
                                                    Location
                                                    <Form.Control as="select">
                                                        {this.state.eventman_locations}
                                                    </Form.Control>
                                                </Form.Group>
                                            )}
                                            {!!this.state.eventman_organizers.length && (
                                                <Form.Group controlId="eventman_organizer">
                                                    Organizer
                                                    <Form.Control as="select">
                                                        {this.state.eventman_organizers}
                                                    </Form.Control>
                                                </Form.Group>
                                            )}
                                            {!!this.state.eventman_type.length && (
                                                <Form.Group controlId="eventman_type">
                                                    Event type
                                                    <Form.Control as="select">
                                                        {this.state.eventman_type}
                                                    </Form.Control>
                                                </Form.Group>
                                            )}
                                            {!!this.state.eventman_cat.length && (
                                                <Form.Group controlId="eventman_cat">
                                                    Categories
                                                    <Form.Control as="select" multiple>
                                                        {this.state.eventman_cat}
                                                    </Form.Control>
                                                </Form.Group>
                                            )}
                                            {!!this.state.tags.length && (
                                                <Form.Group controlId="post_tag">
                                                    Tags
                                                    <Form.Control as="select" multiple>
                                                        {this.state.tags}
                                                    </Form.Control>
                                                </Form.Group>
                                            )}

                                            <Form.Group controlId="status">
                                                Status
                                                <Form.Control as="select">
                                                    <option value="draft">Draft</option>
                                                    {!this.props.force_draft && (<option value="publish">Publish</option>)}
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.onFormSubmit}>Create Event</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }
};

export default PublishBox