var fs = require('fs');
var util = require('util');
var mtgCardInfo = require('../js/mtgcardinfo.js');

mtgCardInfo.getCardsInfo('hou|xln|rix', function (err, newCardDB) {
    fs.writeFileSync("carddb.json", util.inspect(newCardDB, { showHidden: true, depth: null, maxArrayLength: null }));
});





