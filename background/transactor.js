function transact(url) {
	return new Promise(function(resolve) {
		$.get({
			url: url,
			headers: {
				'Authorization': 'token ' + token
			},
			success: function (data) {
				resolve(data);
			}
		});
	});
}