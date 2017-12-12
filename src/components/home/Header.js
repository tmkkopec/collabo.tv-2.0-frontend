import React, {Component} from 'react';
import PropTypes from 'prop-types';

const uniqueId = require('lodash/uniqueId');

class Tab extends Component {
    render() {
        return <a href={'#scroll-tab-' + this.props.id} className="mdl-layout__tab is-active">Room {this.props.id}</a>
    }
}

Tab.propTypes = {
    id: PropTypes.string.isRequired
};

export default class Header extends Component {
    render() {
        return (
            <header className="collabo-header mdl-layout__header">
                <div className="collabo-header mdl-layout__header-row">
                    <span className="mdl-layout-title">Collabo.tv</span>
                    <div className="mdl-layout-spacer"/>
                    <button
                        className="collabo-rect mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--colored"
                        type="button" onClick={this.props.onLogout}>Logout
                    </button>
                    
                </div>
                <div className="collabo-header mdl-layout__tab-bar mdl-js-ripple-effect">
                    {this.props.roomIDs.map((element) => <Tab id={element} key={uniqueId()}/>)}
                </div>
            </header>
        )
    }
}

Header.propTypes = {
    onLogout: PropTypes.func,
    roomIDs: PropTypes.arrayOf(PropTypes.string).isRequired
};
