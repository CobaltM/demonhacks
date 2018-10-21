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
  window.stream = stream;
  if (window.URL) {
    gumVideo.src = window.URL.createObjectURL(stream);
  } else {
    gumVideo.src = stream;
  }
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
  var minface;

  async function drawFaces(faces) {
    minface = false;
    faces.forEach(face => {
      const { width, height, top, left } = face.boundingBox;
      context.strokeStyle = '#00F';
      context.lineWidth = 5;
      context.strokeRect(left, top, width, height);
      if(width>sensitivity.value){
        minface=true;
      }
    });
    //check if there was a change in the number of faces
    var compare = fc;
    fc = faces.length;
    if(compare != fc || minface==false)
      hasChanged = true;
    else
        hasChanged = false;
    
    //if there was a change and the number of faces is greater than our threshold (default 1), 
    if(hasChanged){
      if(exactUser.checked){
        if(faces.length!=userNum.value || minface==false){
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
      else{
        if(faces.length>userNum.value || minface==false){
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
  setInterval(() => {
    if(toggle.checked){ 
      context.drawImage(gumVideo, 0, 0, canvas.width, canvas.height);
      detect();
    }
  }, 100);




