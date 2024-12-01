const express = require("express");
const admin = require("firebase-admin");
const solutionRouter = express.Router();


// Endpoint API untuk solusi
solutionRouter.get("/", async (req, res) => {
    try {
        const solutionRef = admin.firestore().collection("problem-solution");
        const solutionSnapshot = await solutionRef.get();

        if (solutionSnapshot.empty) {
            return res.status(404).json({
                status: "error",
                message: "Solution not found",
            });
        } else {
            const solutionData = [];

            solutionSnapshot.forEach(doc => {
                solutionData.push(doc.data());
            });

            res.status(200).json({
                status: "success",
                message: "solution is ready",
                solutionData,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
});


// Endpoint API untuk solusi masalah
solutionRouter.get("/problem-solution/:id", async (req, res) => {
    try {
        const solutionId = req.params;
        const solutionRef = admin.firestore().collection("problem-solution").doc(solutionId);
        const solutionDoc = await solutionRef.get();

        if (!problem-solutionDoc.exists) {
            return res.status(404).json({ 
                status: "error",
                message: "Solution not found" });
        } else {
        const solutionData = solutionDoc.data(); 
        return res.status(200).json({ 
            status: "success",
            message: "Solution is ready", solutionData });
        }
    } catch (error) {
        return res.status(500).json({ 
            status: "error",
            message: "Failed to search solution"
         });
    }
});


module.exports = solutionRouter