'use strict';

console.log('Loading function');

const https = require('https');


var apiKey = process.env.API_KEY;
var leadId = null;

exports.handler = (event, context, callback) => {
    leadId = event.leadId;
    console.log("leadId: " + leadId);
    postNote((result) => callback(null, result));
};

var post_data = JSON.stringify({
	"lead_id":"lead_lJTA56R67Tcd8Z412p8yq9HAo3PuwpVpSDkyb1Q2gb6",
	"note":"bacon and eggs"
});

function postNote(callback) {
    var post_options = { 
        host: "app.close.io", 
        path: "/api/v1/activity/note/", 
        method: 'POST',
        auth: apiKey + ":",
        // body: post_data,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)//,
        //   'Accept': 'application/json',
        //   'Transfer-Encoding': 'identity'
        }
    };
    
    // Set up the request
    var post_req = https.request(post_options, function(response) {
        response.setEncoding('utf8');
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            callback({
                statusCode: response.statusCode,
                body: JSON.parse(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    });
    
    // post the data
    // post_req.write(post_data);
    post_req.end(post_data);
}

function getLead(callback) {
    var options = { host: "app.close.io", path: "/api/v1/lead/" + leadId + "/", auth: apiKey + ":" };

    return https.get(options, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            console.log("status: " + response.statusCode);
            console.log("body: \n" + body);
            console.log("\n\n\n");
            callback({
                statusCode: response.statusCode,
                body: JSON.parse(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    });
}
