import { model, Schema } from "mongoose";

export interface Product {
  name: string;
  category?: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (price: number) => Number.isFinite(price) && price > 0,
        message: "Price must be a positive number",
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must not be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const ProductModel = model<Product>("Product", productSchema);
