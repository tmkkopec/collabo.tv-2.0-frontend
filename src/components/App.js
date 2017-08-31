import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import LoginPage from './login/LoginPage';
import HomePage from "./home/HomePage";
import AuthRoute from './AuthRoute';

class App extends Component {
    render() {
        return (
            <Switch>
                <AuthRoute componentClass={LoginPage}
                           render={(props) => <LoginPage {...props}/>}
                           exact path="/:path(|login)"/>
                <AuthRoute componentClass={HomePage}
                           render={(props) => <HomePage {...props}/>}
                           path="/room/:roomId?"/>
            </Switch>
        )
    }
}

export default App;
