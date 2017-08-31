import React, { Component } from 'react';
import Header from "./Header";
import Drawer from "./Drawer";
import SectionsController from './section/SectionsController';
import * as Cookie from 'js-cookie';
import WebRTCConfig from "../webrtc/WebRTCConfig";

export default class HomePage extends Component {
    static isPrivate = true;

    constructor(props) {
        super(props);

        this.roomIDs = [Cookie.get('roomId')];
        this.webrtc = new WebRTCConfig(this.roomIDs[0]);

        this.onLogout = this.onLogout.bind(this);
    }

    onLogout() {
        fetch('/auth/logout', {credentials: 'include'})
            .then(() => {
                this.webrtc.logout();
                window.location.replace('/');
            })
            .catch(console.log);
    }

    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-tabs mdl-layout--fixed-header">
                <Header onLogout={this.onLogout} roomIDs={this.roomIDs}/>
                <Drawer/>
                <SectionsController sectionIDs={this.roomIDs} webrtc={this.webrtc}/>
            </div>
        )
    }
}
