import io from 'socket.io-client';
import kurentoUtils from 'kurento-utils';
import Participant from './Participant';


export default class KurentoConfig {
    constructor(room, name, onLogout) {
        this.ws = io.connect(`${window.location.protocol}//${window.location.host}`);
        this.participants = {};
        this.name = name;
        this.room = room;
        this.ownerName = "";
        this.roomOwner = false;
        this.onLogout = onLogout;
        var tmp;
        this.roomCreator = false;
        this.channel = new window.DataChannel();
        this.channel.userid = this.name;

        //this.channel.autoCloseEntireSession = true;
        let onMessageCallbacks = {};
        let socket = this.ws;
        let CurrentRoom = this.room;
        this.channel.openSignalingChannel = function (config) {
            let channel = config.channel || this.channel;
            onMessageCallbacks[channel] = config.onmessage;

            if (config.onopen) setTimeout(config.onopen, 1000);
            return {
                send: function (message) {
                    socket.emit('messageDC', {
                        sender: channel.userid,
                        channel: channel,
                        message: message
                    });
                },
                channel: channel
            };
        };
        //jakos trzeba zmienic bo nie dzialalo w tej funkcji

        this.channel.onopen = () => {
            console.log("ONOPEN");
            if (this.roomOwner) {
                this._section.startSynchronize()
                //this.roomOwner=false;
            }
            else {
                console.log("zapytaj o film");

                setTimeout(function () {
                    const message = {
                        id: 'askWhoIsOwner',
                        room: CurrentRoom,
                        todo: "askFilmUrlAndSetOwner"
                    };
                    console.log(socket);
                    socket.emit('message', message);

                }, 10);
                //
            }
        };
        /*
                this.channel.onleave = function (userid) {
                console.log(userid +"   wyszedl");
            };
            */
        /*

        this.channel.onclose = () => {
        console.log("WYJEBALO NAM CHANELA");
        console.log(tmp);
            if(tmp){
                this._section.createNewDatachannel();

                }
        }
        */

        this.channel.onmessage = msg => {

            if (msg.time || msg.video) {
                //console.log("ODEBRANO");
                //console.log(msg);
                this._section.updateStatus(msg);

            }
            else if (msg.kick) {
                console.log(msg.kick);
                this.logout();
                this.onLogout();
            }


            else if (msg.remoteControl) {

                this._section.controlFromRemote(msg)
            }

            else if (msg.changeUserAllow) {

                this._section.changeAllow(msg)
            }


            else if (msg.getVideo) {

                this._section.sendVideo(msg)
            }

            else if (msg.changeOwner) {

                this._section.changOwnerName(msg)
            }

            else if (msg.newOwner) {

                this._section.becomeNewOwner()
            }

            else if (msg.creatorLeft) {
                this._section.leaveDataChannel();
            }

            else if (msg.creatorLeft) {
                this._section.leaveDataChannel();
            }

            else if (msg.createNewDatachannel) {
                this.roomCreator = true;
                this._section.createNewDatachannel();
            }


        };

        window.onbeforeunload = () => {
            this.logout();
        };

        this.ws.on('connect', () => {
            console.log('ws connect success');
        });

        this.ws.on('CreatedRoom', Owner => {
            this.roomOwner = Owner;
            if (this.roomOwner) {
                this.roomCreator = true;
                this.ownerName = this.name;
                // this.channel.userid = CurrentRoom;
                this.channel.open(CurrentRoom);
                console.log(this.channel);
            }
            else {

                this.channel.connect(CurrentRoom);
                console.log(this.channel);
                console.log(CurrentRoom);
            }

            this._section.setState({
                channel: this.channel,
                name: this.name,
                room: this.room,
                owner: this.roomOwner,
                socket: this.ws,
                creator: this.roomCreator
            })
        });


        this.ws.on('messageDC', data => {
            console.log('messageDC ' + data);
            if (data.sender === this.channel.userid) return;

            if (onMessageCallbacks[data.channel]) {
                onMessageCallbacks[data.channel](data.message);
            }
        });


        this.ws.on('message', parsedMessage => {
            console.info('Received message: ' + parsedMessage.id);

            switch (parsedMessage.id) {
                case 'owner':
                    console.log("############################################################################");
                    console.log(parsedMessage.owner);
                    console.log(parsedMessage.todo);
                    if (parsedMessage.todo == 'askFilmUrlAndSetOwner') {
                        this.ownerName = parsedMessage.owner;
                        this._section.setOwnerName(parsedMessage.owner);

                        const msg = {
                            "getVideo": true,
                            "user": this.name
                        };
                        this.channel.channels[parsedMessage.owner].send(msg)

                    }

                    if (parsedMessage.todo == 'setOwners') {
                        console.log("ZZZZZZZ" + parsedMessage.owner);
                        this.ownerName = parsedMessage.owner;
                        console.log(this.name + " " + parsedMessage.owner)
                        if (this.name == parsedMessage.owner) {
                            this.roomOwner = true;
                            tmp = true;
                        }
                        else this.roomOwner = false;
                        console.log(this.roomOwner);
                        this._section.setOwnerName(parsedMessage.owner);

                    }
                    break;


                case 'connectToNewChannel':
                    console.log("HUHUHUHU");


                    this.channel.connect(CurrentRoom);
                    console.log("CZY TERAZ JUZ DZIAŁA?");


                    break;
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
        if (this.roomOwner) {
            //wyloguj wszystkich
        }
        else if (this.roomCreator) {
            //stowrz nowy kanal z ownera
            //this.channel.send({creatorLeft : true}); //creatorLeft
            this.channel.channels[this.ownerName].send({createNewDatachannel: true});
            //this.channel.autoCloseEntireSession = true;
            this.channel.leave();
        }
        /*

            if (this.roomOwner === true) {
                for (let key in this.participants)
                    if (key !== this.name) {
                        this._section.setNewRoomOwner(key);
                        break;
                    }
            }*/

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
        switch (isRemote) {
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
        switch (isRemote) {
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
