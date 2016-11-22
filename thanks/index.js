import React from 'react';

export default class Thanks extends React.Component{

  // <PlayerAvailabiltyRow />
  render(){
    console.log(this.props.playersAvailable, 'will this work');
    return (
      <div id="results" className="search-results">
        Thanks, your answer has been recorded!
      </div>
    )
  };

};
