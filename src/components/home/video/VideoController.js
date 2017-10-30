import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MdlGrid from '../../mdl/MdlGrid';
import Video from './Video';
import VideoOptions from './VideoOptions';

const uniqueId = require('lodash/uniqueId');

function Wrapper(props) {
    return (
        <MdlGrid>
            <Video videoId={props.videoId}
                   src={props.src}
                   isRemoteVideo={props.isRemoteVideo}
                   key={props.key}
            />
            <VideoOptions/>
        </MdlGrid>
    )
}

export default class VideoController extends Component {
    render() {
        return (
            <div className={'participantsVideos'}>
                <Wrapper videoId='localVideo'/>
                {Object.entries(this.props.remoteVideos).map(video =>
                    <Wrapper videoId={video[0]}
                             src={video[1]}
                             isRemoteVideo={true}
                             key={uniqueId()}/>
                )}
            </div>
        )
    }
}

VideoController.propTypes = {
    remoteVideos: PropTypes.object.isRequired
};

