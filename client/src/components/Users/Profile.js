import React from 'react'
import {Consumer} from '../../context'
import { Redirect } from 'react-router'

export default function Profile() {
    return <Consumer>
        {value => {
            const {userData, fireRedirect} = value;

            var redirect = true
            if(fireRedirect === true && userData.id !== undefined ) { redirect = false }

            return (
                <div className="mt-5">
                    <table className="table col-md-4 mx-auto">
                        <tbody>
                            <tr>
                                <td>Photo</td>
                                <td>
                                    <img src={userData.avatar} className="avatar_photo" alt=""/>
                                </td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td>{userData.nickname}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{userData.email}</td>
                            </tr>
                        </tbody>
                    </table>
                    {redirect &&  (<Redirect to={'/'}/>)  }
                </div>
            );
        }}
    </Consumer>
}