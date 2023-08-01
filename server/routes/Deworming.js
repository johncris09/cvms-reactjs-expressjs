import express from "express";
import db from "./../db.js";
const router = express.Router();
const table = "deworming";

router.get("/", async (req, res, next) => {
  const q =
    "SELECT  d.*, b.barangay as address, m.medication as treatment, s.name as species, s.id as speciesId\
  FROM  deworming as d, medication as m, barangay as b, deworm_species as s\
  WHERE  d.address = b.id and d.treatment = m.id and d.species = s.id \
   order by d.date_deworming desc;";

  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/report", async (req, res, next) => {
  const { start_date, end_date, address, species } = req.query; 
  let q =
    "SELECT d.*, b.barangay as address, s.name as species, m.medication as treatment \
    FROM deworming as d, barangay as b, deworm_species as s, medication as m \
  where d.address = b.id \
  and d.species = s.id \
  and d.date_deworming >= ?  \
  and d.date_deworming <= ? \
  and d.address <= ? ";

  const queryParams = [start_date, end_date, address];

  // Check if the 'species' parameter is provided and not empty
  if (species && species.trim() !== "") {
    q += " and d.species = ?";
    queryParams.push(species);
  }

  q += " ORDER BY d.date_deworming DESC;";

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
    const q =
      "SELECT  d.*  \
      FROM  deworming as d, medication as m, barangay as b \
      WHERE  d.address = b.id and d.treatment = m.id \
       and  d.id = ? ";

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

router.put("/", async (req, res, next) => {
  try {
    const {
      id,
      address,
      amount,
      date_deworming,
      farmer_name,
      female,
      head_number,
      male,
      species,
      treatment,
    } = req.body;

    // Perform the update operation
    const q =
      "UPDATE  " +
      table +
      "  SET  \
      address =?, \
      amount =?,  \
      date_deworming =?,\
      farmer_name =?,\
      female =?,\
      head_number =?,\
      male =?,\
      species =?,\
      treatment =? \
      WHERE id = ?;";
 
    db.query(
      q,
      [
        address,
        amount,
        date_deworming,
        farmer_name,
        female,
        head_number,
        male,
        species,
        treatment,
        id,
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
