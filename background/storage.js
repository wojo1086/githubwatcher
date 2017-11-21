function getStorage(data) {
	return new Promise(function(resolve) {
		chrome.storage.sync.get(data, function (result) {
			resolve(result);
		});
	});
}