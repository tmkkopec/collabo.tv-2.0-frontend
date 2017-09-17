/**
 * Creates a video element for a new participant
 *
 * @param {String} name - the name of the new participant, to be used as tag
 *                        name of the video element.
 *                        The tag of the new element will be 'video<name>'
 *
 * @param {WebSocket} ws
 * @return
 */
export default function Participant(name, ws) {
    this.name = name;
    this.ws = ws;

    var rtcPeer;

    this.sendMessage = function (message) {
        console.log('Sending message: ' + message.id);
        this.ws.emit('message', message);
    };

    this.offerToReceiveVideo = function (error, offerSdp, wp) {
        if (error) return console.error("sdp offer error");
        console.log('Invoking SDP offer callback function');
        const msg = {
            id: "receiveVideoFrom",
            sender: name,
            sdpOffer: offerSdp
        };
        this.sendMessage(msg);
    };


    this.onIceCandidate = function (candidate, wp) {
        console.log("Local candidate" + candidate);

        const message = {
            id: 'onIceCandidate',
            candidate: candidate,
            sender: name
        };
        this.sendMessage(message);
    };

    Object.defineProperty(this, 'rtcPeer', {writable: true});

    this.dispose = function () {
        console.log('Disposing participant ' + this.name);
        this.rtcPeer.dispose();
    };
}