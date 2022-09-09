const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const middleware = require("../middleware/auth");

// Get All elections
router.get("/", middleware, (req, res) => {
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
// Get single  election category
router.get("/category/:id", middleware, (req, res) => {
  try {
    con.query(
      `SELECT * FROM elections WHERE  category_ID = "${req.params.id}"`,
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
// Get one election
router.get("/:id", middleware, (req, res) => {
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
router.post("/add_election", middleware, (req, res) => {
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
router.delete("/:id", middleware, (req, res) => {
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
router.put("/:id", middleware, (req, res) => {
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

// Add Vote Count
router.put("/vote_count/:id", middleware, (req, res) => {
  try {
    con.query(
      `SELECT * FROM elections WHERE  elections_id = "${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.send("U didn't vote bitch");
        } else {
          try {
            const vote_count = {
              vote_count: req.body.vote_count,
            };
            con.query(
              `UPDATE elections SET ? WHERE elections_id = "${result[0].elections_id}"`,
              vote_count,
              (err, result) => {
                if (err) console.log(err);
                res.send(result);
              }
            );
          } catch (error) {}
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
