import React from 'react';
let firebase = require('firebase');
import { rootRef, firebase_init, storage } from '../firebase/firebase_config.js';
export default class Decision extends React.Component{

  render(){
    let output;
    return (
        <div>
          <p> Can you play on Tuesday 15th November? </p>
          <span className="decisionButtons" id="canDecisionButton" onClick={() => this.props.canPlay()}>I can play</span>
          <span className="decisionButtons" id="cantDecisionButton" onClick={() => this.props.cannotPlay()}>I cannot play</span>
          <a type="button" className="decisionButtons" id="cantDecisionButton"  onClick={() => this.sendEmail()} >Email</a>
        </div>
    )
  }
}
