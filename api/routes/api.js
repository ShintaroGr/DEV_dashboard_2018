const mongoose = require('mongoose')
const passport = require('passport')
const config = require('../config/database')
require('../config/passport')(passport)
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Widget = require('../models/widget')
const User = require('../models/user')
const Youtube = require('../models/youtube')
const News = require('../models/news')
const Weather = require('../models/weather')
const Reddit = require('../models/reddit')
const Hogwarts = require('../models/hogwarts')
const Movie = require('../models/movie')
const GuildWars = require('../models/guildwars2')
const request = require('request')

let aboutJson = require('./about')

function getToken (headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    } else {
      return null
    }
  } else {
    return null
  }
}

function saveWidgetID (token, newWidget, res) {
  const newWidgetId = new Widget({
    user_id: jwt.decode(token)._id,
    item: newWidget._id,
    onModel: newWidget.type
  })
  newWidgetId.save(function (err) {
    if (err) {
      return res.json({success: false, msg: 'New widget ID cannot be saved.'})
    } else {
      res.json({success: true, msg: 'Saved'})
    }
  })
}

/**
 * @api {get} /about.json Request information about the server
 * @apiName Dashboard
 * @apiGroup Server
 *
 *
 * @apiSuccess {Object} server Information about the server
 * @apiSuccess {Object} client Information about the client
 */
router.get('/about.json', (req, res) => {
  aboutJson.client.host = req.connection.remoteAddress.split(':')[2] === '1' ? '127.0.0.1' : req.socket.remoteAddress.split(':')[3]
  aboutJson.server.current_time = Date.now()
  res.json(aboutJson)
})

/**
 * @api {post} /signup Create a new user
 * @apiName Signup
 * @apiGroup User
 *
 * @apiParam {String} username Username of the User.
 * @apiParam {String} password Password of the User.
 * @apiParam {String} name Name of the User.
 * @apiParam {String} email Email of the User.
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'})
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email
    })
    // save the user
    newUser.save(function (err) {
      if (err) {
        console.log(err)
        return res.json({success: false, msg: 'Username already exists.'})
      }
      res.json({success: true, msg: 'Successful created new user.'})
    })
  }
})

/**
 * @api {post} /signin Login to a user
 * @apiName Signin
 * @apiGroup User
 *
 * @apiParam {String} username Username of the User.
 * @apiParam {String} password Password of the User.
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} token A token specific to the user
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/signin', (req, res) => {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) res.status(500).send({success: false, msg: 'Something went wrong.'})
    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'})
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // const payload = {id: user._id, username: user.username};
          const token = jwt.sign(user.toJSON(), config.secret)
          res.json({success: true, token: 'JWT ' + token})
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'})
        }
      })
    }
  })
})

/**
 * @api {get} /widget List all of the user's widget
 * @apiName Get all
 * @apiGroup Widget
 *
 * @apiSuccess {Object} data An array of all your widget
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.get('/widget', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.find({
      user_id: jwt.decode(token)._id
    })
      .populate({path: 'item', select: '-__v'})
      .exec(function (err, widget) {
        if (err) res.status(500).send({success: false, msg: 'Something went wrong.'})
        if (!widget) {
          res.status(500).send({success: false, msg: 'Widget not found.'})
        } else {
          let widgets = []
          for (let item of widget) {
            widgets.push(item.item)
          }
          widgets.sort((a, b) => { return (a.position - b.position) })
          res.status(200).json(widgets)
        }
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {get} /widget/:id Get the widget with the id :id
 * @apiName Get by id
 * @apiGroup Widget
 *
 * @apiParam {String} id The id of a widget
 *
 * @apiSuccess {Object} widget The widget with the id
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.get('/widget/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .populate({path: 'item', select: '-__v'})
      .exec(function (err, widget) {
        if (err) res.status(500).send({success: false, msg: 'Something went wrong.'})
        if (widget) {
          res.json(widget.item)
        } else {
          res.status(500).send({success: false, msg: 'Something went wrong.'})
        }
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {delete} /widget/:id Delete the widget with the id :id
 * @apiName Delete by id
 * @apiGroup Widget
 *
 * @apiParam {String} id The id of a widget
 *
 * @apiError {Boolean} success True if the request is valid and saved
 * @apiError {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.delete('/widget/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .exec((err, widget) => {
        if (err) res.status(500).send({success: false, msg: 'Something went wrong.'})
        mongoose.model(widget.onModel)
          .findOne({_id: widget.item._id})
          .remove()
          .exec((err, object) => {
            if (err) res.status(500).send({success: false, msg: 'Something went wrong.'})
          })
        widget.remove()
        res.status(200).json({success: true, msg: 'Widget has been deleted.'})
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {put} /widget/:id Edit the widget with the id :id
 * @apiName Edit by id
 * @apiGroup Widget
 *
 * @apiParam {String} id The id of a widget
 * @apiParam {Object} body The new body of the widget
 *
 * @apiError {Boolean} success True if the request is valid and saved
 * @apiError {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.put('/widget/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .exec((err, widget) => {
        if (err) res.status(500).send({success: false, msg: 'Something went wrong.'})
        mongoose.model(widget.onModel).findByIdAndUpdate(
          req.params.id,
          req.body,
          {new: true},
          (err, item) => {
            if (err) res.status(500).send({success: false, msg: 'Something went wrong.'})
            return res.json(item)
          }
        )
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {get} /widget/:id/data Edit the widget with the id :id
 * @apiName Data
 * @apiGroup Widget
 *
 * @apiParam {String} id The id of a widget
 *
 * @apiSuccess {Object} body The data from the api_url of the models
 *
 * @apiError {Object} body The data from the api_url of the models
 */
router.get('/widget/:id/data', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .populate({path: 'item', select: '-__v'})
      .exec(function (err, widget) {
        if (err) res.status(500).send({success: false, msg: 'Something went wrong.'})
        if (!widget) {
          res.status(500).send({success: false, msg: 'Something went wrong.'})
        }
        request({
          url: widget.item.api_url,
          json: true,
          timeout: 5000
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            res.json(body)
          } else {
            res.json(body)
          }
        })
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/youtube/channel Create a new youtube channel widget
 * @apiName YoutubeChannel
 * @apiGroup Widget
 *
 * @apiParam {String} youtube_name Name of a youtube channel
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/youtube/channel', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    request({
      url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=(' + req.body.youtube_name + ')&key=AIzaSyCLWyuC1IuQxDfAiwX2nYnn1WWRnqZKTJk',
      json: true,
      timeout: 5000
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const newWidget = new Youtube.Channel({
          youtube_id: body.items[0].id.channelId,
          youtube_name: req.body.youtube_name,
          refresh: req.body.refresh
        })
        newWidget.save(function (err) {
          if (err) {
            console.log(err)
            return res.json({success: false, msg: 'New widget cannot be saved.'})
          }
          saveWidgetID(token, newWidget, res)
        })
      } else {
        return res.json({success: false, msg: 'Unknown youtube user'})
      }
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/youtube/video Create a new youtube video widget
 * @apiName YoutubeVideo
 * @apiGroup Widget
 *
 * @apiParam {String} youtube_name Name of a youtube channel
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/youtube/video', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    request({
      url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=(' + req.body.youtube_name + ')&key=AIzaSyCLWyuC1IuQxDfAiwX2nYnn1WWRnqZKTJk',
      json: true,
      timeout: 5000
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const newWidget = new Youtube.Video({
          youtube_id: body.items[0].id.channelId,
          youtube_name: req.body.youtube_name,
          max_comment: req.body.max_comment,
          refresh: req.body.refresh
        })
        newWidget.save(function (err) {
          if (err) {
            return res.json({success: false, msg: 'New widget cannot be saved.'})
          }
          saveWidgetID(token, newWidget, res)
        })
      } else {
        return res.json({success: false, msg: 'Unknown youtube user'})
      }
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/news Create a new News widget
 * @apiName News
 * @apiGroup Widget
 *
 * @apiParam {String} keyword Keyword of the articles wanted
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/news', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    let newWidget
    newWidget = new News({
      keyword: req.body.keyword,
      refresh: req.body.refresh
    })
    newWidget.save(function (err) {
      if (err) {
        return res.json({success: false, msg: 'New widget cannot be saved.'})
      }
      saveWidgetID(token, newWidget, res)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/weather Create a new Weather widget
 * @apiName Weather
 * @apiGroup Widget
 *
 * @apiParam {String} city where to take weather informations
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/weather', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new Weather({
      city: req.body.city,
      refresh: req.body.refresh
    })
    newWidget.save(function (err) {
      if (err) {
        return res.json({success: false, msg: 'New widget cannot be saved.'})
      }
      saveWidgetID(token, newWidget, res)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/reddit Create a new Reddit widget
 * @apiName Reddit
 * @apiGroup Widget
 *
 * @apiParam {String} subreddit Which subreddit to retrieve data from
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/reddit', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new Reddit({
      subreddit: req.body.subreddit,
      max_article: req.body.max_article,
      refresh: req.body.refresh,
      sort: req.body.sort
    })
    newWidget.save(function (err) {
      if (err) {
        return res.json({success: false, msg: 'New widget cannot be saved.'})
      }
      saveWidgetID(token, newWidget, res)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/hogwarts Create a new Hogwarts widget
 * @apiName Hogwarts
 * @apiGroup Widget
 *
 * @apiParam {String} city From where you want the point to be retrieved
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/hogwarts', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new Hogwarts({
      city: req.body.city,
      refresh: req.body.refresh
    })
    newWidget.save(function (err) {
      if (err) {
        return res.json(err)
      }
      saveWidgetID(token, newWidget, res)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/news Create a new Movies widget
 * @apiName Movies
 * @apiGroup Widget
 *
 * @apiParam {String} sort now_playing or upcomming
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new Movie({
      sort: req.body.sort,
      refresh: req.body.refresh
    })
    newWidget.save(function (err) {
      if (err) {
        return res.json(err)
      }
      saveWidgetID(token, newWidget, res)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/guildwars2/gems Create a new Gw2Gems widget
 * @apiName Gw2Gems
 * @apiGroup Widget
 *
 * @apiParam {String} gems_or_coins Which way the exchange is taken
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/guildwars2/gems', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new GuildWars.Gems({
      gems_or_coins: req.body.gems_or_coins,
      refresh: req.body.refresh
    })
    newWidget.save(function (err) {
      if (err) {
        return res.json(err)
      }
      saveWidgetID(token, newWidget, res)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/guildwars2/delivery Create a new Gw2Delivery widget
 * @apiName Gw2Delivery
 * @apiGroup Widget
 *
 * @apiParam {String} api_key Api Key from where to get informations
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/guildwars2/delivery', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new GuildWars.Delivery({
      api_key: req.body.api_key,
      refresh: req.body.refresh
    })
    newWidget.save(function (err) {
      if (err) {
        return res.json(err)
      }
      saveWidgetID(token, newWidget, res)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/guildwars2/delivery/:id Get data from an guildwars2 item
 * @apiName Gw2Item
 * @apiGroup Data
 *
 * @apiParam {String} id Id of the item
 *
 * @apiSuccess {Object} item Item informations
 *
 * @apiError {Object} item Item informations
 */
router.get('/widget/guildwars2/delivery/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    request({
      url: 'https://api.guildwars2.com/v2/items/' + req.params.id,
      json: true,
      timeout: 5000
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        return res.status(200).json(response.body)
      } else {
        return res.json({success: false, msg: 'Unknown youtube user'})
      }
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/guildwars2/delivery/:id/prices Get the price of an guildwars2 item
 * @apiName Gw2Prices
 * @apiGroup Data
 *
 * @apiParam {String} id Id of the item
 *
 * @apiSuccess {Object} item Item prices
 *
 * @apiError {Object} item Item prices
 */
router.get('/widget/guildwars2/delivery/:id/prices', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    request({
      url: 'https://api.guildwars2.com/v2/commerce/prices/' + req.params.id,
      json: true,
      timeout: 5000
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        return res.status(200).json(response.body)
      } else {
        return res.json({success: false, msg: 'Unknown youtube user'})
      }
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/guildwars2/wallet Create a new Gw2Wallet widget
 * @apiName Gw2Wallet
 * @apiGroup Widget
 *
 * @apiParam {String} api_key Api Key from where to get informations
 * @apiParam {Number} refresh Refresh timer in seconds
 *
 * @apiSuccess {Boolean} success True if the request is valid and saved
 * @apiSuccess {String} msg Message that describe handling of the request
 *
 * @apiError {Boolean} success False if the request isn't valid and saved
 * @apiError {String} msg Message that describe handling of the request
 */
router.post('/widget/guildwars2/wallet', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new GuildWars.Wallet({
      api_key: req.body.api_key,
      refresh: req.body.refresh
    })
    newWidget.save(function (err) {
      if (err) {
        return res.json(err)
      }
      saveWidgetID(token, newWidget, res)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

/**
 * @api {post} /widget/guildwars2/wallet/:id Get data from an guildwars2 currency
 * @apiName Gw2Item
 * @apiGroup Data
 *
 * @apiParam {String} id Id of the currency
 *
 * @apiSuccess {Object} currency Currency informations
 *
 * @apiError {Object} currency Currency informations
 */
router.get('/widget/guildwars2/wallet/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    request({
      url: ' https://api.guildwars2.com/v2/currencies/' + req.params.id,
      json: true,
      timeout: 5000
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        return res.status(200).json(response.body)
      } else {
        return res.json({success: false, msg: 'Unknown youtube user'})
      }
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

module.exports = router
