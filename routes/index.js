var
  mongo = require('../lib/mongo');

var responseError = function (err, req, res) {
  var response = {};
  res.status = 500;
  response.error = err;
  console.log(response);
  return res.json(response);
};

var responseSuccess = function (response, req, res) {
  return res.json(response);
};

var verifyTemplate = function (document, callback) {
  if (document.version)
    callback(null, true);
  else
    callback(null, false);
};

exports.index = function (req, res) {
  res.render('index');
};

exports.save = function (req, res) {
  var document = req.body;

  mongo.open('mongodb://localhost:27017/beacon', function (err, db) {
    if (err) {
      return responseError(err, req, res);
    }

    verifyTemplate(document, function (err, validated) {
      var collectionName = 'generic';
      if (validated) {
        collectionName = document.collection.name;
        //delete document.collection;
      }
      mongo.ensureCollection(collectionName, db, function (err, collection) {
        if (err)
          return responseError(err, req, res);

        if (document.collection.indexes && document.collection.indexes.length > 0) {
          document.collection.indexes.forEach(function (index) {
            mongo.ensureIndex(index.def, index.options, collection, function (err) {
              mongo.saveDocument(document, {w:1}, collection, function (err) {
                mongo.close(db, function () {
                  return responseSuccess({ok: 1}, req, res);
                });
                if (err)
                  return responseError(err, req, res);
              })
            });
          });
        }
        else {
          mongo.saveDocument(document, {w:1}, collection, function (err) {
            mongo.close(db, function () {
              return responseSuccess({ok: 1}, req, res);
            });
            if (err)
              return responseError(err, req, res);
          })
        }
      });
    });

    return true;
  });
};