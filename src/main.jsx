import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import('preline')

import { BrowserRouter as Router } from 'react-router-dom'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers';
// import "antd/dist/antd.css"

// Store
const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  // </React.StrictMode>,
)
