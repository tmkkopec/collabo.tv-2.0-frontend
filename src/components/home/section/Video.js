import React from 'react';
import PropTypes from 'prop-types';
import MdlCell from '../../mdl/MdlCell';

class Video extends React.Component {
    render() {
        return (
            <MdlCell cellWidth={this.props.cellWidth}>
                <video id={(this.props.isRemoteVideo ? 'r' : '') + this.props.videoId} autoPlay/>
            </MdlCell>
        )
    }
}

Video.propTypes = {
    cellWidth: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired,
    isRemoteVideo: PropTypes.bool
};

export default Video;