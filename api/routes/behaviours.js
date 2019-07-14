'use strict';

let express = require('express');
let router = express.Router();

let BehaviourUtility = require('../utilities/behaviour_utility');

/* Get all behavior definitions */
router.get('/', function(req, res, next) {
  BehaviourUtility.getBehaviourDefs(function(err, behaviourDefs) {
    if (err) {
      return res.status(500).send(err);
    }

    let data = {
      BehaviourDefs: behaviourDefs
    }
    return res.status(200).send(data);
  });
});

/* Create new behaviour definition */
router.post('/', function(req, res, next) {
  let def = req.body.BehaviourDef;
  if (def) {
    BehaviourUtility.createBehaviourDef(def, function(err, newBehaviourDefId) {
      if (err) {
        return res.status(500).send(err);
      }

      let data = {
        BehaviourDefId: newBehaviourDefId
      };

      return res.status(200).send(data);
    });
  } else {
    let data = {
      error: 'Bad request - BehaviourDef not found in body.'
    }
    return res.status(400).send(data);
  }
});

/* Update a behaviour definition */
router.put('/', function(req, res, next) {
  let def = req.body.BehaviourDef;
  if (def) {
    BehaviourUtility.updateBehaviourDef(def, function(err, behaviourDefId) {
      if (err) {
        return res.status(500).send(err);
      }

      let data = {
        result: 'success',
        BehaviourDefId: behaviourDefId
      }
      return res.status(200).send(data);
    });
  } else {
    let data = {
      error: 'Bad request - BehaviourDef not found in body.'
    }
    return res.status(400).send(data);
  }
});

/* Delete a behaviour definition */
router.delete('/:behaviourdefid', function(req, res, next) {
  let defId = req.params.behaviourdefid;
  if (defId) {
    BehaviourUtility.deleteBehaviourDef(defId, function(err) {
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
      error: 'Bad request - behaviourdefid parameter not found in query string.'
    }
    return res.status(400).send(data);
  }
});

module.exports = router;