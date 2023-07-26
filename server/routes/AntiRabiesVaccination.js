import express from "express";
import db from "./../db.js";
const router = express.Router();
const table = "anti_rabies_vaccination";

router.get("/", async (req, res, next) => {
  const q = "SELECT * FROM anti_rabies_vaccination, barangay, anti_rabies_species \
           WHERE anti_rabies_vaccination.address = barangay.id \
           AND anti_rabies_vaccination.species = anti_rabies_species.id \
           ORDER BY date_vaccinated ASC;";


  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/", async (req, res, next) => {
  try {  
    const newData = {
      ...req.body,
      vaccine_type: req.body.vaccine_type.replace(/\s+/g, " ").trim(),
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
    const { id, name } = req.body;
    // Perform the update operation
    const q = "UPDATE " + table + " SET name = ? WHERE id = ?";
    db.query(q, [name, id], (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ error: "Error updating data" });
        return;
      }

      console.log("Data updated successfully:", result);
      res.status(200).json({ message: "Data updated successfully" });
    });
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
