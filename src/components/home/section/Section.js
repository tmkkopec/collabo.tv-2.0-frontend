import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Video from './Video';
import MdlGrid from '../../mdl/MdlGrid';
import MdlCell from '../../mdl/MdlCell';
import YouTube from 'react-youtube';
const uniqueId = require('lodash/uniqueId');

class Section extends Component {
    constructor(props) {
        super(props);

        this.player = undefined;
        this.interval = undefined;

        this.state = {
            remoteVideos: {},
            activeVideo: 'GPqbZsyl-bs',
            channel: undefined,
            name: undefined,
            room: undefined,
            owner: undefined
        };
        Section.instance = this;
        this.changeVideo = this.changeVideo.bind(this);
        this.sendCurrentStatus = this.sendCurrentStatus.bind(this);
        this.startSynchronize = this.startSynchronize.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    changeVideo(video) {
        this.state.channel.send({'video': video});
        this.setState({activeVideo: video});
    }

    startSynchronize() {
        if (this.owner) {
            this.interval = setInterval(this.sendCurrentStatus, 700);
        }
    }

    sendCurrentStatus() {
        const state = {
            "name": this.player.getVideoUrl(),
            "time": this.player.getCurrentTime(),
            "state": this.player.getPlayerState()
        };
        this.state.channel.send(state);
    }

    updateStatus(status) {
        const time = this.player.getCurrentTime();
        if (time > status.time + 1 || time < status.time - 1) {
            if (this.player.getPlayerState() !== 3) {
                this.player.seekTo(status.time);
                console.log(status.time + " " + time);
            }
        }

        const state = this.player.getPlayerState();
        if (state !== status.state) {
            console.log(status.state + " " + state);
            if (status.state === 1 && state === 2) this.player.playVideo();
            if (status.state === 2 && state === 1) this.player.pauseVideo();
        }

        if (status.video) {
            this.player.loadVideoById(status.video);
        }
    }

    _onReady(event) {
        this.player = event.target;
        this.player.playVideo();
    }

    _onPlay(event) {
        console.log("go");
    }

    componentDidMount() {
        this.props.webrtc.section = this;
        this.props.webrtc.register();
    }

    render() {
        const opts = {
            height: '360',
            width: '480',
            playerVars: {
                autoplay: 0,
                enablejsapi: 1,
                origin: `${window.location.protocol}'//'${window.location.host}`,
                controls: this.state.owner === false ? 0 : 1
            }
        };
        const cellWidth = Math.max(12 / (Object.keys(this.state.remoteVideos).length + 1), 6);

        return (
            <section className="mdl-layout__tab-panel is-active" id={'scroll-tab-' + this.props.id}>
                <div className="page-content">
                    <MdlGrid>
                        <MdlCell cellWidth={6}>
                            <div className="broadcast">
                                <MdlGrid>
                                    <Video cellWidth={cellWidth}
                                           videoId="localVideo"/>
                                    {Object.entries(this.state.remoteVideos).map(video =>
                                        <Video cellWidth={cellWidth}
                                               videoId={video[0]}
                                               src={video[1]}
                                               isRemoteVideo={true}
                                               key={uniqueId()}/>)}
                                </MdlGrid>
                            </div>
                        </MdlCell>
                        <MdlCell cellWidth={6}
                                 style={this.state.owner === false ? {'pointerEvents': 'none'} : {'pointerEvents': 'auto'}}>
                            <YouTube
                                videoId={this.state.activeVideo}
                                opts={opts}
                                onReady={this._onReady}
                                onPlay={this._onPlay}
                            />
                        </MdlCell>
                    </MdlGrid>
                </div>
            </section>
        )
    }
}

Section.propTypes = {
    id: PropTypes.string.isRequired,
    webrtc: PropTypes.object.isRequired
};

export default Section;
