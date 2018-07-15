var cards = require('./cardlist.js');
var mtgCardInfo = require('./mtgcardinfo.js');
var async = require('async');
var cardDB;
var source;
var template;

function render() {
  var set_hou = $('#hou').prop('checked');
  var set_xln = $('#xln').prop('checked');
  var set_rix = $('#rix').prop('checked');
  var set_dom = $('#dom').prop('checked');
  var set_m19 = $('#m19').prop('checked');
  var owned = $('#owned').prop('checked');
  var wanted = $('#wanted').prop('checked');
  var common = $('#common').prop('checked');
  var uncommon = $('#uncommon').prop('checked');
  var rare = $('#rare').prop('checked');
  var mythic = $('#mythic').prop('checked');
  var other = $('#other').prop('checked');
  var showImages = $('#showImages').prop('checked');

  var cards2 = _.map(cards,function(card){
    card.four_minus = Math.max(0, 4 - card.count);
    return card;
  });

  var html = template({
    cards: _.filter(cards2, function (card) {
      var filtered = ((owned && (card.count > 0)) || (wanted && (card.count === 0))) &&
        ( 
          (set_hou && (card.set == 'hou')) || 
          (set_xln && (card.set == 'xln')) || 
          (set_rix && (card.set == 'rix')) || 
          (set_dom && (card.set == 'dom')) || 
          (set_m19 && (card.set == 'm19')) 
        ) &&
        (
          (common && (card.rarity == 'Common')) ||
          (uncommon && (card.rarity == 'Uncommon')) ||
          (rare && (card.rarity == 'Rare')) ||
          (mythic && (card.rarity == 'Mythic Rare')) ||
          (other && (['Common', 'Uncommon', 'Rare', 'Mythic Rare'].indexOf(card.rarity) < 0))
        );
      return filtered;
    }),
    showImages: showImages
  });
  $('#cardlist').html(html);
}

function getRemoteCardDB(sets, cb) {
  async.waterfall([
    function tryCache(wfcb) {
      var ret;
      if (typeof (Storage) !== "undefined") {
        var cardDbStr = localStorage.getItem("cardDB");
        cardDb = JSON.parse(cardDbStr);
      }
      return wfcb(undefined, cardDb);
    },
    function (carddb, wfcb) {
      if (carddb) {
        return wfcb(undefined, carddb);
      }
      mtgCardInfo.getCardsInfo('hou|xln|rix|dom|m19', function (err, newCardDB) {
        localStorage.setItem("cardDB", JSON.stringify(newCardDB));
        return wfcb(err, newCardDB);
      });
    }
  ], function (err, carddb) {
    return cb(err, carddb);
  });
}

function getData(cb) {
  getRemoteCardDB('hou|xln|rix|dom|m19', function (err, newCardDB) {
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
    return cb(err);
  });
}

$(document).ready(function () {

  source = $("#cardlist-template").html();
  template = Handlebars.compile(source);

  $('#hou').change(function () { render(); });
  $('#xln').change(function () { render(); });
  $('#rix').change(function () { render(); });
  $('#dom').change(function () { render(); });
  $('#m19').change(function () { render(); });
  $('#owned').change(function () { render(); });
  $('#wanted').change(function () { render(); });
  $('#common').change(function () { render(); });
  $('#uncommon').change(function () { render(); });
  $('#rare').change(function () { render(); });
  $('#mythic').change(function () { render(); });
  $('#other').change(function () { render(); });
  $('#showImages').change(function () { render(); });
  $("#refresh").click(function () {
    if (typeof (Storage) !== "undefined") {
      localStorage.removeItem("cardDB");
    }
    getData();
  });

  $('#status').text("Downloading card Database");
  $('#mainnav').hide();
  getData(function (err) {
    if (!err) {
      $('#status').text("Downloaded card Database");
      $('#status').hide();
      $('#mainnav').show();
    } else {
      $('#status').text("ERROR: " + JSON.stringify(err));
    }
  });
  render();

});
