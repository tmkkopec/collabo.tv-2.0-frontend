import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MdlCell extends Component {
    render() {
        return (
            <div className={'mdl-cell mdl-cell--' + this.props.cellWidth + '-col'}>
                {this.props.children}
            </div>
        )
    }
}

MdlCell.propTypes = {
    cellWidth: PropTypes.number.isRequired
};
