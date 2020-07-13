<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MessageUser extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'partner_id',  'user_id','is_read', 'is_file'
    ];

    public $timestamps = false;

    public function user(){
        return $this->hasOne('App\User', 'id', 'partner_id');
    }

    public function messages(){
        return $this->hasMany('App\Message', 'id', 'message_id');
    }
}
