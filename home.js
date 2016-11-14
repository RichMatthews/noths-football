import React from 'react';
import ReactDOM from 'react-dom';
var firebase = require('firebase');
//var nodemailer = require('nodemailer');
//var mg = require('nodemailer-mailgun-transport');
import './home.scss';
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
    this.setState({ results: true });
    this.setState({ value: event.target.value });
    event.preventDefault();
  },

  handleChange: function(event){
    this.setState({value: event.target.value})
    console.log(event.target.value);
    //this.props.onChange(event.target.value)
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
      canPlayArray: [],
      cantPlayArray: [],
      thanks: false
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
    let name = this.props.value;
    console.log(name, 'name');
    let email = 'mark@mail';
    this.submitUserResponseCanPlay(this.today(), name, email)
    this.setState({thanks: true})
  },

  cannotPlay: function() {
    var name = this.state.value;
    var email = 'sss';
    this.submitUserResponseCantPlay(this.today(), name, email)
  },

  // sendEmail: function(){
  //
  //   var auth = {
  //     auth: {
  //       api_key: 'key-18e06b43624051b8bbe767fa1f1231d7',
  //       domain: 'sandboxaac16680d4de4296a3dbbecba6a8240c.mailgun.org'
  //     }
  //   }
  //
  //   var nodemailerMailgun = nodemailer.createTransport(mg(auth));
  //
  //   nodemailerMailgun.sendMail({
  //     from: 'Mail Gun Rich Matthews <postmaster@sandboxaac16680d4de4296a3dbbecba6a8240c.mailgun.org>',
  //     to: 'richmatthews@notonthehighstreet.com',
  //     subject: 'TEEEST',
  //     text: 'WAA WAA WEE WAA'
  //   }, function (err, info) {
  //     if (err) {
  //       console.log('Error: ' + err);
  //     }
  //     else {
  //       console.log('Response: ' + info);
  //     }
  //   }
  //  );
  // },

  postMessageToSlack: function(){
    let myArr = ['<@edkerry>', '<@jamiebrown>', '<@robjones>'];
    let arrToStr = myArr.toString();
    let Slack = require('browser-node-slack');
    let slack = new Slack('https://hooks.slack.com/services/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');

    slack.send({
      channel: "#rich-test-public",
      username: "football-bot",
      icon_emoji: ":soccer:",
      text: arrToStr + ' have all indicated they will play this week'
    });
  },

  // sendEmail: function(){
  //   const config = {
  //     method: 'post',
  //     url: '/',
  //     data: {
  //       domain: 'sandboxaac16680d4de4296a3dbbecba6a8240c.mailgun.org',
  //       api_key: 'key-18e06b43624051b8bbe767fa1f1231d7',
  //       from: 'Mail Gun Rich Matthews <postmaster@sandboxaac16680d4de4296a3dbbecba6a8240c.mailgun.org>',
  //       to: 'richmatthews@notonthehighstreet.com',
  //       subject: 'TEEEST',
  //       text: 'WAA WAA WEE WAA'
  //     }
  //   };
  //   axios(config);
  //   // mailgun: require('mailgun-js')({apiKey: api_key, domain: domain}),
  //   // mailgun.messages().send(data, function (error, body) {
  //   //   console.log(body);
  //   // });
  // },

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
    if (this.state.thanks){
      output = <Thanks />;
    }
    return (
      <div id="results" className="search-results">
        <p> Can you play on Tuesday 15th November? </p>
          <input type="submit" className="decisionButtons" id="canDecisionButton" value="I can play" onClick={() => this.canPlay()}/>
          <input type="submit" className="decisionButtons" id="cantDecisionButton" value="I cannot play" onClick={() => this.cannotPlay()}/>
          <input type="submit" className="decisionButtons" id="cantDecisionButton" value="Email" onClick={() => this.postMessageToSlack()}/>
        <h2> Available players </h2>

        <p id='canPlay'>
          {
            this.state.canPlayArray.length
            ? this.state.canPlayArray.map(function(num, index){
              return <p key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</p>;
            }, this)
            : <span>No one has responded</span>
          }
        </p>
        <h2> Unavailable players </h2>

        <p id='cantPlay'>
          {
            this.state.cantPlayArray.length
            ? this.state.cantPlayArray.map(function(num, index){
              return <span key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</span>;}, this)
            : <p>No one has responded</p>
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

});


  ReactDOM.render(
    <NothsFootball />, document.getElementById('content')
  );
