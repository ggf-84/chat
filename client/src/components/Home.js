import React from 'react'
import Title from './Title'
import Users from './Users/Users'
import Login from './Login/Login'
import {Consumer} from '../context'
import {Link} from 'react-router-dom'

export default function Home() {
    
    return <Consumer>
        {value => {
            const {fireRedirect} = value;
             
            if(fireRedirect) {
                return (
                    <div className="chat users_list">
                        <div className="card contacts_card">
                            <Title center title="Users"/>
                            <Users/>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="chat users_list">
                        <div className="card contacts_card">
                            <Title center title="Welcome to chat"/>
                            <Login/>
                             <div className="or-reg">
                               <span>or</span>  
                               <Link to="/sign-up" className="text-main">Register now</Link>
                            </div>   
                        </div>
                    </div>
                );
                
            }
                
        
    }}
    </Consumer>
}

