import React from 'react';

export default class PlayerAvailabiltyList extends React.Component{

  render(){
      <div>
        <h2 id="available"> Available players </h2>
        <div id='canPlay'>
          {
            this.state.canPlayArray.length
            ? this.state.canPlayArray.map(function(num, index){
              return <div key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</div>;
            }, this)
            : <span>No one has responded</span>
          }
        </div>

        <h2 id="unavailable"> Unavailable players </h2>
        <div id='cantPlay'>
          {
            this.state.cantPlayArray.length
            ? this.state.cantPlayArray.map(function(num, index){
              return <div key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</div>;
            }, this)
            : <span>No one has responded</span>
          }
        </div>
      </div>
    return (
      <div>
        <h1 className="headings" id="heading"> PlayerAvailabiltyList </h1>
      </div>
    )
  }

};
