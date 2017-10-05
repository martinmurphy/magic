var cards = require('./cardlist.js');
var mtgCardInfo = require('./mtgcardinfo.js');
var cardDB;
var source;
var template;

  function render() {
    var set_hou = $('#hou').prop('checked');
    var set_xln = $('#xln').prop('checked');
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
        var filtered = ((owned && (card.count > 0)) || (wanted && (card.count === 0))) &&
        ((set_hou && (card.set == 'hou')) || (set_xln && (card.set == 'xln'))) &&
          (
            (common && (card.rarity == 'Common')) ||
            (uncommon && (card.rarity == 'Uncommon')) ||
            (rare && (card.rarity == 'Rare')) ||
            (mythic && (card.rarity == 'Mythic Rare')) ||
            (other && (['Common', 'Uncommon', 'Rare', 'Mythic Rare'].indexOf(card.rarity) < 0))
          );
console.log('count:',card.count,', set:',card.set,', rarity:',card.rarity,', filtered:',filtered);
        return filtered;
      }),
      showImages: showImages
    });
    $('#cardlist').html(html);
  }

function getData() {
    mtgCardInfo.getCardsInfo('hou|xln', function (err, newCardDB) {
      if (!err && newCardDB && newCardDB.length) {
        cardDB = newCardDB;
        cards = _.map(cards, function (card) {
          var foundCard = _.find(cardDB, function (cardDBcard) {
            return (cardDBcard.number == card.number) && (cardDBcard.set.toLowerCase() == card.set.toLowerCase());
          });
          var retCard = {
            set: card.set,
            number: card.number,
            count: card.count
          };
          if (foundCard) {
            retCard = _.extend(retCard, {
              name: foundCard.name,
              subname: "",
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
                name: foundCardA.name,
                subname: foundCardB.name,
                rarity: foundCardA.rarity,
                imageUrl: foundCardA.imageUrl
              });
            }

          }
          return retCard;
        });
      }
    });
}

$(document).ready(function () {

  source = $("#cardlist-template").html();
  template = Handlebars.compile(source);

  $('#hou').change(function () {render();});
  $('#xln').change(function () {render();});
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
    mtgCardInfo.getCardsInfo('hou|xln', function (err, newCardDB) {
      if (!err && newCardDB && newCardDB.length) {
        cardDB = newCardDB;
      }
    });
  }

  $("#refresh").click(function () {
    getData();
  });
});
