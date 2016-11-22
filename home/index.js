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
    console.log('called');
    this.setState({showThanks: true})
  };

  render(){
    return (
      <div>
        {this.state.showThanks
          ?
          <Thanks
            playersAvailable={this.state.canPlayArray}
            playersUnavailable={this.state.cantPlayArray}
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
