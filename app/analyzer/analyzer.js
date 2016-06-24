define(['./dataSet'], function (DataSet) {

	/**
	 * Data Analyzer
	 */
	var analyzer = {

		dataSets: [],

		newDataSet: function(sample){
			var dataSet = new DataSet(sample);
			this.dataSets.push(dataSet);

			console.log("A new dataset has been loaded:")
			console.log("Champions: "  + dataSet.nbOfChampions);
			console.log("Games: "  + dataSet.nbOfGames);

			return dataSet;
		},

		compare: function(ds1, ds2){
			return ds1.average("trueImpact") - ds2.average("trueImpact");
		}
	}

	return analyzer;
});