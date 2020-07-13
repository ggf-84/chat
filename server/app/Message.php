<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'text',  'is_read', 'is_file', 'created_at'
    ];

    protected $hidden = [
        'updated_at'
    ];

    public $timestamps = true;

    // public function user(){
    //     return $this->hasOne('App\User', 'user_id');
    // }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

}
