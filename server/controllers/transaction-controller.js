import asyncHandler from "express-async-handler";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

// Fetch Transactions

// Record Transaction
export const recordTransaction = asyncHandler(async (request, response) => {
  const { from, to, amount, description } = request.body;

  if (!from || !to || !amount || !description) {
    return response.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create the transaction
    const transaction = new Transaction({
      from,
      to,
      amount,
      description,
    });

    const createdTransaction = await transaction.save();

    // Update user balances
    /*await User.findByIdAndUpdate(from, {
      $inc: {
        "balance.totalBalance": -amount,
        "balance.totalOwedByYou": amount,
      },
    });

    await User.findByIdAndUpdate(to, {
      $inc: {
        "balance.totalBalance": amount,
        "balance.totalOwedToYou": amount,
      },
    });*/

    response.status(201).json(createdTransaction);
  } catch (error) {
    console.error("Error recording transaction:", error);
    response.status(500).json({ message: "Error recording transaction." });
  }
});

export const fetchTransactions = asyncHandler(async (request, response) => {
  const { userId } = request.params;

  const transactions = await Transaction.find({
    $or: [{ from: userId }, { to: userId }],
  })
    .populate("from", "name")
    .populate("to", "name")
    .populate("expenseId", "description");

  response.status(200).json(transactions);
});
