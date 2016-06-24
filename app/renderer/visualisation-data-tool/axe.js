define(['./axeCursor'], function (AxeCursor) {

	/**
	 * Axe Model
	 */
	function Axe(containerId, elementId, type){
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


		this.cursor = new AxeCursor(this, "cursor-" + type, 0);

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
	return Axe;
});