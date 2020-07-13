import React from 'react'
import Title from './Title'
import Profile from './Users/Profile'

export default function UrerProfile() {
    
    return (
        <div className="chat users_list">
            <div className="card contacts_card">
                <Title title="Profile" />
                <Profile/>
            </div>
        </div>
    );
}

