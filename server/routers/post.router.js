var router = require("express").Router();
const upload = require("../utils/uploadImage");
const bulkUpload = require("../utils/uploadBulkImage");
const postServices = require("../services/post");
const { adminAuth } = require("../middleware/auth");
const { create } = require("../services/product");

router.get("/", postServices.findAll);
router.get("/:id", postServices.findPost);
router.post("/", [adminAuth, upload], postServices.create);
router.put("/:id", [adminAuth, upload], postServices.update);
router.delete("/:id", [adminAuth, upload], postServices.delete);

module.exports = router;
