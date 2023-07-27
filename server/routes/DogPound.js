import express from "express";
import db from "./../db.js";
const router = express.Router();
const table = "dog_pound";

router.get("/", async (req, res, next) => {
  const q =
    "SELECT dog_pound.*, barangay.barangay as address \
    FROM dog_pound, barangay \
    where dog_pound.address = barangay.id \
    order by dog_pound.date desc;";
  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
router.get("/report", async (req, res, next) => {
  const { start_date, end_date, address } = req.query;
  
  let q = "SELECT dog_pound.*, barangay.barangay as address FROM `dog_pound`, barangay \
  where dog_pound.address = barangay.id \
  and date >= ? and date <= ?";

  const queryParams = [start_date, end_date];

  // Check if the 'address' parameter is provided and not empty
  if (address && address.trim() !== '') {
    q += " and address = ?";
    queryParams.push(address);
  }

  q += " order by dog_pound.date desc;";

  db.query(q, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
      return;
    }
    
    if (results.length === 0) {
      // If results array is empty, send an empty array as the response
      res.json([]);
      return;
    }

    res.json(results);
  });
});



router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const q = "SELECT * FROM `" + table + "` where id = ? ";

    db.query(q, [id], (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Error fetching data" });
        return;
      }
      if (results.length === 0) {
        // If results array is empty, send an error response indicating no data found
        res.status(404).json({ error: "No data found" });
        return;
      }

      res.json(results[0]);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});
router.post("/", async (req, res, next) => {
  try {
    const newData = {
      ...req.body,
      or_number: req.body.or_number.replace(/\s+/g, " ").trim(),
      owner_name: req.body.owner_name.replace(/\s+/g, " ").trim(),
      pet_name: req.body.pet_name.replace(/\s+/g, " ").trim(),
      color: req.body.color.replace(/\s+/g, " ").trim(),
    };

    const q = "INSERT INTO " + table + " SET ?";

    db.query(q, newData, (err, result) => {
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

router.put("/", async (req, res, next) => {
  try {
    const {
      id,
      address,
      color,
      date,
      or_number,
      owner_name,
      pet_name,
      sex,
      size,
    } = req.body;

    const q =
      "UPDATE dog_pound  \
    SET address = ?, \
    color = ?, \
    date = ?, \
    or_number = ?, \
    owner_name = ?, \
    pet_name = ?, \
    sex = ?, \
    size = ? \
    WHERE id = ?;";

    db.query(
      q,
      [
        address,
        color,
        date,
        or_number,
        owner_name,
        pet_name,
        sex,
        size,
        id
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          res.status(500).json({ error: "Error updating data" });
          return;
        }

        console.log("Data updated successfully:", result);
        res.status(200).json({ message: "Data updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error updating data" });
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
