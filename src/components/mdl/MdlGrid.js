import React, { Component } from 'react';

export default class MdlGrid extends Component {
    render() {
        return <div className="mdl-grid">{this.props.children}</div>;
    }
}
