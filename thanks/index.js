import React from 'react';

export default class Thanks extends React.Component{
  render(){
    return (
      <div>
        <div id="results" className="search-results">
          Thanks, your answer has been recorded!
        </div>
          <h2 id="available"> Available players </h2>
            <div id='canPlay'>
              {
                this.props.playersAvailable.length
                ? this.props.playersAvailable.map(function(num, index){
                  return <div key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</div>;
                }, this)
                : <span>No one has responded</span>
              }
            </div>
          <h2 id="unavailable"> Unavailable players </h2>
            <div id='cantPlay'>
              {
                this.props.playersUnavailable.length
                ? this.props.playersUnavailable.map(function(num, index){
                  return <div key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</div>;
                }, this)
                : <span>No one has responded</span>
              }
            </div>
      </div>
    )
  };

};
