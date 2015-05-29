'use strict';


var
  defaults  = require('./default-values').v2,
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
