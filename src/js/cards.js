var cards = require('./cardlist.js');
var mtgCardInfo = require('./mtgcardinfo.js');
var cardDB;

$(document).ready(function () {

  var source = $("#cardlist-template").html();
  var template = Handlebars.compile(source);

  function render() {
    var owned = $('#owned').prop('checked');
    var wanted = $('#wanted').prop('checked');
    var common = $('#common').prop('checked');
    var uncommon = $('#uncommon').prop('checked');
    var rare = $('#rare').prop('checked');
    var mythic = $('#mythic').prop('checked');
    var other = $('#other').prop('checked');
    var showImages = $('#showImages').prop('checked');

    var html = template({
      cards: _.filter(cards, function (card) {
        return ((owned && card.count > 0) || (wanted && card.count === 0)) &&
          (
            (common && card.rarity == 'Common') ||
            (uncommon && card.rarity == 'Uncommon') ||
            (rare && card.rarity == 'Rare') ||
            (mythic && card.rarity == 'Mythic Rare') ||
            (other && ['Common', 'Uncommon', 'Rare', 'Mythic Rare'].indexOf(card.rarity) < 0)
          );
      }),
      showImages: showImages
    });
    $('#cardlist').html(html);
  }

  $('#owned').change(function () {render();});
  $('#wanted').change(function () {render();});
  $('#common').change(function () {render();});
  $('#uncommon').change(function () {render();});
  $('#rare').change(function () {render();});
  $('#mythic').change(function () {render();});
  $('#other').change(function () {render();});
  $('#showImages').change(function () {render();});

  render();

  function getRemoteCardDB() {
    mtgCardInfo.getCardsInfo('hou', function (err, newCardDB) {
      if (!err && newCardDB && newCardDB.length) {
        cardDB = newCardDB;
      }
    });
  }

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
