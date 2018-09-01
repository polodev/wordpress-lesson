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
    this._changeQueryAndFilter = this._changeQueryAndFilter.bind(this)
    this._getTitleByUri = this._getTitleByUri.bind(this)
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
    this.setState({lunrIndex})
  }
  _changeQueryAndFilter (e) {
    let query = e.target.value
    let search_results = this.state.lunrIndex.search(`*${query}*`);
    search_results = query.length ? search_results : []
    this.setState({query, search_results})
  }
  _getTitleByUri (uri) {
    return search_file.find(doc => doc.uri == uri).title
  }
  render ()  {
    const {query, search_results} = this.state
    const after_domain = document.body.dataset.after_domain
    return (
      <form method="get" action={`/${after_domain}/search`}>
        <input
          className="form-control mr-sm-2"
          value={query}
          name='search'
          placeholder="Search..."
          onChange={this._changeQueryAndFilter}
          />
          {
            search_results.length ?
            <div id='search_result'>
              <ul>
              {
                search_results.map((result, index) => <li key={index}>
                  <a href={result.ref}>{this._getTitleByUri(result.ref)}</a>
                </li> )
              }
              </ul>
            </div> : null
          }
      </form>
    )
  }
}

export default Search
