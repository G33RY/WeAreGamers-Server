const EventEmitter = require('events')
const ee = new EventEmitter()
module.exports = {
    on: function (on, func){
        ee.on(on, func)
    },
    emit: function (emit, ToEmit){
        ee.emit(emit, ToEmit)
    }
}