import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MdlCell from "../../mdl/MdlCell";

export default class VideoOptions extends Component {
    constructor(props){
        super(props);

        this.state = {
            microphoneOff: false,
            videoCamOff: false
        };

        this.toggleAudio = this.toggleAudio.bind(this);
        this.toggleVideo = this.toggleVideo.bind(this);
    }

    toggleAudio() {
        const prev = this.state.microphoneOff;
        this.setState({microphoneOff: !prev},
            () => this.props.toggleAudio())
    }

    toggleVideo() {
        const prev = this.state.videoCamOff;
        this.setState({videoCamOff: !prev},
           () => this.props.toggleVideo())
    }

    render() {
        const microphoneOffHighlight = this.state.microphoneOff === true ? 'mdl-button--colored' : '';
        const videoCamOffHighlight = this.state.videoCamOff === true ? 'mdl-button--colored' : '';

        return (
            <MdlCell cellWidth={2}>
                <button className={`mdl-button mdl-js-button mdl-button--icon ${microphoneOffHighlight}`}
                        onClick={this.toggleAudio}>
                    <i className='material-icons'>mic_off</i>
                </button>
                <button className={`mdl-button mdl-js-button mdl-button--icon ${videoCamOffHighlight}`}
                        onClick={this.toggleVideo}>
                    <i className='material-icons'>videocam_off</i>
                </button>
            </MdlCell>
        )
    }
}

VideoOptions.propTypes = {
    toggleAudio: PropTypes.func.isRequired,
    toggleVideo: PropTypes.func.isRequired
};