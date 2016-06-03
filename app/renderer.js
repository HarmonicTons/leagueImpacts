define(['jquery'], function ($) {

	/**
	 * Renderer
	 */
	var renderer = {
		_elements: [],
		createElement: function(className, placeholder){
			var elemt = document.createElement("div");
			if (className) elemt.className = className;
			elemt.id = this._elements.length;
			this._elements.push(elemt);
			if (placeholder) placeholder.appendChild(elemt);
			return elemt;
		},
		removeElement: function(id){
			this._elements[id] = "removed";
		},
		getElement: function(id){
			return this._elements[id];
		},
		// Popularity bar
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
		// draw champ icon
		drawIcon: function(placeholder,championName, x, y){
			var icon = this.createElement("champion-icon small",placeholder);
			var imgName = championName.split("'").join("").split(" ").join("").split(".").join("") + ".png";
			icon.style.backgroundImage = 'url("./icons/'+imgName+'")';
			if (typeof x !== "undefined") {
				icon.style.left = x + "px";
				icon.style.top  = y + "px";
			}
			return icon;
		},
		drawInteractiveIcon: function(placeholder,championName, x, y){
			var icon = this.drawIcon(placeholder, championName, x, y);
			var selector = this.createElement("champion-selector", placeholder);
			selector.style.left = x + "px";
			selector.style.top  = y + "px";
			selector.onmouseover = function(){
				icon.className = "champion-icon big";
			}
			selector.onmouseout = function(){
				icon.className = "champion-icon";
			}
			selector.onclick = function(){
				icon.className = "champion-icon big selected";
			}
			return icon;
		},
		drawLineGraph: function(placeholder, championsStats, prop, min, max){
			var line = this.createElement("line-graph",placeholder);
			var w = $(".line-graph").width();
			var h = $(".line-graph").height();
			// the line is divided in fragments of the size of 1 icon
			var fragments = [];
			var numberOfFragments = Math.floor(w / 60) + 1;
			for(let i=0; i<numberOfFragments; i++){
				fragments[i] = 0;
			}
			for (let championName in championsStats){
				var value = championsStats[championName][prop];
				var x = w * (value - min) / (max - min);
				var f = Math.floor(x / w * numberOfFragments);
				var iconsAlreadyPresent = fragments[f];
				var y = h/2 //+ Math.pow(-1,iconsAlreadyPresent)*iconsAlreadyPresent*10;
				fragments[f]++;
				this.drawInteractiveIcon(line, championName, x, y);
			}
			return line;
		},
		drawGraph: function(placeholder, championsStats, propX, propY, minX, maxX, minY, maxY){
			var surface = this.createElement("graph", placeholder);
			var w = $(".graph").width();
			var h = $(".graph").height();
			for (let championName in championsStats){
				var valueX = championsStats[championName][propX];
				var valueY = championsStats[championName][propY];
				var x = w * (valueX - minX) / (maxX - minX);
				var y = h * (valueY - minY) / (maxY - minY);
				this.drawInteractiveIcon(surface, championName, x, y);
			}
			return surface;
		}

	}

	return renderer;
});