import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from './context'

// const pusher = new Pusher({
//     appId: "849972",
//     key: "c516fb996fd917d3ba3f",
//     secret: "264abbed6f45d7138875",
//     cluster: "eu",
//     encrypted: true,
//   });


ReactDOM.render(
    <Provider>
        <Router>
            <App />
        </Router>
    </Provider>
    , 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();