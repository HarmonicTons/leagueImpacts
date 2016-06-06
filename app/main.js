define(function (require) {

	var $        = require('../jquery-2.2.4.min');
	var getData  = require('./getData');
    var analyzer = require('./analyzer');
    var renderer = require('./renderer');

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
		graph = renderer.drawGraph(placeholder, ds, "win", "pick", 0.42, 0.58, 0, 0.7);
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
    	var placeholder = document.getElementById("placeholder");
		graph.update(newDataSet);
    }

});