import { useDB, tables } from "../utils/db";

async function seed() {
  const db = useDB();
  console.log("🌱 Seeding database...");

  // Seed roles
  console.log("Seeding roles...");
  const rolesData = [
    { slug: "admin", name: "Administrator" },
    { slug: "user", name: "User" },
  ];

  for (const role of rolesData) {
    await db
      .insert(tables.roles)
      .values(role)
      .onConflictDoNothing({ target: tables.roles.slug });
  }

  // Seed users
  console.log("Seeding users...");
  const usersData = [
    { email: "me@aidhan.net", name: "Aidhan", role: "admin" },
    { email: "jimmy@example.com", name: "Jimmy", role: "user" },
    { email: "sara@example.com", name: "Sara", role: "user" },
  ];

  for (const user of usersData) {
    await db
      .insert(tables.users)
      .values(user)
      .onConflictDoNothing({ target: tables.users.email });
  }

  // Seed brands
  console.log("Seeding brands...");
  const brandsData = [
    { slug: "dainese", name: "Dainese" },
    { slug: "oxford", name: "Oxford" },
    { slug: "alpinestars", name: "Alpinestars" },
    { slug: "bell", name: "Bell Helmets" },
  ];

  for (const brand of brandsData) {
    await db
      .insert(tables.brands)
      .values(brand)
      .onConflictDoNothing({ target: tables.brands.slug });
  }

  // Seed items
  console.log("Seeding items...");
  const itemsData = [
    {
      slug: "dainese-avro-4-leather-jacket",
      name: "Dainese Avro 4 Leather Jacket",
      brand: "dainese",
    },
    {
      slug: "dainese-cool-dry-long-sleeve-shirt",
      name: "Dainese Cool Dry Long Sleeve Shirt",
      brand: "dainese",
    },
    {
      slug: "Oxford-aqua-b25-backpack",
      name: "Oxford Aqua B25 Backpack",
      brand: "oxford",
    },
    {
      slug: "alpinestars smx-6-v2-boots",
      name: "Alpinestars SMX-6 V2 Boots",
      brand: "alpinestars",
    },
    {
      slug: "bell-star-mips-helmet",
      name: "Bell Star MIPS Helmet",
      brand: "bell",
    },
    {
      slug: "bell-qualifier-helmet",
      name: "Bell Qualifier Helmet",
      brand: "bell",
    },
  ];

  for (const item of itemsData) {
    await db
      .insert(tables.items)
      .values(item)
      .onConflictDoNothing({ target: tables.items.slug });
  }

  console.log("✅ Seeding complete!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
});

export default seed;
