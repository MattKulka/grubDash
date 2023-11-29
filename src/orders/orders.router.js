const router = require("express").Router();
const path = require("path");
const {
  validateOrder,
  getOrderList,
  createOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} = require("./orders.controller");

router.get("/", getOrderList);
router.post("/", validateOrder, createOrder);
router.get("/:orderId", getOrderById);
router.put("/:orderId", validateOrder, updateOrderById);
router.delete("/:orderId", deleteOrderById);

module.exports = router;

