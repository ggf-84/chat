import React from 'react'
import Title from './Title'
import Login from './Login/Login'

export default function SignIn() {
    
    return (
        <div className="chat users_list">
            <div className="card contacts_card">
                <Title title="Login Page" center/>
                <Login/>
            </div>
        </div>
    );
}

