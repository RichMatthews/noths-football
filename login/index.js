import React from 'react';

export default class LoginPage extends React.Component{

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
