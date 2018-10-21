'use strict';

console.log('camera script');

/* globals MediaRecorder */

// This code is adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
/*
$(function(){
    $.get('popup.html', function(result){
        var link = $(result).find('spurl').value;
    });
});

console.log(link);
*/
var link = this.safeLink;
console.log(link);
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
async function detect() {
    const faces = await faceDetector.detect(canvas);
    drawFaces(faces);
  }

  var fc = 0;
  var hasChanged = false;
  var vid = 0;
  async function drawFaces(faces) {
    //check if there was a change in the number of faces and draw faces
    var compare = fc;
    fc = faces.length;
    if(compare != fc)
      hasChanged = true;
    else
        hasChanged = false;
    if(hasChanged){
      if(faces.length>1){
        chrome.windows.update(vid, {focused: true}, function() {
            if (chrome.runtime.lastError) {
                chrome.windows.create(
                    {'url': 'http://google.com', 'type': 'panel', 'focused': true},
                    function(chromeWindow) {
                        vid = chromeWindow.id;
                    });
            }
        });
        intcount=5;
        }

    }
    else{
      if(faces.length == 1){
          intcount--;
          console.log("count decreased!");
      }
      if(intcount<=0){
        console.log("should close now!!!");
          chrome.windows.remove(vid, function() {
          if (chrome.runtime.lastError) {
          }

      });
      }
    }

    console.log(hasChanged);
    //
    faces.forEach(face => {
      const { width, height, top, left } = face.boundingBox;
      context.strokeStyle = '#00F';
      context.lineWidth = 5;
      context.strokeRect(left, top, width, height);

      face.landmarks.forEach(landmark => {
        console.log("found landmark!!!")
        context.lineWidth = 5;
        if (landmark.type === 'eye') {
          context.strokeStyle = '#00F';
          context.strokeRect(landmark.location.x - 20, landmark.location.y - 20, 40, 20);
        } else {
          context.strokeStyle = '#00F';
          context.strokeRect(landmark.location.x - 40, landmark.location.y - 40, 80, 40);
        }
      });
    });
  }
  setInterval(() => {
    context.drawImage(gumVideo, 0, 0, canvas.width, canvas.height);
    detect();
  }, 100);




