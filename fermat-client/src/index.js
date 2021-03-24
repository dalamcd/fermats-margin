import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FermatsMargin from './App';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <FermatsMargin />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);