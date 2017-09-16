import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

const PUBLIC_ROOT = '/login';
const PRIVATE_ROOT = '/room';

class AuthRoute extends React.Component {
    constructor(props) {
        super(props);

        this.state = {isAuthenticated: false};

        this.isAuthenticated()
            .then(status => this.setState({authenticated: status === 200}));
    }

    isAuthenticated() {
        return fetch('/auth/user', {credentials: 'include'})
            .then(response => {
                return response.status;
            })
            .catch(console.log)
    }

    render() {
        let {componentClass, ...props} = this.props;
        const {isPrivate} = componentClass;

        switch (this.state.authenticated) {
            case true:
                return isPrivate ? <Route {...props}/> : <Redirect to={PRIVATE_ROOT}/>;
            case false:
                return isPrivate ? <Redirect to={PUBLIC_ROOT}/> : <Route {...props}/>;
            default:
                return null;
        }
    }
}

AuthRoute.propTypes = {
    componentClass: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

export default AuthRoute;