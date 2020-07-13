import React from 'react'
import Title from './Title'
import SignUp from './Login/SignUp'

export default function Register() {
    
    return (
        <div className="chat users_list">
            <div className="card contacts_card">
                <Title title="Registration Page" center/>
                <SignUp/>
            </div>
        </div>
    );
}

