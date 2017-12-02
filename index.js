exports.handler = function (event, context) {
    console.log('Received event:', event)
    context.done(null, {status: 200, body: "bacon"})
}
