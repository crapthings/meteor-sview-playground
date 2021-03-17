const Dummies = new Mongo.Collection('dummies')

Meteor.startup(function () {
  Tracker.autorun(function () {
    console.log(Dummies.find().fetch())
  })

  Meteor.connection._stream.eventCallbacks.message.push(function (msg) {
    if (msg === 'anything you want') {
      console.log('websocket event', msg)
      Dummies.insert({ hello: msg })

      Meteor.connection._stream.send('send back to server')
    }
  })
})
