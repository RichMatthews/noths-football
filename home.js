import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './home.scss';
import { rootRef, firebase_init, storage } from './firebase_config.js';
//import LoginPage from './loginPage';
require('es6-promise').polyfill();
require('isomorphic-fetch');
let firebase = require('firebase');

class LoginPage extends React.Component{

  render() {
    return (
      <div>
        <h1 className="headings" id="heading"> Noths Football </h1>
        <div id="container">
          <form onSubmit={this.props.handleClick}>
            <p><input type="text" id="playerName" value={this.props.nameValue} onChange={this.props.handleNameChange} placeholder="your name" required/></p>
            <p><input type="text" id="playerSlackName"  value={this.props.slackNameValue} onChange={this.props.handleSlackNameChange}placeholder="your slack name" required/></p>
            <p><input type="email" id="playerEmail"  value={this.props.emailValue} onChange={this.props.handleEmailChange} placeholder="use noths email" required/></p>
            <p><input type="submit" value="submit" /></p>
          </form>
        </div>
      </div>
    )
  }
}

class PlayerAvailabiltyRow extends React.Component{


  render(){
    return (
      <div>
        <h1 className="headings" id="heading"> Player Availabilty Row </h1>
      </div>
    )
  }

};

class PlayerAvailabiltyList extends React.Component{

  render(){
    return (
      <div>
        <h1 className="headings" id="heading"> PlayerAvailabiltyList </h1>
      </div>
    )
  }

};

class Decision extends React.Component{

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
    // let showThanks = this.props.showThanks;
    this.submitUserResponseCantPlay(this.today(), name, slackName, email);
    this.retrieveCanPlayReponses();
    this.retrieveCantPlayReponses();
    // this.setState({showThanks: true})
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
        // {this.state.showThanks ?
        //   <div>
        //     <p>Thanks for your response!</p>
        //     <h2 id="available"> Available players </h2>
        //     <div id='canPlay'>
        //       {
        //         this.state.canPlayArray.length
        //         ? this.state.canPlayArray.map(function(num, index){
        //           return <div key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</div>;
        //         }, this)
        //         : <span>No one has responded</span>
        //       }
        //     </div>
        //
        //     <h2 id="unavailable"> Unavailable players </h2>
        //     <div id='cantPlay'>
        //       {
        //         this.state.cantPlayArray.length
        //         ? this.state.cantPlayArray.map(function(num, index){
        //           return <div key={ index }>Name: {num.name} Date Indicated: {num.dateConfirmed}</div>;
        //         }, this)
        //         : <span>No one has responded</span>
        //       }
        //     </div>
        //   </div>
        // :

    )
  }
};

class Thanks extends React.Component{

  render(){
    return (
      <div id="results" className="search-results">
        Thanks, your answer has been recorded!
      </div>
    )
  };

};

class NothsFootball extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      results: false,
      nameValue: '',
      slackNameValue: '',
      emailValue: '',
      value: '',
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
    console.log('called');
    this.setState({showThanks: true})
  };

  render(){
    return (
      <div>
        {this.state.showThanks
          ?
          <Thanks />
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
