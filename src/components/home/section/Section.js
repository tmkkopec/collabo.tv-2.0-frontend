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
	
	
	 _onReady(event) {
    // access to player in all event handlers via event.target
	
	channel = getChannel();
	
	player= event.target;
	player.playVideo()
	setTimeout(player.pauseVideo(), 2000);
   	 
  }
   _onPlay(event) {
    console.log("go");
	
	//this.state.player.playVideo();
  }
	

    render() {

	const opts = {
      height: '1000',
      width: '1000',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
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
        		onReady={this._onReady}
			onPlay={this._onPlay}
			
     			 />
			{/*
                            <div id="video">
                                <iframe title="centerVideo"
                                        src={"https://www.youtube.com/embed/" + this.state.activeVideo}/>
                            </div>*/}
				
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
