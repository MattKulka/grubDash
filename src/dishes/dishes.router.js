const router = require("express").Router();
const path = require("path");
const { validateDish, getDishList, createDish, getDishById, updateDish, deleteDish, checkIfExists} = require("./dishes.controller");

router.get("/", getDishList);
router.get("/:dishId", getDishById);
router.post("/", validateDish, createDish);
router.put("/:dishId",checkIfExists, validateDish, updateDish);
router.delete("/:dishId", deleteDish);

module.exports = router;
