import express from "express"
import cors from "cors"
const PORT = 3001
import dashboardRoute from "./routes/Dashboard.js"
import medicationRoute from "./routes/Medication.js"
import barangayRoute from "./routes/Barangay.js"
const app = express() 

// middleware for server
app.use(express.json())
app.use(cors())

app.use("/dashboard",  dashboardRoute);
app.use("/medication",  medicationRoute);
app.use("/barangay",  barangayRoute);

app.get('/', (req, res) => {
    res.send("Weclome to the Server")
})
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT)
})