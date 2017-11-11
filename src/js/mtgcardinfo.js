var request = require('request');
var async = require('async');

var cardsUrl = 'https://api.magicthegathering.io/v1/cards';

function getCardsInfo(set, cb) {
  var pageNum = 1;
  var retCards = [];
  async.doWhilst(function (cb) {
    request.get(cardsUrl, {
      qs: {
        set: set,
        pageSize: 100,
        page: pageNum,
        json: true
      }
    }, function (err, res, body) {
      var more = false;
      body = JSON.parse(body);
      pageNum++;
      if (!err) {
        retCards = retCards.concat(body.cards);
        more = (body.cards.length > 0) && (pageNum < 20);
      }
      return cb(err, more);
    });

  }, function (more) {
    return more;
  }, function (err) {
    return cb(err, retCards);
  });
}

exports.getCardsInfo = getCardsInfo;