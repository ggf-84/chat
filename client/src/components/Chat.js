import React from 'react'
import {Consumer} from '../context'
import { Redirect } from 'react-router'
import Users from '../components/Users/Users'

export default function Chat() {
    return <Consumer>
        {value => {
			const {userData,partnerData,chatMessages,message,handleChange,sendMessage,userTyping,isTyping} = value;
			var userId = userData.id

            return (
                <div className="container-fluid h-100">
					<div className="row justify-content-center h-100">
						<div className="col-md-4 col-xl-3 chat chat-user-list">
          					<div className="card mb-sm-3 mb-md-0 contacts_card">
								<div className="card-header">
									<div className="input-group">
										<input type="text" placeholder="Search..." name="" className="form-control search"/>
										<div className="input-group-prepend">
											<span className="input-group-text search_btn"><i className="fas fa-search"></i></span>
										</div>
									</div>
								</div>
          						<Users />
								<div className="card-footer"></div>
							</div>
        				</div>
						<div className="col-md-8 col-xl-6 chat">
							<div className="card">
								<div className="card-header msg_head">
									<div className="d-flex bd-highlight">
										<div className="img_cont">
											<img src={partnerData.avatar} className="rounded-circle user_img"  alt=""/>
											<span className={partnerData.active ? "online_icon" : ""}></span>
										</div>
										<div className="user_info">
											<span>{partnerData.nickname}</span>
										</div>
									</div>
									<div id="action_menu_btn">
										<div className="video_cam">
											<span><i className="fas fa-video"></i></span>
											<span><i className="fas fa-phone"></i></span>
										</div>
									</div>
								</div>
								<div className="card-body msg_card_body" id="blockMessage">

								{
								chatMessages.map((message, i)=> {
									return (
									<div className={`d-flex justify-content-${message.user_id === userId ? 'end':'start'} mb-4`} key={i}>
										
										{ message.user_id === userId ? ``
										:
											<div className="img_cont_msg">
												<img src={`${message.user.avatar}`} 
												className="rounded-circle user_img_msg" alt=""/>
											</div> 
										}

										<div className={message.user_id === userId ? 'msg_cotainer_send': 'msg_cotainer'}>
											{message.text}
											<span className={`msg_time${message.user_id === userId ? '_send':''}`}>
												{message.created_at}
											</span>
										</div>

										{ message.user_id === userId ? 
											<div className="img_cont_msg">
												<img src={`${message.user.avatar}`} 
												className="rounded-circle user_img_msg" alt=""/>
											</div>
										: '' 
										}
								
									</div>)
									})
								}

								</div>
								<div className="card-footer">
									<div className="is-typing">{ isTyping }</div>
									<div className="input-group">
										<div className="input-group-append">
											<span className="input-group-text attach_btn"><i className="fas fa-paperclip"></i></span>
										</div>
										<textarea
											id="message"
											type="text"
											name="message"
											className="form-control type_msg"
											value={message}
											onChange={handleChange}
											onKeyUp={userTyping}
											></textarea>
										<div className="input-group-append">
											<button
												disabled={message.length < 1}
												type="submit"
												onClick={ () => sendMessage() }
												className="input-group-text send_btn"
											><i className="fas fa-location-arrow"></i></button>
										</div>
									</div>	
								</div>
							</div>
						</div>
					</div>
      				{!userId &&  (<Redirect to={'/'}/>)  }
				</div>
            );
        }}
    </Consumer>
}
