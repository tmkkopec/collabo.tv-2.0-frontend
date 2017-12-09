import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class UsersButton extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button className="mdl-button mdl-js-button mdl-button--primary" onClick={this.props.handleClick}>
                {this.props.title}
            </button>
        )
    }
}

UsersButton.propTypes = {
    title: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired
};
