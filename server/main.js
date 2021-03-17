const serverOnlyCollection = new Mongo.Collection('memorydb', { connection: null })

Meteor.methods({
  test () {
    Meteor.default_server.sessions.forEach((session) => {
      session._namedSubs.forEach((sub) => {
        const id = Random.id()

        const ddpMessageAdded = EJSON.stringify({ msg: 'added', collection: 'dummies', id, fields: { hello: 'kitty' } })
        sub._session.socket.send(ddpMessageAdded)

        const ddpMessageChanged = EJSON.stringify({ msg: 'changed', collection: 'dummies', id, fields: { hello: 'kitty', wow: 'cute' } })
        sub._session.socket.send(ddpMessageChanged)

        const normalWebsocketMessage = 'anything you want'
        sub._session.socket.send(normalWebsocketMessage)

        sub._session.collectionViews.forEach((collection) => {
          console.log(collection)
        })
      })
    })
  }
})

Meteor.onMessage(function (msg) {
  console.log(msg)
})
