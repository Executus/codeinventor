'use strict';

let express = require('express');
let router = express.Router();

let ObjectUtility = require('../utilities/object_utility');

/* Get all objects */
router.get('/', function(req, res, next) {
  let appid = req.query.appid;
  console.log('appid: ' + appid);

  ObjectUtility.getObjects(appid, function(err, objects) {
    if (err) {
      return res.status(500).send(err);
    }

    let data = {
      Objects: objects
    }
    return res.status(200).send(data);
  });
});

/* Get a specific object */
router.get('/:objectid', function(req, res, next) {
  let objId = req.params.objectid;
  ObjectUtility.getObject(objId, function(err, objects) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(objects);
  });
});

/* Create new object */
router.post('/', function(req, res, next) {
  let obj = req.body.Object;
  let appid = req.query.appid;
  console.log('appid: ' + appid);

  if (obj) {
    ObjectUtility.createObject(appid, obj, function(err, object) {
      if (err) {
        return res.status(500).send(err);
      }

      let data = {
        Object: object
      };

      return res.status(200).send(data);
    });
  } else {
    let data = {
      error: 'Bad request - Object not found in body.'
    }
    return res.status(400).send(data);
  }
});

/* Update an object */
router.put('/', function(req, res, next) {
  let obj = req.body.Object;
  if (obj) {
    ObjectUtility.updateObject(obj, function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      let data = {
        result: 'success'
      }
      return res.status(200).send(data);
    });
  } else {
    let data = {
      error: 'Bad request - Object not found in body.'
    }
    return res.status(400).send(data);
  }
});

/* Delete an object */
router.delete('/:objectid', function(req, res, next) {
  let objId = req.params.objectid;
  ObjectUtility.deleteObject(objId, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    let data = {
      result: 'success'
    }
    return res.status(200).send(data);
  });
});

module.exports = router;
