import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Video from './Video';
import MdlGrid from '../../mdl/MdlGrid';
import MdlCell from '../../mdl/MdlCell';
import YouTube from 'react-youtube';
import RTCconf from '../../webrtc/WebRTCConfig';
import {getChannel} from '../../webrtc/WebRTCConfig'; // or './module'
import * as DC from 'datachannel';



export function setParams(Channel, Name, Room, Owner){
	/*	
	console.log(Channel);	
	console.log(Name);
	console.log(Room);
	console.log(Owner);*/
	channel=Channel;
	name=Name;
	room=Room;
	owner=Owner;
}

export function updateStatus(status){
	/*if(player.getVideoUrl() !== status.name){
		console.log(status.name +" " +player.getVideoUrl());
		}*/
	var time = player.getCurrentTime();
	if(time > status.time +1 || time < status.time -1 ){
		if(player.getPlayerState() != 3){
				player.seekTo(status.time);
				console.log(status.time+ " " +time);	
			}
		}
		
	var state=player.getPlayerState()
	if( state!== status.state){
		console.log(status.state+ " " +state );
		if (status.state == 1 && state == 2) player.playVideo();
		if (status.state == 2 && state == 1) player.pauseVideo();
		}

	if(status.video){
		player.loadVideoById(status.video);
	}
}



function sendCurrentStatus() {
	var state ={
		"name": player.getVideoUrl() ,
		"time": player.getCurrentTime(),
		"state": player.getPlayerState()
	}
	//channel.send(player.getCurrentTime());
	//channel.send(player.getVideoUrl());
	//channel.send(player.getPlayerState());
	channel.send(state);
}
export function startSynchronize() {
	if(owner){
	interval = setInterval(sendCurrentStatus, 700);
	}
}
const uniqueId = require('lodash/uniqueId');
var channel;
var name;
var room;
var owner;
var player;
var interval;

class Section extends Component {
    constructor(props) {
        super(props);
	
 	

        this.state = {
            remoteVideos: {},
            activeVideo: 'GPqbZsyl-bs'
        };
        Section.instance = this;
        this.changeVideo = this.changeVideo.bind(this)
    }
		
    changeVideo(video) {
	var newVideo ={'video' : video};
	channel.send(newVideo);
        this.setState({activeVideo: video});
    }

    componentDidMount() {
        this.props.webrtc.section = this;
        this.props.webrtc.register();
    }

	
	
	 _onReady(event) {
    // access to player in all event handlers via event.target
	
	//channel = getChannel();
	
	player= event.target;
	player.playVideo()
	//setTimeout(player.pauseVideo(), 2000);
   	 
  }
   _onPlay(event) {
    console.log("go");
	
	//this.state.player.playVideo();
  }
	

    render() {

	const opts = {
      height: '360',
      width: '480',
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
				
			
                        </MdlCell>
                    </MdlGrid>
                </div>
            </section>
        )
    }
}


//player=YouTube.player;

Section.propTypes = {
    id: PropTypes.string.isRequired,
    webrtc: PropTypes.object.isRequired
};

export default Section;
