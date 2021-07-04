const Event = require('../../models/event');
const User = require('../../models/user')
const { transformEvent } = require('./merge')

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(transformEvent);
        } catch (err) { throw  new Error(err)}
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        try {
            const { title, description, price, date } = args.eventInput;
            const event = new Event({title, description, price: +price, date: new Date(date), creator: req.userId});
            const savedEvent = await event.save();
            const existingUser = await User.findById(req.userId);
            await existingUser.createdEvents.push(savedEvent);
            await existingUser.save();
            return transformEvent(savedEvent);
        } catch (err) { throw new Error("Event not created"); }
    },
}
