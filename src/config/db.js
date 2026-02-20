import { neon } from "@neondatabase/serverless";
import { ENV } from "./env.js";
// import { drizzle } from "drizzle-orm/singlestore/driver";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema.js";

const sql = neon(ENV.DATABASE_URL);
export const db = drizzle(sql, { schema });
