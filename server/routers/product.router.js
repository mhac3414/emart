var router = require("express").Router();
const bulkUpload = require("../utils/uploadBulkImage");
const { adminAuth } = require("../middleware/auth");
const productServices = require("../services/product");

router.get("/", productServices.findAll);
router.get("/:id", productServices.findProduct);
router.post("/", [adminAuth, bulkUpload], productServices.create);
router.put("/:id", [adminAuth, bulkUpload], productServices.update);
router.delete("/:id", [adminAuth, bulkUpload], productServices.delete);

module.exports = router;
