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
            <VideoOptions toggleVideo={() => props.toggleVideo(props.videoId, props.isRemoteVideo)}
                          toggleAudio={() => props.toggleAudio(props.videoId, props.isRemoteVideo)}
            />
        </MdlGrid>
    )
}

export default class VideoController extends Component {
    render() {
        return (
            <div className={'participantsVideos'}>
                <Wrapper videoId={this.props.localUsername}
                         toggleVideo={this.props.toggleVideo}
                         toggleAudio={this.props.toggleAudio}
                         isRemoteVideo={false}
                />
                {Object.entries(this.props.remoteVideos).map(video =>
                    <Wrapper videoId={video[0]}
                             src={video[1]}
                             isRemoteVideo={true}
                             key={uniqueId()}
                             toggleVideo={this.props.toggleVideo}
                             toggleAudio={this.props.toggleAudio}
                    />
                )}
            </div>
        )
    }
}

VideoController.propTypes = {
    localUsername: PropTypes.string.isRequired,
    remoteVideos: PropTypes.object.isRequired,
    toggleAudio: PropTypes.func.isRequired,
    toggleVideo: PropTypes.func.isRequired
};

