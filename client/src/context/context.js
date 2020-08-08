import React, { Component } from 'react'
import {Link} from 'react-router-dom'
// import { Redirect } from 'react-router'
import { chatUsers } from './usersData'
import axios from 'axios'
import Pusher from 'pusher-js'

Pusher.logToConsole = true;

const Context = React.createContext();

const APP_KEY = 'c516fb996fd917d3ba3f';

class Provider extends Component{
    state = {
        token:'',
        login: '',
        email: '',
        password: '',
        repeatPassword:'',
        nickname: '',
        userId: null,
        chatUsers: chatUsers,
        fireRedirect:false,
        userData: {},
        partnerId: null,
        partnerData: {},
        chatMessages: [],
        friends: [],
        message: "",
        isTyping: '',
        page: 1, 
        requestSent: false,
        loading: true,
        pusher: null,
        lastMessage: ''
    }


    componentDidMount(){

        if(localStorage.getItem('auth_data')){
            var storageData         = JSON.parse(localStorage.getItem('auth_data')),
                date                = new Date().toISOString().slice(0, 10),
                expirationTokenDate = new Date(storageData.expirationTime).toISOString().slice(0, 10);
               
                
            if( expirationTokenDate < date ) {
                this.logOut()
            }

            this.getUserById(storageData.userId,storageData.token)
            this.getFriends(storageData.token)
        }
        
        this.getAuthData()
    }

    setupPusher(userId, token) {

        if(userId && token){
            var pusher = new Pusher(APP_KEY, {
                // authEndpoint: 'http://localhost:8000/broadcasting/auth',
                authEndpoint: '/broadcasting/auth',
                cluster: 'eu',
                encrypted: true,
                auth: {
                    params: userId,
                    headers: {
                        Authorization: `Bearer ${ token }`,
                        Accept: 'application/json',
                    }
                }
            });

            this.setState({pusher: pusher})
        }

        var channel = pusher.subscribe('presence-v_chat.' + userId);
        var channelMemberConnection = pusher.subscribe('presence-v_chat.memberConnection');
        var that    = this

        channel.bind('pusher:subscription_succeeded', function(data)  {
            // console.log('Subscription Succeeded! ' + JSON.stringify(data.members))
            // console.log('Subscription Succeeded! ' + Object.keys(data.members))
        });
        
        channel.bind(`NewMessage`,  function(data) {
            console.log('NewMessage! ' + JSON.stringify(data))
            if(data.message.receiver_id === that.state.userId){
                that.setState({
                    chatMessages: that.state.chatMessages.concat([data.message]),
                    lastMessage: data.message.text
                })
                that.scrollToBottom()
            }
        });

        channelMemberConnection.bind('pusher:subscription_succeeded', function(data){});

        channelMemberConnection.bind(`AddMember`, function(data) {
            // console.log('AddMember! ' + data.user_id)
            var friends = that.state.friends

            friends.forEach((friend)=> {
                if(friend.id === data.user_id) {
                    friend.active = 1
                    friend.left_at = ''
                }
                console.log('AddMember! ' + friend.active)
            })

            that.setState({
                friends: friends
            })
            // console.log('AddMember! ' + friends[0].active)
        });

        channelMemberConnection.bind(`RemoveMember`, function(data) {
            // console.log('RemoveMember! ' + data.user_id)
            var friends = that.state.friends

            friends.forEach((friend)=> {
                if(friend.id === data.user_id) {
                    friend.active = 0
                    friend.left_at = 'now'
                }
            })

            that.setState({
                friends: friends
            })
        });
    }

    userTyping = () => {
        var canPublish = true
        var throttleTime = 200

        if(canPublish) {
            axios.post(
                '/api/user-typing', 
                {
                    user_id: this.state.userId,
                    receiver_id: this.state.partnerId
                }, 
                { 
                    headers: { Authorization: `Bearer ${this.state.token}` } 
                }
            )
            
            canPublish = false
            setTimeout(function() {
                canPublish = true
            }, throttleTime)
        }
    }

    scrollToBottom = () => {
        var scrollingElement = document.getElementById('blockMessage')
        if(scrollingElement !== null) {
            scrollingElement.scrollTop = scrollingElement.scrollHeight;
        }
    }


    loginRegLink = () => {
        return (
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sign-up" className="nav-link">
                Sign Up
              </Link>
            </li>
          </ul>
        )
    }
    
    userLink = () => {
        return (
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to={`/profile/${this.state.userId}`} 
                        className="nav-link">
                        Profile
                    </Link>
                </li>
                <li className="nav-item">
                    <a  onClick={() => this.logOut()} className="nav-link a-logout">
                        Logout
                    </a>
                </li>
            </ul>
        )
    }

    startChat = (id) => {

        this.setState({
            page: 1
        })
        
        var clearTimerId
        var that  = this
        var clearInterval   = 900
        var typingChannel   = this.state.pusher.subscribe('presence-v_chat.userTyping')

        typingChannel.bind('pusher:subscription_succeeded', function(data)  {
            console.log('Subscription Succeeded2! ' + JSON.stringify(data))
        })

        typingChannel.bind('UserTyping', function(data) {
            console.log('typing! '+ data.receiver_id + that.state.userId + data.user_id + that.state.partnerId)
            if( data.receiver_id === that.state.userId && data.user_id === that.state.partnerId ) {
                console.log('typingggg! _' + data.receiver_id + that.state.partnerId)
                that.setState({ isTyping: 'is typing...' })

                clearTimeout(clearTimerId);
                clearTimerId = setTimeout(function () {
                    that.setState({ isTyping: '' })
                }, clearInterval);
            }
        });

        axios.get(`/api/chat/${id}/page/${this.state.page}`, {
            headers: { Authorization: `Bearer ${this.state.token}` }
        })
        .then(response => {

            var msgBlock = window.document.getElementById('blockMessage')
            var messages = response.data.messages.reverse()
            
            msgBlock.addEventListener('scroll', this.handleOnScroll)
        
            if(messages.length < 15) {
                this.setState({
                    loading: false
                })
            }else{
                this.setState({
                    loading: true
                })
            }
            
            this.setState({
                chatMessages: messages,
                partnerData: response.data.partner,
                partnerId: id
            })
            
            this.scrollToBottom()
            // console.log('chat',response.data.partner)
        })
        .catch(err => {
            console.log(err)
        })
    }

    loadMessages = () => {
        if(this.state.loading) {
            axios.get(`/api/chat/${this.state.partnerId}/page/${this.state.page}`, {
                headers: { Authorization: `Bearer ${this.state.token}` }
            })
            .then(response => {

                var messages = response.data.messages.reverse()

                this.setState({
                    chatMessages: messages.concat(this.state.chatMessages),
                    partnerData: response.data.partner,
                    page: this.state.page + 1
                })

                if(messages.length >= 15 ) {
                    document.getElementById('blockMessage').scrollTop = 50 
                    this.setState({requestSent: true})
                }else{
                    this.setState({
                        loading: false,
                        page: 1
                    })
                }
                // console.log('chat',response.data.partner)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    handleChange = e => {
        const name = e.target.name;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

        this.setState({
            [name]:value,

        });
    }

    logIn = () => {
        var data = {
            'email': this.state.email,
            'password':this.state.password
        }

        axios.post('/api/login', data)
        .then(response => {
            // console.log('1',response.status);
            if(response.status === 200){
                this.setState({
                    userId: response.data.data.id,
                    token: response.data.data.token, 
                    nickname: response.data.data.nickname,
                    fireRedirect: true
                })

                var tokenDate = new Date()
                tokenDate.setDate(tokenDate.getDate() + 7)

                localStorage.setItem('auth_data', JSON.stringify({
                    userId: this.state.userId,
                    token:this.state.token,
                    nickname:this.state.nickname,
                    fireRedirect:this.state.fireRedirect,
                    expirationTime: tokenDate
                }))

                this.getUserById(this.state.userId,this.state.token)
                this.getFriends(this.state.token)
                this.setupPusher(response.data.data.id, response.data.data.token)
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    signUp = () => {
        var data = {
            'nickname': this.state.nickname,
            'email': this.state.email,
            'password':this.state.password,
            'repeatPassword': this.state.repeatPassword
        }

        axios.post('/api/register', data)
        .then(response => {
            if(response.status === 200){
                this.setState({
                    userId: response.data.data.id,
                    token: response.data.data.token, 
                    nickname: response.data.data.nickname,
                    fireRedirect: true
                })

                var tokenDate = new Date()
                tokenDate.setDate(tokenDate.getDate() + 7)

                localStorage.setItem('auth_data', JSON.stringify({
                    userId: this.state.userId,
                    token:this.state.token,
                    nickname:this.state.nickname,
                    fireRedirect:this.state.fireRedirect,
                    expirationTime: tokenDate
                }))

                this.getUserById(this.state.userId,this.state.token)
                this.getFriends(this.state.token)
                this.setupPusher(response.data.data.id, response.data.data.token)
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    logOut = () => {

        var data = {
            'id': this.state.userId,
            'token': this.state.token
        }

        axios.post('/api/logout', data,{
            headers: { Authorization: `Bearer ${this.state.token}` }
        })
        .then(response => {
            if(response.status === 200){
                this.setState({
                    userId: null,
                    userData: {},
                    token: '', 
                    nickname: '',
                    fireRedirect: false
                })
        
                localStorage.removeItem('auth_data');
                // <Redirect to={'/'}/>
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    getAuthData = () => {
        if(localStorage.getItem('auth_data')){
            var authData = JSON.parse(localStorage.getItem('auth_data'))
            
            this.setState({
                userId: authData.userId,
                token: authData.token,
                nickname: authData.nickname,
                fireRedirect: authData.fireRedirect
            });
            
            this.setupPusher(authData.userId, authData.token)

        }
    }


    getUserById = (id,token) => {
        // console.log('getuser',id,token)
        axios.get(`/api/profile/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                this.setState({userData: response.data.user})
                // console.log('datauser',this.state.userData)
            })
            .catch(err => {
                console.log(err)
            })
    }

    getFriends = (token) => {
        axios.get(`/api/friends`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                this.setState({friends: response.data})
            })
            .catch(err => {
                console.log(err)
            })
    }

    //start Chat functions 

	sendMessage = e =>{

        var data = {
            'is_file': 0,
            'text': this.state.message,
            'id': this.state.partnerId
        }

        axios.post('/api/send-message', data, {
            headers: { Authorization: `Bearer ${this.state.token}` }
        })
        .then(response => {
            if(response.status === 200){

                this.setState({
                    chatMessages: this.state.chatMessages.concat([response.data]),
                    message:"",
                })

                this.scrollToBottom()
            }
            this.getUserById(this.state.userId,this.state.token)
            this.getFriends(this.state.token)
        }).catch((error) => {
            console.log(error)
        });

        this.bindNewMessage()
    }

    //end Chat functions
    
      loadMoreMessages = ()=> {
        if (this.state.requestSent) {
          return;
        }  

        this.loadMessages()
      }
    
      handleOnScroll = ()=> {
        var msgDiv = document.getElementById('blockMessage')

        if (msgDiv.scrollTop === 0 ) {
          this.setState({requestSent: false});
          this.loadMoreMessages();
        }
      }

    render(){
        return (
            <Context.Provider 
                value={{
                    ...this.state,
                    handleChange: this.handleChange,
                    logIn: this.logIn,
                    signUp: this.signUp,
                    logOut: this.logOut,
                    startChat: this.startChat,
                    loginRegLink: this.loginRegLink,
                    userLink: this.userLink,
                    sendMessage: this.sendMessage,
                    userTyping: this.userTyping
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}

const Consumer = Context.Consumer;

export { Provider, Consumer };