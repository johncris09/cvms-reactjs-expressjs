import express from "express";
import db from "./../db.js";
const router = express.Router();
const table = "adopt";

router.get("/", async (req, res, next) => {
  const q =
    "SELECT\
      t1.id,\
      GROUP_CONCAT(DISTINCT t2.barangay ORDER BY t2.id) AS address,\
      GROUP_CONCAT(DISTINCT t3.barangay ORDER BY t3.id) AS adopt_address,\
      t1.adopt_owner_name,\
      t1.color,\
      t1.date,\
      t1.adopt_date,\
      t1.reference,\
      t1.or_number,\
      t1.owner_name,\
      t1.pet_name,\
      t1.sex,\
      t1.size,\
      t1.status,\
      t1.timestamp\
    FROM  adopt t1\
    LEFT JOIN barangay t2 ON t1.address = t2.id\
    LEFT JOIN barangay t3 ON t1.adopt_address = t3.id\
    GROUP BY  t1.id\
    order by t1.adopt_date desc;";
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
