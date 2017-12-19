import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class UserRow extends Component {
    componentDidMount() {
        window.componentHandler.upgradeElement(this.label);
    }

    render() {
        return (
            <tr>
                <td>
                    <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select"
                           ref={(label) => {
                               this.label = label;
                           }}>
                        <input type="checkbox" className="mdl-checkbox__input" onChange={this.props.onChange}/>
                    </label>
                </td>
                <td className="mdl-data-table__cell--non-numeric">{this.props.username}</td>
            </tr>
        )
    }
}

UserRow.propType = {
    onChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired
};

