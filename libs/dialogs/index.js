'use strict';

const setDialogs = (bot) => {
    // bot.dialog('/', getDefaultIntent());
    // bot.dialog('/preguntarLugar', [askLocation, processLocation]);
    bot.dialog('/', session => {
        session.send(`hola ${session.message.user.name}, me dijiste: ${session.message.text}`);
    });
}

module.exports = {
    setDialogs: setDialogs
};
