<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nickname', 'avatar', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'pivot', 'email_verified_at', 'updated_at', 'created_at'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function messages(){
        return $this->hasMany('App\Message', 'user_id', 'id');
    }

    public function last_message(){
        return $this->messages()
            ->where('receiver_id', JWTAuth::user()->id)
            ->orderBy('id', 'desc')->take(1);
    }

    // public function userMessages(){
    //     return $this->hasMany('App\Message');
    // }

    public function requested_friends(){
        return $this->belongsToMany('App\User', 'user_friend', 'user_id', 'request_friend_id');
    }

    public function accepted_friends(){
        return $this->belongsToMany('App\User', 'user_friend', 'user_id', 'accepted_friend_id');
    }
}
