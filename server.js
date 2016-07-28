var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var User       = require('./app/models/User');

/* setup body parser.*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/* conntect to database */
mongoose.connect('mongodb://localhost:27017/userdb');


var port   = process.env.PORT || 3000;
var router = express.Router();

/* Routing middleware */
router.use(function(req, res, next) {
	console.log("In Middleware!");
	console.log(req.body);
	next();
});


router.get('/', function(req, res) {
	res.json({message: "Hello World!"});
});

router.route('/users')
		.post( function(req, res) {
			var user = new User();

			var data      = req.body;

			user.name     = req.body.name;
			user.email    = req.body.email;
			user.password = req.body.password;

			user.save( function(err) {
				if(err) res.send(err);

				res.json({message: "User Created!"});
			});

		})
		.get(function(req, res) {
	        User.find(function(err, users) {
	            if (err) res.send(err);

	            res.json(users);
	        });
	    });

/* single User endpoints */
router.route('/users/:user_id')
		.get( function(req, res) {
			User.findById(req.params.user_id, function(err, User) {
		        if (err)
		            res.send(err);
		        res.json(User);
		    });
		})
		.put(function(req, res) {

	        // use our User model to find the User we want
	        User.findById(req.params.user_id, function(err, user) {

	            if (err)
	                res.send(err);

	            user.name    = req.body.name;  // update the users info
	            user.updated = Date.now();

	            // save the User
	            user.save(function(err) {
	                if (err)
	                    res.send(err);

	                res.json({ message: 'User updated!' });
	            });

	        });
	    })
	    .delete(function(req, res) {
	        User.remove({
	            _id: req.params.user_id
	        }, function(err, user) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Successfully deleted' });
	        });
	    });

app.use('/api', router);

app.listen(port, function(err) {
	if(err) throw err;
		console.log("Server Running at: "+ port);
});