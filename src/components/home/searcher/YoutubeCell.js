import React, {Component} from 'react';
import Section from "../section/Section"

export default class YoutubeCell extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        Section.instance.changeVideo(this.props.items.id.videoId)
        event.preventDefault();
    }

    render() {
        return (
            <div className="mdl-cell--12-col" onClick={this.onClick}>
                <div className="mdl-grid">
                    <div className="mdl-cell--4-col">
                        <img src={this.props.items.snippet.thumbnails.default.url}
                             alt={this.props.items.snippet.title}/>
                    </div>
                    <div className="mdl-cell--8-col">
                        <div className="mdl-grid">
                            <div className="mdl-cell--12-col mdl-textfield mdl-js-textfield">
                                <b>{this.props.items.snippet.title}</b>
                                <br/>
                                <small>{this.props.items.snippet.channelTitle}</small>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}