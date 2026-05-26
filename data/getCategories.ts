import "server-only";
import { getDb } from "@/db";
import { categoriesTable } from "@/db/schema";

export async function getCategories() {
    const db = getDb();
    const categories = await db.select().from(categoriesTable);
    return categories;
}