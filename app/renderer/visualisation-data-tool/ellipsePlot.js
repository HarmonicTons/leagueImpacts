define(function () {

	/**
	 * Champion Icons Model
	 */
	var EllipsePlot = function(plotArea, center, min, max){
		this.plotArea = plotArea;
		var w = plotArea.element.offsetWidth;
		var h = plotArea.element.offsetHeight
		this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.element.setAttribute("class", "fit-svg");
		this.element.setAttribute("viewBox", "0 0 "+w+" "+h);
		this.element.setAttribute("preserveAspectRatio", "none");
		this.element.setAttribute("width", w);
		this.element.setAttribute("height", h);

		centerPx = {x: center.x * w / 100, y: (100 - center.y) * h / 100};
		minPx = {x: min.x * w / 100, y: (100 - min.y) * h / 100};
		maxPx = {x: max.x * w / 100, y: (100 - max.y) * h / 100};

		var p1 = {x: centerPx.x, y: minPx.y};
		var p2 = {x: minPx.x, y: centerPx.y};
		var p3 = {x: centerPx.x, y: maxPx.y};
		var p4 = {x: maxPx.x, y: centerPx.y};
		var r1 = centerPx.y - minPx.y;
		var r2 = centerPx.x - minPx.x;
		var r3 = centerPx.y - maxPx.y;
		var r4 = centerPx.x - maxPx.x;

		var html = `<path d='
		M ${p1.x} ${p1.y}
		A ${r2} ${r1} 0 0 1 ${p2.x} ${p2.y}
		A ${r2} ${r3} 0 0 1 ${p3.x} ${p3.y}
		A ${r4} ${r3} 0 0 1 ${p4.x} ${p4.y}
		A ${r4} ${r1} 0 0 1 ${p1.x} ${p1.y}'
		class="ellipse-plot"/> `;
		this.element.innerHTML = html;

		this.plotArea.element.appendChild(this.element);
	}
	return EllipsePlot;
});