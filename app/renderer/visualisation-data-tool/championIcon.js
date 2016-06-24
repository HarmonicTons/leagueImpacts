define(function () {

	/**
	 * Champion Icons Model
	 */
	var ChampionIcon = function(plotArea, championName){
		this.plotArea = plotArea;
		this.championName = championName;
		this.imgName = this.championName.split("'").join("").split(" ").join("").split(".").join("") + ".png";
		this.x = 0;
		this.y = 0;
		this.isSelected = false;
		this.isHovered = false;

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
		this.iconSelector.onmouseover = function(e){
			self.isHovered = true;
			self.plotArea.indicateHovered(self, true);
			if (!self.isSelected)
				self.iconImage.className = "graph-icon-image big";
		}
		this.iconSelector.onmouseout = function(){
			self.isHovered = false;
			self.plotArea.indicateHovered(self, false);
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
			this.x = x;
			this.y = y;
			this.element.style.left = x + "%";
			this.element.style.bottom  = y + "%";
		}
		
		this.plotArea.element.appendChild(this.element);
	}
	return ChampionIcon;
});