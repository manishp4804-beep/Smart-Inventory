const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  categoryDescription: {
    type: String,
    required: true,
    trim: true,
  },
});

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;
