'use strict';

console.log('Loading function');

const https = require('https');


var apiKey = process.env.API_KEY;
var leadId = null;

exports.handler = (event, context, callback) => {
    leadId = event.leadId;
    console.log("leadId: " + leadId);
    getLead((result) => callback(null, result));
};

function constructOptions() {
    return {
        host: "app.close.io",
        path: "/api/v1/lead/" + leadId + "/",
        auth: apiKey + ":"
    };
}

function getLead(callback) {
    var options = constructOptions();

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
