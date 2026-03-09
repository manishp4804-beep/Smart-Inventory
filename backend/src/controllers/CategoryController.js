const categoryModel = require("../models/category");

const addCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;

    if (!categoryName || !categoryDescription) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingCategory = await categoryModel.findOne({ categoryName });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const newCategory = new categoryModel({
      categoryName,
      categoryDescription,
    });

    await newCategory.save();

    return res
      .status(201)
      .json({ success: true, message: "Category saved successfully" });
  } catch (e) {
    console.error("Error adding category", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCategories = async (req, res) => { 
  try {
    const categories = await categoryModel.find()
    return res.status(200).json({ success: true, categories })
  }
  catch (e) {
    console.error("Error fetching data", e)
    return res.status(500).json({ success: false, message: "server error" })
  }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { categoryName, categoryDescription } = req.body

    if (!categoryName || !categoryDescription) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const duplicate = await categoryModel.findOne({
      _id: { $ne: id },
      categoryName,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { categoryName, categoryDescription },
      { new: true, runValidators: true }
    )

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      category: updatedCategory 
    })
  }
  catch (e) {
    console.error("Error updating category", e)
    return res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting category", e);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {addCategory,getCategories,updateCategory,deleteCategory};
