import { db } from "./config/db.js";
import { users } from "./models/schema.js";

async function main() {
  console.log("Seeding database...");

  await db
    .insert(users)
    .values({
      email: "ranjit@mailinator.com",
      password: "hashed_password_placeholder",
    })
    .onConflictDoNothing();

  console.log("Seeding complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
