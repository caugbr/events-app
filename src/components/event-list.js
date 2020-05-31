import React from 'react';
import axios from 'axios';
import Loading from './loading';
import { authHeaders } from './login-box';
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from 'react-bootstrap';

import PaginationLinks from './pagination';
import Config from '../config';

class EventList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            event_list: [],
            loaded: false
        };
        
        // pagination
        this.itemsPerPage = 3;
        try {
            this.currentPage = Number(this.props.match.params.page);
        } catch(e) {
            this.currentPage = 1;
        }
        this.totalItems = 0;
        this.totalPages = 0;
    }
    
    componentDidMount() {
        axios.get(Config.api_events_url + '?per_page=' + this.itemsPerPage + '&page=' + this.currentPage, authHeaders())
        .then((response) => {
            this.totalItems = Number(response.headers['x-wp-total']);
            this.totalPages = Number(response.headers['x-wp-totalpages']);
            const event_list = response.data, loaded = true;
            this.setState({ event_list, loaded });
        })
        .catch(err => { this.setState({ loaded: true }); console.log(err); });
    }

    renderEvent(event) {
        return (
            <Col key={event.id} lg={3} md={4} sm={6}>
                <Card className="event">
                    <Link to={ "/event/" + event.slug }>
                        {event.thumbnail_url 
                            ? (<Card.Img src={event.images[0].sizes.medium[0]} />) 
                            : (<Card.Img src="/img/placeholder.png" />)
                        }
                    </Link>
                    <Card.Body>
                        <Card.Title><Link to={ "/event/" + event.slug }>{event.title}</Link></Card.Title>
                        <Card.Subtitle>{event.start_date} {event.start_time}</Card.Subtitle>
                        <Card.Text>{event.location.name}</Card.Text>
                        {/* {event.excerpt ? (<Card.Text>{event.excerpt}</Card.Text>) : ('')} */}
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    render() {
        const { event_list, loaded } = this.state;
        if (!loaded) {
            return (
                <Loading />
            );
        } else {
            return (
                <Container className="event-list">
                    <Row>
                        <Col>
                            <h3>Todos os eventos</h3>
                        </Col>
                    </Row>
                    <Row>
                        {event_list.map(event => this.renderEvent(event))}
                    </Row>
                    {this.totalItems > this.itemsPerPage &&
                        (<Row><Col><PaginationLinks total={this.totalPages} current={this.currentPage} /></Col></Row>)}
                </Container>
            );
        }
    }
};

export default EventList