$(function(){
	var 	options = [],
			stocks = []
			stockCounter = 0;
	
	var renderStocks = function(){
		$('#highstocks').highcharts('StockChart', {series: options});
	}
	var createStocks = function(){
		$('#stocks form').each(function(){
			stocks.push($(this).data('symbol'));
		});
		$.each(stocks, function(i, stock){
			$.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename='+stock.toLowerCase()+'-c.json&callback=?',
				function(data){
					options[i] = {name: stock, data: data};
					stockCounter++;
					if ( stockCounter === stocks.length ) {
						renderStocks();
					}
				})
		})
	};
	var resetStocks = function(){
		options = [];
		stocks = [];
		stockCounter = 0;
	}
	var socket = io.connect('/')
	socket.on('update', function (data) {
		var replacementHTML = '';
		for ( var i in data ) {
			var stock = data[i];
			replacementHTML += '<li>'
					+'<form action="/stocks/"'+stock.symbol+'"/remove" method="post" data-symbol="'+stock.symbol.toUpperCase()+'">'
						+'<span>'+stock.symbol.toUpperCase()+'</span>'
						+'<button type="submit">X</button></form></li>'
		}
		$('#stocks').empty().append(replacementHTML);
		resetStocks();
		createStocks();
	});
	$('#frmAdd').on('submit', function(evt){
		socket.emit('add', {symbol: $('#stock').val()});
		evt.preventDefault();
		evt.stopPropagation();
	});
	$(document).on('submit', '#stocks form', function(evt){
		var objTarget = $(evt.target);
		if ( evt.target.tagName.toLowerCase() != 'form' ) {
			objTarget = objTarget.parents('form').first();
		}
		socket.emit('delete', {symbol: objTarget.data('symbol')});
		evt.preventDefault();
		evt.stopPropagation();
	});
	$(document).ready(function(){
		createStocks();
	});
})