import { drizzle } from 'drizzle-orm/neon-http';

let dbClient: ReturnType<typeof drizzle> | null = null;

export function getDb() {
	if (!dbClient) {
		const databaseUrl = process.env.DATABASE_URL;

		if (!databaseUrl) {
			throw new Error("DATABASE_URL is not set.");
		}

		dbClient = drizzle(databaseUrl);
	}

	return dbClient;
}



