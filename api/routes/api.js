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

// A route that gives you all the widgets of the dashboard
router.get('/about.json', (req, res) => {
  aboutJson.client.host = req.connection.remoteAddress.split(':')[2] === '1' ? '127.0.0.1' : req.socket.remoteAddress.split(':')[3]
  aboutJson.server.current_time = Date.now()
  res.json(aboutJson)
})

// A route used to create a user
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

// A route to log in an account
router.post('/signin', (req, res) => {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err
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

// A route that give all your widgets
router.get('/widget', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.find({
      user_id: jwt.decode(token)._id
    })
      .populate({path: 'item', select: '-__v'})
      .exec(function (err, widget) {
        if (err) throw err
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

// A route that give all the widget with the id
router.get('/widget/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .populate({path: 'item', select: '-__v'})
      .exec(function (err, widget) {
        if (err) throw err
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

// A route that delete the widget with the id
router.delete('/widget/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .exec((err, widget) => {
        if (err) throw err
        mongoose.model(widget.onModel)
          .findOne({_id: widget.item._id})
          .remove()
          .exec((err, object) => {
            if (err) throw err
          })
        widget.remove()
        res.status(200).json({success: true, msg: 'Widget has been deleted.'})
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

// A route that modify the widget with the id
router.put('/widget/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .exec((err, widget) => {
        if (err) throw err
        mongoose.model(widget.onModel).findByIdAndUpdate(
          req.params.id,
          req.body,
          {new: true},
          (err, item) => {
            if (err) return res.status(500).send(err)
            return res.json(item)
          }
        )
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

// A route that get the data from the api_url set in the model
router.get('/widget/:id/data', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .populate({path: 'item', select: '-__v'})
      .exec(function (err, widget) {
        if (err) throw err
        if (!widget) {
          return res.status(200)
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

// The route that manages the creation of the youtubeChannel widget
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

// The route that manages the creation of the youtubeVideo widget
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

// The route that manages the creation of the NYT widget
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

// The route that manages the creation of the Weather widget
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

// The route that manages the creation of the Reddit widget
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

// The route that manages the creation of the Hogwarts widget
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

// The route that manages the creation of the Movies widget
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

// The route that manages the creation of the Gw2Gems widget
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

// The route that manages the creation of the GW2Delivery widget
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

// The route that manages the retrieving of the GW2Delivery item by id
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

// The route that manages the retrieving of the GW2Delivery item prices by id
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

// The route that manages the creation of the GW2Wallet widget
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

// The route that manages the retrieving of the GW2Wallet currencies informations
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
