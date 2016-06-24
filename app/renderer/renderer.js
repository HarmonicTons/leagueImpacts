define(['jquery', './visualisation-data-tool/graph'], function ($, Graph) {

	/**
	 * Renderer
	 */
	var renderer = {

		_elements: [],

		addElement: function(element){
			this._elements.push(element);
			return this._elements.length - 1;
		},

		// GRAPH
		drawGraph: function(placeholder, propX, propY, minX, maxX, minY, maxY){
			var graph = new Graph(placeholder);
			graph.setAxes(propX, propY, minX, maxX, minY, maxY);

			return this.addElement(graph);
		},

		displayEllipses: function(graphId, values){
			var graph = this._elements[graphId];
			for (var i = 0; i < values.length; i++) {
				graph.displayEllipse(values[i][0], values[i][1], values[i][2]);
			}
		},

		displayChampionsIcons: function(graphId, championsStats){
			var graph = this._elements[graphId];
			graph.setData(championsStats);
			graph.displayData();
		}
	}

	return renderer;
});