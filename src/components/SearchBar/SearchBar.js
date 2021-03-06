import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      term: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeByEnter = this.handleChangeByEnter.bind(this);
  }
  handleChange(event){
    this.setState({
      term: event.target.value
    })
  }
  handleSearch(event){
    this.props.searchSpotify(this.state.term);
    event.preventDefault();
  }

  handleChangeByEnter(event) {
    var which = event.which || event.keyCode;
    if(which == 13) {
      this.props.searchSpotify(this.state.term);
      event.preventDefault();
    }
  }

  render(){
    return (
      <div className="SearchBar">
        <input onChange={this.handleChange} placeholder="Enter A Song, Album, or Artist" onKeyUp={this.handleChangeByEnter}/>
        <a onClick={this.handleSearch}>SEARCH</a>
        </div>
    );
  }
};

export default SearchBar;
