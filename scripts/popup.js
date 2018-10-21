'use strict';
document.addEventListener('DOMContentLoaded', function () {
	var checkPageButton = document.getElementById('checkPage');
	var getSafeLink = document.getElementById('spurl').value;
	checkPageButton.addEventListener('click', function() {
	chrome.runtime.getBackgroundPage(function (backgroundPage) {
	  // close popup window
		backgroundPage.startRecord(getSafeLink);
		window.close();
	});
	},false);
},false);
