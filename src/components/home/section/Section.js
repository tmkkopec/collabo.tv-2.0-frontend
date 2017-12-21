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
	this.ownerName = undefined;
        this.state = {
            remoteVideos: {},
            activeVideo: 'VZzFEHqSddU',
            channel: undefined,
            name: undefined,
            room: undefined,
            owner: undefined,
		creator: undefined,
		socket: undefined,
	    		
        };
        Section.instance = this;	

        this._onReady = this._onReady.bind(this);
        this.changeVideo = this.changeVideo.bind(this);
        this.sendCurrentStatus = this.sendCurrentStatus.bind(this);
        this.startSynchronize = this.startSynchronize.bind(this);
	 this.stopBeOwner = this.stopBeOwner.bind(this);
 	this.changOwnerName = this.changOwnerName.bind(this);
	this.becomeNewOwner = this.becomeNewOwner.bind(this);
        //this.updateStatus = this.updateStatus.bind(this);
        this.updateVideoTime = this.updateVideoTime.bind(this);
        this.updateVideoState = this.updateVideoState.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
       // this.updateOwner = this.updateOwner.bind(this);
	this.setOwnerName = this.setOwnerName.bind(this);
	this.scrollVideo = this.scrollVideo.bind(this); 
	this.createNewDatachannel = this.createNewDatachannel.bind(this);
	this.leaveDataChannel = this.leaveDataChannel.bind(this);
    }

    setOwnerName(name){
	this.ownerName=name;
    }

    changeVideo(video) {
        this.state.channel.send({'video' : video});
        this.setState({activeVideo: video});
    }

    startSynchronize() {
        if (this.state.owner === true) {
		
            this.interval = setInterval(this.sendCurrentStatus, 700);
        }
    }
	
	changOwnerName(msg){
		if(msg.name !== this.state.room)
		this.state.room=msg.name;
	}

	stopBeOwner(newOwner){
		console.log(this.interval);
		clearInterval(this.interval);
		this.setOwnerName(newOwner);
		const message = {
			    id: 'newOwner',
			    room: this.state.room,
			    owner: newOwner,
			    todo: "setOwners"	
			};
			
			
		this.state.socket.emit('message', message);
 		this.setState({owner: false});
		
		console.log("nowy owner" + newOwner);
	}

	becomeNewOwner(){
		this.setState({owner: true});
		this.state.channel.send({'video' : this.state.activeVideo});
		this.startSynchronize();
	}

	createNewDatachannel(){
		console.log("czas stworzyc nowy kanał ichhhhhhhha");
	
	this.state.channel.open(this.state.room);
		
	/* !!!!!!!!!!!!!
		const message = {
		    id: 'createNewChannel',
		    room: this.state.room,
		    ownerName: this.state.name	
		};
	
			this.state.socket.emit('message', message);
			
		console.log("poszlo");

	*/
		
	}	

	leaveDataChannel(){
		console.log("WYCHODZIMY");
		this.state.channel.leave();
	}

	controlFromRemote(msg) {
        	if(msg.do == "pause") this.player.pauseVideo();
		else if(msg.do == "play") this.player.playVideo();
		else if(msg.do == "scroll") {
			this.player.seekTo(msg.time);
		}		
	

   	 }


	changeAllow(msg) {
        	if(msg.perm == true) {
		
		document.getElementById("PlayButton").disabled = false;
		document.getElementById("PauseButton").disabled = false;
		}
		else {
		document.getElementById("PlayButton").disabled = true;
		document.getElementById("PauseButton").disabled = true;
		
		}		

   	 }

	 sendVideo(msg) {

         
	this.state.channel.channels[msg.user].send({'video' : this.state.activeVideo});
/*
	const message = {
          		  "changeOwner": true,
          		  "name": this.state.room
         		 
      		  };
	this.channel.channels[msg.user].send(message);
*/
    }	

    sendCurrentStatus() {
	if(this.state.owner) {
        const state = {
            'time': this.player.getCurrentTime(),
            'state': this.player.getPlayerState()
        };
	
        this.state.channel.send(state);
	}
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
        if (state !== newState && state != 3 ) {
            console.log(newState + " " + state);
            if ( newState === 1 ) this.player.playVideo();
            if ( newState === 2 ) this.player.pauseVideo();
        }
    }

       updateVideo(newVideo) {
	console.log(newVideo);
	if(this.state.activeVideo !== newVideo){
        		this.setState({activeVideo: newVideo});
		}
	}

    
	updateStatus(status) {
	//console.log("KWAS");
        const time = this.player.getCurrentTime();
        if (time > status.time + 1 || time < status.time - 1) {
            if (this.player.getPlayerState() !== 3) {
                this.player.seekTo(status.time);
                console.log(status.time + " " + time);
            }
        }

        const state = this.player.getPlayerState();
        if (state !== status.state && state != 3 ) {
            console.log(status.state + " " + state);
            if ( status.state === 1 ) this.player.playVideo();
            if ( status.state === 2 ) this.player.pauseVideo();
        }

        if (status.video) {
            this.setState({activeVideo: status.video});
        }
    }

	/* need fix, double invoke
    updateStatus(status) {
        Object.entries(status).forEach(obj => {
            const key = obj[0];
            const value = obj[1];
	console.log("KWAS");
	//console.log(status);
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
	*/
    setNewRoomOwner(newOwnerName) {
        this.state.channel.send({'owner': newOwnerName});
    }
	handlePlay() {
	   	
		  const remoteMesage = {
          		  "remoteControl": "true",
			  "do": "play"
          		 };
 		
		this.state.channel.channels[this.ownerName].send(remoteMesage);
		
		
  	}	

	handlePause() {
	   
		  const remoteMesage = {
          		  "remoteControl": "true",
			  "do": "pause"
          		 };
 		
		this.state.channel.channels[this.ownerName].send(remoteMesage);
		
  	}	
	handleMute() {
		//need toggle button
		if(this.player.isMuted()) {
			 this.player.unMute()
		}
		else {
			this.player.mute()
     		}
	}
	

	handlechuj(){
		/*
		  const siup = {
          		  "cos": "kot",
          		  "ktos": this.state.room
         		 
      		  };
 		
		var user="ala";
		this.state.channel.channels[user].send(siup);
		*/

		console.log("2###" + this.state.name + this.state.room + this.state.channel.channels );
		console.log(this.state.channel.channels);
		/*
		if(this.state.owner) this.setState({owner: false});
		else this.setState({owner: true});
		*/ 
		if(!this.state.owner){
		this.scrollVideo(50);
		}

		console.log("CCCCCCCC  " + this.ownerName);
	}
	
	 scrollVideo(event) {
   	 	var time = this.player.getDuration() * (event / 100) ;
		//console.log(time + "%%%%%%%%%%%%%%%%%%%%%" + event);
		//console.log( event);
   	 	 const remoteMesage = {
          		  "remoteControl": "true",
			  "do": "scroll",
			  "time" : time	
          		 };
		this.state.channel.channels[this.ownerName].send(remoteMesage);
	}


    _onReady(event) {
        this.player = event.target;
        this.player.playVideo();
	/*
	const message = {
            id: 'askWhoIsOwner',
            room: this.state.room,
	    todo: ""	
        };
	
	this.state.socket.emit('message', message);*/	
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
                        <MdlCell cellWidth={7}>
                            <YouTube
                                videoId={this.state.activeVideo}
                                opts={opts}
                                onReady={this._onReady}
                            />
                        </MdlCell>
                        <MdlCell cellWidth={5}>
                            
				<button onClick={(e) => this.handlechuj(e)}>
	    			 debbug
	   			 </button>
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
                            <UserTable remoteUsers={Object.keys(this.state.remoteVideos)}  channel={this.state.channel} stopBeOwner={this.stopBeOwner} /> :
                           <p>
				<button id="PlayButton" onClick={(e) => this.handlePlay(e)}>
	    			 PLAY
	   			 </button>

				<button id="PauseButton" onClick={(e) => this.handlePause(e)}>
	    			 Pause
	   			 </button>
				<button onClick={(e) => this.handleMute(e)}>
	    			 Mute
	   			 </button>

			
				
				<input type="number" max="100" min="0" onChange={(e) => this.scrollVideo(e) } />
			</p>
			
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
