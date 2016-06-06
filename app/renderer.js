define(['jquery'], function ($) {

	/**
	 * Axes
	 */
	var AxeModel = function(graph, type){
		this.graph = graph;
		this.element = document.createElement("div");
		this.element.className = "graph-axe graph-axe-" + type;
		this.min = 0;
		this.max = 1;
		this.dataType = "";

		var self = this;
		this.element.onmousemove = function(e){
			if (type === "horizontal") {
				var x = e.offsetX;
				var y = Number.MAX_SAFE_INTEGER;
			}
			if (type === "vertical") {
				var x = 0;
				var y = e.offsetY;
			}
			self.graph.updateCursor(x, y);
		};	

		this.getWidth = function(){
			return this.element.offsetWidth;
		}
		this.getHeight = function(){
			return this.element.offsetHeight;
		}
		this.getCoordinate = function(value){
			if (type === "horizontal")
				return this.getWidth() * (value - this.min) / (this.max - this.min);
			if (type === "vertical")
				return this.getHeight() * (value - this.max) / (this.min - this.max);
		}
		this.getValue = function(position){
			if (type === "horizontal"){
				if (position < 0) return this.min;
				if (position > this.getWidth()) return this.max;
				return position / this.getWidth() * (this.max - this.min) + this.min;
			}
			if (type === "vertical"){
				if (position < 0) return this.max;
				if (position > this.getHeight()) return this.min;
				return position / this.getHeight() * (this.min - this.max) + this.max;
			}
		}

		this.graph.element.appendChild(this.element);
	}

	/**
	 * Champion Icons
	 */
	var ChampionIconModel = function(plotarea, championName){
		this.plotarea = plotarea;
		this.championName = championName;
		this.imgName = this.championName.split("'").join("").split(" ").join("").split(".").join("") + ".png";
		this.isSelected = false;
		// ICON CONTAINER
		this.element = document.createElement("div");
		this.element.className = "graph-icon-container";
		// ICON IMAGE
		this.iconImage = document.createElement("div");
		this.iconImage.className = "graph-icon-image";
		this.iconImage.style.backgroundImage = 'url("./icons/'+this.imgName+'")';
		this.iconImage.onclick = function(){
			if (self.isSelected) {
				self.isSelected = false;
				self.iconImage.className = "graph-icon-image";
			}
		}
		this.element.appendChild(this.iconImage);
		// ICON SELECTOR
		this.iconSelector = document.createElement("div");
		this.iconSelector.className = "graph-icon-selector";
		var self = this;
		this.iconSelector.onmouseover = function(){
			if (!self.isSelected)
				self.iconImage.className = "graph-icon-image big";
		}
		this.iconSelector.onmouseout = function(){
			if (!self.isSelected)
				self.iconImage.className = "graph-icon-image";
		}
		this.iconSelector.onclick = function(){
			if (self.isSelected) {
				self.isSelected = false;
				self.iconImage.className = "graph-icon-image big";
			} else {
				self.isSelected = true;
				self.iconImage.className = "graph-icon-image big selected";
			}
		}
		this.element.appendChild(this.iconSelector);

		this.moveTo = function(x, y){
			this.element.style.left = x + "px";
			this.element.style.top  = y + "px";
		}
		
		this.plotarea.element.appendChild(this.element);
	}

	/**
	 * Plot Area
	 */
	var PlotAreaModel = function(graph){
		this.graph = graph;
		this.element = document.createElement("div");
		this.element.className = "graph-plot-area";

		this.championsIcons = [];

		var self = this;
		this.element.onmousemove = function(e){
			var x = e.offsetX;
			var y = e.offsetY;
			self.graph.updateCursor(x, y);
		}

		this.addIcon = function(championName, x, y){
			var icon = new ChampionIconModel(this, championName);
			this.championsIcons.push(icon);
			icon.moveTo(x, y);
		}

		this.moveIcon = function(championName, x, y){
			var icon = this.championsIcons.find(function(icon){
				return icon.championName === championName;
			});
			icon.moveTo(x, y);
		}

		this.graph.element.appendChild(this.element);
	}

	/**
	 * Graph
	 */
	var GraphModel = function(placeholder){
		this.element = document.createElement("div");
		this.element.className = "graph-area";

		this.plotArea = new PlotAreaModel(this);
		this.xAxe = new AxeModel(this, "horizontal");
		this.yAxe = new AxeModel(this, "vertical");	

		this.data = [];

		this.setData = function(data){
			this.data = data;
		}

		this.defineAxes = function(xDataType, xMin, xMax, yDataType, yMin, yMax){
			this.xAxe.dataType = xDataType;
			this.xAxe.min = xMin;
			this.xAxe.max = xMax;
			this.yAxe.dataType = yDataType;
			this.yAxe.min = yMin;
			this.yAxe.max = yMax;
		}

		this.getCoordinates = function(xv, yv){
			var x = this.xAxe.getCoordinate(xv);
			var y = this.yAxe.getCoordinate(yv);
			return [x, y];
		}

		this.getValues = function(x, y){
			var xv = this.xAxe.getValue(x);
			var yv = this.yAxe.getValue(y);
			return [xv, yv];
		}

		this.updateCursor = function(x, y){
			//console.log(this.getValues(x, y));
		}

		this.displayData = function(){
			for (let championName in this.data){
				var xdt = this.xAxe.dataType;
				var ydt = this.yAxe.dataType;
				var xv = this.data[championName][xdt];
				var yv = this.data[championName][ydt];
				var coor = this.getCoordinates(xv, yv);
				this.plotArea.addIcon(championName, coor[0], coor[1]);
			}
		}

		this.update = function(data){
			this.setData(data);
			this.updateData();
		}

		this.updateData = function(){
			for (let championName in this.data){
				var xdt = this.xAxe.dataType;
				var ydt = this.yAxe.dataType;
				var xv = this.data[championName][xdt];
				var yv = this.data[championName][ydt];
				var coor = this.getCoordinates(xv, yv);
				this.plotArea.moveIcon(championName, coor[0], coor[1]);
			}
		}

		placeholder.appendChild(this.element);
	}

	/**
	 * Renderer
	 */
	var renderer = {

		_elements: [],

		// POPULARITY BAR
		drawPopularityBar: function(placeholder, championStats){
			var bar = this.createElement("popularity-bar",placeholder);
			var availableBar = this.createElement("available-bar",bar);
			var playedBar = this.createElement("played-bar",availableBar);
			var banned = championStats.banned * 100;
			var available = championStats.availability * 100;
			var played = championStats.played * 100;
			availableBar.style.left = banned + "%";
			availableBar.style.width = available + "%";
			playedBar.style.width = played + "%";
			return bar;
		},

		// GRAPH
		drawGraph: function(placeholder, championsStats, propX, propY, minX, maxX, minY, maxY){
			var graph = new GraphModel(placeholder);
			graph.setData(championsStats);
			graph.defineAxes(propX, minX, maxX, propY, minY, maxY);
			graph.displayData();

			return graph;
		}
	}

	return renderer;
});