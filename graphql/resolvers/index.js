const bcrypt = require('bcryptjs')
const Event = require('../../models/event');
const User = require('../../models/user');

const user = async userId  => { 
    try {
    const user = await User.findById(userId)
     return { 
            ...user._doc, 
            _id: user.id, 
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    }
    catch(err) {
        throw err
    }
}

 const events = async eventsIds => {
    try{
        const events = await Event.find({_id: {$in: eventsIds} })
        events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        }); 
     return events
    } 
    catch(err) {
        throw err;
    }
}

 module.exports =  {
    events: async () => {
        try {
        const events = Event.find()
              return events.map(event => {
                  return {
                      ...event._doc, 
                      _id: event.id,
                      date: new Date(event._doc.date).toISOString(),
                      creator: user.bind(this, event._doc.creator)
                  };
              })
          }
        catch(err) {
            throw err
        } 
      },
      createEvent: async args => {
         const event = new Event ({
           title: args.eventInput.title,
           description: args.eventInput.description,
           price: +args.eventInput.price,
           date: new Date(args.eventInput.date),
           creator: '5d6c0df623d9c82544ac4f89'
          });
          let createdEvent;
          try {
          const result = await event.save();
              createdEvent = { 
                  ...result._doc, 
                  _id: result._doc._id.toString(),
                  date: new Date(event._doc.date).toISOString(),
                  creator: user.bind(this, result._doc.creator )
                };
                const userCreator = await User.findById('5d6c0df623d9c82544ac4f89');
              
                if(!userCreator) {
                  throw new Error('User not found.')
              }
              userCreator.createdEvents.push(event)
              await userCreator.save();
                   
              return createdEvent;
         }catch(err) {
            console.log(err) 
            throw err
         }
      },
      createUser: async args => {
       try{
        const existingUser = await User.findOne({ email:args.userInput.email })
           if(existingUser) {
              throw new Error('User exists already.')
           }
           const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
         
              const user = new User({
                  email: args.userInput.email,
                  password: hashedPassword
                })
                  const result = await user.save();
         
              return{...result._doc, password: null, _id: result.id };
            }catch(err) {
                throw err;
            }
      }
};
 
