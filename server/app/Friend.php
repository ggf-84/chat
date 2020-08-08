<?php
/*
namespace App;

use Illuminate\Database\Eloquent\Model;

class UserFriend extends Model {


    protected $hidden = [
        'user_id',  'requested_friend_id'
    ];

    public $timestamps = false;

    public function user(){
        // return $this->hasOne('App\User', 'id', 'friend_id');
        return $this->belongsTo('App\User', 'user_friends', 'accepted_friend_id', 'id');
    }
}
