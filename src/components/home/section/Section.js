import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Video from './Video';
import MdlGrid from '../../mdl/MdlGrid';
import MdlCell from '../../mdl/MdlCell';
import YouTube from 'react-youtube';
import RTCconf from '../../webrtc/WebRTCConfig';
import {getChannel} from '../../webrtc/WebRTCConfig'; // or './module'
import * as DC from 'datachannel';

export function play() {
     player.playVideo();
}
export function pause() {
     player.pauseVideo();
}
const uniqueId = require('lodash/uniqueId');
var channel;
var player;
class Section extends Component {
    constructor(props) {
        super(props);
	
 	

        this.state = {
            remoteVideos: {},
            activeVideo: 'sJYBaaUVh20'
        };
        Section.instance = this;
        this.changeVideo = this.changeVideo.bind(this)

        this.onPlay=this.onPlay.bind(this);
        this.onReady=this.onReady.bind(this);
        this.onError=this.onError.bind(this);
        this.onPause=this.onPause.bind(this);
        this.onEnd=this.onEnd.bind(this);
        this.onStateChange=this.onStateChange.bind(this);
        this.onPlaybackRateChange=this.onPlaybackRateChange.bind(this);
        this.onPlaybackQualityChange=this.onPlaybackQualityChange.bind(this);
        this.handlePlay=this.handlePlay.bind(this);
    }
    changeVideo(video) {
        this.setState({activeVideo: video})
    }

    componentDidMount() {
        this.props.webrtc.section = this;
        this.props.webrtc.register();
    }
    handlePause() {
	
      channel.send('/pause');
	pause();
	 
  }
    handlePlay() {
    	channel.send('/play');
	play();
 	
  }	
	
	
	onReady(event) {
        console.log("onReady");
   	 
    }
    onPlay(event) {
        console.log("onPlay");
    }
    onError(event) {
        console.log("onError");
    }
    onPause(event) {
        console.log("onPause");
    }
    onEnd(event) {
        console.log("onEnd");
    }
    onStateChange(event) {
        console.log("onStateChange");
    }
    onPlaybackRateChange(event) {
        console.log("onPlaybackRateChange");
    }
    onPlaybackQualityChange(event) {
        console.log("onPlaybackQualityChange");
    }
	

    render() {

	const opts = {
      height: '1000',
      width: '1000',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay:1,
        enablejsapi: 1,
        origin:window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '')
      }
	};
        const cellWidth = Math.max(12/(Object.keys(this.state.remoteVideos).length + 1), 6);
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
                        <MdlCell cellWidth={6}>

			<YouTube
       			 videoId={this.state.activeVideo}
        		opts={opts}
        	onReady={this.onReady}
            onPlay={this.onPlay}
            onError={this.onError}
            onPause={this.onPause}
            onEnd={this.onEnd}
            onStateChange={this.onStateChange}
            onPlaybackRateChange={this.onPlaybackRateChange}
            onPlaybackQualityChange={this.onPlaybackQualityChange}			
     			 />
			 <button onClick={(e) => this.handlePause(e)}>
       			 PAUSE
      			</button>
			 <button onClick={(e) => this.handlePlay(e)}>
      			 PLAY
     			 </button>
                        </MdlCell>
                    </MdlGrid>
                </div>
            </section>
        )
    }
}


player=YouTube.player;

Section.propTypes = {
    id: PropTypes.string.isRequired,
    webrtc: PropTypes.object.isRequired
};

export default Section;
