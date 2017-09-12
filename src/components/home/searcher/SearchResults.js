import React, { Component } from 'react';
import YoutubeCell from "./YoutubeCell"

export default class SearchResults extends Component {

    constructor(props) {
        super(props);
        this.state = {visible: props.visible, items: []}

    }

    render(){

        if(this.props.visible)
        {
            if(this.props.items){
                console.log(this.props.items[0])
                return(
                    <div className="mdl-grid mdl-cell--stretch">
                        <YoutubeCell thumbnail={this.props.items[0].snippet.thumbnails.default.url}
                            title={this.props.items[0].snippet.title} author={this.props.items[0].snippet.channelTitle}/>
                    </div>);
            }
            else {
                return(
                    <div className="mdl-cell mdl-textfield">
                        <label className="mdl-textfield__label">No results</label>
                    </div>
                );
            }
        }
        else {
            return(
                <div className="mdl-cell">
                </div>
            );
        }
    }
}