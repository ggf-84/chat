import React from 'react'
import {Consumer} from '../context'

export default function Gallery() {
    return <Consumer>
        {value => {
            const {userId} = value;
            return (
                <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-4 mx-auto">
                        <h1 className="text-center">PROFILE</h1>
                    </div>
                    <table className="table col-md-4 mx-auto">
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>{userId}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            );
        }}
    </Consumer>
}