import React, {Component} from 'react';
import MdlGrid from '../mdl/MdlGrid';
import MdlCell from '../mdl/MdlCell';

class LoginPage extends Component {
    static isPrivate = false;

    constructor(props) {
        super(props);

        this.state = {nickname: ''};

        this.validateInput = this.validateInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({nickname: event.target.value})
    }

    validateInput(event) {
        if (this.state.nickname !== '') {
            fetch('/auth/join?nickname=' + this.state.nickname, {credentials: 'include'})
                .then(response => response.json())
                .then(data => {
                    window.location.replace('/room');
                });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <MdlGrid>
                    <MdlCell cellWidth={12} style={{'text-align': 'center'}}>
                        <h3 className="mdl-typography--display-4 mdl-color-text--grey-600">Collabo.tv</h3>
                    </MdlCell>
                </MdlGrid>
                <MdlGrid>
                    <MdlCell cellWidth={12} style={{'text-align': 'center'}}>
                        <form method="GET" name="login_form" onSubmit={this.validateInput}>
                            <div id="form_div" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <label className="mdl-textfield__label" htmlFor="nickname">nickname@room</label>
                                <input className="mdl-textfield__input" type="text" name="nickname" id="nickname"
                                       pattern="\w+@\w+" value={this.state.nickname} onChange={this.handleChange}/>
                                <span className="mdl-textfield__error">Not a valid input</span>
                            </div>
                            <br/>
                            <button
                                className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--colored"
                                type="submit" htmlFor="form_div">Join a room!
                            </button>
                        </form>
                    </MdlCell>
                </MdlGrid>
            </div>
        )
    }
}

export default LoginPage;
