import { Router } from "express";

import { ProductModel } from "../models/product.model";

const router = Router();
const PAGE_SIZE = 10;
const MAX_PAGE = Math.floor(Number.MAX_SAFE_INTEGER / PAGE_SIZE);

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

export default router;
