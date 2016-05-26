define(function (require) {

	var $        = require('../jquery-2.2.4.min');
	var getData  = require('./getData');
    var analyzer = require('./analyzer');
    var renderer = require('./renderer');

    var query = {};
    getData(query,start);

    function start(data){

    	analyzer.setDataSample(data);
		var ctnr = document.getElementById("test");
		renderer.drawPopularityBar(ctnr,analyzer.championsData["Aatrox"]);

		console.log(analyzer.championsData["Swain"].trueImpact);
    }

});