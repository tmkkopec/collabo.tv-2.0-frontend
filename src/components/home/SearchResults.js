import React, { Component } from 'react';
import MdlGrid from '../mdl/MdlGrid';
import MdlCell from '../mdl/MdlCell';

export default class SearchResults extends Component {

    constructor(props) {
        super(props);

        this.state = {visible: props.visible}

    }

    render(){
        if(this.props.visible){
            return(
                <div className="mdl-cell">
                    <div>
                        <label className="mdl-textfield__label" htmlFor="search-form">Visible</label>
                    </div>
                </div>);
        }
        else {
            return(
                <div className="mdl-cell">
                    <div>
                        <label className="mdl-textfield__label" htmlFor="search-form">Not visible</label>
                    </div>
                </div>
            );
        }
    }
}