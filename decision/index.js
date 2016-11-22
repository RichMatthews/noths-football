import React from 'react';
let firebase = require('firebase');
import { rootRef, firebase_init, storage } from '../firebase/firebase_config.js';

export default class Decision extends React.Component{

  componentDidMount(){
    //this.retrieveCanPlayReponses();
    //this.retrieveCantPlayReponses();
    //this.postMessageToSlack();
  };

  today(){
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
  };

  testfunc(){
    return new Promise((resolve, reject) => {
      resolve(this.retrieveCanPlayReponses());
    })
  };

  canPlay() {
    let name = this.props.nameValue;
    let slackName = this.props.slackNameValue;
    let email = this.props.emailValue;
    this.props.changeToThanks();
    this.submitUserResponseCanPlay(this.today(), name, slackName, email)
    this.testfunc().then(() => {
      return this.retrieveCantPlayReponses();
    }).then(() => {
      return Promise.resolve(this.setState({showThanks: true}))
    }).then(() => {
      return this.postToSlack();
    })
  };

  cannotPlay() {
    let name = this.props.nameValue;
    let slackName = this.props.slackNameValue;
    let email = this.props.emailValue;
    this.props.changeToThanks();
    this.submitUserResponseCantPlay(this.today(), name, slackName, email);
    this.retrieveCanPlayReponses();
    this.retrieveCantPlayReponses();
  };

  postToSlack(){
    let slackName = this.props.slackNameValue;
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
  };

  submitUserResponseCanPlay(date, name, slackName, email){
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
  };

  submitUserResponseCantPlay(date, name, slackName, email){
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
  };

  retrieveReponsesFromDB(query){
  return new Promise((resolve, reject) => {
      firebase.database().ref(query).on('value', resolve);
    })
  };

  retrieveCanPlayReponses(){
    return new Promise((resolve, reject) => {
      this.retrieveReponsesFromDB('/date/' + '/15-11-2016/' + '/Can Play/').then((canResponses) => {
        let canPlayArray = Object.keys(canResponses.val()).map(function(key) {
          return canResponses.val()[key];
        });
        this.setState({canPlayArray: canPlayArray});
        resolve();
      })
    })
  };

  retrieveCantPlayReponses(){
    return new Promise((resolve, reject) => {
      this.retrieveReponsesFromDB('/date/' + '/15-11-2016/' + '/Cant Play/').then((cantResponses) => {
        let cantPlayArray = Object.keys(cantResponses.val()).map(function(key) {
          return cantResponses.val()[key];
        });
        this.setState({cantPlayArray: cantPlayArray});
        resolve();
      })
    })
  };

  render(){
    let output;
    return (
        <div>
          <p> Can you play on Tuesday 15th November? </p>
          <span className="decisionButtons" id="canDecisionButton" onClick={() => this.canPlay()}>I can play</span>
          <span className="decisionButtons" id="cantDecisionButton" onClick={() => this.cannotPlay()}>I cannot play</span>
          <a type="button" className="decisionButtons" id="cantDecisionButton"  onClick={() => this.sendEmail()} >Email</a>
        </div>
    )
  }
}
