import { slugify } from "../../shared/utils/slugify";
import { tables, useDB } from "../utils/db";

async function seed() {
  const db = useDB();
  console.info("🌱 Seeding database...");

  // Seed brands
  console.info("Seeding brands...");
  const brandsData = [
    { name: "Dainese" },
    { name: "Oxford" },
    { name: "Alpinestars" },
    { name: "Bell Helmets" },
    { name: "REV'IT!" },
    { name: "Scorpion" },
    { name: "Icon" },
    { name: "Shoei" },
    { name: "Arai" },
    { name: "Klim" },
    { name: "RST" },
    { name: "Spidi" },
  ];

  for (const brand of brandsData) {
    await db
      .insert(tables.brands)
      .values({ ...brand, slug: slugify(brand.name) })
      .onConflictDoNothing({ target: tables.brands.slug });
  }

  // Seed categories
  console.info("Seeding categories...");
  const categoriesData = [
    { slug: "riding-gear", name: "Riding Gear", parent: null },
    { name: "Helmets", parent: "riding-gear" },
    { name: "Jackets", parent: "riding-gear" },
    { name: "Shirts", parent: "riding-gear" },
    { name: "Gloves", parent: "riding-gear" },
    { name: "Pants", parent: "riding-gear" },
    { name: "Boots", parent: "riding-gear" },
    { slug: "accessories", name: "Accessories", parent: null },
    { name: "Tools", parent: "accessories" },
    { slug: "luggage", name: "Luggage", parent: "accessories" },
    { name: "Tank Bags", parent: "luggage" },
    { name: "Backpacks", parent: "luggage" },
  ];

  for (const category of categoriesData) {
    await db
      .insert(tables.categories)
      .values({
        ...category,
        slug: slugify(category.name),
        parent: category.parent ? slugify(category.parent) : null,
      })
      .onConflictDoNothing({ target: tables.categories.slug });
  }

  // Seed items
  console.info("Seeding items...");
  const itemsData = [
    {
      name: "Dainese Avro 4 Leather Jacket",
      brand: "dainese",
      category: "jackets",
    },
    {
      name: "Dainese Cool Dry Long Sleeve Shirt",
      brand: "dainese",
      category: "shirts",
    },
    {
      name: "Oxford Aqua B25 Backpack",
      brand: "oxford",
      category: "luggage",
    },
    {
      name: "Alpinestars SMX-6 V2 Boots",
      brand: "alpinestars",
      category: "boots",
    },
    {
      name: "Bell Star MIPS Helmet",
      brand: "bell",
      category: "helmets",
    },
    {
      name: "Bell Qualifier Helmet",
      brand: "bell",
      category: "helmets",
    },
    {
      name: "REV'IT! Sand 4 H2O Jacket",
      brand: "revit",
      category: "jackets",
    },
    {
      name: "Scorpion EXO-R1 Air Helmet",
      brand: "scorpion",
      category: "helmets",
    },
    {
      name: "Icon Mesh AF Jacket",
      brand: "icon",
      category: "jackets",
    },
    {
      name: "Shoei RF-1400 Helmet",
      brand: "shoei",
      category: "helmets",
    },
    {
      name: "Arai Defiant-X Helmet",
      brand: "arai",
      category: "helmets",
    },
    {
      name: "Klim Badlands Pro Pants",
      brand: "klim",
      category: "pants",
    },
    {
      name: "RST GT CE Leather Gloves",
      brand: "rst",
      category: "gloves",
    },
    {
      name: "Spidi TX Touring Boots",
      brand: "spidi",
      category: "boots",
    },
    {
      name: "Dainese Carbon 3 Gloves",
      brand: "dainese",
      category: "gloves",
    },
    {
      name: "REV'IT! Argo Backpack",
      brand: "revit",
      category: "backpacks",
    },
    {
      name: "Oxford Toolkit Pro",
      brand: "oxford",
      category: "tools",
    },
    {
      name: "Alpinestars Bionic Action Chest Protector",
      brand: "alpinestars",
      category: "accessories",
    },
  ];

  for (const item of itemsData) {
    await db
      .insert(tables.items)
      .values({ ...item, slug: slugify(item.name) })
      .onConflictDoNothing({ target: tables.items.slug });
  }

  console.info("✅ Seeding complete!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
});

export default seed;
