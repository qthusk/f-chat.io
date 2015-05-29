'use strict';

// Commands and others taken from https://wiki.f-list.net/FChat_client_commands
// stuff that you can send
module.exports = {
  // Request a character's account be banned from the server:
  'ACB': {
    params:     {
      character: 'string'
    },
    requires: 'chat-op'
  },

  // Promotes a user to be a chatop (global moderator):
  'AOP': {
    params:     {
      character: 'string'
    },
    requires: 'admin'
  },

  // Requests a list of currently connected alts for a characters account:
  'AWC': {
    params:     {
      character: 'string'
    },
    requires: 'chat-op'
  },

  // Broadcasts a message to all connections:
  'BRO': {
    params:     {
      message: 'string'
    },
    requires: 'admin'
  },

  // Request the channel banlist:
  'CBL': {
    params:     {
      channel: 'string'
    },
    requires: 'chan-op'
  },

  // Bans a character from a channel:
  'CBU': {
    params:     {
      character:  'string',
      channel:    'string'
    },
    requires: 'chan-op'
  },

  // Create a private, invite-only channel:
  'CCR': {
    params:     {
      channel: 'string'
    },
    requires: 'user'
  },

  // Changes a channel's description:
  'CDS': {
    params:     {
      channel:      'string',
      description:  'string'
    },
    requires: 'chan-op'
  },

  // Request a list of all public channels:
  'CHA': {
    params:     {},
    requires: 'user'
  },

  // Sends an invitation for a channel to a user:
  'CIU': {
    params:     {
      channel:    'string',
      character:  'string'
    },
    requires: 'chan-op'
  },

  // Kicks a user from a channel:
  'CKU': {
    params:     {
      channel:    'string',
      character:  'string'
    },
    requires: 'chan-op'
  },

  // Request a character be promoted to channel operator (channel moderator):
  'COA': {
    params:     {
      channel:    'string',
      character:  'string'
    },
    requires: 'chan-op'
  },

  // Requests the list of channel ops (channel moderators):
  'COL': {
    params:     {
      channel: 'string'
    },
    requires: 'user'
  },

  // Demotes a channel operator (channel moderator) to a normal user:
  'COR': {
    params:     {
      channel:    'string',
      character:  'string'
    },
    requires: 'chan-op'
  },

  // Creates an official channel:
  'CRC': {
    params:     {
      channel: 'string'
    },
    requires: 'admin'
  },

  // Set a new channel owner:
  'CSO': {
    params:     {
      character:  'string',
      channel:    'string'
    },
    requires: 'chan-op'
  },

  // Temporarily bans a user from the channel for 1-90 minutes.
  // A channel timeout:
  'CTU': {
    params:     {
      channel:    'string',
      character:  'string',
      length:     'number'
    },
    requires: 'chan-op'
  },

  // Unbans a user from a channel:
  'CUB': {
    params:     {
      channel:    'string',
      character:  'string'
    },
    requires: 'chan-op'
  },

  // Demotes a chatop (global moderator):
  'DOP': {
    params:     {
      character:    'string'
    },
    requires: 'admin'
  },

  // Search for characters fitting the user's selections. Kinks is required,
  // all other parameters are optional:
  'FKS': {
    params:     {
      kinks:        'array->number',
      genders:      [
        'Male', 'Female', 'Transgender', 'Herm', 'Shemale', 'Male-Herm', 'None'
      ],
      orientations: [
        'Straight', 'Gay', 'Bisexual', 'Asexual', 'Unsure',
        'Bi - male preference', 'Bi - female preference',
        'Pansexual', 'Bi-curious'
      ],
      languages:    [
        'Dutch', 'English', 'French', 'Spanish', 'German', 'Russian',
        'Chinese', 'Japanese', 'Portuguese', 'Korean', 'Arabic',
        'Italian', 'Swedish', 'Other'
      ],
      furryprefs:   [
        'No furry characters, just humans', 'No humans, just furry characters',
        'Furries ok, Humans Preferred', 'Humans ok, Furries Preferred',
        'Furs and / or humans'
      ],
      roles:        [
        'Always dominant', 'Usually dominant', 'Switch', 'Usually submissive',
        'Always submissive', 'None'
      ]
    },
    requires: 'user'
  },

  // This command is used to identify with the server:
  'IDN': {
    defparams: {
      method: 'ticket'
    },
    params:     {
      account:    'string',
      ticket:     'string',
      character:  'string',
      cname:      'string',
      cversion:   'string'
    },
    requires: ''
  },

  // A multi-faceted command to handle actions related to the ignore list.
  // The server does not actually handle much of the ignore process, as it
  // is the client's responsibility to block out messages it recieves from
  // the server if that character is on the user's ignore list:
  'IGN': {
    params:     {
      action:     ['add', 'delete', 'notify', 'list'],
      character:  'string'
    },
    requires: 'user'
  },

  // Send a channel join request:
  'JCH': {
    params:     {
      channel: 'string'
    },
    requires: 'user'
  },

  // Request a character be kicked from the server:
  'KIK': {
    params:     {
      character: 'string'
    },
    requires: 'chat-op'
  },

  // Request a list of a user's kinks:
  'KIN': {
    params:     {
      character: 'string'
    },
    requires: 'user'
  },

  // Request to leave a channel:
  'LCH': {
    params:     {
      channel: 'string'
    },
    requires: 'user'
  },

  // Sends a message to all other users in a channel:
  'MSG': {
    params:     {
      channel: 'string',
      message: 'string'
    },
    requires: 'user'
  },

  // Request a list of open private rooms:
  'ORS': {
    params:     {},
    requires: 'user'
  },

  // Sends a ping response to the server. Timeout detection, and activity
  // to keep the connection alive:
  'PIN': {
    params:     {},
    requires: 'user'
  },

  // Sends a private message to another user:
  'PRI': {
    params:     {
      recipient:  'string',
      message:    'string'
    },
    requires: 'user'
  },

  // Requests some of the profile tags on a character, such as Top/Bottom
  // position and Language Preference:
  'PRO': {
    params:     {
      character: 'string'
    },
    requires: 'user'
  },

  // Reload certain server config files:
  'RLD': {
    params:     {
      save: 'string'
    },
    requires: 'chat-op'
  },

  // Roll dice or spin the bottle:
  'RLL': {
    params:     {
      channel:  'string',
      dice:     'string'
    },
    requires: 'user'
  },

  // Change room mode to accept chat, ads, or both:
  'RMO': {
    params:     {
      channel:  'string',
      mode:     ['chat', 'ads', 'both']
    },
    requires: 'chan-op'
  },

  // Sets a private room's status to closed or open:
  'RST': {
    params:     {
      channel:  'string',
      status:   ['public', 'private']
    },
    requires: 'chan-op'
  },

  // Rewards a user, setting their status to 'crown' until they change
  // it or log out:
  'RWD': {
    params:     {
      character: 'string'
    },
    requires: 'admin'
  },

  // Alerts admins and chatops (global moderators) of an issue:
  'SFC': {
    defparams: {
      action: 'report'
    },
    params:     {
      report:     'string',
      character:  'string'
    },
    requires: 'user'
  },

  // Request a new status be set for your character:
  'STA': {
    params:     {
      status:     ['online', 'looking', 'busy', 'dnd', 'idle', 'away', 'crown'],
      statusmsg:  'string'
    },
    requires: 'user'
  },

  // Times out a user for a given amount minutes:
  'TMO': {
    params:     {
      character:  'string',
      time:       'number',
      reason:     'string'
    },
    requires: 'chat-op'
  },

  // "user x is typing/stopped typing/has entered text" for private messages:
  'TPN': {
    params:     {
      character:  'string',
      status:     ['clear', 'paused', 'typing']
    },
    requires: 'user'
  },

  // Unbans a character's account from the server:
  'UBN': {
    params:     {
      character: 'string'
    },
    requires: 'chat-op'
  },

  // Requests info about how long the server has been running, and some
  // stats about usage:
  'UPT': {
    params:     {},
    requires: 'user'
  }
};
