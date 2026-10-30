import "dotenv/config";
import { createApp } from "./app.js";
import { openDatabase } from "./database/connection.js";
import { runMigrations } from "./database/migrate.js";

const PORT = Number(process.env.PORT ?? 3000);

const database = openDatabase();

try {
  runMigrations(database);
} catch (error) {
  database.close();
  throw error;
}

const app = createApp(database);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`BFF executando na porta ${PORT}`);
});
