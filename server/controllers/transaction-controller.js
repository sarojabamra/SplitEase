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

// Fetch transactions between two specific users
export const fetchTransactionsBetweenUsers = asyncHandler(
  async (request, response) => {
    const { userId1, userId2 } = request.params;

    console.log(
      "Fetching transactions between users:",
      userId1,
      "and",
      userId2
    );

    if (!userId1 || !userId2) {
      return response
        .status(400)
        .json({ message: "Both user IDs are required" });
    }

    try {
      const transactions = await Transaction.find({
        $or: [
          { from: userId1, to: userId2 },
          { from: userId2, to: userId1 },
        ],
      })
        .populate("from", "name username")
        .populate("to", "name username")
        .populate("expenseId", "description amount")
        .sort({ createdAt: -1 }); // Most recent first

      console.log("Found transactions:", transactions.length);

      // Format the transactions for the frontend
      const formattedTransactions = transactions.map((transaction) => {
        const isFromCurrentUser = transaction.from._id.toString() === userId1;

        return {
          id: transaction._id,
          type: transaction.description || "Transaction",
          amount: isFromCurrentUser ? -transaction.amount : transaction.amount,
          date: transaction.createdAt,
          description: transaction.description,
          expenseId: transaction.expenseId?._id,
          expenseDescription: transaction.expenseId?.description,
          expenseAmount: transaction.expenseId?.amount,
          fromUser: transaction.from,
          toUser: transaction.to,
        };
      });

      response.status(200).json(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions between users:", error);
      response
        .status(500)
        .json({ message: "Error fetching transactions between users." });
    }
  }
);
