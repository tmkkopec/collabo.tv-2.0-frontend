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
            <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">Collabo.tv</span>
                    <div className="mdl-layout-spacer"/>
                    <nav className="mdl-navigation">
                        <a className="mdl-navigation__link mdl-typography--button" style={{cursor: 'pointer'}}
                           onClick={this.props.onLogout}>Logout</a>
                    </nav>
                </div>
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title collabo-room">{this.props.roomIDs.map((element) => <Tab id={element} key={uniqueId()}/>)}</span>
                </div>
            </header>
        )
    }
}

Header.propTypes = {
    onLogout: PropTypes.func,
    roomIDs: PropTypes.arrayOf(PropTypes.string).isRequired
};
