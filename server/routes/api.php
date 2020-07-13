<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', 'UserController@register');
Route::post('login', 'UserController@login');
Route::post('logout', 'UserController@logout');
Route::get('profile/{id}', 'UserController@getAuthUser');
Route::get('chat/{id}/page/{page}', 'UserController@getMessages');
Route::get('friends', 'UserController@getMyFriends');
Route::post('send-message', 'UserController@sendMessage');
Route::post('user-typing', 'UserController@isTyping');
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
