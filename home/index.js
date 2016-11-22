import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './styles.scss';
let firebase = require('firebase');
import { rootRef, firebase_init, storage } from '../firebase/firebase_config.js';
import LoginPage from '../login/index';
import Decision from '../decision/index';
import Thanks from '../thanks/index';
import PlayerAvailabiltyList from '../playerAvailabilityList/index';
import PlayerAvailabiltyRow from '../playerAvailabilityRow/index';
require('es6-promise').polyfill();
require('isomorphic-fetch');

class NothsFootball extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      results: false,
      nameValue: '',
      slackNameValue: '',
      emailValue: '',
      value: '',
      canPlayArray: [],
      cantPlayArray: [],
      showThanks: false,
      decisionPage: false
    };
  }

  handleClick(event) {
    this.setState({ decisionPage: true });
    event.preventDefault();
  };

  handleNameChange(event){
    this.setState({nameValue: event.target.value})
  };

  handleEmailChange(event){
    this.setState({emailValue: event.target.value})
  };

  handleSlackNameChange(event){
    this.setState({slackNameValue: event.target.value})
  };

  changeToThanks(){
    this.setState({showThanks: true})
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
    this.changeToThanks();
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
    return (
      <div>
        {this.state.showThanks
          ?
          <Thanks
            playersAvailable={this.state.retrieveCanPlayReponses}
            playersUnavailable={this.state.retrieveCantPlayReponses}
          />
          :
          <div>
            {this.state.decisionPage
            ?
            <Decision
              decisionPage={this.state.decisionPage}
              handleNameChange={this.handleNameChange.bind(this)}
              handleSlackNameChange={this.handleSlackNameChange.bind(this)}
              handleEmailChange={this.handleEmailChange.bind(this)}
              changeToThanks={this.changeToThanks.bind(this)}
              canPlay={this.canPlay.bind(this)}
              cantPlay={this.cannotPlay.bind(this)}
              nameValue={this.state.nameValue}
              emailValue={this.state.emailValue}
              slackNameValue={this.state.slackNameValue}
            />
            :
            <LoginPage
              handleClick={this.handleClick.bind(this)}
              handleNameChange={this.handleNameChange.bind(this)}
              handleSlackNameChange={this.handleSlackNameChange.bind(this)}
              handleEmailChange={this.handleEmailChange.bind(this)}
              nameValue={this.state.nameValue}
              emailValue={this.state.emailValue}
              slackNameValue={this.state.slackNameValue}
            />
            }
          </div>
        }
      </div>
    )
  };
};


  ReactDOM.render(
    <NothsFootball />, document.getElementById('content')
  );
