import express from "express";

const router = express.Router();
let offers = [];

// GET all offers
router.get("/", async (req, res) => {
  res.json(offers);
});

// POST new offer
router.post("/", async (req, res) => {
  try {
    const offer = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    offers.push(offer);
    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE offer
router.delete("/:id", async (req, res) => {
  try {
    offers = offers.filter(offer => offer._id !== req.params.id);
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;