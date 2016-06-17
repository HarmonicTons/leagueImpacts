define(['jquery'], function ($) {

	/**
	 * Cursor Model
	 */
	function CursorModel(axe, elementId, position){
		this.axe = axe;
		this.type = axe.type;
		this.position = position;
		this.element = axe.addTick(position, "cursor");
		this.styleOffset = this.axe.styleOffset;
		this.label = this.element.children[this.element.children.length-1];
		// ! different if vertical

		this.moveTo = function(position){
			var value = this.axe.getValueFromPosition(position);
			this.element.style[this.styleOffset] = position + "%";
			this.position = position;
			this.label = value.toFixed(1) + "%";
		}
	}

	/**
	 * Axe Model
	 */
	function AxeModel(containerId, elementId, type){
		this.name = elementId;
		this.container = document.getElementById(containerId);
		this.element = document.getElementById(elementId);
		this.min = 0;
		this.max = 100;
		this.scale = 1;
		this.offset = 0;
		this.size = 100;
		this.dataType = "";
		this.type = type;
		if (this.type == "horizontal"){
			this.styleSize = "width";
			this.styleOffset = "left";
			this.containerSize = this.container.offsetWidth;
		}
		if (this.type == "vertical") {
			this.styleSize = "height";
			this.styleOffset = "bottom";
			this.containerSize = this.container.offsetHeight;
		}

		this.set = function(prop, min, max){
			this.dataType = prop;
			this.min = min;
			this.max = max;
		}

		this.getValueFromPosition = function(position){
			return (position / 100 * (this.max - this.min) + this.min);
		}

		this.init = function(){
			var firstUnit = this.min*10; 
			for (let i = firstUnit; i <= this.max*10; i++){
				var position = (i - this.min*10)/(this.max-this.min)*10;
				if (i%1000 == 0) { 
					this.addTick(position, "hundred"); 
				} else if (i%100 == 0) { 
					this.addTick(position, "decade"); 
				} else if (i%10 == 0) { 
					this.addTick(position, "unit"); 
				} else {
					//this.addTick(position, "tenth"); 
				}
			}
		}

		this.addTick = function(position, type){
			var tickBox = document.createElement("div");
			tickBox.className = this.name + "-tick-box";

			var tick = document.createElement("div");
			tick.className = this.name + "-tick-box__tick  " +  this.name + "-tick-box__tick--" + type;
			tickBox.appendChild(tick);

			var tickLabel = document.createElement("div");
			tickLabel.className = this.name + "-tick-box__tick-label";
			//tickLabel.innerHTML = this.getValueFromPosition(position).toFixed(1) + "%";

			if (type == "decade") {
			tickLabel.className = this.name + "-tick-box__label  " + this.name + "-tick-box__label--visible";
			}
			tickBox.appendChild(tickLabel);

			this.element.appendChild(tickBox);
			tickBox.style[this.styleOffset] = position + "%";
			return tickBox;
		}


		this.cursor = new CursorModel(this, "cursor-" + type, 0);

		var self = this;
		this.element.onmousemove = function(e){
			var position;
			if (self.type == "horizontal") {
				position = e.layerX;
				self.cursor.moveTo( position / self.element.offsetWidth * 100);
			}
			if (self.type == "vertical") {
				position = self.element.offsetHeight - e.layerY;
				self.cursor.moveTo( position / self.element.offsetHeight * 100);
			}
		}

		this.onwheel = function(e){
			var oldPosition = this.cursor.position * this.size * this.containerSize / 100 / 100;

			var delta = -e.deltaY/100; 
			this.scale = this.scale*Math.pow(1.2,delta);
			if (this.scale < 1)  { this.scale = 1; }
			if (this.scale > 12) { this.scale = 12; }
			this.size = this.scale*100;

			this.element.style[this.styleSize] = this.size + "%";
			var newPosition = this.cursor.position * this.size * this.containerSize / 100 / 100;
			var newOffset = - newPosition + oldPosition + this.offset;

			this.moveTo(newOffset);
		}

		this.moveTo = function(offset){
			if (offset < this.containerSize * (100 - this.size) / 100) {
			offset = this.containerSize * (100 - this.size) / 100;
			}
			if (offset > 0) {
			offset = 0;
			}
			self.offset = offset;
			self.element.style[self.styleOffset] = offset + "px";
		}

	}

	/**
	 * Champion Icons
	 */
	var ChampionIconModel = function(plotArea, championName){
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

	/**
	 * Plot Area
	 */
	var PlotAreaModel = function(graph, elementId){
		this.graph = graph;
		this.isDragged = false;
		this.startPosition = {x: 0, y: 0};
		this.element = document.getElementById(elementId);

		this.championsIcons = [];
		this.iconHovered = [];

		this.addIcon = function(championName, x, y){
			var icon = new ChampionIconModel(this, championName);
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
	}

	/**
	 * Graph
	 */
	var GraphModel = function(placeholder){
		this.data = [];
		this.xAxe = new AxeModel("graph-x-axe-container", "x-axe", "horizontal");
		this.yAxe = new AxeModel("graph-y-axe-container", "y-axe", "vertical");
		this.plotArea = new PlotAreaModel(this, "graph-plot-area");

		var self = this;
		this.plotArea.element.onmousemove = function(e) {
			if (!self.plotArea.isDragged) {
				if (self.plotArea.iconHovered.length > 0){
					self.xAxe.cursor.moveTo( self.plotArea.iconHovered[0].x );
					self.yAxe.cursor.moveTo( self.plotArea.iconHovered[0].y );
				} else {
				  	var position = e.layerX;
				  	self.xAxe.cursor.moveTo( position / self.xAxe.element.offsetWidth * 100);
				  	position = self.yAxe.element.offsetHeight - e.layerY;
				  	self.yAxe.cursor.moveTo( position / self.yAxe.element.offsetHeight * 100);
				}
			} else {
				var x, y;
				if (self.plotArea.iconHovered.length > 0){
					return;
					// should really do something bettere here
					// could pass every icon in "--disable-mouse-events" while draging 
				} else {
				  	x = e.layerX;
				  	y = e.layerY;
				}
				var deltaX = x - self.plotArea.startPosition.x;
			  	var deltaY = y - self.plotArea.startPosition.y;
			  	self.xAxe.moveTo(self.xAxe.offset + deltaX); 
			  	self.yAxe.moveTo(self.yAxe.offset - deltaY);
			  	self.plotArea.element.style.left = self.xAxe.offset + "px";
			  	self.plotArea.element.style.bottom = self.yAxe.offset + "px";
			}
		}

		this.plotArea.element.onmousedown = function(e) {
			self.plotArea.isDragged = true;
			self.xAxe.element.className = "x-axe  x-axe--instant";
			self.yAxe.element.className = "y-axe  y-axe--instant";
			self.plotArea.element.className = "graph-plot-area  graph-plot-area--instant";
			self.plotArea.startPosition.x = e.layerX;
			self.plotArea.startPosition.y = e.layerY;
		}

		this.plotArea.element.onmouseup = function(e) {
			self.plotArea.isDragged = false;
			self.xAxe.element.className = "x-axe";
			self.yAxe.element.className = "y-axe";
			self.plotArea.element.className = "graph-plot-area";
		}

		this.plotArea.element.onmouseout = function(e) {
			self.plotArea.isDragged = false;
			self.xAxe.element.className = "x-axe";
			self.yAxe.element.className = "y-axe";
			self.plotArea.element.className = "graph-plot-area";
		}

		this.plotArea.element.onwheel = function(e){
			self.xAxe.onwheel(e);
			self.yAxe.onwheel(e);
			self.plotArea.element.style.left = self.xAxe.offset + "px";
			self.plotArea.element.style.bottom = self.yAxe.offset + "px";
			self.plotArea.element.style.width = self.xAxe.size + "%";
			self.plotArea.element.style.height = self.yAxe.size + "%";
		}

		this.setData = function(data){
			this.data = data;
		}

		this.setAxes = function(propX, propY, minX, maxX, minY, maxY){
			this.xAxe.set(propX, minX, maxX);
			this.yAxe.set(propY, minY, maxY);
			this.xAxe.init();
			this.yAxe.init();
		}

		this.getCoordinates = function(xv, yv){
			var x = (xv - this.xAxe.min) / (this.xAxe.max - this.xAxe.min) * 100;
			var y = (yv - this.yAxe.min) / (this.yAxe.max - this.yAxe.min) * 100;
			return [x, y];
		}

		this.displayData = function(){
			for (let championName in this.data){
				var xdt = this.xAxe.dataType;
				var ydt = this.yAxe.dataType;
				var xv = this.data[championName][xdt];
				var yv = this.data[championName][ydt];
				var coor = this.getCoordinates(xv * 100, yv * 100);
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
				var coor = this.getCoordinates(xv * 100, yv * 100);
				this.plotArea.moveIcon(championName, coor[0], coor[1]);
			}
		}

	}

	/**
	 * Renderer
	 */
	var renderer = {

		_elements: [],
		// GRAPH
		drawGraph: function(placeholder, championsStats, propX, propY, minX, maxX, minY, maxY){
			var graph = new GraphModel(placeholder);
			graph.setData(championsStats);
			graph.setAxes(propX, propY, minX, maxX, minY, maxY);
			graph.displayData();

			return graph;
		}
	}

	return renderer;
});