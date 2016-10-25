var express  = require('express');
var router   = express.Router();
var stocks   = require('../models/mw.stocks.js');


/**
 *main interface for viewing stock charts
 */
router.get('', stocks.list, function(req, res){
	res.render("stocks", {
		title: "FreeCodeCamp - Stocks Watcher", 
		stockSymbols: res.stockSymbols
	});
});

/**
 *add a new stock to be monitored
 */
router.post('/add', stocks.create, function(req, res){
	
	res.redirect("/stocks");
});

/**
 *remove a registered stock
 */
router.post('/:stock/remove', stocks.remove, function(req, res){
	
	res.redirect("/stocks");
});


module.exports = router;