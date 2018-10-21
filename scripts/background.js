"use strict";
function startRecord(youarerell) {
    safeLink: youarerell,
    chrome.windows.getCurrent({}, function(e) {
        chrome.windows.create({
            url: "camera.html",
            type: "popup",
            focused: false
        }, function(e) {
            this.cameraWindowId = e.id, chrome.windows.onRemoved.addListener(function(e) {
                e == cameraWindowId && console.log("window closed")
            })
        })
    })
}