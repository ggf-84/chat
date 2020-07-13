import React from 'react'
import Title from './Title'
import {Link} from 'react-router-dom';

export default function Default() {
    
    return (
        <div className="chat users_list">
            <div className="card contacts_card">
                <Title title="page not found" center/>
                <div className="error-404">404</div>
                    <Link to="/"
                    className="main-link"
                    // style={{margin:"2rem"}}
                    >return home</Link>
            </div>
        </div>
    );
}

