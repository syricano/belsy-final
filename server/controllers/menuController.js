import Menu from '../models/Menu.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

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
