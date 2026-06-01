import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http/driver";
import { categoriesTable } from "./db/schema";

dotenv.config({
  path: ".env.local",
});

const db = drizzle(process.env.DATABASE_URL!);

const categoriesSeedData: (typeof categoriesTable.$inferInsert)[] = [
  {
    name: "Salary",
    type: "income",
  },
  {
    name: "Rental Income",
    type: "income",
  },
  {
    name: "Business Income",
    type: "income",
  },
  {
    name: "Investments",
    type: "income",
  },
  {
    name: "Other",
    type: "income",
  },
  {
    name: "Housing",
    type: "expense",
  },
  {
    name: "Transport",
    type: "expense",
  },
  {
    name: "Food & Groceries",
    type: "expense",
  },
  {
    name: "Health",
    type: "expense",
  },
  {
    name: "Utilities",
    type: "expense",
  },
  {
    name: "Phone & Internet",
    type: "expense",
  },
  {
    name: "Extracurricular",
    type: "expense",
  },
  {
    name: "Miscellaneous",
    type: "expense",
  },
  {
    name: "Credit Card Payments",
    type: "expense",
  },
  { name: "Eating Out", type: "expense" },
  { name: "Loan Repayment", type: "expense" },
  {
    name: "Other",
    type: "expense",
  },
];

async function seed() {
  await db.insert(categoriesTable).values(categoriesSeedData);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
