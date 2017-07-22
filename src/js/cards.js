var cards = require('./cardlist.js');
var mtgCardInfo = require('./mtgcardinfo.js');
var cardDB;

$(document).ready(function () {

  var source = $("#cardlist-template").html();
  var template = Handlebars.compile(source);

  var showImages = $('#showImages').prop('checked');
  var html = template({
    cards: cards,
    showImages: showImages
  });
  $('#cardlist').html(html);

  $("#all").click(function () {
    var showImages = $('#showImages').prop('checked');
    var html = template({
      cards: cards,
      showImages: showImages
    });
    $('#cardlist').html(html);
  });

  $("#owned").click(function () {
    var showImages = $('#showImages').prop('checked');
    var html = template({
      cards: _.filter(cards, function (card) {
        return card.count > 0
      }),
      showImages: showImages
    });
    $('#cardlist').html(html);
  });

  $("#wanted").click(function () {
    var showImages = $('#showImages').prop('checked');
    var html = template({
      cards: _.filter(cards, function (card) {
        return card.count <= 0
      }),
      showImages: showImages
    });
    $('#cardlist').html(html);
  });

  $("#refresh").click(function () {
    mtgCardInfo.getCardsInfo('hou', function (err, newCardDB) {
      if (!err && newCardDB && newCardDB.length) {
        cardDB = newCardDB;
        cards = _.map(cards, function (card) {
          var foundCard = _.find(cardDB, function (cardDBcard) {
            return cardDBcard.number == card.number;
          });
          var retCard = {
            set: card.set,
            number: card.number,
            count: card.count
          };
          if (foundCard) {
            retCard = _.extend(retCard, {
              name: foundCard.name,
              rarity: foundCard.rarity,
              imageUrl: foundCard.imageUrl
            });
          } else {
            var foundCardA = _.find(cardDB, function (cardDBcard) {
              return cardDBcard.number == card.number + "a";
            });
            var foundCardB = _.find(cardDB, function (cardDBcard) {
              return cardDBcard.number == card.number + "b";
            });
            if (foundCardA && foundCardB) {
              retCard = _.extend(retCard, {
                name: foundCardA.name + ' / ' + foundCardB.name,
                rarity: foundCardA.rarity,
                imageUrl: foundCardA.imageUrl
              });
            }
          }
          return retCard;
        });
      }
    });
  });
});
