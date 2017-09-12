import React, { Component } from 'react';
import SearchResults from './SearchResults';

export default class Searcher extends Component {

    constructor(props) {
        super(props);

        this.state = {query: '', resultsVisible: false, response: []};
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    // sendRequest(query, next){
    //     var req = new XMLHttpRequest();
    //     req.onreadystatechange = function() {
    //         if (req.readyState == 4 && req.status == 200)
    //             next(req.responseText);
    //     }
    //     req.open('GET', 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+query+'type=video&key=AIzaSyAkWmNO7E-FZWXxsNrD9nqsKTdvJpNti2I', true);
    //     req.send(null);
    // }

    handleResponse(response){
        var res = JSON.parse(response)
        this.setState({resultsVisible: true, response: res});

    }

    handleChange(event) {
        this.setState({query: event.target.value})

    }

    onSubmit(event) {
        if (this.state.query !== '') {
            // this.sendRequest(this.state.query,this.handleResponse)
            fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+this.state.query+'type=video&key=AIzaSyAkWmNO7E-FZWXxsNrD9nqsKTdvJpNti2I')
                .then(d => d.json())
                .then(d => {
                    this.setState({resultsVisible: true, response: d})
                })
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className="content-grid mdl-grid">

                    <div className="mdl-cell--12-col">
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
                    </div>
                    <div className="mdl-cell--12-col mdl-textfield mdl-js-textfield">
                            <SearchResults visible={this.state.resultsVisible} items={this.state.response.items}/>

                    </div>


            </div>
        )
    }
}
