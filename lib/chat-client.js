'use strict';


var
  commands  = require('./commands'),
  errors    = require('./errors'),
  flist     = require('./json-endpoint').v1,
  events    = require('events'),
  util      = require('util'),
  ws        = require('ws');


var
  stdCName    = require('./default-values').CName,
  stdCVersion = require('./default-values').CVersion,
  stdHost     = require('./default-values').Host,
  stdPort     = require('./default-values').Port,
  stdSecure   = require('./default-values').Secure;



var FChatClient = function(config) {
  // Call EventEmitter's constructor for our current context and
  // therefore initialize an EventEmitter Object bound to <this>
  events.EventEmitter.call(this);

  var cfg = config || {};
  cfg.cname     = cfg.cname || stdCName;
  cfg.cversion  = cfg.cversion || stdCVersion;
  cfg.host      = cfg.host || stdHost;
  cfg.port      = cfg.port || stdPort;
  cfg.secure    = cfg.secure || stdSecure;

  // Expose read-only server "URL" property, build from <host> and <port>
  Object.defineProperty(this, 'url', {
    value: (cfg.secure ? 'wss://' : 'ws://') + cfg.host + ':' + cfg.port,
    writeable: false,
    configurable: false,
    enumerable: true
  });

  // Expose  read-only "cname" property, which will be used
  // to store f-chat client's name string
  Object.defineProperty(this, 'cname', {
    value: cfg.cname,
    writeable: false,
    configurable: false,
    enumerable: true
  });

  // Expose read-only "cversion" property, which will be used
  // to store f-chat client's version string
  Object.defineProperty(this, 'cversion', {
    value: cfg.cversion,
    writeable: false,
    configurable: false,
    enumerable: true
  });
};

// Inherit the FChat "class" from event.EventEmitter
util.inherits(FChatClient, events.EventEmitter);

FChatClient.prototype.connect = function(account, password, character) {
  // Check for valid <account> parameter
  if (!account || typeof account !== 'string' || !account.length) {
    throw new Error('<account> MUST be a non-empty string');
  }

  // Check for valid <password> parameter
  if (!password || typeof password !== 'string' || !password.length) {
    throw new Error('<password> MUST be a non-empty string');
  }

  var fchat = this;
  flist.acquireTicket(account, password, function(err, data) {
    if (err) {
      // Emit 'ticket' event with errors
      fchat.emit('ticket', err, null);
    }

    // Store <account> and <ticket> for later

    // Expose un-deletable "account" property, which will be used
    // to store the content of the <account> parameter passed to
    // FChatClient.prototype.connect(...)
    Object.defineProperty(fchat, 'account', {
      value: account,
      writeable: true,
      configurable: false,
      enumerable: true
    });

    // Expose un-deletable "ticket" property, which will be used
    // to store the <ticket> retrieved by a successful F-List API
    // call in FChatClient.prototype.connect(...)
    Object.defineProperty(fchat, 'ticket', {
      value: data.ticket || '',
      writeable: true,
      configurable: false,
      enumerable: true
    });

    // Emit 'ticket' event with no errors
    fchat.emit('ticket', null, data);

    // Expose un-deletable "socket" property, which will be used
    // to store the WebSocket object that holds the connection to
    // f-list
    try {
      Object.defineProperty(fchat, 'socket', {
        value: new ws(fchat.url),
        writeable: true,
        configurable: false,
        enumerable: true
      });
    } catch(err) {
      fchat.emit('error', err);
    }

    // Register event handlers
    fchat.socket.on('error', fchat.onError_.bind(fchat));
    fchat.socket.on('close', fchat.onDisconnect_.bind(fchat));
    fchat.socket.on('message', fchat.onMessage_.bind(fchat));
    fchat.socket.on('open', function() {
      // Decide which <character> string to take
      var char = (character && data.characters.indexOf(character) > -1)
        ? character : (data.default_character || null);

      // Emit "connected" event
      fchat.emit('connected', null, fchat.url);

      // Register default 'raw' event handler that emits the incoming
      // <command> as ''<command.id>'-event with <command.args> as data
      fchat.on('raw', fchat.onRaw_);

      // Register handler once, for reacting to server's "IDN" message
      // in response to our (hopefully) successful IDN message a few
      // lines later
      fchat.once('IDN', function(err, args) {
        fchat.emit('identified', null, args);
      });
      // Send "IDN" message to identify with the server as suggested
      // by the docs at https://wiki.f-list.net/
      fchat.send('IDN', {
        method:     'ticket',
        account:    fchat.account,
        ticket:     fchat.ticket,
        character:  char,
        cname:      fchat.cname,
        cversion:   fchat.cversion
      }, function(err) {
        if (err) {
          fchat.emit('error', err);
          fchat.disconnect();
        }
      });
    });
  });
};

FChatClient.prototype.disconnect = function() {
  if (this.socket && (
        this.socket.readyState == ws.OPEN ||
        this.socket.readyState == ws.CONNECTING
      )) {
    this.socket.close();
  }
};

FChatClient.prototype.send = function(command, args, callback) {
  if (this.socket && (command in commands.client)) {
    // Dummy callback function
    var cb = function() {};

    if (typeof args === 'function') {
      cb = args;
    } else {
      // Lists of possible / default params to check against
      var
        defparams = commands.client[command].defparams,
        usrparams = commands.client[command].params,
        params    = {};

      for (var param in defparams) {
        if (param in args) { params[param] = args[param]; }
      }
      for (var param in usrparams) {
        if (param in args) { params[param] = args[param]; }
      }

      if (typeof callback === 'function') { cb = callback; }
    }

    // Send message as string "over the wire" (WebSocket)
    this.socket.send(command + ' ' + JSON.stringify(params), cb);
  }
};

FChatClient.prototype.parse = function(message) {
  // Split message into <id> and <args>, if possible
  var parts = (message.indexOf(' ') > 2) ? message.split(' ') : [message, '{}'];

  // Do we have a message that can be split into <id> and (JSON) <args>?
  if (!parts.length || parts.length < 2) {
    throw new Error('Malformed message: ' + message);
  }

  // Check, if we even know the detected message ID
  if (!(parts[0] in commands.server)) {
    throw new Error('Unknown message identifier: ' + parts[0]);
  }

  // Try parsing the JSON <args> and return parsed/deserialized <command>
  return {
    id:   parts[0],
    args: JSON.parse(parts.slice(1).join(' '))
  };
};

FChatClient.prototype.onMessage_ = function(message, flags) {
  try {
    var command = this.parse(message);
    this.emit('raw', null, command);
  } catch(err) {
    this.emit('error', err);
  }
};

FChatClient.prototype.onRaw_ = function(err, command) {
  if (err) {
    this.emit('error', err);
    return;
  }

  this.emit(command.id, null, command.args);
};

FChatClient.prototype.onDisconnect_ = function() {
  this.emit('disconnected');
};

FChatClient.prototype.onError_ = function(err) {
  this.emit('error', err);
};


module.exports = FChatClient;
