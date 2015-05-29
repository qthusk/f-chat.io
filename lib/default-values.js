'use strict';


var pack = require('../package.json');

exports.CName     = pack.name;          // F-Chat client name string.
exports.CVersion  = pack.version;       // F-Chat client version string.
exports.Host      = 'chat.f-list.net';  // Default Host.
exports.Port      = 8799;               // Default Port (dev-port).
exports.Secure    = true;               // Default for https ('wss://' == true)
                                        // or non-https ('ws://' == false).

exports.v1 = {
  // Base URL of F-List's JSON API Endpoint:
  BaseUrl: 'https://www.f-list.net/json/',

  // API path for acquiring a ticket:
  AcquireTicketPath: 'getApiTicket.php',

  // API paths for bookmark management:
  BookmarkAddPath:    'api/bookmark-add.php',
  BookmarkListPath:   'api/bookmark-list.php',
  BookmarkRemovePath: 'api/bookmark-remove.php',

  // API paths for retrieving character specific data:
  CharacterCustomkinksPath: 'api/character-customkinks.php',
  CharacterGetPath:         'api/character-get.php',
  CharacterImagesPath:      'api/character-images.php',
  CharacterInfoPath:        'api/character-info.php',
  CharacterKinksPath:       'api/character-kinks.php',
  CharacterListPath:        'api/character-list.php',

  // API paths for getting misc data:
  GroupListPath:  'api/group-list.php',
  IgnoreListPath: 'api/ignore-list.php',
  InfoListPath:   'api/info-list.php',
  KinkListPath:   'api/kink-list.php',

  // API paths for handling friend request and friend list data:
  FriendListPath:     'api/friend-list.php',
  FriendRemovePath:   'api/friend-remove.php',
  RequestAcceptPath:  'api/request-accept.php',
  RequestCancelPath:  'api/request-cancel.php',
  RequestDenyPath:    'api/request-deny.php',
  RequestListPath:    'api/request-list.php',
  RequestPendingPath: 'api/request-pending.php',
  RequestSendPath:    'api/request-send.php'
};

exports.v2 = {
  // Base URL of F-List's JSON API Endpoint:
  BaseUrl: 'https://www.f-list.net/api/v2/',

  // API path for acquiring a ticket:
  AcquireTicketPath: 'auth',

  // API paths for bookmarks & friends listing:
  BookmarksAndFriendsListPath: 'bookmark_friend/list',

  // API paths for bookmark management:
  BookmarkAddPath:    'bookmark/add',
  BookmarkRemovePath: 'bookmark/remove',

  // API paths for handling friend request and friend list data:
  FriendAddPath:      'friend/add',
  FriendRemovePath:   'friend/remove',
  RequestAcceptPath:  'friend/request/accept',
  RequestCancelPath:  'friend/request/cancel',

  // API paths for handling character specific data:
  CharacterListPath:    'character/list',
  CharacterGetPath:     'character/data',
  CharacterMemoSetPath: 'character/memo/set',
  CharacterMemoGetPath: 'character/memo/get',

  // API paths for handling "ignores":
  IgnoreListPath:   'ignore/list',
  IgnoreAddPath:    'ignore/add',
  IgnoreRemovePath: 'ignore/remove',

  // API paths for getting misc data:
  KinkDataListPath: 'kink/list',
  SiteSearchPath:   'search/site'
};
