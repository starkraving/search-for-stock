var express = require('express');
var router = express.Router();


/**
 *main interface for viewing stock charts
 */
router.get('', function(req, res){
	res.render("stocks", {title: "FreeCodeCamp - Stocks Watcher"});
});

/**
 *add a new stock to be monitored
 */
router.post('/add', function(req, res){
	
	res.redirect("/stocks");
});

/**
 *remove a registered stock
 */
router.post('/:stock/remove', function(req, res){
	
	res.redirect("/stocks");
});

module.exports = router;