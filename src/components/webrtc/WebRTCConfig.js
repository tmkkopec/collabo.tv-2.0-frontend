import io from 'socket.io-client';
import kurentoUtils from 'kurento-utils';
import Participant from './Participant';

let currentRoom = "";

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

        msg.data.forEach(this.receiveVideo.bind(this));
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
        const video = document.querySelector('#r' + sender);

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
