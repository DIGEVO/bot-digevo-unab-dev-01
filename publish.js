var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../bot-digevo-unab-dev-01.zip');
var kuduApi = 'https://bot-digevo-unab-dev-01.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$bot-digevo-unab-dev-01';
var password = 'zoj4gyf5hvqpaSQ6whZjafPf0Bioc9xhKlhk5lgHNG4sbf7urQNxJr2lTFyG';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('bot-digevo-unab-dev-01 publish');
  } else {
    console.error('failed to publish bot-digevo-unab-dev-01', err);
  }
});