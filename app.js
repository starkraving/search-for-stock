console.log('starting up');
var mode = process.argv[2] || 'development';
if ( mode == 'development' ) {
	require('dotenv').config();
}
var express      = require('express'),
	path         = require('path'),
	app          = express(),
	fs           = require('fs'),
	bodyParser   = require('body-parser'),
	pug          = require('pug'),
	io           = require('socket.io'),
    stocks   	 = require('./models/mw.stocks.js');

// database connection
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

// some environment variables
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static(path.join(__dirname, 'bower_components')));

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
	if(file.substr(-3) == '.js') {
		var fc = file.replace('.js', '');
		app.use('/'+fc, require('./controllers/' + file));
	}
});

app.get('/', function(req, res){
	res.redirect("/stocks");
});

if ( mode == 'development' ) {
	app.use(require('nodebuilder'));
}

var ion = io.listen(app.listen(process.env.PORT, function(){
  console.log('Express server listening on port ' + process.env.PORT);
}));

ion.sockets.on('connection', function (socket) {
    socket.on('add', function (data) {
    	stocks.stocksCreate(data.symbol, function(){
    		stocks.stocksList(function(results){
	    		ion.sockets.emit('update', results);
    		});
    	});
    }).on('delete', function(data){
    	stocks.stocksRemove(data.symbol, function(){
    		stocks.stocksList(function(results){
    			ion.sockets.emit('update', results);
    		});
    	});
    });
});