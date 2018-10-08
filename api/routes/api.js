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

router.get('/about', (req, res) => {
  aboutJson.client.host = req.connection.remoteAddress.split(':')[2] === '1' ? '127.0.0.1' : req.socket.remoteAddress.split(':')[3]
  aboutJson.server.current_time = Date.now()
  res.json(aboutJson)
})

router.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'})
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'})
      }
      res.json({success: true, msg: 'Successful created new user.'})
    })
  }
})

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
          res.status(200).json(widgets)
        }
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

router.get('/widget/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .populate({path: 'item', select: '-__v'})
      .exec(function (err, widget) {
        if (err) throw err
        res.json(widget.item)
      })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

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

router.get('/widget/:id/data', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    Widget.findOne({item: req.params.id})
      .populate({path: 'item', select: '-__v'})
      .exec(function (err, widget) {
        if (err) throw err
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

router.post('/widget/youtube/channel', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new Youtube.Channel({
      youtube_username: req.body.youtube_username,
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

router.post('/widget/youtube/comment', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new Youtube.Comment({
      youtube_video: req.body.youtube_video,
      max_comment: req.body.max_comment,
      refresh: req.body.refresh,
      api_url: 'https://www.googleapis.com/youtube/v3/commentThreads?videoId=' + req.body.youtube_video + '&part=snippet,replies&key=AIzaSyCLWyuC1IuQxDfAiwX2nYnn1WWRnqZKTJk'
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

router.post('/widget/youtube/video', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = getToken(req.headers)
  if (token) {
    const newWidget = new Youtube.Video({
      youtube_username: req.body.youtube_username,
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
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
})

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

module.exports = router
