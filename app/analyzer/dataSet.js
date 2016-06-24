define(['./championData'], function (ChampionData) {

	/**
	 * DataSet Model
	 */
	var DataSet = function(sample){
		this._sample = sample;
		this._operationsDone = {};
		this.data = {};
		this.nbOfGames = 0;
		this.nbOfChampions = 0;

		// init
		for(let datum of sample){
			this.nbOfGames += datum.games / 10;
		}
		for(let datum of sample){
			// 1st entry for this champion
			if (!this.data.hasOwnProperty(datum.championName)) {
				this.nbOfChampions++;
				this.data[datum.championName] = new ChampionData(
					datum.championName, 
					datum.win, 
					datum.games / this.nbOfGames, 
					datum.banned, 
					datum.games
				);
			} 
			// merge with previous entries
			else {
				var champion = this.data[datum.championName];
				champion.win	= (champion.win * champion.games + datum.win * datum.games) / (champion.games + datum.games);
				champion.ban	= (champion.ban * champion.games + datum.banned * datum.games) / (champion.games + datum.games);
				champion.games	= champion.games + datum.games; 
				champion.play   = champion.games / this.nbOfGames;
				champion.update();
			}
		}

		// sum(a)
		this.sum = function(prop){
			if (this._operationsDone.hasOwnProperty("sum-"+prop)) return this._operationsDone["sum-"+prop];
			var sum = 0;
			for(let champion in this.data){
				sum += this.data[champion][prop];
			}
			this._operationsDone["sum-"+prop] = sum;
			return sum;
		}
		// sum(a*b)
		this.mSum = function(prop1, prop2){
			if (this._operationsDone.hasOwnProperty("mSum-"+prop1+"-"+prop2)) return this._operationsDone["mSum-"+prop1+"-"+prop2];
			var sum = 0;
			for(let champion in this.data){
				sum += this.data[champion][prop1]*this.data[champion][prop2];
			}
			this._operationsDone["mSum-"+prop1+"-"+prop2] = sum;
			return sum;
		}
		// max(a)
		this.max = function(prop){
			if (this._operationsDone.hasOwnProperty("max-"+prop)) return this._operationsDone["max-"+prop];

			var max = "firstvalue";
			for(let champion in this.data){
				if (max == "firstvalue") max = this.data[champion][prop];
				if (this.data[champion][prop] > max) max = this.data[champion][prop];
			}
			this._operationsDone["max-"+prop] = max;
			return max;
		}
		// min(a)
		this.min = function(prop){
			if (this._operationsDone.hasOwnProperty("min-"+prop)) return this._operationsDone["min-"+prop];

			var min = "firstvalue";
			for(let champion in this.data){
				if (min == "firstvalue") min = this.data[champion][prop];
				if (this.data[champion][prop] < min) min = this.data[champion][prop];
			}
			this._operationsDone["min-"+prop] = min;
			return min;
		}
		// sum(a)/N
		this.average = function(prop){
			if (this._operationsDone.hasOwnProperty("average-"+prop)) return this._operationsDone["average-"+prop];
			var average = this.sum(prop) / this.nbOfChampions;
			this._operationsDone["average-"+prop] = average;
			return average;
		}
		// sum(a*b)/sum(b)
		this.wAverage = function(value,weight){
			if (this._operationsDone.hasOwnProperty("wAverage-"+value+"-"+weight)) return this._operationsDone["wAverage-"+value+"-"+weight];
			var wAverage = this.mSum(value,weight) / this.sum(weight)
			this._operationsDone["wAverage-"+value+"-"+weight] = wAverage;
			return wAverage;
		}
		this.getSortedArray = function(prop){
			var championsData = this.data;
			var championsList = Object.keys(championsData);
			championsList.sort(function(a,b){
				if (championsData[a][prop] > championsData[b][prop]) return 1;
				if (championsData[a][prop] < championsData[b][prop]) return -1;
				return 0;
			});
			return championsList;
		}
		// return an array of 11 int for each value of the corresponding decile 
		this.deciles = function(prop){
			var sortedChampions = this.getSortedArray(prop);
			var deciles = [];
			for (let i=0; i<10; i++){
			var index = Math.floor(i / 10 * sortedChampions.length);
			deciles.push( this.data[sortedChampions[index]][prop] );
			}
			// last value:
			deciles.push(this.data[sortedChampions[sortedChampions.length - 1]][prop]);

			return deciles;
		}
	}
	return DataSet;
});