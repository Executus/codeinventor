'use strict';

let express = require('express');
let router = express.Router();

let ObjectUtility = require('../utilities/object_utility');

/* Get all objects */
router.get('/', function(req, res, next) {
  ObjectUtility.getObjects(function(err, objects) {
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
  if (obj) {
    ObjectUtility.createObject(obj, function(err, object) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(object);
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
    ObjectUtility.updateObject(obj, function(err, object) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(object);
    });
  } else {
    let data = {
      error: 'Bad request - Object not found in body.'
    }
    return res.status(400).send(data);
  }
});

/* Delete an object */
router.delete('/', function(req, res, next) {
  let obj = req.body.Object;
  if (obj) {
    ObjectUtility.deleteObject(obj, function(err, object) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(object);
    });
  } else {
    let data = {
      error: 'Bad request - Object not found in body.'
    }
    return res.status(400).send(data);
  }
});

module.exports = router;
