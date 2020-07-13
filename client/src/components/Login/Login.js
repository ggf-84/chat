import React from 'react'
import {Consumer} from '../../context'
import { Redirect } from 'react-router'

export default function Login() {
    return <Consumer>
        {value => {
            const {logIn, email, password, handleChange, fireRedirect} = value;
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mt-5 mx-auto">
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email" 
                                    name="email" 
                                    className="form-control"
                                    placeholder="Enter email"
                                    onChange={handleChange} 
                                    value={email}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password" 
                                    name="password" 
                                    className="form-control"
                                    placeholder="Password"
                                    onChange={handleChange} 
                                    value={password}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-lg btn-primary btn-block"
                                onClick={() => logIn()}
                            >
                                Sign in
                            </button>
                            {fireRedirect && (<Redirect to={'/'}/>)}
                        </div>
                    </div>
                </div>
            );
        }}
    </Consumer>
}