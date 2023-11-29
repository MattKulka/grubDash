const path = require("path");
const express = require("express");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign IDs when necessary
const nextId = require("../utils/nextId");

function validateDish(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
  
    if (!name || name === "") {
      return next({ status: 400, message: "Dish must include a name" });
    }
  
    if (!description || description === "") {
      return next({ status: 400, message: "Dish must include a description" });
    }
  
    if (!price || price <= 0 || !Number.isInteger(price)) {
      return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
    }
  
    if (!image_url || image_url === "") {
      return next({ status: 400, message: "Dish must include an image_url" });
    }
  
    next();
  }

function getDishList(req, res) {
    res.json({ data: dishes });
}

function createDish(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
  
    const newDish = {
      id: nextId(),
      name,
      description,
      price,
      image_url,
    };
  
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
  }

function checkIfExists(req, res, next){
  const { dishId } = req.params;
  const foundIndex = dishes.findIndex((dish) => dish.id === dishId);
  
  if (foundIndex === -1) {
    return res.status(404).json({ error: `Dish ID ${dishId} not found` });
  }else{
    next();
  }
}

function updateDish(req, res, next) {
  const { dishId } = req.params;
  const { data: { id, name, description, price, image_url } = {} } = req.body;

  // Find the index of the dish with the given ID
  const foundIndex = dishes.findIndex((dish) => dish.id === dishId);

  // Check if the provided ID mismatches the route parameter ID
  if (id && id !== dishId) {
    return res.status(400).json({ error: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
  }

  // Update the dish properties if provided in the request body
  if (name) dishes[foundIndex].name = name;
  if (description) dishes[foundIndex].description = description;
  if (price) dishes[foundIndex].price = price;
  if (image_url) dishes[foundIndex].image_url = image_url;

  // Return the updated dish
  res.json({ data: dishes[foundIndex] });
}


function getDishById(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (foundDish) {
    res.status(200).json({ data: foundDish });
  } else {
    next({ status: 404, message: `Dish ID ${dishId} not found` });
  }
} 

function deleteDish(req, res, next) {
  const { dishId } = req.params;

  const foundIndex = dishes.findIndex((dish) => dish.id === dishId);

  if (foundIndex !== -1) {
    dishes.splice(foundIndex, 1); // Remove the dish from the data
    return res.status(405).json({ error: `Attempting to delete an existing dish` });
  } else {
    return res.status(405).json({ error: `Dish ID ${dishId} not found` });
  }
}


module.exports = {
  getDishById,
  validateDish,
  getDishList,
  createDish,
  updateDish,
  deleteDish,
  checkIfExists,
  
};