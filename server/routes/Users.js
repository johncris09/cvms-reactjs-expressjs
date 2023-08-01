import express from "express";
import db from "./../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();
const table = "users";

router.get("/", async (req, res, next) => {
  const q =
    "SELECT * FROM " + table + " ORDER BY timestamp desc";
  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; 
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }
  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.sendStatus(200); // Forbidden
    }
    req.user = user;
    next();
  });
};


router.get('/authinfo', authenticateToken, (req, res) => {
  const userId = req.user.id;   
  // SQL query to retrieve user data based on the user ID from the token
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.sendStatus(500); // Internal server error
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    res.json(user);
  });
}); 

// Function to hash the password
function hashPassword(password) {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}


router.post("/", async (req, res, next) => {
  try {

    // Hash the password using the hashPassword function
    const hashedPassword = await hashPassword(req.body.password);

    const q = "INSERT INTO " + table + " SET ?";

    db.query(q, { ...req.body, password: hashedPassword }, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: err.sqlMessage });
        return;
      }

      console.log("Data inserted successfully:", result);
      res.status(201).json({ message: "Data inserted successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
}); 


router.delete("/", async (req, res, next) => {
  try {
    const { id } = req.body;
    // Perform the delete operation
    const q = "DELETE FROM " + table + " WHERE id = ?";
    db.query(q, [id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        res.status(500).json({ error: "Error deleting data" });
        return;
      }

      console.log("Data deleted successfully:", result);
      res.status(200).json({ message: "Data deleted successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error deleting data" });
  }
});


export default router;
