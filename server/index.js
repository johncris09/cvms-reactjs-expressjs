import express from "express"
import cors from "cors"
const PORT = 3001
import dashboardRoute from "./routes/Dashboard.js"
import medicationRoute from "./routes/Medication.js"
import barangayRoute from "./routes/Barangay.js"
import antiRabiesSpeciesRoute from "./routes/AntiRabiesSepcies.js"
import dewormSpeciesRoute from "./routes/DewormSpecies.js"
const app = express() 

// middleware for server
app.use(express.json())
app.use(cors())

app.use("/dashboard",  dashboardRoute);
app.use("/medication",  medicationRoute);
app.use("/barangay",  barangayRoute);
app.use("/anti_rabies_species",  antiRabiesSpeciesRoute);
app.use("/deworm_species",  dewormSpeciesRoute);

app.get('/', (req, res) => {
    res.send("Weclome to the Server")
})
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT)
})