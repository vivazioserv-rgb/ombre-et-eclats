import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { siteConfig } from "@/site.config";

// Category
const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    emoji: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export type CategoryDoc = InferSchemaType<typeof CategorySchema>;
export const Category: Model<CategoryDoc> =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

// Product
const FlavorSchema = new Schema(
  { name: String, imageUrl: String, surcharge: { type: Number, default: 0 } },
  { _id: true }
);
const SizeSchema = new Schema(
  { name: String, surcharge: { type: Number, default: 0 } },
  { _id: true }
);
const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    shortDesc: { type: String, trim: true },
    longDesc: String,
    basePrice: { type: Number, required: true, min: 0 },
    delay: { type: Number, default: 2 },
    isNew: { type: Boolean, default: false },
    status: { type: String, enum: ["available", "unavailable", "soon"], default: "available" },
    imageUrl: String,
    images: { type: [String], default: [] },
    allergens: String,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    flavors: [FlavorSchema],
    sizes: [SizeSchema],
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);
export type ProductDoc = InferSchemaType<typeof ProductSchema>;
export const Product: Model<ProductDoc> =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

// Order
const OrderItemSchema = new Schema(
  {
    productId: String,
    name: String,
    flavor: String,
    size: String,
    quantity: { type: Number, min: 1 },
    price: Number,
  },
  { _id: false }
);
const OrderSchema = new Schema(
  {
    client: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    pickupDate: String,
    slot: String,
    mode: { type: String, enum: ["pickup", "delivery"], default: "pickup" },
    address: String,
    note: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
    },
    stripeSessionId: String,
    stripePaymentIntent: String,
  },
  { timestamps: true }
);
export type OrderDoc = InferSchemaType<typeof OrderSchema>;
export const Order: Model<OrderDoc> =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

// Settings
const SettingsSchema = new Schema(
  {
    brandName: { type: String, default: () => siteConfig.brand.name },
    brandTagline: { type: String, default: () => siteConfig.brand.tagline },
    heroTitle: { type: String, default: () => siteConfig.hero.defaultTitle },
    heroSubtitle: { type: String, default: () => siteConfig.hero.defaultSubtitle },
    heroImageUrl: { type: String, default: () => siteConfig.hero.defaultImageUrl },
    email: String,
    phone: String,
    zone: String,
    adminPassword: { type: String, required: true },
    slots: { type: [String], default: () => siteConfig.defaults.slots },
    openWeekdays: { type: [Number], default: () => siteConfig.defaults.openWeekdays },
    closedDates: { type: [String], default: [] },
    minDelay: { type: Number, default: () => siteConfig.defaults.minDelay },
    about: { type: String, default: "" },
    cgv: String,
    rgpd: String,
    cookiesPolicy: String,
  },
  { timestamps: true }
);
export type SettingsDoc = InferSchemaType<typeof SettingsSchema>;
export const Settings: Model<SettingsDoc> =
  mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
