var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = (function(){
	var stocksModel = mongoose.model('stockSymbols', new Schema({
		symbol: String
	}));

	var objReturn = {};

	objReturn.stocksList = function(callback) {
		stocksModel.find().sort('-timestamp').limit(5).exec(function(err, results){
			if ( err || ! results ) results = [];
			callback(results);
		});
	};

	objReturn.stocksCreate = function(symbol, callback) {
		stocksModel.findOne({ symbol: symbol.toLowerCase() }).exec(function(err, result){
			if ( result ) {
				callback();
			} else {
				var newStock = new stocksModel({ symbol: symbol.toLowerCase() }).save(function(err, doc, rowsaffected){
					callback();
				});
			}
		});
	};

	objReturn.stocksRemove = function(symbol, callback) {
		stocksModel.findOne({ symbol: symbol.toLowerCase() }).exec(function(err, result){
			if ( result ) {
				result.remove(function(err, doc, rowsaffected){
					callback();
				});
			} else {
				callback();
			}
		});
	};


	objReturn.list = function(req, res, next) {
		objReturn.stocksList(function(results){
			res.stockSymbols = results;
			next();
		});
	};

	objReturn.create = function(req, res, next) {
		objReturn.stocksCreate(req.body.stock, next);
	};

	objReturn.remove = function(req, res, next) {
		objReturn.stocksRemove(req.params.stock, next);
	};

	return objReturn;
})();
