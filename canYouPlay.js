import React from 'react';
import ReactDOM from 'react-dom';
require('es6-promise').polyfill();
require('isomorphic-fetch');

var CanYouPlay = React.createClass({

  render: function() {
      return (
        <div>
        <h1 className="headings" id="heading"> Can you play? </h1>
        </div>
      );
    }
  });


  ReactDOM.render(
    <CanYouPlay />, document.getElementById('content')
  );
