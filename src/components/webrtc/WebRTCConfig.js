import io from 'socket.io-client';
import kurentoUtils from 'kurento-utils';
import Participant from './Participant';

let currentRoom = "";

class WebRTCConfig {
    constructor(roomID) {
        const self = this;
        this._section = undefined;
        this.isChannelReady = false;
        this.isInitiator = false;
        this.isStarted = false;
        this.isClosed = false;
        this.localStream = undefined;
        this.sender = undefined;
        this.pc = {};
        this.socket = io.connect();

        this.socket.on('created', function (room) {
            currentRoom = room;
            console.log('Created room ' + room);
            self.isInitiator = true;
        });

        this.socket.on('full', function (room) {
            console.log('Room ' + room + ' is full');
        });

        this.socket.on('join', function (room) {
            console.log('Another peer made a request to join room ' + room);
            self.isChannelReady = true;
        });

        this.socket.on('joined', function (room) {
            currentRoom = room;
            console.log('joined: ' + room);
            self.isChannelReady = true;
        });

        this.socket.on('log', function (array) {
            console.log.apply(console, array);
        });

        this.socket.on('message', function (message) {
            console.log('Client received message:', message);
            if (message === 'got user media') {
                self.isStarted = false;
                self.maybeStart();
            } else if (message.type === 'offer') {
                console.log('received offer!', message);
                self.doAnswer(message);
            } else if (message.type === 'answer' && self.isStarted) {
                self.pc.setRemoteDescription(message)
                    .then(() => {
                        console.log("FINAL PC AFTER SET REMOTE", self.pc);
                    });
            } else if (message.type === 'candidate' && self.isStarted) {
                let candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                self.pc.addIceCandidate(candidate);
            } else {
                console.warn("UNRECOGNIZED MESSAGE RECEIVED", message, "isStarted", self.isStarted);
            }
        });

        const room = roomID;
        if (room !== '') {
            this.socket.emit('create or join', room);
        }

        window.onbeforeunload = function () {
            if (self.isStarted) {
                self.pc.removeTrack(self.sender);
            }
        };

        this.gotStream = this.gotStream.bind(this);
        this.setLocalAndSendMessage = this.setLocalAndSendMessage.bind(this);
        this.handleIceCandidate = this.handleIceCandidate.bind(this);
        this.handleRemoteStreamAdded = this.handleRemoteStreamAdded.bind(this);
        this.handleRemoteStreamRemoved = this.handleRemoteStreamRemoved.bind(this);
        this.handleNegotiation = this.handleNegotiation.bind(this);
    }

    set section(section) {
        this._section = section;
    }

    sendMessage(message) {
        console.log('Client sending message: ', message);
        this.socket.emit('message', message);
    }


    gotStream(stream) {
        this.createPeerConnection();
        this.localStream = stream;
        document.querySelector("#localVideo").srcObject = stream;
        this.sendMessage('got user media');
        if (this.isInitiator) {
            this.maybeStart();
        }
    }

    maybeStart() {
        console.log('>>>>>>> maybeStart() ', this.isStarted, this.sender, this.isChannelReady);
        console.log('LOCAL TRACKS', this.localStream.getTracks());
        if (!this.isStarted && this.isChannelReady) {
            console.log('>>>>>> creating peer connection');

            if (this.isClosed) {
                this.createPeerConnection();
                this.isClosed = false;
            }

            this.localStream.getTracks().forEach(track => {
                console.log('ADDING TRACK', track);
                this.sender = this.pc.addTrack(track, this.localStream);
            });
            console.log('GET SENDERS', this.pc.getSenders(), 'GET RECEIVERS', this.pc.getReceivers());
            this.isStarted = true;
        }
    }

    createPeerConnection() {
        try {
            const configuration = {
                iceServers: [
                    {
                        urls: 'stun:stun.l.google.com:19302'
                    }]
            };
            this.pc = new RTCPeerConnection(configuration);
            this.pc.onicecandidate = this.handleIceCandidate;
            this.pc.ontrack = this.handleRemoteStreamAdded;
            this.pc.onremovestream = this.handleRemoteStreamRemoved;
            this.pc.onnegotiationneeded = this.handleNegotiation;
            console.log('Created RTCPeerConnection');
        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert('Cannot create RTCPeerConnection object.');
        }
    }

    handleIceCandidate(event) {
        if (event.candidate) {
            this.sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
            console.log('End of candidates.');
        }
    }

    handleRemoteStreamAdded(track) {
        const ids = this._section.state.remoteVideoIDs;
        let newId = track.streams[0].id;
        newId = newId.substring(1, newId.length - 1);

        this._section.setState({
            remoteVideoIDs: ids.concat([newId])
        }, () => {
            console.log('Adding remote stream for ' + newId, track);
            document.querySelector('#r' + newId).srcObject = track.streams[0];
        });
    }

    handleRemoteStreamRemoved(event) {
        this.isClosed = true;
        console.log('Remote stream removed. Event: ', event);
        const ids = this._section.state.remoteVideoIDs;
        let toRemoveId = event.stream.id;
        toRemoveId = toRemoveId.substring(1, toRemoveId.length - 1);

        for (let i = 0; i < ids.length; i++)
            if (ids[i] === toRemoveId) {
                ids.splice(i, 1);
                break;
            }

        this._section.setState({
            remoteVideoIDs: ids
        });
    }

    handleCreateOfferError(event) {
        console.log('createOffer() error: ', event);
    }

    handleNegotiation() {
        console.log('Sending offer to peer');
        this.pc.createOffer(this.setLocalAndSendMessage, this.handleCreateOfferError);
    }

    doAnswer(message) {
        console.log('Sending answer to peer');
        this.pc.setRemoteDescription(message)
            .then(() => {
                console.log('PC', this.pc);
                this.pc.createAnswer()
                    .then((description) => {
                        this.maybeStart();
                        this.setLocalAndSendMessage(description);
                    })
                    .catch((error) => this.onCreateSessionDescriptionError(error));
            })
            .catch((error) => console.error(error));
    }

    setLocalAndSendMessage(sessionDescription) {
        this.pc.setLocalDescription(sessionDescription);
        console.log('setLocalAndSendMessage sending message', sessionDescription);
        this.sendMessage(sessionDescription);
    }

    onCreateSessionDescriptionError(error) {
        console.error('Failed to create session description: ' + error.toString());
    }

    logout() {
        if (this.isStarted) {
            this.socket.emit("logout", currentRoom);
            this.pc.removeTrack(this.sender);
        }
    }

}

export default class A {
    constructor(room, name) {
        this.ws = io.connect(`https://${window.location.host}`);
        this.participants = {};
        this.name = name;
        this.room = room;

        window.onbeforeunload = () => {
            this.ws.disconnect();
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
                    const ids = this._section.state.remoteVideoIDs;

                    this._section.setState({remoteVideoIDs: ids.concat([parsedMessage.name])},
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
                            if (error) {
                                console.error("Error adding candidate: " + error);
                                return;
                            }
                        });
                    break;
                default:
                    console.error('Unrecognized message', parsedMessage);
            }
        });
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
        this.participants[result.name].rtcPeer.processAnswer(result.sdpAnswer, function (error) {
                if (error) return console.error(error);
            }
        );
    }

    // callResponse(message) {
    //     if (message.response != 'accepted') {
    //         console.info('Call not accepted by peer. Closing call');
    //         stop();
    //     } else {
    //         webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
    //                 if (error)
    //                     return;
    //                 console.error(error);
    //             }
    //         )
    //         ;
    //     }
    // }

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
        const video = document.querySelector("#localVideo");

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

        msg.data.forEach(this.receiveVideo);
    }

    //!!!!!!!!!!!!!!!!!!!!!!!
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
        const video = document.querySelector('#r' + sender);
        console.log('remoteVideo', video);
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

        const ids = this._section.state.remoteVideoIDs;
        ids.splice(ids.indexOf(request.name), 1);
        this._section.setState({remoteVideoIDs: ids});

        delete this.participants[request.name];
    }

    sendMessage(message) {
        console.log('Sending message: ' + message.id);
        this.ws.emit('message', message);
    }
}
