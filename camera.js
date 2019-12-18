'use strict';

console.log('camera script');

/* globals MediaRecorder */

// This code is adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos

// This code is adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
//load in html options from page
var youarell = document.getElementById("link");
var toggle = document.getElementById("toggle");
var erval = document.getElementById("time");
var userNum = document.getElementById("users");
var exactUser = document.getElementById("exact");
var sensitivity = document.getElementById("sens");

var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var mediaRecorder;
var sourceBuffer;
var intervalTimer;
var startTime;
var finishTime;
var intcount = 0;
var v = false;

var gumVideo = document.querySelector('video#gum');
var canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const faceDetector = new FaceDetector();

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
  audio: false,
  video: true
};

navigator.getUserMedia(constraints, successCallback, errorCallback );

function successCallback(stream) {
  console.log('getUserMedia() got stream: ', stream);
    gumVideo.srcObject  = stream;
  /*
  if (window.URL) {
    gumVideo.src = window.URL.createObjectURL(stream);
  } else {
    gumVideo.src = stream;
  }
  */
}


function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}
function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}
//google face Detector call
async function detect() {
    const faces = await faceDetector.detect(canvas);
    drawFaces(faces);
  }
  //initialize facecount, whether there's been a change in number of faces and chrome canvas id
  var fc = 0;
  var hasChanged = false;
  var vid = 0;
  var minface=true;
  // all detection logic in this app !!! TODO: BREAK UP THIS FUNCTION
  async function drawFaces(faces) {
    //first check if there's any faces at all. If none detected, we will ignore the minimum face size requirement
    if(faces.length>0){
      minface=false;
    }
    //alright so now we're iterating through each face and drawing it on our canvas
    faces.forEach(face => {
      const { width, height, top, left } = face.boundingBox;
      context.strokeStyle = '#00F';
      context.lineWidth = 5;
      context.strokeRect(left, top, width, height);
      //we only need one face to be bigger than the set threshold (default 80)
      if(width>sensitivity.value){
        minface=true;
      }
    });
    //check if there was a change in the number of faces
    //if there was a change then there's a good chance we will need to block the screen
    var compare = fc;
    fc = faces.length;
    if(compare != fc || minface==false)
      hasChanged = true;
    else
      hasChanged = false;

    if(hasChanged){
      //so if the exact checking is enabled, we have stricter checking
      if(exactUser.checked){
        //length of the array needs to be exactly the length specified
        if(faces.length!=userNum.value || minface==false){
        //here is where we actually create the new window. First we try to update it, and if we meet
        //an error trying to update a non-existing page then we create a new webpage
        //makeWindow(vid,youarell);
		chrome.windows.update(vid, {focused: true}, function() {
              if (chrome.runtime.lastError) {
                  chrome.windows.create(
                      {'url': youarell.value, 'type': 'panel', 'focused': true},
                      function(chromeWindow) {
                          vid = chromeWindow.id;
                      });
              }
          });
        //since something has likely changed we need to wait before we can try to remove anything or face glitchiness
        //So we set a specified value (default 10 iters) that will act as a timer to any changes not updating the page
        intcount=erval.value;
        }
      }
      //here checking is more lenient
      else{
        //same exact thing as the stricter  update
        //!!!TODO: make this window creation into a function that is called by these conditions for readability
        if(faces.length>userNum.value || minface == false){
          //makeWindow(vid,youarell);
		  chrome.windows.update(vid, {focused: true}, function() {
              if (chrome.runtime.lastError) {
                  chrome.windows.create(
                      {'url': youarell.value, 'type': 'panel', 'focused': true},
                      function(chromeWindow) {
                          vid = chromeWindow.id;
                      });
              }
          });
          intcount=erval.value;
          }
        }
    }
    else{
      if(faces.length == userNum.value && minface == true){
          if(intcount>0){
            intcount--;
            console.log("count decreased!");
          }
          
      }
      if(intcount<=0){
          chrome.windows.remove(vid, function() {
          if (chrome.runtime.lastError) {
          }

      });
      }
    }
    //draw face boxes

  }
  //deprecated
  function makeWindow(vid,youarell){
    chrome.windows.update(vid, {focused: true}, function() {
              if (chrome.runtime.lastError) {
                  chrome.windows.create(
                      {'url': youarell.value, 'type': 'panel', 'focused': true},
                      function(chromeWindow) {
                          vid = chromeWindow.id;
                      });
              }
          });
  }
  setInterval(() => {
    if(toggle.checked){ 
      context.drawImage(gumVideo, 0, 0, canvas.width, canvas.height);
      detect();
    }
  }, 100);




