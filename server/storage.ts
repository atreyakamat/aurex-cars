import { preorders, type InsertPreorder, type Preorder } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createPreorder(preorder: InsertPreorder): Promise<Preorder>;
}

export class DatabaseStorage implements IStorage {
  async createPreorder(insertPreorder: InsertPreorder): Promise<Preorder> {
    const [preorder] = await db.insert(preorders).values(insertPreorder).returning();
    return preorder;
  }
}

export const storage = new DatabaseStorage();
