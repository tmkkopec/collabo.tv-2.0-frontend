import React, { Component } from 'react';
import MdlGrid from '../mdl/MdlGrid';
import MdlCell from '../mdl/MdlCell';

export default class Searcher extends Component {

    constructor(props) {
        super(props);

        this.state = {query: ''};

        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({query: event.target.value})
    }

    onSubmit(event) {
        if (this.state.query !== '') {

        }
        event.preventDefault();
    }

    render() {
        return (
            <div className="mdl-layout__content">
                <MdlGrid>
                    <MdlCell cellWidth={12}>
                        <form method="GET" name="search_form" onSubmit={this.onSubmit}>
                            <div id="search_div" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <label className="mdl-textfield__label" htmlFor="search-form">Search a video</label>
                                <input className="mdl-textfield__input" type="text" name="search-form" id="search-form"
                                       value={this.state.query} onChange={this.handleChange}/>
                                <span className="mdl-textfield__error">Not a valid input</span>
                            </div>
                            <br/>
                            <button
                                className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--colored"
                                type="submit" htmlFor="search_div">Search!
                            </button>
                        </form>
                    </MdlCell>
                </MdlGrid>
            </div>
        )
    }
}
