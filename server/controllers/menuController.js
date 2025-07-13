import Menu from '../models/Menu.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { Op } from 'sequelize';


// GET /api/menu — Public
export const getAllMenuItems = asyncHandler(async (req, res) => {
  const items = await Menu.findAll({
    include: [{ model: Category, attributes: ['id', 'name'] }],
    order: [['id', 'ASC']],
  });
  res.json(items);
});

// POST /api/menu — Admin only
export const createMenuItem = asyncHandler(async (req, res) => {
  console.log('Incoming menu item data:', req.body); // 🔍

  const { name, price, categoryId } = req.body;

  if (!name || !price || !categoryId) {
    throw new ErrorResponse('Missing required fields', 400);
  }

  const newItem = await Menu.create(req.body);
  res.status(201).json(newItem);
});

// PUT /api/menu/:id — Admin only
export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await Menu.findByPk(req.params.id);
  if (!item) throw new ErrorResponse('Menu item not found', 404);

  await item.update(req.body);
  res.json(item);
});

// DELETE /api/menu/:id — Admin only
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await Menu.findByPk(req.params.id);
  if (!item) throw new ErrorResponse('Menu item not found', 404);

  await item.destroy();
  res.json({ message: 'Menu item deleted successfully' });
});


// controllers/menuController.js

// GET /api/menu/categories — Admin only
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const existing = await Category.findOne({ where: { name } });

  if (existing) {
    throw new ErrorResponse('Category already exists', 409);
  }

  const category = await Category.create({ name });
  res.status(201).json({ message: 'Category created successfully', category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    throw new ErrorResponse('Category not found', 404);
  }

  await category.update(req.body);
  res.json({ message: 'Category updated successfully', category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    throw new ErrorResponse('Category not found', 404);
  }

  await category.destroy();
  res.json({ message: 'Category deleted successfully' });
});
