const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const middleware = require("../middleware/auth");

// Get all polls
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM polls", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add Poll
router.post("/add_polls", (req, res) => {
  try {
    let sql = "INSERT INTO polls SET ?";
    con.query(sql, req.body, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(`Poll was created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});
// Delete one poll
router.delete("/:id", (req, res) => {
  {
    con.query(
      `DELETE FROM polls WHERE poll_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send("Sucessfully deleted this poll");
      }
    );
    // res.send({ id: req.params.id });
  }
});

module.exports = router;
