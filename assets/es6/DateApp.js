//always add leading zero before month and day
import React from 'react'
import allDates from './dates/index'
import FuzzySearch from 'fuzzy-search'


class Tr extends React.Component {
  constructor (prop) {
    super(prop)
    this._formatDate = this._formatDate.bind(this)
  }
  _formatDate (date) {
    let new_date = new Date(date)
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let day = new_date.getDate()
    let month = months[new_date.getMonth()]
    let year = new_date.getFullYear()
    return `${day} ${month}, ${year}`
  }
  render () {
    const {date, index} = this.props
    return <tr className='data' onClick={() => console.log(date)}>
      <td>{index}</td>
      <td>{this._formatDate(date.date)}</td>
      <td>{date.event}</td>
    </tr>
  }
}

class DateApp extends React.Component {
  constructor (prop) {
    super(prop)
    this.state = {
      dates: allDates,
      query: '',
    }
    this._changeQueryAndFilterDate = this._changeQueryAndFilterDate.bind(this)
  }
  _changeQueryAndFilterDate (e) {
    let query = e.target.value
      const searcher = new FuzzySearch(allDates, ['date', 'event']);
      const dates = searcher.search(query);
      this.setState({query, dates})
  }
  render () {
    const {query, dates} = this.state
    return (
      <div>
        <div className="col-md-6 mx-auto my-3">
          <div className='d-flex justify-content-center align-items-center'>
            <label htmlFor='query' className='d-inline-block mr-2'>Search</label>
            <input
              className='form-control'
              id='query'
              placeholder="Search..."
              type="text"
              onChange={this._changeQueryAndFilterDate}
              value={query}
              />
          </div>
        </div>
        <table className='table table-border history_date'>
          <tbody>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Event</th>
            </tr>
            {
              dates.map((date, index) => <Tr key={index} index={index} date={date} />)
            }

          </tbody>
        </table>
      </div>
      )
  }
}

export default DateApp
