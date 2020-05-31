import React from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Config from '../config';

class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal_show: false,
			username: '',
			password: '',
			user_nice_name: '',
			logged_in: false,
			error: ''
        };
    }

	createMarkup(data) {
        return { __html: data };
    }

	handleOnChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        return true;
	};

    openModal = (event) => {
        event.preventDefault();
        this.setState({ modal_show: true });
    };

    closeModal = () => {
        this.setState({ modal_show: false });
    };

    logout = (event) => {
        event.preventDefault();
        this.setState({ logged_in: false, token: '', user_nice_name: '' });
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        this.props.setAppState('logged_in', false);
    };

	onFormSubmit = (event) => {
        event.preventDefault();

        const { username, password } = this.state;

        axios.post(Config.api_auth_url, { username, password }).then(res => {
            if (undefined === res.data.token) {
                this.setState({ error: res.data.message });
                return;
            }

            const { token, user_nicename } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userName', user_nicename);

            this.setState({
                token: token,
                user_nice_name: user_nicename,
                logged_in: true,
                modal_show: false
            });
            this.props.setAppState('logged_in', true);
            
        }).catch(err => {
            this.setState({ error: err.response.data.message });
        });
    };
    
    static authHeaders() {
        let token = localStorage.getItem('token'); 
        if (token) {
            return { headers: { "Authorization": `Bearer ${token}` } };
        }
        return {};
    };

    checkToken() {
        const auth = this.constructor.authHeaders();
        if (!auth.headers) {
            this.setState({ logged_in: false });
            this.props.setAppState('logged_in', false);
        } else {
            axios.post(Config.api_auth_token_url, {}, auth).then(res => {
                if (res.data && res.data.code == "jwt_auth_valid_token") {
                    this.setState({ logged_in: true });
                    this.props.setAppState('logged_in', true);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    this.setState({ logged_in: false });
                    this.props.setAppState('logged_in', false);
                }
            });
        }
    }

    componentDidMount() {
        this.checkToken();
    }

    render() {
        const { username, password, user_nice_name, logged_in, error, modal_show } = this.state;
		if (logged_in) {
            let user_name = !!user_nice_name ? user_nice_name : localStorage.getItem('userName');
			return (
                <div className="login-area">
                    Olá, {user_name}!
                    <a href="#logout" onClick={this.logout}>Logout</a>
                </div>
            );
        }

        return (
            <div className="login-area">         
                <a href="#login" onClick={this.openModal}>Login</a>
                <Modal show={modal_show} keyboard={true} size="sm" onHide={this.closeModal} aria-labelledby="modal-title" className="login-box" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">
                            Login
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { error && <div className="alert alert-danger" dangerouslySetInnerHTML={ this.createMarkup(error) }/> }
                        <form onSubmit={this.onFormSubmit}>
                            <label className="form-group">
                                Username
                                <input type="text" className="form-control" name="username" value={ username } onChange={ this.handleOnChange } />
                            </label>
                            <br/>
                            <label className="form-group">
                                Password
                                <input type="password" className="form-control" name="password" value={ password } onChange={ this.handleOnChange } />
                            </label>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.onFormSubmit}>Login</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}

export const authHeaders = LoginBox.authHeaders;
export default LoginBox;