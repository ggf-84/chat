import React from 'react'
import {Link} from 'react-router-dom'
import { Consumer } from '../../context'

export default function User({user}) {
    return <Consumer>
        {value => {
            const {startChat,partnerId,fireRedirect,lastMessage} = value;
            console.log('123',user)
            return (
                    <Link to={`/chat/${user.id}`} onClick={() => startChat(user.id)} >
                        <li className={`${user.id === partnerId ? 'active' : ''}`}>
                            <div className="d-flex bd-highlight user-block-list">
                                <div className="img_cont">
                                    <span className="badge badge-primary badge-pill">
                                     { fireRedirect ? 
                                        (user.last_message[0] && user.last_message[0].is_read > 0 ? 1 : '') 
                                        : ''}
                                    </span>
                                    <img src={ user.avatar } className="rounded-circle user_img" alt=""/>
                                    <span className={`${user.active ? 'online_icon' : ''}`}></span>
                                </div>
                                <div className="user_info">
                                    <span>{ user.nickname }</span>
                                    <div className="last_msg">
                                        {   lastMessage ? 
                                            (lastMessage.substr(0,15) + (lastMessage.length > 15 ? '...' : '')) : 
                                            ( user.last_message.length > 0 
                                                ? (user.last_message[0].text).substr(0,15) + ((user.last_message[0].text).length > 15 ? '...' : '')
                                                : '')
                                        }
                                        </div>
                                    <p>{ user.active ? '' : user.left_at }</p>
                                </div>
                            </div>
                        </li>
                    </Link>
            );
        }}
    </Consumer>
}