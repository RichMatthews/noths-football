import React from 'react';
import ReactDOM from 'react-dom';
var firebase = require('firebase');
import { rootRef, firebase_init, storage } from './firebase_config.js';
require('es6-promise').polyfill();
require('isomorphic-fetch');


var NothsFootball = React.createClass({

  getInitialState: function(){
    return {
      results: false,
      value: ''
    };
  },

  handleClick: function(event) {
    this.setState({ results: true});
    event.preventDefault();
  },

  handleChange: function(event){
    this.setState({value: event.target.value})
  },

  render: function() {
    let output;
    if (this.state.results){
      output = <Decision />;
    }
    else {
      output = (
        <div>
          <form onSubmit={this.handleClick}>
            <input type="text" id="playerName" value={this.state.value} onChange={this.handleChange} placeholder="name" />
            <input type="email" id="playerEmail" placeholder="use noths email" />
            <input type="submit" value="submit" />
          </form>
        </div>
      );
    }
    return (
      <div>
        <h1 className="headings" id="heading"> Football </h1>
        {output}
      </div>
    )
  }
});

var Decision = React.createClass({

  getInitialState: function(){
    return {
      info: false,
      canPlayArray: [],
      cantPlayArray: []
    };
  },

  componentDidMount: function(){
    this.retrieveCanPlayReponses();
    this.retrieveCantPlayReponses();
  },

  today: function(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = mm+'/'+dd+'/'+yyyy;
    return today;
  },

  canPlay: function() {
    this.setState({info: true})
    var name = 'Mark';
    console.log(name, 'name');
    var email = 'mark@mail';
    this.submitUserResponseCanPlay(this.today(), name, email)
  },

  cannotPlay: function() {
    this.setState({info: true})
    var name = this.state.value;
    var email = 'sss';
    this.submitUserResponseCantPlay(this.today(), name, email)
  },

  submitUserResponseCanPlay: function(date, name, email){
    var postData = {
      dateConfirmed: date,
      name: name,
      email: email
    };
    var newPostKey = firebase.database().ref().child('date').push().key;
    var updates = {};
    updates['date' + '/15-11-2016/' + '/Can Play/' + name] = postData;
    return firebase.database().ref().update(updates);
  },

  submitUserResponseCantPlay: function(date, name, email){
    var postData = {
      dateConfirmed: date,
      name: name,
      email: email
    };
    var newPostKey = firebase.database().ref().child('date').push().key;
    var updates = {};
    updates['date' + '/15-11-2016/' + '/Cant Play/' + name] = postData;
    return firebase.database().ref().update(updates);
  },

  retrieveReponsesFromDB: function(query){
  return new Promise((resolve, reject) => {
      firebase.database().ref(query).on('value', resolve);
    })
  },

  retrieveCanPlayReponses: function(){
    this.retrieveReponsesFromDB('/date/' + '/15-11-2016/' + '/Can Play/').then((canResponses) => {
      var canPlayArray = Object.keys(canResponses.val()).map(function(key) {
        return canResponses.val()[key];
      });
      this.setState({canPlayArray: canPlayArray});
    })
  },

  retrieveCantPlayReponses: function(){
    this.retrieveReponsesFromDB('/date/' + '/15-11-2016/' + '/Cant Play/').then((cantResponses) => {
        var cantPlayArray = Object.keys(cantResponses.val()).map(function(key) {
          return cantResponses.val()[key];
        });
        this.setState({cantPlayArray: cantPlayArray});
    })
  },

  render: function(){
    let output;
    if (this.state.info){
      output = <Thanks />;
    }
    return (
      <div id="results" className="search-results">
        <p> Can you play on Tuesday 15th November? </p>
          <input type="submit" value="I can play" onClick={() => this.canPlay()}/>
          <input type="submit" value="I cannot play" onClick={() => this.cannotPlay()}/>
          <input type="submit" value="Other responders" onClick={() => this.today()}/>
        <h2> Can play </h2>

        <p id='canPlay'>
          {
            this.state.canPlayArray.length
            ? this.state.canPlayArray.map(function(num, index){
              return <span key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</span>;}, this)
            : <span>No one has responded</span>
          }
        </p>
        <h2> Cant play </h2>

        <p id='cantPlay'>
          {
            this.state.cantPlayArray.length
            ? this.state.cantPlayArray.map(function(num, index){
              return <span key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</span>;}, this)
            : <span>No one has responded</span>
          }
        </p>

      </div>
    )
  }
});

var Thanks = React.createClass({

  render: function(){
    return (
      <div id="results" className="search-results">
        Thanks, your answer has been recorded!
      </div>
    )
  }

})

  ReactDOM.render(
    <NothsFootball />, document.getElementById('content')
  );
