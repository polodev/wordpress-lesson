/**
 * always build js after building hugo
 * @type {String}
 */
import search_file from '../../docs/index.json'
import React from 'react'
import lunr from 'lunr'

class Search extends React.Component {
  constructor (prop) {
    super(prop)
    this.state = {
      query: '',
      search_results: [],
      lunrIndex: [],
    }
    this._search = this._search.bind(this)
    this._getTitleByUri = this._getTitleByUri.bind(this)
    this._getQueryVariable = this._getQueryVariable.bind(this)
  }
  // _changeQueryAndFilter (e) {
  //   let query = e.target.value
  //   let searcher = new FuzzySearch(search_file, ['title', 'tags'])
  //   let search_results = searcher.search(query)
  //   search_results = query.length ? search_results : []
  //   this.setState({query, search_results})
  // }
  componentDidMount () {
    let lunrIndex = lunr(function() {
      this.field("title", {
          boost: 10
      });
      this.field("tags", {
          boost: 3
      });
      this.field("content", {
        boost: 1
      });
      this.ref("uri");
      search_file.forEach(function(doc) {
          this.add(doc);
      }, this);
    });
    this.setState({lunrIndex}, () => {
      this._search();
    })
  }
  _search (e) {
    var query = this._getQueryVariable('search');
    let search_results = this.state.lunrIndex.search(`*${query}*`);
    search_results = query.length ? search_results : []
    this.setState({query, search_results})
  }


  _getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }






  _getTitleByUri (uri) {
    return search_file.find(doc => doc.uri == uri).title
  }
  render ()  {
    const {query, search_results} = this.state
    return (
          search_results.length ?
          <div>
            <h2>Search results for <strong>{query}</strong></h2>
            <ul>
            {
              search_results.map((result, index) => <li key={index}>
                <a href={result.ref}>{this._getTitleByUri(result.ref)}</a>
              </li> )
            }
            </ul>
          </div> : <h2>No result found for <strong>{query}</strong></h2>
      )
  }
}

export default Search
