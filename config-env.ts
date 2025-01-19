import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const targetLocations = ["./apps/latent-be/", "./packages/db/"];

async function duplicateEnv() {
  const sourceEnvPath = path.join(process.cwd(), ".env");

  try {
    if (!existsSync(sourceEnvPath)) {
      throw new Error("Source .env file not found");
    }

    const envContent = await fs.readFile(sourceEnvPath, "utf-8");

    for (const location of targetLocations) {
      try {
        const targetPath = path.join(process.cwd(), location);
        const targetEnvPath = path.join(targetPath, ".env");

        if (!existsSync(targetEnvPath)) {
          console.log(`Copying .env to ${location}`);
          await fs.mkdir(location, { recursive: true });
        }

        await fs.writeFile(targetEnvPath, envContent);
        console.log(`Successfully copied .env to ${location}`);
      } catch (error) {
        console.log(`Failed to copy .env to ${location}`, error);
      }
    }

    console.log("Copied .env to all target locations!");
  } catch (error) {
    console.error("Fatal Error: ", error);
    process.exit(1);
  }
}

duplicateEnv().catch(console.error);
