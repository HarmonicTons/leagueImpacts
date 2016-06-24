define(function () {
	/**
	 * Champion Model
	 */
	var ChampionData = function(name, win, play, ban, games){
		this.name 	      = name;
		this.win 	      = win;
		this.play         = play;
		this.ban 	      = ban;
		this.games        = games;

		this.update = function(){
			this.availability  = 1 - this.ban;
			this.pick          = this.play / this.availability;
			this.log2pick      = Math.log2(this.pick*100);
			this.pickOrBan     = this.play + this.ban;
			this.absenteeism   = 1 - this.pickOrBan;
			this.visibleImpact = 9 * (1 - ( 1 - 1 / 5 * this.win * this.play ) / ( 1 - this.play / 10 ));
			this.trueImpact    = 10 * (1 - ( 1 - 1 / 5.5 * this.win * this.pick) / ( 1 - this.pick / 11 ));
		}

		this.update();
	}
	return ChampionData;
});