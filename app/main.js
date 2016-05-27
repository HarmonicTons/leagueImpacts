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

		var sortedChamps = analyzer.sortChampionsDataBy("trueImpact");


		for (var championName of sortedChamps){
			renderer.drawPopularityBar(ctnr,analyzer.championsData[championName]);
			var vis = analyzer.championsData[championName].win * analyzer.championsData[championName].played;
			var tru = analyzer.championsData[championName].trueImpact * 100;
			var d = vis / tru;
			console.log(championName + ": " + vis.toPrecision(2) +  "% , " + tru.toPrecision(2) + "%");
		}

		//console.table(analyzer.championsData);
		// console.log(analyzer.sum("picked").toPrecision(3));
		// console.log(analyzer.sum("banned").toPrecision(3));
		// console.log(analyzer.wAverage("win","picked").toPrecision(3));
		// console.log("-");
		// console.log(analyzer.sum("calculatedPicked").toPrecision(3));
		// console.log(analyzer.wAverage("win","calculatedPicked").toPrecision(3));
		// console.log("-");
		// console.log(analyzer.average("visibleImpact").toPrecision(3));
		// console.log(analyzer.championsData["Swain"].visibleImpact);
		// console.log("-");
		// console.log(analyzer.average("trueImpact").toPrecision(3));
		// console.log(analyzer.championsData["Swain"].trueImpact);
    }

});