const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

function validateOrder(req, res, next) {
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  
    if (!deliverTo || deliverTo === "") {
      return next({ status: 400, message: "Order must include a deliverTo" });
    }
  
    if (!mobileNumber || mobileNumber === "") {
      return next({ status: 400, message: "Order must include a mobileNumber" });
    }
  
    if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
      return next({ status: 400, message: "Order must include at least one dish" });
    }
  
    for (let index = 0; index < dishes.length; index++) {
      const { quantity } = dishes[index];
  
      if (quantity === undefined || quantity <= 0 || !Number.isInteger(quantity)) {
        return next({ status: 400, message: `Dish ${index} must have a quantity that is an integer greater than 0` });
      }
    }
  
    next();
  }

function getOrderList(req, res) {
    res.status(200).json({ data: orders });
  }

function createOrder(req, res, next) {
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  
    if (!deliverTo || deliverTo === "") {
      return next({ status: 400, message: "Order must include a deliverTo" });
    }
  
    if (!mobileNumber || mobileNumber === "") {
      return next({ status: 400, message: "Order must include a mobileNumber" });
    }
  
    if (!Array.isArray(dishes) || dishes.length === 0) {
      return next({ status: 400, message: "Order must include at least one dish" });
    }
  
    for (let i = 0; i < dishes.length; i++) {
      const { quantity } = dishes[i];
      if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
        return next({ status: 400, message: `Dish ${i} must have a quantity that is an integer greater than 0` });
      }
    }
  
    const newOrder = {
      id: nextId(),
      deliverTo,
      mobileNumber,
      dishes,
    };
  
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
  }

function getOrderById(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
  
    if (foundOrder) {
      res.status(200).json({ data: foundOrder });
    } else {
      next({ status: 404, message: `Order ID ${orderId} not found` });
    }
  }

function updateOrderById(req, res, next) {
  const { orderId } = req.params;
  const { data: { id, status, deliverTo, mobileNumber, dishes } = {} } = req.body;

  // Check for order existence before performing other validations
  const foundOrderIndex = orders.findIndex((order) => order.id === orderId);

  if (foundOrderIndex === -1) {
    return next({ status: 404, message: `Order ID ${orderId} not found` });
  }

  if (id && id !== orderId) {
    return next({ status: 400, message: `Order id does not match route id. Order: ${id}, Route: ${orderId}` });
  }

  // Proceed with other validations and updates

  const foundOrder = orders[foundOrderIndex];

  if (foundOrder.status === "delivered") {
    return next({ status: 400, message: "A delivered order cannot be changed" });
  }

  // Validate other properties like deliverTo, mobileNumber, dishes, etc.

  foundOrder.deliverTo = deliverTo || foundOrder.deliverTo;
  foundOrder.mobileNumber = mobileNumber || foundOrder.mobileNumber;
  foundOrder.dishes = dishes || foundOrder.dishes;

  if (!status || status.trim() === "") {
    return next({ status: 400, message: "Order status is required" });
  }

  if (status !== "pending" && status !== "preparing" && status !== "out-for-delivery" && status !== "delivered") {
    return next({ status: 400, message: "Invalid order status" });
  }

  foundOrder.status = status;

  res.json({ data: foundOrder });
}


function deleteOrderById(req, res, next) {
    const { orderId } = req.params;
  
    const foundOrderIndex = orders.findIndex((order) => order.id === orderId);
  
    if (foundOrderIndex === -1) {
      return next({ status: 404, message: `Order ID ${orderId} not found` });
    }
  
    const orderToDelete = orders[foundOrderIndex];
  
    if (orderToDelete.status !== "pending") {
      return next({ status: 400, message: "An order cannot be deleted unless it is pending" });
    }
  
    orders.splice(foundOrderIndex, 1);
    res.sendStatus(204);
  }

module.exports = {
  validateOrder,
  getOrderList,
  createOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
