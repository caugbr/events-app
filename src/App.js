import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Container } from 'react-bootstrap';

import Config from './config';

// My components
import EventList from './components/event-list';
import EventSingle from './components/event-single';
import PublishBox from './components/publish-box';
import LoginBox from './components/login-box';
import NotFound from './components/not-found';

// css
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: 'pt_br',
            logged_in: false,
            remote_create: false,
            force_draft: true,
            include_fields: []
        };
    }

    componentDidMount() {
        axios.get(Config.api_url + '/create-event-rules', LoginBox.authHeaders())
        .then(({ data }) => {
            this.setState({
                remote_create: data.rest_remote_create,
                force_draft: data.rest_force_draft,
                include_fields: data.rest_include_fields
            })
        });
    }
    
    setAppState = (index, value) => {
        this.setState({ [index]: value });
    }

    render() {
        return (
            <Router>
                <Container className="events">
                    <header className="events-header">
                        <h1><Link to="/">Events</Link></h1>

                        <div className="links">
                            <LoginBox setAppState={this.setAppState} />
                            <PublishBox {...this.state} />
                        </div>
                    </header>
                    <Switch>
                        <Route path="/" exact>
                            <EventList />
                        </Route>
                        <Route path="/page/:page" component={EventList} />
                        <Route path="/event/:slug" component={EventSingle} />
                        {/* <Route path="/event/:slug" render={
                            props => <EventSingle setAppState={this.setAppState} {...props} />
                        }> */}
                        <Route path="*">
                            <NotFound url={window.location.href} />
                        </Route>
                    </Switch>
                    <footer className="events-footer"></footer>
                </Container>
            </Router>
        );
    }
}

export default App;
