const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const middleware = require("../middleware/auth");

// Get All Users
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Gets one user
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users WHERE id = ${req.params.id}`,
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

// Delete User
router.delete("/:id", (req, res) => {
  try {
    let sql = "DELETE FROM users WHERE ?";
    let user = {
      id: req.params.id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      res.json({ msg: "User successfully removed" });
    });
  } catch (error) {
    console.log(error);
  }
});

// Register
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";

    const { username, email, password, avatar, user_type, about } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let user = {
      username,
      email,
      // We sending the hash value to be stored witin the table
      password: hash,
      avatar,
      user_type,
      about,
    };

    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.username, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

// Login
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.json({ msg: "email not found please register" });
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        // New code
        if (!isMatch) {
          res.json({ msg: "Password incorrect" });
        } else {
          // The information the should be stored inside token
          const payload = {
            // user: {
            id: result[0].id,
            user_type: result[0].user_type,
            username: result[0].username,
            email: result[0].email,
            about: result[0].about,
            avatar: result[0].avatar,
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Update user
router.patch("/update-user/:id", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      id: req.params.id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        let updateSql = `UPDATE users SET ? WHERE id = ${req.params.id}`;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        let updateUser = {
          username: req.body.username,
          email: req.body.email,
          password: hash,
          avatar: req.body.avatar,
          about: req.body.about,
        };
        con.query(updateSql, updateUser, (err, updated) => {
          if (err) throw err;
          console.log(updated);
          res.json({ msg: "Successfully Updated" });
        });
      } else {
        res.json({ msg: "User not found" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Verify
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});

// Wanted to add this still
// Forgot password
router.post("/forgot-psw", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result === 0) {
        res.status(400), res.send("Email not found");
      } else {
        // Allows me to connect to the given email account || Your Email
        const transporter = nodemailer.createTransport({
          host: process.env.MAILERHOST,
          port: process.env.MAILERPORT,
          auth: {
            user: process.env.MAILERUSER,
            pass: process.env.MAILERPASS,
          },
        });

        // How the email should be sent out
        var mailData = {
          from: process.env.MAILERUSER,
          // Sending to the person who requested
          to: result[0].email,

          subject: "Password Reset",
          html: `<div>
          <h3>Hi ${result[0].username},</h3>
          <br>
          <h4>Click link below to reset your password</h4>
          <a href="https://user-images.githubusercontent.com/4998145/52377595-605e4400-2a33-11e9-80f1-c9f61b163c6a.png">
            Click Here to Reset Password
          </a>
          <br>
          <p>For any queries feel free to contact us...</p>
          <div>
            Email: ${process.env.MAILERUSER}
            <br>
            Tel: If needed you can add this
          <div>
        </div>`,
        };

        // Check if email can be sent
        // Check password and email given in .env file
        transporter.verify((error, success) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email valid! ", success);
          }
        });

        transporter.sendMail(mailData, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            res.send("Please Check your email");
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Reset Password
router.put("/reset-psw/:id", (req, res) => {
  let sql = "SELECT * FROM users WHERE ?";
  let user = {
    user_id: req.params.id,
  };
  con.query(sql, user, (err, result) => {
    if (err) throw err;
    if (result === 0) {
      res.status(400), res.send("User not found");
    } else {
      let newPassword = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const updatedPassword = {
        username: result[0].username,
        email: result[0].email,
        user_type: result[0].user_type,
        phone: result[0].phone,
        country: result[0].country,
        billing_address: result[0].billing_address,
        default_shipping_address: result[0].default_shipping_address,

        // Only thing im changing in table
        password: hash,
      };

      con.query(newPassword, updatedPassword, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Password Updated please login");
      });
    }
  });
});

// New Routes
module.exports = router;
