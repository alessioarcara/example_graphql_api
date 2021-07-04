const Event = require('../../models/event')
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');

const events = async eventsIds => {
    try {
        const createdEvents = await Event.find({_id: {$in: eventsIds}})
        return createdEvents.map(transformEvent);
    } catch (err) {throw err}
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event)
    } catch (err) {throw err}
}

const user = async userId => {
    try {
        const users = await User.findById(userId)
        return {
            ...users._doc,
            createdEvents: events.bind(this, users._doc.createdEvents)
        }
    } catch (err) {throw err}
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
