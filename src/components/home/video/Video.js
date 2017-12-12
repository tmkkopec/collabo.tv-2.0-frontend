import React from 'react';
import PropTypes from 'prop-types';
import MdlCell from '../../mdl/MdlCell';

class Video extends React.Component {
    render() {
        return (
            <MdlCell cellWidth={10}>
                <video id={(this.props.isRemoteVideo ? 'remote_' : 'local_') + this.props.videoId}
                class="fadeIn"
                       src={this.props.src}
                       autoPlay/>
            </MdlCell>
        )
    }
}

Video.propTypes = {
    videoId: PropTypes.string.isRequired,
    isRemoteVideo: PropTypes.bool,
    src: PropTypes.string
};

export default Video;