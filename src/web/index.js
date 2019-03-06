/* global document */
import { library } from '@fortawesome/fontawesome-svg-core';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';
import * as farIcons from '@fortawesome/free-regular-svg-icons';
import * as fasIcons from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { initGlobal } from './../store/persistence';
import registerServiceWorker from './register-service-worker';
import Routes from './routes/index';

// Load css
require('./styles/style.scss');

// Load icons
library.add(fasIcons.faLock, fasIcons.faSignInAlt, fasIcons.faSignOutAlt);
library.add(fasIcons.faSpinner, brandIcons.faYoutube, fasIcons.faSearch);
library.add(fasIcons.faEye, fasIcons.faStar, farIcons.faStar, fasIcons.faListAlt);
library.add(fasIcons.faCommentDots, fasIcons.faTrashAlt, fasIcons.faSadTear);
library.add(fasIcons.faPlusCircle, fasIcons.faFolderOpen, fasIcons.faEraser, fasIcons.faMinusCircle);

const rootElement = document.getElementById('root');

initGlobal();

const Root = () => (
  <Router>
    <Routes />
  </Router>
);

render(<Root />, rootElement);
registerServiceWorker();
