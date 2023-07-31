import express from "express";
import mysqldump from "mysqldump";
import fs from "fs";

const router = express.Router();
 
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cvms",
};

// API endpoint to trigger the backup
router.get('/', (req, res) => {
  const backupDir = './backup'; // Change this to the desired backup directory path
  const backupFilePath = `${backupDir}/backup.sql`; // Change this to the desired backup file name

  // Create the backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // Generate the backup and send the file as a response
  mysqldump({
    connection: dbConfig,
    dumpToFile: backupFilePath,
  })
    .then(() => {
      res.download(backupFilePath);
    })
    .catch((error) => {
      console.error('Error generating backup:', error);
      res.status(500).json({ error: 'Error generating backup' });
    });
});


export default router;
