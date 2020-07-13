import React from 'react'
import {Consumer} from '../../context/context'
import { Redirect } from 'react-router'

export default function SignUp() {
    return <Consumer>
        {value => {
            const {signUp,handleChange,email,password,repeatPassword,nickname,fireRedirect} = value;
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mt-5 mx-auto">
                            <div className="form-group">
                                <label htmlFor="name">Nickname</label>
                                <input
                                    type="text" 
                                    name="nickname" 
                                    className="form-control"
                                    placeholder="Enter your first name"
                                    onChange={handleChange} 
                                    value={nickname}
                                />
                            </div>
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
                            <div className="form-group">
                                <label htmlFor="password">Repeat Password</label>
                                <input
                                    type="password" 
                                    name="repeatPassword" 
                                    className="form-control"
                                    placeholder="Repeat Password"
                                    onChange={handleChange} 
                                    value={repeatPassword}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-lg btn-primary btn-block"
                                onClick={() => signUp()}
                            >
                                Sign Up!
                            </button>
                            {fireRedirect && (<Redirect to={'/'}/>)}
                        </div>
                    </div>
                </div>
            );
        }}
    </Consumer>
}