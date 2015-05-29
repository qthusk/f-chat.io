'use strict';


var
  defaults  = require('./default-values').v1,
  request   = require('request');


exports.config = defaults;


// Helper functions
//  --- BEGIN ---
function buildApiUrl(pathKey) {
  return exports.config.BaseUrl + exports.config[pathKey];
}

function apiEndpointRequest(pathKey, callback, postData) {
  request.post(buildApiUrl(pathKey), { form: (postData || {}) },
    function(err, res, body) {
      if (err) { throw err; }

      if (res.statusCode !== 200) { body = JSON.stringify({ error: body }); }

      if (typeof callback !== 'function') { return; }

      var result;
      try { result = JSON.parse(body); }
      catch(ex) {}

      if (result.error && result.error.length) {
        callback(result, null);
      } else {
        callback(null, result);
      }
    }
  );
}
//  ---- END ----


// Acquire an API Ticket asynchronously
exports.acquireTicket = function(account, password, callback) {
  apiEndpointRequest('AcquireTicketPath', callback, {
      secure:   'yes',
      account:  account,
      password: password
  });
};


// Bookmarks API
exports.bookmarks = {
  // Bookmark a profile. Takes one argument, <name>:
  add: function(account, ticket, name, callback) {
    apiEndpointRequest('BookmarkAddPath', callback, {
      account:  account,
      ticket:   ticket,
      name:     name
    });
  },

  // List all bookmarked profiles
  list: function(account, ticket, callback) {
    apiEndpointRequest('BookmarkListPath', callback, {
      account:  account,
      ticket:   ticket
    });
  },

  // Remove a profile bookmark. Takes one argument, <name>:
  remove: function(account, ticket, name, callback) {
    apiEndpointRequest('BookmarkRemovePath', callback, {
      account:  account,
      ticket:   ticket,
      name:     name
    });
  }
};


// Characters API
exports.character = {
  // Get a character's custom kinks. Requires one parameter, <name>:
  customkinks: function(account, ticket, name, callback) {
    apiEndpointRequest('CharacterCustomkinksPath', callback, {
      account:  account,
      ticket:   ticket,
      name:     name
    });
  },

  // Get basic characer info. Does not require the account and ticket form
  // fields. Requires one parameter, <name>:
  get: function(name, callback) {
    apiEndpointRequest('CharacterGetPath', callback, { name: name });
  },

  // Get a list of all character image urls, and some extra info like the
  // dimensions. Requires one parameter, <name>:
  images: function(account, ticket, name, callback) {
    apiEndpointRequest('CharacterImagesPath', callback, {
      account:  account,
      ticket:   ticket,
      name:     name
    });
  },

  // Get a character's profile info fields. Requires one parameter, <name>:
  info: function(account, ticket, name, callback) {
    apiEndpointRequest('CharacterInfoPath', callback, {
      account:  account,
      ticket:   ticket,
      name:     name
    });
  },

  // Get a character's kinks. Does not require the account and ticket form
  // fields. Requires one parameter, <name>:
  kinks: function(name, callback) {
    apiEndpointRequest('CharacterKinksPath', callback, { name: name });
  },

  // Get a list of all the account's characters:
  list: function(account, ticket, callback) {
    apiEndpointRequest('CharacterListPath', callback, {
      account:  account,
      ticket:   ticket
    });
  }
};


// Misc-Data API
exports.misc = {
  // Get the global list of all f-list groups:
  groupList: function(account, ticket, callback) {
    apiEndpointRequest('GroupListPath', callback, {
      account:  account,
      ticket:   ticket
    });
  },

  // Get a list of all profiles your account has on chat-ignore:
  ignoreList: function(account, ticket, callback) {
    apiEndpointRequest('IgnoreListPath', callback, {
      account:  account,
      ticket:   ticket
    });
  },

  // Get the global list of profile info fields, grouped. Dropdown options
  // include a list of the options. Does not require the account and ticket
  // form fields:
  infoList: function(callback) {
    apiEndpointRequest('InfoListPath', callback);
  },

  // Get the global list of kinks, grouped. Does not require the account
  // and ticket form fields:
  kinkList: function(callback) {
    apiEndpointRequest('KinkListPath', callback);
  },
};


// Friends API
exports.friends = {
  // List all friends, account-wide, in a "your-character (dest) =>
  // the character's friend (source)" format:
  listFriends: function(account, ticket, callback) {
    apiEndpointRequest('FriendListPath', callback, {
      account:  account,
      ticket:   ticket
    });
  },

  // Remove a profile from your friends. Takes two arguments,
  // <charName> (your char) and <friendName> (the character's friend
  // you're removing):
  remove: function(account, ticket, charName, friendName, callback) {
    apiEndpointRequest('FriendRemovePath', callback, {
      account:      account,
      ticket:       ticket,
      source_name:  charName,
      dest_name:    friendName
    });
  },

  // Accept an incoming friend request. <requestId>, can get with
  // listRequests():
  accept: function(account, ticket, requestId, callback) {
    apiEndpointRequest('RequestAcceptPath', callback, {
      account:      account,
      ticket:       ticket,
      request_id:   requestId
    });
  },

  // Cancel an outgoing friend request. <requestId>, can get with pending():
  cancel: function(account, ticket, requestId, callback) {
    apiEndpointRequest('RequestCancelPath', callback, {
      account:      account,
      ticket:       ticket,
      request_id:   requestId
    });
  },

  // Deny a friend request. <requestId>, can get with listRequests():
  deny: function(account, ticket, requestId, callback) {
    apiEndpointRequest('RequestDenyPath', callback, {
      account:      account,
      ticket:       ticket,
      request_id:   requestId
    });
  },

  // Get all incoming friend requests:
  listRequests: function(account, ticket, callback) {
    apiEndpointRequest('RequestListPath', callback, {
      account:  account,
      ticket:   ticket
    });
  },

  // Get all outgoing friend requests:
  pending: function(account, ticket, callback) {
    apiEndpointRequest('RequestPendingPath', callback, {
      account:  account,
      ticket:   ticket
    });
  },

  // Send a friend request. <charName>, <friendName>:
  send: function(account, ticket, charName, friendName, callback) {
    apiEndpointRequest('RequestSendPath', callback, {
      account:      account,
      ticket:       ticket,
      source_name:  charName,
      dest_name:    friendName
    });
  }
};
