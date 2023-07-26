import express from "express";
const router = express.Router();
router.get("/", async (req, res, next) => {
    res.send("Welcome to Dashboard")
});

export default router;
