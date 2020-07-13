<?php

namespace App\Http\Controllers;

use App\User;
use App\Friend;
use App\MessageUser;
use App\Message;

use Illuminate\Http\Request;
use App\Http\Requests\RegisterAuthRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\PayloadFactory;
use Tymon\JWTAuth\JWTManager as JWT;
// use Pusher\Pusher;

class MessageController extends Controller
{   
    const NR_OF_MSG = 15;

    public function getMessage($id)
    {
        $userId = JWTAuth::user()->id;
        // Make read all unread message
        Message::where(['receiver_id' => $id, 'user_id' => $userId])->update(['is_read' => 1]);
        // Get all message from selected user
        $messages = Message::where(function ($query) use ($id, $userId) {
            $query->where('receiver_id', $id)->where('user_id', $userId);
        })->oRwhere(function ($query) use ($id, $userId) {
            $query->where('receiver_id', $userId)->where('user_id', $id);
        })->take(NR_OF_MSG);
        return view('messages.index', ['messages' => $messages]);
    }
    
    public function sendMessage(Request $request)
    {
        $from = JWTAuth::user()->id;
        $to = $request->id;
        $message = $request->message;
        $data = new Message();
        $data->receiver_id = $from;
        $data->user_id = $to;
        $data->text = $message;
        $data->is_read = 0; // message will be unread when sending message
        $data->is_file = 0;
        $data->save();

        // // pusher
        // $options = array(
        //     'cluster' => 'ap2',
        //     'useTLS' => true
        // );
        // $pusher = new Pusher(
        //     env('PUSHER_APP_KEY'),
        //     env('PUSHER_APP_SECRET'),
        //     env('PUSHER_APP_ID'),
        //     $options
        // );
        // $data = ['receiver_id' => $from, 'user_id' => $to]; // sending from and to user id when pressed enter
        // $pusher->trigger('my-channel', 'my-event', $data);
    }
}