const express = require('express');

const router = express.Router();

router.post('/test', (req, res) => {
    res.send({msg: "Profile works!"})
})

module.exports = router;
