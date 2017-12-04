'use strict';

console.log('Loading function');

const https = require('https');


var apiKey = process.env.API_KEY;
var leadId = null;
var contactId = null;
var url = null;

exports.handler = (event, context, callback) => {
    leadId = event.leadId;
    url = event.url;
    contactId = event.contactId;
    // getContact( postNote, (result) => callback(null, result) );
    getContact( function(contact) {
        postNote(contact, (postResult) => callback(null, postResult));
    });
};

function postNote(contact, callback) {
    console.log(JSON.stringify(contact));
    var post_data = JSON.stringify({
    	"lead_id": leadId,
    	"note": (contact.body.name  || contact.body.emails[0].email || "Someone") + " visited the following page:\n" + url
    });

    var post_options = { 
        host: "app.close.io", 
        path: "/api/v1/activity/note/", 
        method: 'POST',
        auth: apiKey + ":",
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)//,
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
    post_req.end(post_data);
}

function getContact(callback, cbsq) {
    var options = { host: "app.close.io", path: "/api/v1/contact/" + contactId + "/", auth: apiKey + ":" };

    return https.get(options, function(response) {
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
            }, cbsq);
        });
    });
}
