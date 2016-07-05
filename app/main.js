define(function (require) {

	var $        = require('../jquery-2.2.4.min');
	var getData  = require('./getData');
    var analyzer = require('./analyzer/analyzer');
    var renderer = require('./renderer/renderer');

    var ts_from = 0;
    var ts_to = 0;

    var graph;


    var oneDay = 24*60*60*1000;
    var patches = [1463450400000, 1464832800000, 1465956000000, 1467172800000, Date.now()];
    function patchDate(i){
        return patches[i] + oneDay;
    }
    var ts = 1463450400000;
    var mv = 13;
    var dt = 1;
    function nextData(){
        mv++;
        if (mv > 50) {
            console.log(deltas);
            return;
        }
        var query = {periode: [ts+oneDay*(mv-dt), ts+oneDay*(mv)]};
        getData(query, calcDelta);
        query = {periode: [ts+oneDay*(mv),ts+oneDay*(mv+dt)]}; 
        getData(query, calcDelta);
    }
    nextData();

    function calcBalance(sample){
        var newDataSet = analyzer.newDataSet(sample);
        var ds = newDataSet.data;
        var bi = analyzer.balanceIndex(ds);
        console.log(bi.toPrecision(2));
    }

    var samples = [];
    var deltas = [];
    function calcDelta(sample){
        samples.push(sample);
        if (samples.length < 2) return;
        var newDataSet1 = analyzer.newDataSet(samples[0]);
        var ds1 = newDataSet1.data;
        var newDataSet2 = analyzer.newDataSet(samples[1]);
        var ds2 = newDataSet2.data;

        var delta = analyzer.delta2(ds1, ds2, 10);
        deltas.push(delta.toPrecision(3));

        samples = [];

        nextData();
    }

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
        //renderer.displayEllipses(graph, values);

        //lines 
        var xQuarters = newDataSet.quarters("win");
        var yQuarters = newDataSet.quarters("pick");
        renderer.displayVerticalLine(graph, xQuarters[2]);
        renderer.displayVerticalLine(graph, xQuarters[1], "dashed");
        renderer.displayVerticalLine(graph, xQuarters[3], "dashed");
        renderer.displayHorizontalLine(graph, yQuarters[2]);
        renderer.displayHorizontalLine(graph, yQuarters[1], "dashed");
        renderer.displayHorizontalLine(graph, yQuarters[3], "dashed");

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