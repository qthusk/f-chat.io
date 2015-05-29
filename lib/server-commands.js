'use strict';

// Commands and others taken from https://wiki.f-list.net/FChat_server_commands
// Stuff that is sent to you
module.exports = {
  // Sends the client the current list of chatops:
  'ADL': {
    args:     {
      ops: 'array->string'
    },
    requires: 'user'
  },

  // The given character has been promoted to chatop:
  'AOP': {
    args:     {
      character: 'string'
    },
    requires: 'user'
  },

  // Incoming admin broadcast:
  'BRO': {
    args:     {
      message: 'string'
    },
    requires: 'user'
  },

  // Removes a user from a channel, and prevents them from re-entering:
  'CBU': {
    args:     {
      operator:   'string',
      channel:    'string',
      character:  'string'
    },
    requires: 'chan-op'
  },

  // Alerts the client that that the channel's description has changed.
  // This is sent whenever a client sends a JCH to the server:
  'CDS': {
    args:     {
      channel:      'string',
      description:  'string'
    },
    requires: 'user'
  },

  // Sends the client a list of all public channels:
  'CHA': {
    args:     {
      channel: 'array->object'
    },
    requires: 'user'
  },

  // Invites a user to a channel:
  'CIU': {
    args:     {
      sender: 'string',
      title:  'string',
      name:   'string'
    },
    requires: 'user'
  },

  // Kicks a user from a channel:
  'CKU': {
    args:     {
      operator:   'string',
      channel:    'string',
      character:  'string'
    },
    requires: 'chan-op'
  },

  //
  'COA': {},

  //
  'COL': {},

  // After connecting and identifying you will receive a CON command, giving
  // the number of connected users to the network:
  'CON': {
    args:     {
      count: 'number',
    },
    requires: 'user'
  },

  // Removes a channel operator:
  'COR': {
    args:     {
      character:  'string',
      channel:    'string'
    },
    requires: 'chan-op'
  },

  // Sets the owner of the current channel to the character provided:
  'CSO': {
    args:     {
      character:  'string',
      channel:    'string'
    },
    requires: 'user'
  },

  // Temporarily bans a user from the channel for 1-90 minutes.
  // A channel timeout:
  'CTU': {
    args:     {
      operator:   'string',
      channel:    'string',
      length:     'number',
      character:  'string'
    },
    requires: 'user'
  },

  // The given character has been stripped of chatop status:
  'DOP': {
    args:     {
      character:  'string'
    },
    requires: 'user'
  },

  // Indicates that the given error has occurred:
  'ERR': {
    args:     {
      number:   'number',
      message:  'string'
    },
    requires: ''
  },

  // Sent by as a response to the client's FKS command, containing the
  // results of the search:
  'FKS': {
    args:     {
      characters: 'array->object',
      kinks:      'array->object'
    },
    requires: 'user'
  },

  // Sent by the server to inform the client a given character went offline:
  'FLN': {
    args:     {
      character: 'string'
    },
    requires: 'user'
  },

  // Initial friends list:
  'FRL': {
    args:     {
      characters: 'array->string'
    },
    requires: 'user'
  },

  // Server hello command. Tells which server version is running and who
  // wrote it:
  'HLO': {
    args:     {
      message: 'string'
    },
    requires: 'user'
  },

  // Initial channel data. Received in response to JCH, along with CDS
  'ICH': {
    args:     {
      users:    'array->object',
      channel:  'string',
      title:    'string',
      mode:     ['ads', 'chat', 'both']
    },
    requires: 'user'
  },

  // Used to inform the client their identification is successful, and
  // handily sends their character name along with it:
  'IDN': {
    args:     {
      character: 'string'
    },
    requires: 'user'
  },

  // Handles the ignore list:
  'IGN': {
    args:     {
      action:     'string',
      characters: 'array->string',
      chracter:   'string'
    },
    requires: 'user'
  },

  // Indicates the given user has joined the given channel. This may also be
  // the client's character:
  'JCH': {
    args:     {
      channel:    'string',
      character:  'object',
      title:      'string'
    },
    requires: 'user'
  },

  // Kinks data in response to a KIN client command:
  'KID': {
    args:     {
      type:     ['start', 'custom', 'end'],
      message:  'string',
      key:      'number',
      value:    'number'
    },
    requires: 'user'
  },

  // An indicator that the given character has left the channel. This may
  // also be the client's character:
  'LCH': {
    args:     {
      channel:    'string',
      character:  'string'
    },
    requires: 'user'
  },

  // Sends an array of all the online characters and their gender, status,
  // and status message:
  'LIS': {
    args:     {
      characters: 'array->object'
    },
    requires: 'user'
  },

  // A roleplay ad is received from a user in a channel:
  'LRP': {
    args:     {
      character:  'string',
      message:    'string',
      channel:    'string'
    },
    requires: 'user'
  },

  // A message is received from a user in a channel:
  'MSG': {
    args:     {
      character:  'string',
      message:    'string',
      channel:    'string'
    },
    requires: 'user'
  },

  // A user connected:
  'NLN': {
    args:     {
      identity: 'string',
      gender:   [
        'Male', 'Female', 'Transgender', 'Herm', 'Shemale', 'Male-Herm', 'None'
      ],
      status:   ['online', 'looking', 'busy', 'dnd', 'idle', 'away', 'crown']
    },
    requires: 'user'
  },

  // Gives a list of open private rooms:
  'ORS': {
    args:     {
      channels: 'array->object'
    },
    requires: 'user'
  },

  // Ping command from the server, requiring a response, to keep the
  // connection alive:
  'PIN': {
    args:     {
    },
    requires: 'user'
  },

  // Profile data commands sent in response to a PRO client command:
  'PRD': {
    args:     {
      type:     ['start', 'info', 'select', 'end'],
      message:  'string',
      key:      'string',
      value:    'string'
    },
    requires: 'user'
  },

  // A private message is received from another user:
  'PRI': {
    args:     {
      character:  'string',
      message:    'string'
    },
    requires: 'user'
  },

  // Rolls dice or spins the bottle:
  'RLL': {
    args:     {
      type:       ['dice', 'bottle'],
      channel:    'string',
      message:    'string',
      character:  'string',
      rolls:      'array->string',
      results:    'array->number',
      endresult:  'number'
    },
    requires: 'user'
  },

  // Change room mode to accept chat, ads, or both:
  'RMO': {
    args:     {
      mode:     ['chat', 'ads', 'both'],
      channel:  'string'
    },
    requires: 'user'
  },

  // Real-time bridge. Indicates the user received a note or message, right
  // at the very moment this is received:
  'RTB': {
    args:     {
      type:       'string',
      character:  'string'
    },
    requires: 'user'
  },

  // Alerts admins and chatops (global moderators) of an issue:
  'SFC': {
    args:     {
      action:     ['report', 'confirm'],
      timestamp:  'string',
      character:  'string',
      moderator:  'string',
      callid:     'number',
      logid:      'number',
      report:     'string'
    },
    requires: 'user'
  },

  // A user changed their status:
  'STA': {
    args:     {
      status:     ['online', 'looking', 'busy', 'dnd', 'idle', 'away', 'crown'],
      character:  'string',
      statusmsg:  'string'
    },
    requires: 'user'
  },

  // An informative autogenerated message from the server. This is also the
  // way the server responds to some commands, such as RST, CIU, CBL, COL,
  // and CUB. The server will sometimes send this in concert with a response
  // command, such as with SFC, COA, and COR
  'SYS': {
    args:     {
      message: 'string',
      channel: 'string'
    },
    requires: 'user'
  },

  // A user informs you of his typing status:
  'TPN': {
    args:     {
      character:  'string',
      status:     ['clear', 'paused', 'typing']
    },
    requires: 'user'
  },

  // Informs the client of the server's self-tracked online time, and a few
  // other bits of information:
  'UPT': {
    args:     {
      time:         'number',
      starttime:    'number',
      startstring:  'string',
      accepted:     'number',
      channels:     'number',
      users:        'number',
      maxusers:     'number'
    },
    requires: 'user'
  },

  // Variables the server sends to inform the client about server variables:
  'VAR': {
    args:     {
      variable: 'string',
      value:    'number'
    },
    requires: 'user'
  },
};
