# F-Chat.IO

[![Current package version](https://img.shields.io/npm/v/f-chat.io.svg)](https://www.npmjs.com/package/f-chat.io)
[![Package license](https://img.shields.io/npm/l/f-chat.io.svg)](https://www.npmjs.com/package/f-chat.io)
[![Package downloads per month](https://img.shields.io/npm/dm/f-chat.io.svg)](https://www.npmjs.com/package/f-chat.io)

## Install
```sh
$ npm install f-chat.io
```

## Usage

By default, the FChatClient class uses wss://chat.f-list.net:8799 as URL.

### Example:
```js
'use strict';

var FChatClient = require('f-chat.io').FChatClient;


// Your F-List credentials
var fChatAccount = 'foo-user', fChatPassword = 'bar-pass';

// Client options
var options = { cname: 'foo-bar client', cversion: '1.0.0' };

// Create a new F-Chat client object
var fchat = new FChatClient(options);


// Handle any errors that may arise
fchat.on('error', function(err) {
  console.log('[Error]: ' + err);
});

// WebSocket connection established
fchat.on('connected', function() {
  console.log('Client connected');

  // Something caused the WebSocket to disconnect
  fchat.on('disconnected', function() {
    console.log('Client disconnected');
  });

  // Got API ticket from https://www.f-list.net/json/getApiTicket.php
  fchat.on('ticket', function(err, data) {
    if (!err) {
      console.log('Requested ticket: ' + data.ticket);
    }
  });

  // Got IDN from server, after automatically sending IDN from client
  fchat.on('identified', function(err, data) {
    if (!err) {
      console.log('Identified as character: ' + data.character);
    }
  });

  // Raw commands, that got successfully parsed from any
  // message the WebSocket client got from the server
  fchat.on('raw', function(err, command) {
    if (!err) {
      console.log('>> [' + command.id + '] -> ' + JSON.stringify(command.args));
    }
  });

  // Any of the commands listed here https://wiki.f-list.net/FChat_server_commands
  // that got successfully parsed by the FChatClient object's parse(...) method
  // should trigger events with the same three-character names listed on the
  // wiki, e.g. the "PIN" command:
  fchat.on('PIN', function(err, args) {
    console.log('Recieved PING from server, but won\'t respond to it, ' +
                'as this is our call to disconnect. Cheerio!');
    fchat.disconnect();
  });
});

// Default character for your F-List account will be chosen.
// Should you want to connect as a specific character, provide
// it as the third parameter like this: { character: <characterName> }
fchat.connect(fChatAccount, fChatPassword);
```

The full signature of FChatClient.connect(...) is

```js
FChatClient.connect(<account>, <credentials>, <options>);
```

**\<options\>** is a JS object which can contain the following keys and values:
```js
{
    autoPing:             <boolean> // [true] -> automatically respond with
                                    // a client-'PIN' to a server-'PIN'.
                                    //
                                    // With 'autoPing' set to [true], an
                                    // additional 'ping' event is emitted
                                    // every time the client-'PIN' was
                                    // successfuly send.
                                    //
                                    // Not responding with a client-'PIN'
                                    // command in time, will trigger a
                                    // disconnect after a few further
                                    // server-'PIN' commands.

  , character:            <string>  // Name of the F-List character to join
                                    // the chat as.

  , ticketAsCredentials:  <boolean> // [true] -> <credentials> contains a
                                    // valid ticket instead of the account's
                                    // password.
}
```


## Documentation

Personal ToDo for the next days/weeks ...
