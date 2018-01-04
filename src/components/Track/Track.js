import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props){
    super(props);
    this.handleAction = this.handleAction.bind(this);
  }
  handleAction(event){
    this.props.action(this.props.trackInfo.id);
    event.preventDefault();
  }
  render(){
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.trackInfo.name}</h3>
          <p>{this.props.trackInfo.artist} | {this.props.trackInfo.album}</p>
        </div>
        <a className="Track-action" onClick={this.handleAction}>{this.props.actionSymbol}</a>
      </div>
    );
  }
};

export default Track;
