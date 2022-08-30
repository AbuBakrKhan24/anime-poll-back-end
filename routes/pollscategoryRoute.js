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

// Single product|| with middleware
// router.get("/polls", middleware, (req, res) => {
//   res.send(req.product);
//   try {
//     let sql = "SELECT * FROM polls WHERE ?";
//     let product = {
//       product_id: req.product.id,
//     };
//     con.query(sql, product, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// Single Product
// router.get("/:id", (req, res) => {
//   try {
//     con.query(
//       `SELECT * FROM polls WHERE poll_id = ${req.params.id}`,
//       (err, result) => {
//         if (err) throw err;
//         res.send(result);
//       }
//     );
//     // res.send({ id: req.params.id });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// });

// Add product
router.post("/add_polls", (req, res) => {
  try {
    let sql = "INSERT INTO polls SET ?";

    con.query(sql, req.body.poll, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(`Poll was created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete one product
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

// Update user
router.put("/update-user/:id", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      user_id: req.params.id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        let updateSql = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        let updateUser = {
          username: req.body.username,
          email: req.body.email,
          password: hash,
          user_type: req.body.user_type,
          phone: req.body.phone,
          country: req.body.country,
          billing_address: req.body.billing_address,
          default_shipping_address: req.body.default_shipping_address,
        };
        con.query(updateSql, updateUser, (err, updated) => {
          if (err) throw err;
          console.log(updated);
          res.send("Successfully Updated");
        });
      } else {
        res.send("User not found");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
