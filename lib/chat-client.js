'use strict';


var
  commands  = require('./commands'),
  errors    = require('./errors'),
  flist     = require('./json-endpoint').v1,
  events    = require('events'),
  util      = require('util'),
  ws        = require('ws'),
  _         = require('underscore');


// Pick default values for the f-chat client from default-values.js
var std = _(require('./default-values')).pick(
  ['CName', 'CVersion', 'Host', 'Port', 'Secure']
);



var FChatClient = module.exports = function(config) {
  // Call EventEmitter's constructor for our current context and
  // therefore initialize an EventEmitter Object bound to <this>
  events.EventEmitter.call(this);

  // Map cfg values 'cname', 'cversion', 'host', 'port', 'secure' to
  // values defined by <config>, or their defaults in 'std'
  var cfg = _(std).mapObject(function(val, key) {
    return config[key.toLowerCase()] || val;
  });

  // Expose read-only server "URL" property, build from <host> and <port>
  Object.defineProperty(this, 'url', {
    value: (cfg.Secure ? 'wss://' : 'ws://') + cfg.Host + ':' + cfg.Port,
    writeable: false,
    configurable: false,
    enumerable: true
  });

  // Expose  read-only "cname" property, which will be used
  // to store f-chat client's name string
  Object.defineProperty(this, 'cname', {
    value: cfg.CName,
    writeable: false,
    configurable: false,
    enumerable: true
  });

  // Expose read-only "cversion" property, which will be used
  // to store f-chat client's version string
  Object.defineProperty(this, 'cversion', {
    value: cfg.CVersion,
    writeable: false,
    configurable: false,
    enumerable: true
  });
};

// Inherit the FChat "class" from event.EventEmitter
util.inherits(FChatClient, events.EventEmitter);

FChatClient.prototype.connect = function(account, credentials, options) {
  var opts = options || {};

  // Check for valid <account> parameter
  if (!_.isString(account) || !account.length) {
    this.emit('error', new TypeError('<account> MUST be a non-empty string'));
  }

  // Check for valid <credentials> parameter
  if (!_.isString(credentials) || !credentials.length) {
    this.emit('error', new TypeError(
      '<credentials> MUST be a non-empty string'
    ));
  }

  var fchat = this;

  // If we already have a valid ticket as credentials instead of a password,
  // try to build up an actual connection, otherwise try to acquire a fresh
  // ticket, using <credentials> as password.
  if (opts.ticketAsCredentials) {
    flist.character.list(account, credentials, function(err, result) {
      if (err) {
        // Emit 'ticket' event with errors
        fchat.emit('ticket', err, null);
        return;
      }

      // Set data objects with default values
      var data = _.extend(_.pick(result, 'characters'), {
        ticket:             credentials,
        default_character:  _.first(result.characters)
      });

      // Build the actual connection
      _(onTicketAcquired).bind(fchat, account, data, opts, null)();
    });
  } else {
    flist.acquireTicket(account, credentials, function(err, result) {
      if (err) {
        // Emit 'ticket' event with errors
        fchat.emit('ticket', err, null);
        return;
      }

      // Set data objects with default values
      var data = _.pick(result, ['ticket', 'characters', 'default_character']);

      // Build the actual connection
      _(onTicketAcquired).bind(fchat, account, data, opts, function() {
        // Emit 'ticket' event with no errors
        fchat.emit('ticket', null, data);
      })();
    });
  }
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
  if (this.socket && _(commands.client).has(command)) {
    // Dummy callback function
    var cb = _.noop();

    if (_.isFunction(args)) {
      cb = args;
    } else {
      var params = _.mapObject(
        // Lists of possible / default params to check against
        _.extend(
          _.clone(commands.client[command].defparams),
          commands.client[command].params
        ),
        // Fill in user args, where possible
        function(val, param) {
          return (_(args).has(param)) ? args[param] : null;
        }
      );

      // Set <cb> to <callback>, if <callback> is a function
      if (_.isFunction(callback)) {
        cb = callback;
      }
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
  if (!_(commands.server).has(parts[0])) {
    throw new Error('Unknown message identifier: ' + parts[0]);
  }

  // Try parsing the JSON <args> and return parsed/deserialized <command>
  return {
    id:   parts[0],
    args: JSON.parse(parts.slice(1).join(' '))
  };
};



// -------------- //
// Event handlers //
// -------------- //

// <this> can be assumed as an object of the FChatClient class
function onMessage(message, flags) {
  try {
    // Try to parse valid f-chat server-command from <message>
    var command = this.parse(message);
    // ... and emit a 'raw' event with an <command> := {id, args} object ...
    this.emit('raw', null, command);
  } catch(err) {
    // ... or emit a 'raw' event with the respective parse error otherwise.
    this.emit('raw', err, null);
  }
};

// <this> can be assumed as an object of the FChatClient class
function onRaw(err, command) {
  if (err) {
    this.emit('error', err);
    return;
  }

  // Emit parsed <command.id> as event
  this.emit(command.id, null, command.args);
};

// <this> can be assumed as an object of the FChatClient class
function onDisconnected(code, message) {
  this.emit('disconnected', code, message);
};

// <this> can be assumed as an object of the FChatClient class
function onError(err) {
  this.emit('error', err);
};


// Event-handler will only be active, when the auto-ping was
// configured in the FChatClient class' connect(...) method.
//
// <this> can be assumed as an object of the FChatClient class
function onPing(err, args) {
  var fchat = this;

  // Respond with PING
  fchat.send('PIN', function(err) {
    if (err) {
      fchat.emit('error', err);
    } else {
      // Emit f-chat client's own 'ping' event (not to confuse with WebSocket's)
      fchat.emit('ping', null, {});
    }
  });
};


// Things to do, after a valid ticket was acquired in the FChatClient's
// connect(...) method, to build up the actual connection.
//
// <this> can be assumed as an object of the FChatClient class
function onTicketAcquired(account, data, opts, callback) {
  var fchat = this;

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

  // Use callback on successfully saving the ticket.
  if (_.isFunction(callback)) { callback(); }

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
  fchat.socket.on('error', _(onError).bind(fchat));
  fchat.socket.on('close', _(onDisconnected).bind(fchat));
  fchat.socket.on('message', _(onMessage).bind(fchat));
  fchat.socket.on('open', function() {
    // Decide which opts.<character> string to take
    var characterName =
      (opts.character && _(data.characters).contains(opts.character))
        ? opts.character : (data.default_character || null);

    // Emit "connected" event
    fchat.emit('connected', null, fchat.url);

    // Register default 'raw' event handler that emits the incoming
    // <command> as ''<command.id>'-event with <command.args> as data
    fchat.on('raw', _(onRaw).bind(fchat));

    // Register handler for the 'PIN' server command which automatically
    // responds with a 'PIN' back from the client, if options.<autoPing>
    // is [true].
    if (opts.autoPing) {
      fchat.on('PIN', _(onPing).bind(fchat));
    }

    // Register handler once, for reacting to server's "IDN" message
    // in response to our (hopefully) successful IDN message a few
    // lines later
    fchat.once('IDN', function(err, args) {
      fchat.emit('identified', err, args);
    });
    // Send "IDN" message to identify with the server as suggested
    // by the docs at https://wiki.f-list.net/
    fchat.send('IDN', {
      method:     'ticket',
      account:    fchat.account,
      ticket:     fchat.ticket,
      character:  characterName,
      cname:      fchat.cname,
      cversion:   fchat.cversion
    }, function(err) {
      if (err) {
        fchat.emit('error', err);
        fchat.disconnect();
      }
    });
  });
};
