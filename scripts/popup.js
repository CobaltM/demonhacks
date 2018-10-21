'use strict';
window.onload = function () {
	chrome.runtime.getBackgroundPage(function (backgroundPage) {
	  // close popup window
		backgroundPage.startRecord();
		window.close();
	});
};
/* USE THIS INSTEAD FOR A POPUP PAGE WITH START BUTTON
'use strict';
document.addEventListener('DOMContentLoaded', function () {
	var checkPageButton = document.getElementById('checkPage');
	checkPageButton.addEventListener('click', function() {
	chrome.runtime.getBackgroundPage(function (backgroundPage) {
	  // close popup window
		backgroundPage.startRecord(getSafeLink);
		window.close();
	});
	},false);
},false);
*/