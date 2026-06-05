const express = require("express");
const customer = require("../models/customer");
const router = express.Router();

router.get("/customers", async (req, res) => {
    try {
        const customers = await customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/customer/:id", async (req, res) => {
    try {
        const customerObject = await customer.findOne({ id: req.params.id });
        if (customerObject == null) {
            res.status(404).json({ status: 404 });
        } else {
            res.json(customerObject);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/customer", async (req, res) => {
    try {
        const newCustomer = new customer({
            id: req.body.id,
            name: req.body.name,
            age: req.body.age,
            moneySpent: req.body.moneySpent
        });
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/customers/totalMoneySpent", async (req, res) => {
    try {
        const result = await customer.aggregate([
            {
                $group: {
                    _id: null,
                    totalEarned: { $sum: "$moneySpent" }
                }
            }
        ]);
        const totalEarned = result.length > 0 ? result[0].totalEarned : 0;
        res.json({ totalEarned });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
