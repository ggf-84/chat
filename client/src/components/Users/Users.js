import React from 'react'
import { Consumer } from '../../context';
import User from './User'

export default function Users() {
    return <Consumer>
        {value => {
            const {friends} = value;
            return (
                <div className="card-body contacts_body">
                    <ul className="contacts">
                        {friends.length === 0 ? (
                            <div className="col text-title text-center">
                                no friends in your chat! Add friends
                            </div>
                        ):(
                            friends.map((user) => {
                               return <User key={user.id} user={user}/> ;
                        }))}
                    </ul>
                </div>
            );
        }}
    </Consumer>
}

