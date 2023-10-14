var router = require("express").Router();
const { adminAuth } = require("../middleware/auth");
const manufacturerServices = require("../services/manufacturer");

router.get("/", manufacturerServices.findAll);
router.post("/", [adminAuth], manufacturerServices.create);
router.delete("/:id", [adminAuth], manufacturerServices.delete);
router.put("/:id", [adminAuth], manufacturerServices.update);
router.get("/:id", [adminAuth], manufacturerServices.findManufacturer);

module.exports = router;
