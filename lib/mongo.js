var mongo = require('mongodb');

exports.open = function (url, callback) {
  new mongo.MongoClient.connect(url, {w: 0}, function (err, db) {
    if (err)
      return callback(err);

    return callback(null, db);
  });
};

exports.close = function (db, callback) {
  db.close();
  return callback(null);
};

exports.ensureCollection = function (collection, db, callback) {
  db.createCollection(collection, {strict: false}, function (err, collection) {
    if (err)
      return callback(err);

    return callback(null, collection);
  });
};

exports.ensureIndex = function (indexKey, options, collection, callback) {
  collection.ensureIndex(indexKey, options, function (err) {
    if (err)
      return callback(err);

    return callback(null);
  });
};
exports.saveDocument = function (document, options, collection, callback) {
  collection.insert(document, options, function (err) {
    if (err)
      return callback(err);

    return callback(null, document);
  });
};

exports.getCount = function (collection, callback) {
  var result = -1;

  return callback(null, result);
};