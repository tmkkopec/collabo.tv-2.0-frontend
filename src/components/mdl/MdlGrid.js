import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MdlGrid extends Component {
    render() {
        const name = this.props.className || '';
        return <div className={`mdl-grid ${name}`}>{this.props.children}</div>;
    }
}

MdlGrid.propTypes = {
    className: PropTypes.string
};