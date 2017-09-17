import React from 'react';
import PropTypes from 'prop-types';
import MdlCell from '../../mdl/MdlCell';

class Video extends React.Component {
    render() {
        return (
            <MdlCell cellWidth={this.props.cellWidth}>
                <video id={(this.props.isRemoteVideo ? 'remote_' : '') + this.props.videoId}
                       src={this.props.src}
                       autoPlay/>
            </MdlCell>
        )
    }
}

Video.propTypes = {
    cellWidth: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired,
    isRemoteVideo: PropTypes.bool,
    src: PropTypes.string
};

export default Video;