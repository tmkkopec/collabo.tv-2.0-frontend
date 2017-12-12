import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MdlGrid from '../../mdl/MdlGrid';
import MdlCell from '../../mdl/MdlCell';
import VideoController from '../video/VideoController';
import UserTable from '../usersPanel/UsersTable';
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
        this.updateVideoTime = this.updateVideoTime.bind(this);
        this.updateVideoState = this.updateVideoState.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
        this.updateOwner = this.updateOwner.bind(this);
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
            'time': this.player.getCurrentTime(),
            'state': this.player.getPlayerState()
        };
        this.state.channel.send(state);
    }

    updateVideoTime(newTime) {
        const time = this.player.getCurrentTime();
        if (time > newTime + 1 || time < newTime - 1) {
            if (this.player.getPlayerState() !== 3) {
                this.player.seekTo(newTime);
                console.log(newTime + " " + time);
            }
        }
    }

    updateVideoState(newState) {
        const state = this.player.getPlayerState();
        if (state !== newState) {
            console.log(newState + " " + state);
            if (newState === 1 && state === 2) this.player.playVideo();
            if (newState === 2 && state === 1) this.player.pauseVideo();
        }
    }

    updateVideo(newVideo) {
        this.player.loadVideoById(newVideo);
    }

    updateOwner(newOwner) {
        if (this.state.name === newOwner) {
            // this.setState({owner: true}, () => this.startSynchronize());
        }
    }

    updateStatus(status) {
        Object.entries(status).forEach(obj => {
            const key = obj[0];
            const value = obj[1];

            switch (key) {
                case 'time':
                    this.updateVideoTime(value);
                    break;
                case 'state':
                    this.updateVideoState(value);
                    break;
                case 'video':
                    this.updateVideo(value);
                    break;
                case 'owner':
                    this.updateOwner(value);
                    break;
                default:
                    console.error(`Unhandled status key, value pair: {${key}: ${value}}`);
                    break;
            }
        });
    }

    setNewRoomOwner(newOwnerName) {
        this.state.channel.send({'owner': newOwnerName});
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
                autoplay: 1,
                enablejsapi: 1,
                origin: `${window.location.protocol}'//'${window.location.host}`,
                controls: this.state.owner === false ? 0 : 1,
                showinfo: 0
            }
        };

        return (
            <section className="mdl-layout__tab-panel is-active" id={'scroll-tab-' + this.props.id}>
                <div className="page-content">
                    <MdlGrid className={'full-screen'}>
                        <MdlCell cellWidth={7}
                                 style={this.state.owner === false ? {'pointerEvents': 'none'} : {'pointerEvents': 'auto'}}>
                                 <div className="collabo-video">
                            <YouTube
                                videoId={this.state.activeVideo}
                                opts={opts}
                                onReady={this._onReady}
                            />
                            </div>
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
                    <MdlGrid>
                        {this.state.owner === true ?
                            <UserTable remoteUsers={Object.keys(this.state.remoteVideos)} channel={this.state.channel}/> :
                            <p>Not an owner</p>
                        }
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