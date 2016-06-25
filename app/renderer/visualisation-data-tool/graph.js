define(['./axe', './plotArea'], function (Axe, PlotArea) {

	/**
	 * Graph
	 */
	var Graph = function(placeholder){
		this.data = [];
		this.xAxe = new Axe("graph-x-axe-container", "x-axe", "horizontal");
		this.yAxe = new Axe("graph-y-axe-container", "y-axe", "vertical");
		this.plotArea = new PlotArea(this, "graph-plot-area");

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

		this.getRelativePosition = function(value){
			var xv = value.x;
			var yv = value.y;
			var x = (xv * 100 - this.xAxe.min) / (this.xAxe.max - this.xAxe.min) * 100;
			var y = (yv * 100 - this.yAxe.min) / (this.yAxe.max - this.yAxe.min) * 100;
			return {x: x, y: y};
		}

		this.displayData = function(){
			for (let championName in this.data){
				var xdt = this.xAxe.dataType;
				var ydt = this.yAxe.dataType;
				var xv = this.data[championName][xdt];
				var yv = this.data[championName][ydt];
				var coor = this.getRelativePosition({x: xv, y: yv});
				this.plotArea.addIcon(championName, coor.x, coor.y);
			}
		}

		this.displayEllipse = function(centerValue, minValue, maxValue){
			var center = this.getRelativePosition(centerValue);
			var min = this.getRelativePosition(minValue);
			var max = this.getRelativePosition(maxValue);
			this.plotArea.addEllipsePlot(center, min, max);
		}

		this.displayLine = function(v1, v2, style) {
			var p1 = this.getRelativePosition(v1);
			var p2 = this.getRelativePosition(v2);
			this.plotArea.addLinePlot(p1, p2, style);
		}

		this.displayVerticalLine = function(v, style) {
			var x = this.getRelativePosition({x:v, y:0}).x;
			this.plotArea.addLinePlot({x:x, y:0}, {x:x, y:100}, style);
		}

		this.displayHorizontalLine = function(v, style) {
			var y = this.getRelativePosition({x:0, y:v}).y;
			this.plotArea.addLinePlot({x:0, y:y}, {x:100, y:y}, style);
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
				var coor = this.getRelativePosition({x: xv, y: yv});
				this.plotArea.moveIcon(championName, coor.x, coor.y);
			}
		}
	}
	return Graph;
});