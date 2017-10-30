import React, {Component} from 'react';
import MdlCell from "../../mdl/MdlCell";

export default class VideoOptions extends Component {
    render() {
        return (
            <MdlCell cellWidth={2}>
                <button className="mdl-button mdl-js-button mdl-button--icon">
                    <i className="material-icons">mic_off</i>
                </button>
                <button className="mdl-button mdl-js-button mdl-button--icon">
                    <i className="material-icons">videocam_off</i>
                </button>
            </MdlCell>
        )
    }
}

