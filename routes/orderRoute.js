const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const jwt = require("jsonwebtoken");
const middleware = require("../Middleware/auth");

// Get All Orders
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM orders", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// Get one Order
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM orders WHERE order_id = ${req.params.id}`,
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

// Add new order
router.post("/", middleware, (req, res) => {
  const { amount, order_status, cart } = req.body;
  try {
    let sql = "SELECT * FROM users WHERE ?";
    const user = {
      user_id: req.user.user_id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      let orderSql = "INSERT INTO orders SET ?";
      let jsonCart = JSON.stringify(cart);
      let order = {
        amount,
        user_id: result[0].user_id,
        order_status,
        cart: jsonCart,
      };
      con.query(orderSql, order, (err, result) => {
        if (err) throw err;
        res.send("Order Placed");
      });
    });
  } catch (error) {
    console.log(error);
  }
  // const jsonCart = JSON.stringify(cart);
  // console.log(JSON.parse(jsonCart));
  // try {
  //   let sql = 'INSERT INTO orders'
  //   con.query(
  //     `Insert into orders(amount,order_status, cart) VALUES ("${amount}", "${order_status}", "${jsonCart}")`,
  //     (err, result) => {
  //       if (err) throw err;
  //       res.send(result);
  //     }
  //   );
  // } catch (error) {
  //   console.log(error);
  // }
});
// Delete one order
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM orders WHERE order_id = ${req.params.id}`,
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
// Edit order by ID
router.put("/:id", (req, res) => {
  const { amount, order_status, cart } = req.body;
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
    let orderSql = "UPDATE orders SET ?";
    let jsonCart = JSON.stringify(cart);
    let order = {
      amount,
      // user_id: result[0].user_id,
      order_status,
      cart: jsonCart,
    };
    con.query(orderSql, order, (err, result) => {
      if (err) throw err;
      res.send("Order Edited");
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
