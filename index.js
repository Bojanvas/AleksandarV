var express = require('express');
var app = express();
var path = require('path');
var passport = require('passport');
var formidable = require('formidable');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var fs = require('fs');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var session = require("express-session");
var port = process.env.PORT || 3000;
mongoose.connect('mongodb://bojan:bojan.1987@ds139959.mlab.com:39959/aceblog');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: "this is the secrect" }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());



var usersSchema = mongoose.Schema({
    username: String,
    password: String
}, { collection: 'user' });

var PostSchema = mongoose.Schema({
    title: { type: String, required: true },
    img: String,
    body: String,
    tag: { type: String, enum: ['JAVA', "DEVELOPMENT", "ANDROID"] },
    posted: { type: Date, default: Date.now }
}, { collection: 'post' });

var Users = mongoose.model('Users', usersSchema);
var PostModel = mongoose.model("PostModel", PostSchema);


passport.use(new LocalStrategy(function(username, password, done) {
    Users.findOne({ username: username, password: password }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: "no username" });
        }

        return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


// Define a middleware function to be used for every secured routes 
function auth(req, res, next) {
    if (!req.isAuthenticated()) { res.redirect('/#/blog/admin'); } else { next(); }
};
// app.use('/blogs', ghost({
//   config: path.join(__dirname, 'ghost-app/config.js')
// }));
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/#/blog/adminblog',
        failureRedirect: '/'
    })
);
app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});
app.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? '1' : '0');
})
app.get('/blog/adminblog', auth, function(req, res) {
    res.render('parts/admin');
})
app.get('/notes', function(req, res) {
    res.sendFile(__dirname +'/public/parts/notes.html');
})
app.get('/notes/privacy_policy', function(req, res) {
    res.sendFile(__dirname +'/public/parts/policy.html');
})
app.post('/api/post', function(req, res) {
    var post = req.body;
    PostModel
        .create(post)
        .then(
            function(postobj) {
                res.json(200);
            },
            function(error) {
                res.send(400);
            }
        )


})
app.get('/api/post', function(req, res) {
    PostModel
        .find()
        .then(function(posts) {
            res.json(posts);
        }, function(error) {
            res.sendStatus(400);
        });
})

app.get("/api/post/:id", function(req, res) {
    var postId = req.params.id;

    PostModel
        .findById({
            _id: postId
        })
        .then(function(post) { res.json(post); }, function(err) { res.sendStatus(400); })
})
app.put('/api/post/:id', function(req, res) {
    var postId = req.params.id;
    var post = req.body;
    PostModel
        .update({ _id: postId }, {
            title: post.title,
            body: post.body
        })
        .then(function(status) { res.sendStatus(200); },
            function(status) { res.sendStatus(400); })
})
app.delete("/api/post/:id", function(req, res) {
    var postId = req.params.id;
    PostModel
        .remove({ _id: postId })
        .then(function() { res.sendSatus(200); }, function() { res.sendStatus(400); })
})
app.get('/blog/adminblog', auth, function() {

})
app.post('/api/images/', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function(name, file) {
        file.path = __dirname + '/public/uploads/' + file.name;
    });

    res.redirect('/blog');
});
app.get('/sitemap.xml', function(req, res) {
    generate(res);
})

function generate(res) {
    var urls = ['/#about', '/#portfolio', '/#blog', '/'];
    var root_path = 'aleksandarvasilevski.com'
    var priority = 0.5;
    var freq = 'monthly';
    var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for (i in urls) {
        xml += '<url>';
        xml += '<loc>' + root_path + urls[i] + '</loc>';
        xml += '<changefreq>' + freq + '</changefreq>';
        xml += '<priority>' + priority + '</priority>';
        xml += '</url>';
    }
    xml += '</urlset>';
    res.header('Content-Type', "text/xml");
    res.send(xml);
}
app.listen(port, function() {
    console.log('working')
});