define(function () {
	/**
	 * get data from db
	 */
	function getData(query, callback){
		query = query ? $.param(query) : "";
		$.ajax({
			// just put 'ajax' if on the web
		  	url: "http://loldata-spateoffire.rhcloud.com/ajax?" + query,
		  	context: document.body
		}).done(function(jsonStr) {
		  	var data = JSON.parse(jsonStr)
		  	callback(data);
		});
	}

	return getData;
});