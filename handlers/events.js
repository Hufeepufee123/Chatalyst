const { fetchFiles } = require('../util/Helper');

module.exports = async (client) => {
    const events = fetchFiles('./events/', '.js');

    events.forEach((_events, _) => {
        const event = require(`../events/${_events}`);
        
        client.on(event.name, event.run.bind(null, client));
        client.Events.set(event.name, event);
    })
};