import express from "express";
import db from "./../db.js";
const router = express.Router();
const table = "disposed_dog";

router.get("/", async (req, res, next) => {
  const q =
    "SELECT d.*, b.barangay as address FROM disposed_dog as d, barangay as b \
    where d.address = b.id \
    order by d.disposed_date desc;";
  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/", async (req, res, next) => {
  try {
    const q = "INSERT INTO " + table + " SET ?";

    db.query(q, req.body, (err, result) => {
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

export default router;
