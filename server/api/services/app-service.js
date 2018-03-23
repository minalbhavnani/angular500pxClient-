
'use strict';
var config = require('../config.js');
var Api500px = require('api_500px');
var request = require('request');
var CryptoJS = require('crypto-js');
var oauthSignature = require('oauth-signature');
var fs = require("fs");
var accToken;
var accSec;

var api = new Api500px(
    {
      key: config.consumerkey,
      secret: config.consumersecret,
      callback: 'http://localhost:4200/oauth_callback'
    });

exports.authenticate = function (stringPassed, callback) {
    console.log(stringPassed);
    api.authRequest(function(err, authToken, authSecret, results)
    {
      if (err) return callback(err);
     
      // redirect client to OAuth page
      //console.log(authToken);
      callback(null,'https://api.500px.com/v1/oauth/authorize?oauth_token='+authToken);
    });
};

exports.accessToken = function (tokenVerifier, callback) {
  console.log("tokenvarifier: "+tokenVerifier);
  api.getAccessToken(tokenVerifier, function(err, accessToken, accessSecret, results)
  {
    if (err) return callback(err);
   
    // access token's been stored within the api instance as well
    if(accessToken!= null) {
      accToken = accessToken;
      accSec = accessSecret;
    }
    console.log("accessToken: "+accToken);
    console.log("accessSecret: "+accessSecret);
    callback(null, {status: 'ready'});
    // console.log("accessToken:"+accessToken);
  });
};

exports.getUsers = function (stringPassed, callback){
  console.log(stringPassed);
  api.getUser(function(err, userData)
  {
    if (err) return callback(err);
   
    // user's info has been stored within the api instance
    // - normalized: api.data.user.id and api.data.user.username
    // - original: api.data.user._details
    // "returned" userData has same format
  //  console.log("userData:"+userData);
    callback(null, userData);
  });
};

exports.deletePhoto = function (photoID, callback){
 console.log("deletePhoto");
  var oauth =
      { consumer_key: config.consumerkey
      , consumer_secret: config.consumersecret
      , token: accToken
      , token_secret: accSec
      }
    , url = 'https://api.500px.com/v1/photos/'+photoID
    , qs ={
        id : photoID
      };
  request.del({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, userData) {
    callback(null, userData);
  });

};

exports.removePhotoTag = function(tags, id, callback){
  var oauth =
      { consumer_key: config.consumerkey
      , consumer_secret: config.consumersecret
      , token: accToken
      , token_secret: accSec
      }
    , url = 'https://api.500px.com/v1/photos/'+id+'/tags'
    , qs ={
        tags : tags
      };
    request.del({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, userData) {
      console.log(userData);
      callback(null, userData);
    });
};

exports.addPhotoTag = function(tags, id, callback){
  var oauth =
    { consumer_key: config.consumerkey
    , consumer_secret: config.consumersecret
    , token: accToken
    , token_secret: accSec
    }
  , url = 'https://api.500px.com/v1/photos/'+id+'/tags'
  , qs ={
      tags : tags
    };
  request.post({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, userData) {
    console.log(userData);
    callback(null, userData);
  });
};


exports.uploadPhoto = function(path, name, des, callback){
  var filepath = "/Users/ankushdeora/Downloads/"+path;
  var readStream = fs.createReadStream(filepath);
  //console.log(readStream);
  // let headers = new Headers();
  // /** No need to include Content-Type in Angular 4 */
  // headers.append('Content-Type', 'multipart/form-data');

  var oauth =
  { consumer_key: config.consumerkey
  , consumer_secret: config.consumersecret
  , token: accToken
  , token_secret: accSec
  }
, url = 'https://api.500px.com/v1/photos/upload'
, qs = {
      name: name,
      description: des,
      tags: "carTag"
  }
, formData = {
    file : readStream
  };

  request.post({url:url, oauth:oauth, qs:qs, formData: formData, json:true}, function (e, r, user) {
    console.log(user)
  });
};



exports.usersPhotos  = function(stringPassed, callback){
  console.log(stringPassed);
  var oauth =
  { consumer_key: config.consumerkey
  , consumer_secret: config.consumersecret
  , token: accToken
  , token_secret: accSec
  }
, url = 'https://api.500px.com/v1/photos'
, qs = {
      feature: 'user',
      user_id: '24439129',
      sort: 'created_at',
      image_size: '6,2',
      tags: 1
  }

  request.get({url: url, oauth: oauth, qs:qs, json:true}, function(e, r, data){
    //console.log(user);
    if (e) return callback(e);

    callback(null, data);
  });
};


exports.photoLikes = function (id, callback){
  console.log("photoLikes. id: "+id);
  var oauth =
  { consumer_key: config.consumerkey
  , consumer_secret: config.consumersecret
  , token: accToken
  , token_secret: accSec
  }
, url = 'https://api.500px.com/v1/photos/'+id+'/votes'
, qs = {
      
  }

  request.get({url: url, oauth: oauth, qs:qs, json:true}, function(e, r, data){
    //console.log(user);
    if (e) return callback(e);

    callback(null, data);
  });
};

exports.searchPhoto = function(searchTerm, pageNum,callback){
  console.log("seatchTerm: "+searchTerm);
  var oauth =
  { consumer_key: config.consumerkey
  , consumer_secret: config.consumersecret
  , token: accToken
  , token_secret: accSec
  }
, url = 'https://api.500px.com/v1/photos/search'
, qs = {
      term : searchTerm,
      page : pageNum 
  }

  request.get({url: url, oauth: oauth, qs:qs, json:true}, function(e, r, data){
    //console.log(user);
    if (e) return callback(e);

    callback(null, data);
  });
};


exports.postComment = function(comment, id, callback){
  var oauth =
  { consumer_key: config.consumerkey
  , consumer_secret: config.consumersecret
  , token: accToken
  , token_secret: accSec
  }
, url = 'https://api.500px.com/v1/photos/'+id+'/comments'
, qs = {
      body : comment
  }

  request.post({url: url, oauth: oauth, qs:qs, json:true}, function(e, r, data){
    //console.log(data);
    if (e) return callback(e);

    callback(null, data);
  });
}




////////
function makeRequest(urlString, methodType){
  let url = urlString;
  let method = methodType;
  let oauth_consumer_key = config.consumerkey;
  let oauth_nonce = getNonce(11);
  let oauth_signature_method = "HMAC-SHA1";
  let oauth_timestamp = Math.floor(Date.now() / 1000).toString();
  let oauth_version = "1.0";
  let parameterString = getSignatureString([
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_token", value: accToken},
      {key: "oauth_version", value: "1.0"}
  ]);


  let shaKey = encodeURIComponent(config.consumersecret) + "&" + encodeURIComponent(accSec); //Consumer Key Secret
  let final_string = method + "&" + encodeURIComponent(url) + "&" + encodeURIComponent(parameterString);
  //console.log("Parameter String:", parameterString);
  console.log("finalString:", final_string);
  console.log("shakey:", shaKey);
  let s = CryptoJS.HmacSHA1(final_string, shaKey);
  let oauth_signature = CryptoJS.enc.Base64.stringify(s);
  //console.log(oauth_signature);
  //let sign = oauthSignature.generate(method, url, parameterString);
  let authHeader = getAuthValue([
      {key: "oauth_consumer_key", value: oauth_consumer_key},
      {key: "oauth_nonce", value: oauth_nonce},
      {key: "oauth_signature", value: oauth_signature},
      {key: "oauth_signature_method", value: "HMAC-SHA1"},
      {key: "oauth_timestamp", value: oauth_timestamp},
      {key: "oauth_token", value: accToken},
      {key: "oauth_version", value: "1.0"}
  ]);

  return authHeader;
}


//
//signature
//
function getSignatureString(arr){
  var result = "";
  let l = arr.length;
  for (let i= 0; i < l; i++) {
      console.log(arr[i].key, arr[i].value);
      result += encodeURIComponent(arr[i].key) + '=' + encodeURIComponent(arr[i].value);
      if (i != l - 1) {
      result += '&';
      }
  }
  //console.log("getSignatureString result: "+result);
  return result;
}

//
//nonce
//
function getNonce(numChars){
  var st = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz";
  var l = st.length;
  var result = "";

  for (var i = 0; i < numChars; i++) {
      var randomIndex = Math.floor(Math.random() * l);
      result = result + st.charAt(randomIndex);
  }
  return result;
}
//
//auth
//
function getAuthValue(arr) {
  var result = "OAuth ";
  let l = arr.length;
  for (let i = 0; i < l; i++) {
      result += encodeURIComponent(arr[i].key) + '=&"' + encodeURIComponent(arr[i].value) + '"';
      if (i != l - 1) {
      result += ', ';
      }
  }
  //console.log("getAuthValue: "+result);
  return result;
}


