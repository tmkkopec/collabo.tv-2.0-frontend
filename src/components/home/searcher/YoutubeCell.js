import React, { Component } from 'react';

export default class YoutubeCell extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className="mdl-cell--12-col">
                <div className="mdl-grid">
                    <div className="mdl-cell--6-col">
                        <img src={this.props.thumbnail} alt={this.props.title}/>
                    </div>
                    <div className="mdl-cell--6-col">
                        <div className="mdl-grid">
                            <div className="mdl-cell--12-col mdl-cell--top mdl-textfield">
                                <label className="mdl-textfield__label">{this.props.title}</label>
                            </div>
                            <div className="mdl-cell--12-col mdl-textfield">
                                <label className="mdl-textfield__label">{this.props.author}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}