import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//This is an advanced concept we may want to incoporate later so just comment it out for now
//import registerServiceWorker from './registerServiceWorker';

//This is the main render function. Calling the ReactDOM.render and parameters:
//App - this is the top level element that I want to render in the DOM
//root - this is the container for my top level element. Since App will be top level item it goes in root
ReactDOM.render(<App />, document.getElementById('root'));

//This is an advanced concept we may want to incoporate later so just comment it out for now
//registerServiceWorker();
