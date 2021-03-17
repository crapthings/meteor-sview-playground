const serverOnlyCollection = new Mongo.Collection('memorydb', { connection: null })

const serverOnlyReactDict = new ReactiveDict({
  hello: 'kitty'
})

console.log(serverOnlyReactDict.get('hello'))

Meteor.publish('test', function () {
  const comp = Tracker.autorun(() => {
    const dep = serverOnlyReactDict.get('hello')

    console.log('do something')
  })

  this.onStop(() => {
    comp.stop()
  })
})

Meteor.methods({
  test () {
    Meteor.default_server.sessions.forEach((session) => {
      session._namedSubs.forEach((sub) => {
        console.log(sub._handler())
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
  // console.log(msg)
  if (msg === 'send back to server') {
    // change reactive source
    serverOnlyReactDict.set('hello', 'world')
  }
  // console.log(serverOnlyCollection.find().fetch())
})
