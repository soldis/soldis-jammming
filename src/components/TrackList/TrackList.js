import React from 'react';
import './TrackList.css';
import Track from '../Track/Track.js';

class TrackList extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    if (this.props.tracks){
      return (
        <div className="TrackList">
          {
            this.props.tracks.map(track => {
              return <Track trackInfo={track} actionSymbol={this.props.actionSymbol} action={this.props.action}/>;
            })
          }
        </div>
      );
    } else {
      return <div className="TrackList"/>;
    }
  }
};

export default TrackList;
