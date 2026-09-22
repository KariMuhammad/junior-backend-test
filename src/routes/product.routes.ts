import { body, validationResult } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

import { requireAuthentication } from "../middleware/authentication";
import { requireAdmin } from "../middleware/authorization";
import { ProductModel } from "../models/product.model";

const router = Router();
const PAGE_SIZE = 10;
const MAX_PAGE = Math.floor(Number.MAX_SAFE_INTEGER / PAGE_SIZE);

const productValidation = [
  body("name")
    .custom((value) => typeof value === "string" && value.trim().length > 0)
    .withMessage("Name is required")
    .trim(),
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
  body("price")
    .custom(
      (value) =>
        typeof value === "number" &&
        Number.isFinite(value) &&
        value > 0,
    )
    .withMessage("Price must be a positive number"),
  body("quantity")
    .custom(
      (value) =>
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0,
    )
    .withMessage("Quantity must be a non-negative integer"),
];

function handleValidationErrors(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    response.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
    return;
  }

  next();
}

function validateProductId(
  request: Request<{ id: string }>,
  response: Response,
  next: NextFunction,
): void {
  if (!/^[a-f\d]{24}$/i.test(request.params.id)) {
    response.status(400).json({ message: "Invalid product ID" });
    return;
  }

  next();
}

function parsePage(value: unknown): number | null {
  if (value === undefined) {
    return 1;
  }

  if (
    typeof value !== "string" ||
    !/^\d+$/.test(value)
  ) {
    return null;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) && page > 0 && page <= MAX_PAGE
    ? page
    : null;
}

router.get("/", async (request, response) => {
  const page = parsePage(request.query.page);

  if (page === null) {
    response.status(400).json({ message: "Page must be a positive integer" });
    return;
  }

  const [products, totalCount] = await Promise.all([
    ProductModel.find()
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    ProductModel.countDocuments(),
  ]);

  response.status(200).json({
    data: products,
    page,
    pageSize: PAGE_SIZE,
    totalCount,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
  });
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;

  if (!/^[a-f\d]{24}$/i.test(id)) {
    response.status(400).json({ message: "Invalid product ID" });
    return;
  }

  const product = await ProductModel.findById(id).lean();

  if (!product) {
    response.status(404).json({ message: "Product not found" });
    return;
  }

  response.status(200).json({ data: product });
});

router.post(
  "/",
  requireAuthentication,
  requireAdmin,
  productValidation,
  handleValidationErrors,
  async (request: Request, response: Response) => {
    const product = await ProductModel.create({
      name: request.body.name,
      category: request.body.category,
      price: request.body.price,
      quantity: request.body.quantity,
    });

    response.status(201).json({ data: product });
  },
);

router.put(
  "/:id",
  requireAuthentication,
  requireAdmin,
  validateProductId,
  productValidation,
  handleValidationErrors,
  async (request: Request<{ id: string }>, response: Response) => {
    const changes = {
      name: request.body.name,
      price: request.body.price,
      quantity: request.body.quantity,
    };
    const update =
      request.body.category === undefined
        ? { $set: changes, $unset: { category: 1 } }
        : { $set: { ...changes, category: request.body.category } };

    const product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      update,
      { new: true, runValidators: true },
    );

    if (!product) {
      response.status(404).json({ message: "Product not found" });
      return;
    }

    response.status(200).json({ data: product });
  },
);

router.delete(
  "/:id",
  requireAuthentication,
  requireAdmin,
  validateProductId,
  async (request: Request<{ id: string }>, response: Response) => {
    const product = await ProductModel.findByIdAndDelete(request.params.id);

    if (!product) {
      response.status(404).json({ message: "Product not found" });
      return;
    }

    response.status(204).send();
  },
);

export default router;
