var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Widget = require("../models/widget");
var User = require("../models/user");
var Youtube = require("../models/youtube");
var News = require("../models/news");
var Weather = require("../models/weather");
var Reddit = require("../models/reddit");

router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                console.log(err);
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

router.post('/signin', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    //const payload = {id: user._id, username: user.username};
                    const token = jwt.sign(user, config.secret);
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    console.log(err);
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

router.get('/widget', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        Widget.find({
            user_id: jwt.decode(token)._doc._id
        })
            .populate({path: 'item', select: '-_id -__v'})
            .exec(function (err, widget) {
                if (err) throw err;
                if (!widget) {
                    res.status(500).send({success: false, msg: 'Widget not found.'});
                } else {
                    widgets = [];
                    for (item of widget) {
                        widgets.push(item.item);
                    }
                    res.status(200).json(widgets);
                }
            });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/widget/youtube/channel', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        User.findOne({
            _id: jwt.decode(token)._doc._id
        }, function (err, user) {
            var newWidget = new Youtube.channel({
                youtube_username: req.body.youtube_username,
                refresh: req.body.refresh
            });
            newWidget.save(function (err) {
                if (err) {
                    return res.json({success: false, msg: 'Save YoutubeChannel failed.'});
                }
                newWidgetId = new Widget({
                    user_id: user._id,
                    item: newWidget._id,
                    onModel: newWidget.type
                });
                newWidgetId.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Save YoutubeChannel failed.'});
                    } else {
                        res.json({success: true, msg: 'Saved'});
                    }
                });
            });
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/widget/youtube/comment', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        User.findOne({
            _id: jwt.decode(token)._doc._id
        }, function (err, user) {
            var newWidget = new Youtube.comment({
                youtube_video: req.body.youtube_video,
                max_comment: req.body.max_comment,
                refresh: req.body.refresh
            });
            newWidget.save(function (err) {
                if (err) {
                    return res.json({success: false, msg: 'Save YoutubeComment failed.'});
                }
                newWidgetId = new Widget({
                    user_id: user._id,
                    item: newWidget._id,
                    onModel: newWidget.type
                });
                newWidgetId.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Save YoutubeComment failed.'});
                    } else {
                        res.json({success: true, msg: 'Saved'});
                    }
                });
            });
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/widget/youtube/video', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        User.findOne({
            _id: jwt.decode(token)._doc._id
        }, function (err, user) {
            var newWidget = new Youtube.video({
                youtube_username: req.body.youtube_username,
                max_comment: req.body.max_comment,
                refresh: req.body.refresh
            });
            newWidget.save(function (err) {
                if (err) {
                    return res.json({success: false, msg: 'Save YoutubeComment failed.'});
                }
                newWidgetId = new Widget({
                    user_id: user._id,
                    item: newWidget._id,
                    onModel: newWidget.type
                });
                newWidgetId.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Save YoutubeComment failed.'});
                    } else {
                        res.json({success: true, msg: 'Saved'});
                    }
                });
            });
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/widget/news', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        User.findOne({
            _id: jwt.decode(token)._doc._id
        }, function (err, user) {
            var newWidget = new News({
                keyword: req.body.keyword,
                refresh: req.body.refresh
            });
            newWidget.save(function (err) {
                if (err) {
                    return res.json({success: false, msg: 'Save News failed.'});
                }
                newWidgetId = new Widget({
                    user_id: user._id,
                    item: newWidget._id,
                    onModel: newWidget.type
                });
                newWidgetId.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Save News failed.'});
                    } else {
                        res.json({success: true, msg: 'Saved'});
                    }
                });
            });
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/widget/weather', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        User.findOne({
            _id: jwt.decode(token)._doc._id
        }, function (err, user) {
            var newWidget = new Weather({
                city: req.body.city,
                refresh: req.body.refresh
            });
            newWidget.save(function (err) {
                if (err) {
                    return res.json({success: false, msg: 'Save News failed.'});
                }
                newWidgetId = new Widget({
                    user_id: user._id,
                    item: newWidget._id,
                    onModel: newWidget.type
                });
                newWidgetId.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Save News failed.'});
                    } else {
                        res.json({success: true, msg: 'Saved'});
                    }
                });
            });
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/widget/reddit', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        User.findOne({
            _id: jwt.decode(token)._doc._id
        }, function (err, user) {
            var newWidget = new Reddit({
                subreddit: req.body.subreddit,
                max_article: req.body.max_article,
                refresh: req.body.refresh
            });
            newWidget.save(function (err) {
                if (err) {
                    return res.json({success: false, msg: 'Save News failed.'});
                }
                newWidgetId = new Widget({
                    user_id: user._id,
                    item: newWidget._id,
                    onModel: newWidget.type
                });
                newWidgetId.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Save News failed.'});
                    } else {
                        res.json({success: true, msg: 'Saved'});
                    }
                });
            });
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
