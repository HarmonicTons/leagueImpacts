define(function () {
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
		}
	}

	return renderer;
});