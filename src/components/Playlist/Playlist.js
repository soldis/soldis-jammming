import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList.js';

class Playlist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playListName: "New Playlist"
    };
    this.handleChange =this.handleChange.bind(this);
    this.handleSave =this.handleSave.bind(this);
  }
  handleChange(event){
    this.setState({
      playListName: event.target.value
    })
  }
  handleSave(event){
    this.props.save2Spotify(this.state.playListName);
    this.setState({
      playListName: "New Playlist"
    });
    event.preventDefault();
  }
  render(){
    return (
      <div className="Playlist">
        <input value={this.state.playListName} onChange={this.handleChange}/>
        <TrackList tracks={this.props.playList} actionSymbol={this.props.actionSymbol} action={this.props.action}/>
        <a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
};

export default Playlist;
