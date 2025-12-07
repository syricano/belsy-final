import Menu from '../models/Menu.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { applyLocalizedFields, ensureTranslations } from '../utils/localization.js';


// GET /api/menu — Public
export const getAllMenuItems = asyncHandler(async (req, res) => {
  const items = await Menu.findAll({
    include: [{ model: Category, attributes: ['id', 'name', 'nameTranslations'] }],
    order: [['id', 'ASC']],
  });
  const localized = items.map((item) => {
    const localizedItem = applyLocalizedFields(item, ['name', 'description'], req.lang);
    if (localizedItem.Category) {
      localizedItem.Category = applyLocalizedFields(localizedItem.Category, ['name'], req.lang);
    }
    return localizedItem;
  });
  res.json(localized);
});

// POST /api/menu — Admin only
export const createMenuItem = asyncHandler(async (req, res) => {
  const { name, price, categoryId, nameTranslations, descriptionTranslations, description } = req.body;

  if (!name || !price || !categoryId) {
    throw new ErrorResponse('Missing required fields', 400);
  }

  const mergedNameTranslations = ensureTranslations(name, nameTranslations);
  const mergedDescriptionTranslations = ensureTranslations(description, descriptionTranslations);

  const newItem = await Menu.create({
    ...req.body,
    name: mergedNameTranslations?.en || name,
    description: mergedDescriptionTranslations?.en ?? description,
    nameTranslations: mergedNameTranslations,
    descriptionTranslations: mergedDescriptionTranslations,
  });
  const created = await Menu.findByPk(newItem.id, { include: [{ model: Category, attributes: ['id', 'name', 'nameTranslations'] }] });
  const localized = applyLocalizedFields(created, ['name', 'description'], req.lang);
  if (localized.Category) localized.Category = applyLocalizedFields(localized.Category, ['name'], req.lang);
  res.status(201).json(localized);
});

// PUT /api/menu/:id — Admin only
export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await Menu.findByPk(req.params.id);
  if (!item) throw new ErrorResponse('Menu item not found', 404);

  const { nameTranslations, descriptionTranslations, name, description } = req.body;

  const mergedNameTranslations = ensureTranslations(name || item.name, {
    ...(item.nameTranslations || {}),
    ...(nameTranslations || {}),
  });
  const mergedDescriptionTranslations = ensureTranslations(description || item.description, {
    ...(item.descriptionTranslations || {}),
    ...(descriptionTranslations || {}),
  });

  await item.update({
    ...req.body,
    name: mergedNameTranslations?.en || name || item.name,
    description: mergedDescriptionTranslations?.en ?? description ?? item.description,
    nameTranslations: mergedNameTranslations,
    descriptionTranslations: mergedDescriptionTranslations,
  });
  const updated = await Menu.findByPk(item.id, { include: [{ model: Category, attributes: ['id', 'name', 'nameTranslations'] }] });
  const localized = applyLocalizedFields(updated, ['name', 'description'], req.lang);
  if (localized.Category) localized.Category = applyLocalizedFields(localized.Category, ['name'], req.lang);
  res.json(localized);
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
  const localized = categories.map((cat) => applyLocalizedFields(cat, ['name'], req.lang));
  res.json(localized);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, nameTranslations } = req.body;
  const existing = await Category.findOne({ where: { name } });

  if (existing) {
    throw new ErrorResponse('Category already exists', 409);
  }

  const merged = ensureTranslations(name, { ...(nameTranslations || {}) });
  const category = await Category.create({ name: merged?.en || name, nameTranslations: merged });
  res.status(201).json({ message: 'Category created successfully', category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    throw new ErrorResponse('Category not found', 404);
  }

  const merged = ensureTranslations(req.body.name || category.name, {
    ...(category.nameTranslations || {}),
    ...(req.body.nameTranslations || {}),
  });

  await category.update({
    ...req.body,
    name: merged?.en || req.body.name || category.name,
    nameTranslations: merged,
  });
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
