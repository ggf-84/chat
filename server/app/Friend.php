<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Friend extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $hidden = [
        'user_id',  'friend_id'
    ];
    // protected $fillable = [
    //     'user_id',  'friend_id'
    // ];

    public $timestamps = false;

    public function user(){
        // return $this->hasOne('App\User', 'id', 'friend_id');
        return $this->belongsTo('App\User', 'requested_friend_id', 'id')->where('accepted', 1);
    }
}
