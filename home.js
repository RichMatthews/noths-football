import React from 'react';
import ReactDOM from 'react-dom';
let firebase = require('firebase');
import './home.scss';
import { rootRef, firebase_init, storage } from './firebase_config.js';
require('es6-promise').polyfill();
require('isomorphic-fetch');
import axios from 'axios';


let NothsFootball = React.createClass({

  getInitialState: function(){
    return {
      results: false,
      emailValue: '',
      nameValue: '',
      slackNameValue: '',
      value: ''
    };
  },

  handleClick: function(event) {
    this.setState({ results: true });
    event.preventDefault();
  },

  handleNameChange: function(event){
    this.setState({nameValue: event.target.value})
  },

  handleSlackNameChange: function(event){
    this.setState({slackNameValue: event.target.value})
  },

  handleEmailChange: function(event){
    this.setState({emailValue: event.target.value})
  },

  render: function() {
    let output;
    if (this.state.results){
      output = <Decision name={this.state.nameValue} email={this.state.emailValue} slackName={this.state.slackNameValue}/>;
    }
    else {
      output = (
        <div id="container">
          <form onSubmit={this.handleClick}>
            <p><input type="text" id="playerName" value={this.state.nameValue} onChange={this.handleNameChange} placeholder="your name" required/></p>
            <p><input type="text" id="playerSlackName"  value={this.state.slackNameValue} onChange={this.handleSlackNameChange}placeholder="your slack name" required/></p>
            <p><input type="email" id="playerEmail"  value={this.state.emailValue} onChange={this.handleEmailChange} placeholder="use noths email" required/></p>
            <p><input type="submit" value="submit" /></p>
          </form>
        </div>
      );
    }
    return (
      <div>
        <h1 className="headings" id="heading"> Noths Football </h1>
        {output}
      </div>
    )
  }
});

let Decision = React.createClass({

  getInitialState: function(){
    return {
      canPlayArray: [],
      cantPlayArray: [],
      showThanks: false
    };
  },

  componentDidMount: function(){
    //this.retrieveCanPlayReponses();
    //this.retrieveCantPlayReponses();
    //this.postMessageToSlack();
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

  testfunc: function(){
    return new Promise((resolve, reject) => {
      resolve(this.retrieveCanPlayReponses());
    })
  },

  canPlay: function() {
    let name = this.props.name;
    let slackName = this.props.slackName;
    let email = this.props.email;
    this.submitUserResponseCanPlay(this.today(), name, slackName, email)
    this.testfunc().then(() => {
      return this.retrieveCantPlayReponses();
    }).then(() => {
      return Promise.resolve(this.setState({showThanks: true}))
    }).then(() => {
      return this.postToSlack();
    })
  },

  cannotPlay: function() {
    let name = this.props.name;
    let slackName = this.props.slackName;
    let email = this.props.email;
    this.submitUserResponseCantPlay(this.today(), name, slackName, email);
    this.retrieveCanPlayReponses();
    this.retrieveCantPlayReponses();
    this.setState({showThanks: true})
  },

  postToSlack: function(){
    let slackName = this.props.slackName;
    let Slack = require('browser-node-slack');
    let minNumberPlayers = 7;
    let availablePlayers = this.state.canPlayArray.length;
    let slack = new Slack('https://hooks.slack.com/services/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');
    slack.send({
      channel: "#rich-test-public",
      username: "football-bot",
      icon_emoji: ":soccer:",
      text: slackName + ' has just indicated they are available this week, we now have ' + availablePlayers + ' players for this week'
    });
  },

  submitUserResponseCanPlay: function(date, name, slackName, email){
    let postData = {
      dateConfirmed: date,
      name: name,
      slackName: slackName,
      email: email
    };
    let newPostKey = firebase.database().ref().child('date').push().key;
    let updates = {};
    updates['date' + '/15-11-2016/' + '/Can Play/' + name] = postData;
    return firebase.database().ref().update(updates);
  },

  submitUserResponseCantPlay: function(date, name, slackName, email){
    let postData = {
      dateConfirmed: date,
      name: name,
      slackName: slackName,
      email: email
    };
    let newPostKey = firebase.database().ref().child('date').push().key;
    let updates = {};
    updates['date' + '/15-11-2016/' + '/Cant Play/' + name] = postData;
    return firebase.database().ref().update(updates);
  },

  retrieveReponsesFromDB: function(query){
  return new Promise((resolve, reject) => {
      firebase.database().ref(query).on('value', resolve);
    })
  },

  retrieveCanPlayReponses: function(){
    return new Promise((resolve, reject) => {
      this.retrieveReponsesFromDB('/date/' + '/15-11-2016/' + '/Can Play/').then((canResponses) => {
        let canPlayArray = Object.keys(canResponses.val()).map(function(key) {
          return canResponses.val()[key];
        });
        this.setState({canPlayArray: canPlayArray});
        resolve();
      })
    })
  },

  retrieveCantPlayReponses: function(){
    return new Promise((resolve, reject) => {
      this.retrieveReponsesFromDB('/date/' + '/15-11-2016/' + '/Cant Play/').then((cantResponses) => {
        let cantPlayArray = Object.keys(cantResponses.val()).map(function(key) {
          return cantResponses.val()[key];
        });
        this.setState({cantPlayArray: cantPlayArray});
        resolve();
      })
    })
  },

  render: function(){
    let output;
    return (
      <div id="results" className="search-results">
        {this.state.showThanks ?
          <div>
            <p>Thanks for your response!</p>
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
        :
        <div>
          <p> Can you play on Tuesday 15th November? </p>
          <span className="decisionButtons" id="canDecisionButton" onClick={() => this.canPlay()}>I can play</span>
          <span className="decisionButtons" id="cantDecisionButton" onClick={() => this.cannotPlay()}>I cannot play</span>
          <a type="button" className="decisionButtons" id="cantDecisionButton"  onClick={() => this.sendEmail()} >Email</a>
        </div> }
      </div>
    )
  }
});

let Thanks = React.createClass({

  render: function(){
    return (
      <div id="results" className="search-results">
        Thanks, your answer has been recorded!
      </div>
    )
  }

});


  ReactDOM.render(
    <NothsFootball />, document.getElementById('content')
  );


  // sendEmail: function(){
  //
  //     let formData = new FormData();
  //     formData.append('from','Mail Gun Rich Matthews <postmaster@sandboxaac16680d4de4296a3dbbecba6a8240c.mailgun.org>');
  //     formData.append('to','richmatthews@notonthehighstreet.com');
  //     formData.append('subject', 'TESTTTTTT');
  //     formData.append('text', 'FORM DATA TEXT')
  //     // data: {
  //     //   from: 'Mail Gun Rich Matthews <postmaster@sandboxaac16680d4de4296a3dbbecba6a8240c.mailgun.org>',
  //     //   to: 'richmatthews@notonthehighstreet.com',
  //     //   subject: 'TEEEST',
  //     //   text: 'BLAH BLAHWAA WAA WEE WAA'
  //     // }
  //
  //     // headers: {
  //     //   Authorization: 'Basic YXBpOmtleS0xOGUwNmI0MzYyNDA1MWI4YmJlNzY3ZmExZjEyMzFkNw==',
  //     //   'Content-Type': 'application/x-www-form-urlencoded'
  //     // },
  //     const config = {
  //       method: 'post',
  //       url: 'https://api.mailgun.net/v3/sandboxaac16680d4de4296a3dbbecba6a8240c.mailgun.org/messages',
  //
  //       data: {
  //         FormData: formData
  //       }
  //     };
  //     axios(config)
  //       .then(() => {
  //       })
  //       .catch((e) => {
  //       });
  //
  // },
