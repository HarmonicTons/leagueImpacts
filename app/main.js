define(function (require) {

	var $        = require('../jquery-2.2.4.min');
	var getData  = require('./getData');
    var analyzer = require('./analyzer/analyzer');
    var renderer = require('./renderer/renderer');

    var ts_from = 0;
    var ts_to = 0;

    var graph;

	//init graph
    var query = {};
    getData(query, init);

    function init(sample){
    	var newDataSet = analyzer.newDataSet(sample);
    	var ds = newDataSet.data;
    	var placeholder = document.getElementById("placeholder");
		graph = renderer.drawGraph(placeholder, "win", "pick", 40, 60, -10, 100);

        // ellipses
        var xDeciles = newDataSet.deciles("win");
        var yDeciles = newDataSet.deciles("pick");
        var values = [
            [{x: xDeciles[5], y: yDeciles[5]}, {x: xDeciles[0], y: yDeciles[0]}, {x: xDeciles[10], y: yDeciles[10]}],
            [{x: xDeciles[5], y: yDeciles[5]}, {x: xDeciles[1], y: yDeciles[1]}, {x: xDeciles[9], y: yDeciles[9]}],
            [{x: xDeciles[5], y: yDeciles[5]}, {x: xDeciles[2], y: yDeciles[2]}, {x: xDeciles[8], y: yDeciles[8]}],
            [{x: xDeciles[5], y: yDeciles[5]}, {x: xDeciles[3], y: yDeciles[3]}, {x: xDeciles[7], y: yDeciles[7]}],
            [{x: xDeciles[5], y: yDeciles[5]}, {x: xDeciles[4], y: yDeciles[4]}, {x: xDeciles[6], y: yDeciles[6]}]
            ];
        renderer.displayEllipses(graph, values);

        // champions icons
        renderer.displayChampionsIcons(graph, ds);
    }

    var date_from = document.getElementById("date_from");
    date_from.onchange = function(e){
    	var date = new Date(e.srcElement.value);
    	ts_from = date.getTime();

    	getNewData();
    }
    var date_to = document.getElementById("date_to");
    date_to.onchange = function(e){
    	var date = new Date(e.srcElement.value);
    	ts_to = date.getTime();

    	getNewData();
    }

    function getNewData(){
    	if (ts_from >= ts_to) return;

    	var query = {periode:[ts_from, ts_to]};
    	getData(query, setNewData);
    }

    function setNewData(sample){
    	var newDataSet = analyzer.newDataSet(sample);
    	updateGraph(newDataSet.data);
    }

    function updateGraph(newDataSet){
		graph.update(newDataSet);
    }

});