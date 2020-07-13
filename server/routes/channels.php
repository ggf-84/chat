<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('v_chat.{id}', function ($user, $id) {
    return ['id' => $user->id, 'nickname' => $user->nickname];
});

Broadcast::channel('v_chat.userTyping', function () {
    return true;
});

Broadcast::channel('v_chat.memberConnection', function () {
    return true;
});
