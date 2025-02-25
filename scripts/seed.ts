import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { format, subDays, eachDayOfInterval } from "date-fns";

import { categories, accounts, transactions } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Connect to Neon
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Example user ID for the data
const SEED_USER_ID = "user_2tS328J4Hp2iU4xCDVA0Hxebk1a";

// Categories to seed
const SEED_CATEGORIES = [
  { id: "category_1", name: "Food", userId: SEED_USER_ID, plaidId: null },
  { id: "category_2", name: "Rent", userId: SEED_USER_ID, plaidId: null },
  { id: "category_3", name: "Utilities", userId: SEED_USER_ID, plaidId: null },
  { id: "category_4", name: "Transportation", userId: SEED_USER_ID, plaidId: null },
  { id: "category_5", name: "Health", userId: SEED_USER_ID, plaidId: null },
  { id: "category_6", name: "Entertainment", userId: SEED_USER_ID, plaidId: null },
  { id: "category_7", name: "Clothing", userId: SEED_USER_ID, plaidId: null },
  { id: "category_8", name: "Miscellaneous", userId: SEED_USER_ID, plaidId: null },
];

// Accounts to seed
const SEED_ACCOUNTS = [
  { id: "account_1", name: "Checking", userId: SEED_USER_ID, plaidId: null },
  { id: "account_2", name: "Savings", userId: SEED_USER_ID, plaidId: null },
];

// We'll push generated transactions into this array
const SEED_TRANSACTIONS: Array<{
  id?: string;
  date: Date | string;
  accountId: string;
  categoryId: string;
  payee: string;
  amount: number;
  notes?: string;
  userId: string;
}> = [];

// Define the 90-day range
const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

/**
 * Generate a random amount in lakhs (1 Lakh = 100,000).
 * Below are sample ranges for each category:
 * - Rent: 1L to 5L
 * - Utilities: 1L to 3L
 * - Food: 1L to 2L
 * - Transportation: 1L to 3L
 * - Health: 1L to 4L
 * - Entertainment: 1L to 4L
 * - Clothing: 1L to 2L
 * - Miscellaneous: 1L to 2L
 */
const generateRandomAmount = (category: { name: string }): number => {
  switch (category.name) {
    case "Rent":
      // 100,000 - 500,000
      return Math.random() * 400000 + 100000;
    case "Utilities":
      // 100,000 - 300,000
      return Math.random() * 200000 + 100000;
    case "Food":
      // 100,000 - 200,000
      return Math.random() * 100000 + 100000;
    case "Transportation":
      // 100,000 - 300,000
      return Math.random() * 200000 + 100000;
    case "Health":
      // 100,000 - 400,000
      return Math.random() * 300000 + 100000;
    case "Entertainment":
      // 100,000 - 400,000
      return Math.random() * 300000 + 100000;
    case "Clothing":
      // 100,000 - 200,000
      return Math.random() * 100000 + 100000;
    case "Miscellaneous":
      // 100,000 - 200,000
      return Math.random() * 100000 + 100000;
    default:
      // 100,000 - 200,000
      return Math.random() * 100000 + 100000;
  }
};

/** Generate transactions for a single day. */
const generateTransactionsForDay = (day: Date) => {
  // Randomly pick how many transactions to create for this day (1-4)
  const numTransactions = Math.floor(Math.random() * 4) + 1;

  for (let i = 0; i < numTransactions; i++) {
    const category =
      SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
    // 60% chance of expense
    const isExpense = Math.random() > 0.6;

    const rawAmount = generateRandomAmount(category);
    // Convert to negative if expense, then to miliunits
    const finalAmount = convertAmountToMiliunits(isExpense ? -rawAmount : rawAmount);

    SEED_TRANSACTIONS.push({
      // e.g. transaction_2025-02-25_1
      id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
      date: day, // If your DB schema uses TIMESTAMP, store a Date
      accountId: SEED_ACCOUNTS[0].id, // Always use the first account for simplicity
      categoryId: category.id,
      payee: "Merchant",
      amount: finalAmount,
      notes: "Random transaction",
      userId: SEED_USER_ID,
    });
  }
};

/** Generate transactions across the entire 90-day range. */
const generateTransactions = () => {
  const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
  days.forEach((day) => generateTransactionsForDay(day));
};

// Pre-generate transactions before the main function
generateTransactions();

/** Main seeding function. */
async function main() {
  try {
    // 1. Clear existing data
    await db.delete(transactions).execute();
    await db.delete(accounts).execute();
    await db.delete(categories).execute();

    // 2. Insert categories
    await db.insert(categories).values(SEED_CATEGORIES).execute();

    // 3. Insert accounts
    await db.insert(accounts).values(SEED_ACCOUNTS).execute();

    // 4. Insert transactions
    await db.insert(transactions).values(SEED_TRANSACTIONS).execute();

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seed:", error);
    process.exit(1);
  }
}

// Run the seeding script
main();
