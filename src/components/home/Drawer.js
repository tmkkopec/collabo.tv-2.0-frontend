import React, { Component } from 'react';
import Searcher from "./Searcher"

export default class Drawer extends Component {
    render() {
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">Collabo.tv</span>
                <Searcher/>
            </div>
        )
    }
}
