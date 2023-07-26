import mysql from 'mysql';

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cvms"
};

const db = mysql.createConnection(dbConfig);

async function connectToDatabase() {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Connected to the database!');
        resolve();
      }
    });
  });
}

// Call the async function to establish the database connection
connectToDatabase().catch((err) => {
  console.error('Error connecting to the database:', err);
  process.exit(1); // Exit the process with an error code
});

export default db;
