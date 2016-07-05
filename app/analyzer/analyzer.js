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
		},

		balanceIndex: function(ds){
			var sum = 0;
			var n = 0;
			for (let championName in ds){
				n++;
				let ti = ds[championName].trueImpact;
				if (ti > 0) 
					sum += ti*ti;
			}
			sum = sum / n;
			var balanceIndex = (5.5 + Math.log10(sum)) * 10;

			return balanceIndex;
		},

		delta: function(ds1, ds2){
			var sum = 0;
			var n = 0;
			var max = {championName:"",delta:0};
			for (let championName in ds1){
				if (!ds2.hasOwnProperty(championName)) continue;
				n++;
				let championDelta = 0;
				championDelta += Math.pow(Math.abs(ds1[championName].pick - ds2[championName].pick),2);
				championDelta += Math.pow(Math.abs(ds1[championName].win - ds2[championName].win),2);
				championDelta += Math.pow(Math.abs(ds1[championName].ban - ds2[championName].ban),2);
				sum += championDelta / 3;

				if (championDelta / 3 > max.delta) {
					max.delta = championDelta;
					max.championName = championName;
				}
			}
			sum = sum / n;
			var delta = (5 + Math.log10(sum)) * 10;

			console.log(max.championName, ds1[max.championName].pick, ds2[max.championName].pick, 
				ds1[max.championName].win, ds2[max.championName].win, ds1[max.championName].ban, ds2[max.championName].ban)

			return delta;
		},

		delta2: function(ds1, ds2, top){
			var championsDeltas = [];
			var n=0;
			for (let championName in ds1){
				if (!ds2.hasOwnProperty(championName)) continue;

				n++;
				let championDelta = Math.pow(ds1[championName].trueImpact - ds2[championName].trueImpact,2);
				championsDeltas.push(championDelta);
			}
			championsDeltas.sort(function(a,b) {return b-a;});

			var delta = 0;
			var topn = Math.floor(n * top / 100);
			for (let i=0; i < topn; i++){
				delta += championsDeltas[i];
			}
			delta = delta / topn;
			delta = Math.log(delta);

			return delta;
		}
	}

	return analyzer;
});