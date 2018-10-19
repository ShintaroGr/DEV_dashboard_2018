const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GuildWarsGems = new Schema({
  type: {
    type: String,
    default: 'GuildWarsGems'
  },
  gems_or_coins: {
    type: String,
    default: 'gems',
    enum: ['gems', 'coins'],
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  },
  position: {
    type: Number,
    default: 0
  }
})

GuildWarsGems
  .set('toObject', { getters: true })

GuildWarsGems.virtual('api_url').get(function () {
  return 'https://api.guildwars2.com/v2/commerce/exchange/' + this.gems_or_coins + '?quantity=' + (this.gems_or_coins === 'gems' ? 10 : 100000000)
})

const GuildWarsDelivery = new Schema({
  type: {
    type: String,
    default: 'GuildWarsDelivery'
  },
  api_key: {
    type: String,
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  },
  position: {
    type: Number,
    default: 0
  }
})

GuildWarsDelivery
  .set('toObject', { getters: true })

GuildWarsDelivery.virtual('api_url').get(function () {
  return 'https://api.guildwars2.com/v2/commerce/delivery?access_token=' + this.api_key
})

const GuildWarsWallet = new Schema({
  type: {
    type: String,
    default: 'GuildWarsWallet'
  },
  api_key: {
    type: String,
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  },
  position: {
    type: Number,
    default: 0
  }
})

GuildWarsWallet
  .set('toObject', { getters: true })

GuildWarsWallet.virtual('api_url').get(function () {
  return 'https://api.guildwars2.com/v2/account/wallet?access_token=' + this.api_key
})

module.exports = {
  Gems: mongoose.model('GuildWarsGems', GuildWarsGems),
  Delivery: mongoose.model('GuildWarsDelivery', GuildWarsDelivery),
  Wallet: mongoose.model('GuildWarsWallet', GuildWarsWallet)
}
