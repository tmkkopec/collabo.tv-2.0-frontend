import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MdlGrid from '../../mdl/MdlGrid';
import MdlCell from '../../mdl/MdlCell';
import VideoController from "../video/VideoController";
import YouTube from 'react-youtube';


class Section extends Component {
    constructor(props) {
        super(props);

        this.player = undefined;
        this.interval = undefined;

        this.state = {
            remoteVideos: {},
            activeVideo: 'VZzFEHqSddU',
            channel: undefined,
            name: undefined,
            room: undefined,
            owner: undefined
        };
        Section.instance = this;
        this._onReady = this._onReady.bind(this);
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
        if (this.state.owner === true) {
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

    componentDidMount() {
        this.props.webrtc.section = this;
        this.props.webrtc.register();
    }

    render() {
        const opts = {
            height: '450',
            width: '800',
            playerVars: {
                autoplay: 0,
                enablejsapi: 1,
                origin: `${window.location.protocol}'//'${window.location.host}`,
                controls: this.state.owner === false ? 0 : 1
            }
        };

        return (
            <section className="mdl-layout__tab-panel is-active full-screen" id={'scroll-tab-' + this.props.id}>
                <div className="page-content full-screen">
                    <MdlGrid className={'full-screen'}>
                        <MdlCell cellWidth={7}
                                 style={this.state.owner === false ? {'pointerEvents': 'none'} : {'pointerEvents': 'auto'}}>
                            <YouTube
                                videoId={this.state.activeVideo}
                                opts={opts}
                                onReady={this._onReady}
                            />
                        </MdlCell>
                        <MdlCell cellWidth={5}>
                            <VideoController
                                localUsername={this.props.webrtc.name}
                                remoteVideos={this.state.remoteVideos}
                                toggleAudio={this.props.webrtc.toggleAudio}
                                toggleVideo={this.props.webrtc.toggleVideo}
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