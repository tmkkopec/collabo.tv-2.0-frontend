import io from 'socket.io-client';
import kurentoUtils from 'kurento-utils';
import Participant from './Participant';

export default class KurentoConfig {
    constructor(room, name) {
        this.ws = io.connect(`https://${window.location.host}`);
        this.participants = {};
        this.name = name;
        this.room = room;

        window.onbeforeunload = () => {
            this.logout();
        };

        this.ws.on('connect', () => {
            console.log('ws connect success');
        });

        this.ws.on('message', parsedMessage => {
            console.info('Received message: ' + parsedMessage.id);

            switch (parsedMessage.id) {
                case 'existingParticipants':
                    this.onExistingParticipants(parsedMessage);
                    break;
                case 'newParticipantArrived':
                    const remoteVideos = this._section.state.remoteVideos;
                    remoteVideos[parsedMessage.name] = '';

                    this._section.setState({remoteVideos: remoteVideos},
                        () => this.onNewParticipant(parsedMessage));
                    break;
                case 'participantLeft':
                    this.onParticipantLeft(parsedMessage);
                    break;
                case 'receiveVideoAnswer':
                    this.receiveVideoResponse(parsedMessage);
                    break;
                case 'iceCandidate':
                    this.participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate,
                        function (error) {
                            if (error)
                                return console.error("Error adding candidate: " + error);
                        });
                    break;
                default:
                    console.error('Unrecognized message', parsedMessage);
            }
        });

        this.toggleVideo = this.toggleVideo.bind(this);
        this.toggleAudio = this.toggleAudio.bind(this);
    }

    set section(section) {
        this._section = section;
    }

    register() {
        const message = {
            id: 'joinRoom',
            name: this.name,
            room: this.room,
        };

        this.sendMessage(message);
    }

    onNewParticipant(request) {
        this.receiveVideo(request.name);
    }

    receiveVideoResponse(result) {
        const remoteVideos = this._section.state.remoteVideos;
        const myName = this.name;
        this.participants[result.name].rtcPeer.processAnswer(result.sdpAnswer, function (error) {
                if (error)
                    return console.error(error);

                if (result.name !== myName)
                    remoteVideos[result.name] = document.querySelector(`#remote_${result.name}`).getAttribute('src');
            }
        );
    }

    onExistingParticipants(msg) {
        const constraints = {
            audio: true,
            video: {
                mandatory: {
                    maxWidth: 320,
                    maxFrameRate: 15,
                    minFrameRate: 15
                }
            }
        };
        console.log(this.name + " registered in room " + this.room);
        const participant = new Participant(this.name, this.ws);
        this.participants[this.name] = participant;
        const video = document.querySelector(`#local_${this.name}`);

        const options = {
            localVideo: video,
            mediaConstraints: constraints,
            onicecandidate: participant.onIceCandidate.bind(participant)
        };

        participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
            function (error) {
                if (error) {
                    return console.error(error);
                }
                this.generateOffer(participant.offerToReceiveVideo.bind(participant));
            }
        );

        const remoteVideos = msg.data.reduce(function (accumulator, current) {
            accumulator[current] = '';
            return accumulator;
        }, {});

        this._section.setState({remoteVideos: remoteVideos},
            () => msg.data.forEach(this.receiveVideo.bind(this)));
    }

    logout() {
        this.sendMessage({
            id: 'leaveRoom'
        });

        for (let key in this.participants) {
            this.participants[key].dispose();
        }

        this.ws.close();
    }

    receiveVideo(sender) {
        const participant = new Participant(sender, this.ws);
        this.participants[sender] = participant;
        const video = document.querySelector('#remote_' + sender);

        const options = {
            remoteVideo: video,
            onicecandidate: participant.onIceCandidate.bind(participant)
        };

        participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
            function (error) {
                if (error) {
                    return console.error(error);
                }
                this.generateOffer(participant.offerToReceiveVideo.bind(participant));
            }
        );
    }

    onParticipantLeft(request) {
        console.log('Participant ' + request.name + ' left');
        const participant = this.participants[request.name];
        participant.dispose();

        const remoteVideos = this._section.state.remoteVideos;
        delete remoteVideos[request.name];
        this._section.setState({remoteVideos: remoteVideos});

        delete this.participants[request.name];
    }

    sendMessage(message) {
        console.log('Sending message: ' + message.id);
        this.ws.emit('message', message);
    }

    toggleAudio(name, isRemote) {
        let audioTracks;
        switch(isRemote) {
            case true:
                audioTracks = this.participants[name].rtcPeer.getRemoteStream().getAudioTracks();
                break;
            case false:
                audioTracks = this.participants[name].rtcPeer.getLocalStream().getAudioTracks();
                break;
            default:
                console.error('Argument \'isLocal\' is not an instance of boolean\'');
                return;
        }

        // if MediaStream has reference to microphone
        if (audioTracks[0]) {
            audioTracks[0].enabled = !audioTracks[0].enabled;
        }
    }

    toggleVideo(name, isRemote) {
        let videoTracks;
        switch(isRemote) {
            case true:
                videoTracks = this.participants[name].rtcPeer.getRemoteStream().getVideoTracks();
                break;
            case false:
                videoTracks = this.participants[name].rtcPeer.getLocalStream().getVideoTracks();
                break;
            default:
                console.error('Argument \'isLocal\' is not an instance of boolean\'');
                return;
        }

        // if MediaStream has reference to web cam
        if (videoTracks[0]) {
            videoTracks[0].enabled = !videoTracks[0].enabled;
        }
    }
}
