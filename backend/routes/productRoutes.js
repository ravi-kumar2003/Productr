const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});


const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    cloudinary.uploader.upload(base64, { folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
  });
};


router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


router.post(
  "/",
  upload.array("images", 5),
  [
    body("name").notEmpty(),
    body("description").notEmpty(),
    body("price").isNumeric(),
    body("category").notEmpty(),
    body("stock").isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = await Promise.all(
          req.files.map((file) =>
            uploadBufferToCloudinary(file.buffer, "productr/products")
          )
        );
      }

      const product = new Product({
        ...req.body,
        image: imageUrls[0] || "",
        images: imageUrls,
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      res.status(500).json({ message: "Product creation failed" });
    }
  }
);


router.put("/:id", upload.none(), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
