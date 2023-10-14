var router = require("express").Router();
const { adminAuth } = require("../middleware/auth");
const reviewServices = require("../services/review");

router.get("/", reviewServices.findAll);
router.post("/", [adminAuth], reviewServices.create);
router.delete("/:id", [adminAuth], reviewServices.delete);
router.put("/:id", [adminAuth], reviewServices.update);
router.get("/:id", reviewServices.findReview);

module.exports = router;
