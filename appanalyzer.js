define(function () {
	/**
	 * Champion Model
	 */
	var championModel = {
		name: "",
		win: 0,
		picked: 0,
		banned: 0,
		games: 0
	}
	Object.defineProperty(championModel, "played", { get : function(){
		return this.picked / (1-this.banned);
	}});
	Object.defineProperty(championModel, "impact", { get : function(){
		return 0.5 - (5.5 - this.win*this.played)/(11 - this.played);
	}});

	/**
	 * Data Analyzer
	 */
	var analyzer = {
		_sample : [],
		championsData : {},
		setDataSample: function(sample){
			this._sample = sample;
			this.setChampionsData();
		},
		setChampionsData: function(){
			this.championsData = {};
			for(let datum of this._sample){
				// 1st entry for this champion
				if (!this.championsData.hasOwnProperty(datum.championName)) {
					var champion = Object.create(championModel)
					champion.name 	= datum.championName;
					champion.win 	= datum.win;
					champion.picked = datum.picked;
					champion.banned = datum.banned;
					champion.games 	= datum.games;
					this.championsData[datum.championName] = champion;
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
		sum: function(prop){
			var sum = 0;
			for(let champion in this.championsData){
				sum += this.championsData[champion][prop];
			}
			return sum;
		},
		max: function(prop){
			var max = "firstvalue";
			for(let champion in this.championsData){
				if (max == "firstvalue") max = this.championsData[champion][prop];
				if (this.championsData[champion][prop] > max) max = this.championsData[champion][prop];
			}
			return max;
		},
		min: function(prop){
			var min = "firstvalue";
			for(let champion in this.championsData){
				if (min == "firstvalue") min = this.championsData[champion][prop];
				if (this.championsData[champion][prop] < min) min = this.championsData[champion][prop];
			}
			return min;
		},
		average: function(prop){
			return this.sum(prop) / this.nbOfChampions();
		},
		wAverage: function(value,weight){
			var totalwValues = 0;
			var totalWeights = 0;
			for(let champion in this.championsData){
				totalwValues += this.championsData[champion][value] * this.championsData[champion][weight];
				totalWeights += this.championsData[champion][weight];
			}
			return totalwValues / totalWeights;
		}
	}

	return analyzer;
});
