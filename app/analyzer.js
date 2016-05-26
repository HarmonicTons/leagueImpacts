define(function () {
	/**
	 * Champion Model
	 */
	var ChampionModel = function(name, win, picked, banned, games){
		this.analyzer 		= analyzer;
		this.name 			= name;
		this.win 			= win;
		this.picked 		= picked;
		this.banned 		= banned;
		this.games 			= games;
		this.popularity 	= picked + banned;
		this.availability 	= 1 - banned;
		this.played 		= picked / this.availability;
		this.absenteeism 	= 1 - this.popularity;
		this.visibleImpact 	= 0.5 - (5 - win*picked)/(10 - picked);
	}
	function newChampionModel(analyzer, name, win, picked, banned, games){
		var champion = new ChampionModel(name, win, picked, banned, games);
		Object.defineProperty(champion, "trueImpact", {get : function(){ 
			return analyzer.wAverage("win","played") - (analyzer.mSum("win","played") - this.win*this.played)/(analyzer.sum("played") - this.played);
		}});
		return champion;
	}

	/**
	 * Data Analyzer
	 */
	var analyzer = {
		_sample : [],
		_operationsDone : {},
		championsData : {},
		setDataSample: function(sample){
			this._sample = sample;
			// reset operations results
			this._operationsDone = {}; 
			this.setChampionsData();
		},
		setChampionsData: function(){
			this.championsData = {};
			for(let datum of this._sample){
				// 1st entry for this champion
				if (!this.championsData.hasOwnProperty(datum.championName)) {
					this.championsData[datum.championName] = newChampionModel(
						this,
						datum.championName, 
						datum.win, 
						datum.picked, 
						datum.banned, 
						datum.games
					);
				} else {
					var champion = this.championsData[datum.championName];
					function wAverage(prop) {
						return (champion[prop] * champion.games + datum[prop] * datum.games) / (champion.games + datum.games);
					}
					champion.win	= wAverage("win");
					champion.picked	= wAverage("picked");
					champion.banned	= wAverage("banned");
					champion.games	= champion.games + datum.games; 
				}
			}
			console.log("Champions'data updated.")
		},
		nbOfChampions: function(){
			return this.championsData.keys.length;
		},
		// sum(a)
		sum: function(prop){
			if (this._operationsDone.hasOwnProperty("sum-"+prop)) return this._operationsDone["sum-"+prop];
			var sum = 0;
			for(let champion in this.championsData){
				sum += this.championsData[champion][prop];
			}
			this._operationsDone["sum-"+prop] = sum;
			return sum;
		},
		// sum(a*b)
		mSum: function(prop1, prop2){
			if (this._operationsDone.hasOwnProperty("mSum-"+prop1+"-"+prop2)) return this._operationsDone["mSum-"+prop1+"-"+prop2];
			var sum = 0;
			for(let champion in this.championsData){
				sum += this.championsData[champion][prop1]*this.championsData[champion][prop2];
			}
			this._operationsDone["mSum-"+prop1+"-"+prop2] = sum;
			return sum;
		},
		// max(a)
		max: function(prop){
			if (this._operationsDone.hasOwnProperty("max-"+prop)) return this._operationsDone["max-"+prop];

			var max = "firstvalue";
			for(let champion in this.championsData){
				if (max == "firstvalue") max = this.championsData[champion][prop];
				if (this.championsData[champion][prop] > max) max = this.championsData[champion][prop];
			}
			this._operationsDone["max-"+prop] = max;
			return max;
		},
		// min(a)
		min: function(prop){
			if (this._operationsDone.hasOwnProperty("min-"+prop)) return this._operationsDone["min-"+prop];

			var min = "firstvalue";
			for(let champion in this.championsData){
				if (min == "firstvalue") min = this.championsData[champion][prop];
				if (this.championsData[champion][prop] < min) min = this.championsData[champion][prop];
			}
			this._operationsDone["min-"+prop] = min;
			return min;
		},
		// sum(a)/N
		average: function(prop){
			if (this._operationsDone.hasOwnProperty("average-"+prop)) return this._operationsDone["average-"+prop];
			var average = this.sum(prop) / this.nbOfChampions();
			this._operationsDone["average-"+prop] = average;
			return average;
		},
		// sum(a*b)/sum(b)
		wAverage: function(value,weight){
			if (this._operationsDone.hasOwnProperty("wAverage-"+value+"-"+weight)) return this._operationsDone["wAverage-"+value+"-"+weight];
			var wAverage = this.mSum(value,weight) / this.sum(weight)
			this._operationsDone["wAverage-"+value+"-"+weight] = wAverage;
			return wAverage;
		}
	}

	return analyzer;
});