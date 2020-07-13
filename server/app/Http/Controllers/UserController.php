<?php

namespace App\Http\Controllers;

use App\User;
use App\Friend;
use App\MessageUser;
use App\Message;
use App\Events\NewMessage;
use App\Events\AddMember;
use App\Events\RemoveMember;
use App\Events\UserTyping;

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

class UserController extends Controller
{  
    public $loginAfterSignUp = false;

    public function register(Request $request)
    {
        $params = $request->json()->all();
        if( $params['password'] !== $params['repeatPassword']) {
            return response()->json([
                'success' => false,
                'data' => ['message' => 'Passwords do not match. Try again!'],
            ], 401);
        }
        $user = new User();
        $user->nickname = $params['nickname'];
        $user->email = $params['email'];
        $user->password = bcrypt($params['password']);
        $user->save();
        if ($this->loginAfterSignUp = true) {
            return $this->login($request);
        }
        return response()->json([
            'success' => true,
            'data' => $user
        ], 200);
    }


    public function login(Request $request)
    {
        if ($this->loginAfterSignUp) {
            $params = $request->json()->all();
            $credentials = ['email' => $params['email'],'password' => $params['password']];
        }else{
            $credentials = $request->only('email', 'password');
        }
        
        $jwt_token = null;

        if (!$jwt_token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'data' => ['message' => 'Invalid Email or Password'],
            ], 401);
        }
        $user = JWTAuth::user();
        $data = [
            'success' => true,
            'data' => [
                'id' => $user->id,
                'nickname'=> $user->nickname,
                'token' => $jwt_token
            ]
        ];

        $user->active = 1;
        $user->save();

        broadcast(new AddMember($user->id));

        return response()->json($data, 200);
    }


    public function logout(Request $request)
    {
        try {

            if ($user = User::find($request->id)) {
                $user->active = 0;
                $user->left_at = date('Y-m-d H:i');
                $user->save();
            }

            JWTAuth::setToken($request->token)->invalidate();

            broadcast(new RemoveMember($request->id));
            
            return response()->json([
                'success' => true,
                'message' => 'User logged out successfully'
            ]);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, the user cannot be logged out'
            ], 500);
        }
    }


    public function getAuthUser($id)
    {
        $this->checkAuthentification();

        if (! $user = User::find($id)) {
            return response()->json(['user_not_found'], 404);
        }

        return response()->json(compact('user'));
    }


    public function getMessages($id, $page = 1)
    {
        $user       = $this->checkAuthentification();
        $partner    = User::find($id);
  
        $id         = (int)$id;
        $userId     = $user->id;

        $limit      = 15;

        if($page == 1) {
            $page = 0;
        }
        else {
            $page = $page * $limit; 
        }

        $messages = Message::with(['user'=>function($query) use ($id, $userId){
            $query->whereIn('id', [$userId, $id]);
        }])
            ->where('user_id', $userId)
            ->where('receiver_id', $id)
            ->orWhere('user_id', $id)
            ->where('receiver_id', $userId)
            ->orderBy('id', 'desc')
            ->offset($page)->limit($limit)->get();
        
        $data = [
            'messages' => $messages,
            'partner' => $partner
        ];


        return response()->json($data, 200);
    }


    public function getMyFriends()
    {
        $user = $this->checkAuthentification();

        $userId = $user->id;     
  
        foreach ($user->requested_friends as $friend) {
            $friend->last_message; 
        }
                    
        return response()->json($user->requested_friends, 200);
    }


    public function sendMessage(Request $request)
    {
        $user       = $this->checkAuthentification();

        $params     = $request->json()->all();
        $receiverId = $params['id'];
        $message    = $params['text'];
        $isFile     = $params['is_file'];

        $data               = new Message();
        $data->receiver_id  = $receiverId;
        $data->user_id      = $user->id;
        // $data->text         = serialize(base64_encode(json_encode([$message])));
        $data->text         = $message;
        $data->is_read      = 0; 
        $data->is_file      = $isFile;
        $data->save();

        $message = Message::with('user')->find($data->id);

        broadcast(new NewMessage($message));

        return response()->json($message, 200);
    }


    public function isTyping(Request $request)
    {
        $userId = $request->user_id;
        $receiverId = $request->receiver_id;

        broadcast(new UserTyping($userId, $receiverId));

        // return true;
    }


    public function checkAuthentification()
    {
        try {
            if (! JWTAuth::parseToken()->authenticate()) {
                return response()->json(['authentification_falied'], 404);
            }
            if (! $user = JWTAuth::user()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        return $user;
    }
    
}