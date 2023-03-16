const { fetchFiles } = require('../util/Helper');

module.exports = async (client) => {
    const buttons = fetchFiles('./buttons/', '.js');

    buttons.forEach((_buttons, _) => {
        const button = require(`../buttons/${_buttons}`);
        
        client.on(button.name, button.run.bind(null, client));
        client.Buttons.set(button.name, button);
    })
};