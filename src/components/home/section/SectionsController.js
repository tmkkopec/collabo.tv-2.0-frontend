import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Section from './Section';

const uniqueId = require('lodash/uniqueId');

class SectionsController extends Component {
    render() {
        return (
            <main className="mdl-layout__content">
                {this.props.sectionIDs.map((element) => <Section webrtc={this.props.webrtc}
                                                                 id={element}
                                                                 key={uniqueId()}/>)}
            </main>
        )
    }
}

SectionsController.propTypes = {
    sectionIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
    webrtc: PropTypes.object.isRequired
};

export default SectionsController;