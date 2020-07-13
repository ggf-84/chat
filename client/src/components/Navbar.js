import React from 'react'
import {Link} from 'react-router-dom'
import {Consumer} from '../context'

export default function Login() {
    return <Consumer>
        {value => {
            const {loginRegLink, userLink, fireRedirect} = value;
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded menu-navbar">
                    <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarsExample10"
                    aria-controls="navbarsExample10"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    >
                    <span className="navbar-toggler-icon" />
                    </button>

                    <div
                    className="collapse navbar-collapse justify-content-md-center"
                    id="navbarsExample10"
                    >
                    <ul className="navbar-nav">
                        <li className="nav-item">
                        {fireRedirect ? <Link to="/" className="nav-link">Chat</Link> : ``}
                        </li>
                    </ul>
                    {fireRedirect ?  userLink() : loginRegLink()}
                    </div>
                </nav>
            );
        }}
    </Consumer>
}