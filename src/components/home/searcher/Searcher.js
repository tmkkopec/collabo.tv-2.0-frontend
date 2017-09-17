import React, {Component} from 'react';
import SearchResults from './SearchResults';

export default class Searcher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            lastQuery: '',
            resultsVisible: false,
            response: [],
            nextActive: false,
            prevActive: false,
            next: null,
            prev: null
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }

    handleResponse(response) {
        var res = JSON.parse(response)
        this.setState({resultsVisible: true, response: res});

    }

    handleChange(event) {
        this.setState({query: event.target.value})

    }

    nextPage(event) {
        fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + this.state.lastQuery + '&pageToken=' +
            this.state.next + '&type=video&key=AIzaSyAkWmNO7E-FZWXxsNrD9nqsKTdvJpNti2I')
            .then(d => d.json())
            .then(d => {
                if (d.nextPageToken) {
                    this.setState({
                        response: d, nextActive: true, next: d.nextPageToken, prevActive: true,
                        prev: d.prevPageToken
                    })
                } else {
                    this.setState({
                        response: d, nextActive: false, next: null, prevActive: true,
                        prev: d.prevPageToken
                    })
                }
            })
    }

    prevPage(event) {
        fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + this.state.lastQuery + '&pageToken=' +
            this.state.prev + '&type=video&key=AIzaSyAkWmNO7E-FZWXxsNrD9nqsKTdvJpNti2I')
            .then(d => d.json())
            .then(d => {
                if (d.prevPageToken) {
                    this.setState({
                        response: d, nextActive: true, next: d.nextPageToken, prevActive: true,
                        prev: d.prevPageToken
                    })
                } else {
                    this.setState({
                        response: d, nextActive: true, next: d.nextPageToken, prevActive: false,
                        prev: null
                    })
                }
            })
    }

    onSubmit(event) {
        if (this.state.query !== '') {
            fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + this.state.query + '&type=video&key=AIzaSyAkWmNO7E-FZWXxsNrD9nqsKTdvJpNti2I')
                .then(d => d.json())
                .then(d => {
                    if (d.nextPageToken) {
                        this.setState({
                            lastQuery: this.state.query,
                            resultsVisible: true,
                            response: d,
                            nextActive: true,
                            next: d.nextPageToken,
                            prevActive: false,
                            prev: null
                        })
                    } else {
                        this.setState({
                            lastQuery: this.state.query,
                            resultsVisible: true,
                            response: d,
                            nextActive: false,
                            next: null,
                            prevActive: false,
                            prev: null
                        })
                    }

                })
        }
        event.preventDefault();
    }

    render() {
        var prevButton = ''
        var nextButton = ''
        if (this.state.resultsVisible) {
            if (this.state.prevActive) {
                prevButton = <button
                    className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--colored"
                    type="button" onClick={this.prevPage}>Prev
                </button>
            } else {
                prevButton = <button
                    className="mdl-button mdl-js-button disabled"
                    type="button">Prev
                </button>
            }
            if (this.state.nextActive) {
                nextButton = <button
                    className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--colored"
                    type="button" onClick={this.nextPage}>Next
                </button>
            } else {
                nextButton = <button
                    className="mdl-button mdl-js-button disabled"
                    type="button">Next
                </button>
            }
        } else {
            prevButton = <div/>
            nextButton = <div/>
        }
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
                    <div className="mdl-cell--12-col mdl-cell--bottom mdl-grid">
                        <div className="mdl-cell--6-col">
                            {prevButton}
                        </div>
                        <div className="mdl-cell--6-col">
                            {nextButton}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
