const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");

// Get All elections
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM elections", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// Get one election
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM elections WHERE elections_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add election
router.post("/add_eleccction", (req, res) => {
  try {
    let sql = "INSERT INTO elections SET ?";
    const {
      title,
      category_ID,
      election_description,
      creator,
      Cover_img,
      vote_count,
    } = req.body;
    let election = {
      title,
      category_ID,
      election_description,
      creator,
      Cover_img,
      vote_count,
    };
    con.query(sql, election, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`Election for  ${elections.title} was created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});
// Delete one election
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM orders WHERE elections_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// Update election
router.put("/:id", (req, res) => {
  const {
    title,
    category_ID,
    election_description,
    creator,
    Cover_img,
    vote_count,
  } = req.body;
  try {
    // let sql = "SELECT * FROM users WHERE ?";
    // const user = {
    //   user_id: req.user.user_id,
    // };
    // con.query(
    //   `UPDATE orders SET amount = "${amount}", order_status = "${order_status}", cart = "${cart}" WHERE order_id = "${req.params.id}" `,
    //   (err, result) => {
    //     if (err) throw err;
    //     res.send(result);
    //   }
    // );
    let electionSql = "UPDATE elections SET ?";
    let election = {
      title,
      category_ID,
      election_description,
      creator,
      Cover_img,
      vote_count,
    };
    con.query(electionSql, election, (err, result) => {
      if (err) throw err;
      res.send("Election was successfully Edited");
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
