import express from "express";
import db from "./../db.js";
const router = express.Router();
const table = "barangay";

router.get("/", async (req, res, next) => {
  const q =
    "SELECT * FROM `" + table + "` ORDER BY barangay ASC";
  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


export default router;
