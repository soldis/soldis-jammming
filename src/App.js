import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar.js';
import SearchResults from './components/SearchResults/SearchResults.js';
import Playlist from './components/Playlist/Playlist.js';
import Spotify from './util/Spotify.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResult: [],
      playList: []
    };
    this.searchSpotify = this.searchSpotify.bind(this);
    this.save2Spotify = this.save2Spotify.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    Spotify.init();
  }

  // perform track search in Spotify
  searchSpotify(term){
    if (Spotify.isLoggedIn()){
      Spotify.search(term).then(res => {
        this.setState({
          searchResult: res
        })
      });
    } else {
      Spotify.login();
    }
  }

  // save new playlist to Spotify
  save2Spotify(playListName){
    if (Spotify.isLoggedIn()){
      // if either name or array is empty we should not continue
      if (!(playListName && Array.isArray(this.state.playList) && this.state.playList.length > 0)) return false;

      Spotify.addPlayList(playListName, this.state.playList).then(ok => {
        console.log(ok);
        if (ok){
          this.setState({
            playList: []
          });
        }
      });
    } else {
      Spotify.login();
    }
  }

  // copy track from SearchResults list to Playlist
  addTrack(trackId){
    let index = this.state.playList.findIndex(elem => {
      return (elem.id === trackId);
    });
    if (index == -1){
      let newElement = this.state.searchResult.find(elem => {
        return (elem.id === trackId);
      });
      let newPlayList = this.state.playList;
      newPlayList.push(newElement);
      this.setState({
        playList: newPlayList
      });
    }
  }

  // remove track from Playlist
  removeTrack(trackId){
    let index = this.state.playList.findIndex(elem => {
      return (elem.id === trackId);
    });
    if (index >= 0){
      let newPlayList = this.state.playList;
      newPlayList.splice(index, 1);
      this.setState({
        playList: newPlayList
      });
    }
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar searchSpotify={this.searchSpotify}/>
          <div className="App-playlist">
            <SearchResults searchResult={this.state.searchResult} actionSymbol='+' action={this.addTrack}/>
            <Playlist playList={this.state.playList} actionSymbol='-' action={this.removeTrack} save2Spotify={this.save2Spotify}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
