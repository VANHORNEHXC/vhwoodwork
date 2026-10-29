import { loadEnvConfig } from "@next/env";
import { seedDatabase } from "../src/db/seed";

loadEnvConfig(process.cwd());
seedDatabase().then(() => console.log("Catalog seed complete")).catch((error) => {
  console.error("Catalog seed failed", error);
  process.exitCode = 1;
});
