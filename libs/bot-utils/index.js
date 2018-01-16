'use strict';

const restify = require('restify');
const builder = require("botbuilder");
const locationDialog = require('botbuilder-location');
const path = require('path');
const botbuilder_azure = require("botbuilder-azure");

// const middleware = require('../middleware');
// const dialogs = require('../dialogs');
// const utils = require('../middleware-utils');

const buildConnector = () => new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

const tableName = 'botdata';
const azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
const tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

const buildBot = connector => {
    let bot = new builder.UniversalBot(connector);
    bot.set('storage', tableStorage);
    middleware.initMiddleware(bot);
    // middleware.addIncomingMessageHandler(utils.saveIncomingMessageIntoCache);
    // middleware.addIncomingMessageHandler(utils.saveIncomingMessageIntoIntercom);
    // middleware.addIncomingMessageHandler(utils.saveIncomingMessageIntoMongoDB);

    // middleware.addOutgoingMessageHandler(utils.saveOutgoingMessageIntoIntercom);
    // middleware.addOutgoingMessageHandler(utils.saveOutgoingMessageIntoDashbot);
    // middleware.addOutgoingMessageHandler(utils.saveOutgoingMessageIntoMongoDB);
    bot.localePath(path.join(__dirname, './locale'));
    bot.library(locationDialog.createLibrary(process.env.BING_MAPS_API_KEY));
    dialogs.setDialogs(bot);
    return bot;
}

const startLocalServer = connector => {
    var server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, function () {
        console.log('%s listening to %s', server.name, server.url);
    });
    server.post('/api/messages', connector.listen());
}

module.exports = {
    buildConnector: buildConnector,
    buildBot: buildBot,
    startLocalServer: startLocalServer
};

