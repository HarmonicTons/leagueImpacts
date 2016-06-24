define(['./championIcon', './ellipsePlot'], function (ChampionIcon, EllipsePlot) {

	/**
	 * Plot Area
	 */
	var PlotArea = function(graph, elementId){
		this.graph = graph;
		this.isDragged = false;
		this.startPosition = {x: 0, y: 0};
		this.element = document.getElementById(elementId);

		this.championsIcons = [];
		this.iconHovered = [];

		this.plots = [];

		this.addIcon = function(championName, x, y){
			var icon = new ChampionIcon(this, championName);
			this.championsIcons.push(icon);
			icon.moveTo(x, y);
		}

		this.indicateHovered = function(icon, add){
			var i = this.iconHovered.indexOf(icon);
			if (add && i < 0) 
				this.iconHovered.push(icon);
			if (!add && i >= 0)
				this.iconHovered.splice(i, 1);
		}

		this.moveIcon = function(championName, x, y){
			var icon = this.championsIcons.find(function(icon){
				return icon.championName === championName;
			});
			icon.moveTo(x, y);
		}

		this.addEllipsePlot = function(center, min, max){
			var ellipsePlot = new EllipsePlot(this, center, min, max);
			this.plots.push(ellipsePlot);
		}
	}
	return PlotArea;
});