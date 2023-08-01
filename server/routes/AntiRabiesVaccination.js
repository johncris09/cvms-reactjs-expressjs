import express from "express";
import db from "./../db.js";
const router = express.Router();
const table = "anti_rabies_vaccination";

router.get("/", async (req, res, next) => {
  const q =
    "SELECT anti_rabies_vaccination.*, barangay.barangay as address, anti_rabies_species.name as species, anti_rabies_species.id as speciesId \
           FROM anti_rabies_vaccination, barangay, anti_rabies_species \
           where anti_rabies_vaccination.address = barangay.id \
           and anti_rabies_vaccination.species = anti_rabies_species.id \
           ORDER BY anti_rabies_vaccination.date_vaccinated desc;";

  db.query(q, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/report", async (req, res, next) => {
  const { start_date, end_date, address, species } = req.query;

  let q =
    "SELECT a.*, b.barangay as address, s.name as species \
    FROM `anti_rabies_vaccination` as a, barangay as b, anti_rabies_species as s \
  where a.address = b.id \
  and a.species = s.id \
  and a.date_vaccinated >= ?  \
  and a.date_vaccinated <= ? \
  and a.address <= ? ";

  const queryParams = [start_date, end_date, address];

  // Check if the 'species' parameter is provided and not empty
  if (species && species.trim() !== "") {
    q += " and a.species = ?";
    queryParams.push(species);
  }

  q += " ORDER BY a.date_vaccinated DESC;";

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
      "SELECT * FROM anti_rabies_vaccination, barangay, anti_rabies_species \
    WHERE anti_rabies_vaccination.address = barangay.id \
    AND anti_rabies_vaccination.species = anti_rabies_species.id \
    AND anti_rabies_vaccination.id = ? ";

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
    const {
      id,
      address,
      color,
      date_vaccinated,
      pet_name,
      neutered,
      owner_name,
      pet_birthdate,
      species,
      sex,
      vaccine_type,
    } = req.body;

    // Perform the update operation
    const q =
      "UPDATE `anti_rabies_vaccination` SET \
      `address` = ?, \
      `color` = ?, \
      `date_vaccinated` = ?, \
      `pet_name` = ?, \
      `neutered` = ?, \
      `owner_name` = ?, \
      `pet_birthdate` = ?, \
      `species` = ?, \
      `sex` = ?, \
      `vaccine_type` = ? \
      WHERE `id` = ?;";

    db.query(
      q,
      [
        address,
        color,
        date_vaccinated,
        pet_name,
        neutered,
        owner_name,
        pet_birthdate,
        species,
        sex,
        vaccine_type,
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
