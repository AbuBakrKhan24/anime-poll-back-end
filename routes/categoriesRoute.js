const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");

// Get all categories
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM categories", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Single Category|| with middleware
// router.get("/categories", middleware, (req, res) => {
//   res.send(req.product);
//   try {
//     let sql = "SELECT * FROM categories WHERE ?";
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
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM categories WHERE categories_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
    // res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add Category
router.post("/add_category", (req, res) => {
  try {
    let sql = "INSERT INTO categories SET ?";
    const { category_name, categories_description, result_description } =
      req.body;
    let category = {
      category_name,
      categories_description,
      result_description,
    };
    con.query(sql, category, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`Category ${category.category_name} was created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
