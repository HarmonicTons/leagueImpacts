define(function () {

	/**
	 * Line Plot Model
	 */
	var LinePlot = function(plotArea, p1, p2, style){
		this.plotArea = plotArea;
		var w = plotArea.element.offsetWidth;
		var h = plotArea.element.offsetHeight
		this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.element.setAttribute("class", "fit-svg");
		this.element.setAttribute("viewBox", "0 0 "+w+" "+h);
		this.element.setAttribute("preserveAspectRatio", "none");
		this.element.setAttribute("width", w);
		this.element.setAttribute("height", h);

		p1Px = {x: p1.x * w / 100, y: (100 - p1.y) * h / 100};
		p2Px = {x: p2.x * w / 100, y: (100 - p2.y) * h / 100};

		var html = `<path d='
		M ${p1Px.x} ${p1Px.y}
		L ${p2Px.x} ${p2Px.y}'
		class="`;
		if (style == "dashed") {
			html += 'line-plot--dashed ';
		} 
		html += 'line-plot" />';
		this.element.innerHTML = html;

		this.plotArea.element.appendChild(this.element);
	}
	return LinePlot;
});