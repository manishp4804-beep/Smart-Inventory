const supplierModel = require("../models/supplier");

const addSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        if (!name || !email || !phone || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingSupplier = await supplierModel.findOne({ name })
        if (existingSupplier) {
            return res.status(400).json({ success: false, message: "Supplier already exist" })
        }

        const newSupplier = new supplierModel({
            name,
            email,
            phone,
            address
        })
        await newSupplier.save()

        return res.status(201).json({ success: true, message: "Saved successfully", })
    }
    catch (e) {
        console.error("Error adding supplier", e)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

const getSupplier = async (req, res) => {
    try {
        const suppliers = await supplierModel.find()
        return res.status(200).json({ success: true, suppliers })
    }
    catch (e) {
        console.error("Error getting supplier data", e)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, phone, address } = req.body
        if (!name || !email || !phone || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        const updatedSupplier = await supplierModel.findByIdAndUpdate(
            id,
            { name, email, phone, address },
            { new: true, runValidators: true }
        )
        if (!updatedSupplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Successfully upated supplier",
            supplier: updatedSupplier
        })
    }
    catch (e) {
        console.error("Server Error", e)
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params
        const deletedSupplier = await supplierModel.findByIdAndDelete(id)
        if (deletedSupplier) {
            return res.status(200).json({
                success: true,
                message: "Supplier deleted successfully",
            });
        }
        return res.status(404).json({
            success: false,
            message: "Supplier not found",
        })
    }
    catch (e) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

module.exports = { addSupplier, getSupplier, updateSupplier, deleteSupplier }
