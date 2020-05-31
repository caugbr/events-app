import React from 'react';
import axios from 'axios';
import { Container, Row, Col, Image } from 'react-bootstrap';
import NotFound from './not-found';
import Loading from './loading';
import { authHeaders } from './login-box';
import Config from '../config';

class EventSingle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: false,
            loaded: false
        };
        this.slug = this.props.match.params.slug;
    }
    
    componentDidMount () {
        axios.get(Config.api_events_url + '?slug=' + this.slug, authHeaders())
        .then(({data}) => {
            this.setState({ loaded: true });
            if (data[0] !== undefined) {
                this.setState({ event: data[0] });
            }
        });
    }
    
    render() {
        if (!this.state.loaded) {
            return (
                <Loading />
            );
        } else {
            if (this.state.event === false) {
                return (
                    <NotFound url={window.location.href} />
                );
            }
            return (
                <Container className="event-single">
                    <Row>
                        <Col>
                            <h2>{this.state.event.title}</h2>
                        </Col>
                    </Row>
                    {this.state.event.thumbnail_url &&
                        (
                          <Row>
                              <Col>
                                  <Image src={this.state.event.images[0].sizes.large[0]} />
                              </Col>
                          </Row>
                        )
                    }
                    <Row>
                        <Col>
                            {this.state.event.location &&
                                (
                                  <>
                                  <h3 className="local-title">{this.state.event.location.name}</h3>
                                  <p>
                                      {this.state.event.location.address} <br />
                                      {this.state.event.location.city}
                                  </p>
                                  </>
                                )
                            }
                        </Col>
                    </Row>
                </Container>
            );
        }
    }
};

export default EventSingle;