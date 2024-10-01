import asyncHandler from "express-async-handler";
import Expense from "../models/expense.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

// Add Expense
export const addExpense = asyncHandler(async (request, response) => {
  const { description, amount, paidBy, splitWith } = request.body;

  if (
    !description ||
    !amount ||
    !paidBy ||
    !splitWith ||
    splitWith.length === 0
  ) {
    return response.status(400).json({ message: "All fields are required" });
  }

  const expense = new Expense({
    description,
    amount,
    paidBy,
    splitWith,
  });

  const createdExpense = await expense.save();

  // Update balances and create transactions
  for (let split of splitWith) {
    await User.findByIdAndUpdate(split.user, {
      $inc: {
        "balance.totalBalance": -split.amount,
      },
      $push: {
        "balance.totalOwedByYou": { user: paidBy, amount: split.amount },
      },
    });

    await User.findByIdAndUpdate(paidBy, {
      $inc: {
        "balance.totalBalance": split.amount,
      },
      $push: {
        "balance.totalOwedToYou": { user: split.user, amount: split.amount },
      },
    });

    const transaction = new Transaction({
      from: split.user,
      to: paidBy,
      amount: split.amount,
      description: `Split of ${description}`,
      expenseId: createdExpense._id,
    });

    await transaction.save();
  }

  response.status(200).json(createdExpense);
});

// Fetch Expenses
export const fetchExpenses = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({ message: "User ID is required" });
  }

  try {
    const expenses = await Expense.find({
      $or: [{ paidBy: id }, { "splitWith.user": id }],
    })
      .populate("paidBy", "name")
      .populate("splitWith.user", "name");

    response.status(200).json(expenses);
  } catch (error) {
    response.status(500).json({ message: "Error fetching expenses", error });
  }
});

// Fetch Users Who Owe You Money
export const fetchUsersWhoOweYou = asyncHandler(async (request, response) => {
  const { id } = request.params;

  try {
    const user = await User.findById(id)
      .populate({
        path: "balance.totalOwedToYou.user",
        select: "name",
      })
      .select("balance.totalOwedToYou");

    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }

    let totalOwedToYou = 0;
    const usersOwingYouMap = new Map();

    user.balance.totalOwedToYou.forEach((entry) => {
      totalOwedToYou += entry.amount;

      const userId = entry.user._id.toString();
      if (!usersOwingYouMap.has(userId)) {
        usersOwingYouMap.set(userId, {
          user: {
            _id: entry.user._id,
            name: entry.user.name,
          },
          amount: entry.amount,
        });
      } else {
        usersOwingYouMap.get(userId).amount += entry.amount;
      }
    });

    const usersOwingYou = Array.from(usersOwingYouMap.values());

    response.status(200).json({ users: usersOwingYou, totalOwedToYou });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error fetching users who owe you money", error });
  }
});

// Fetch Users You Owe Money To
export const fetchUsersYouOwe = asyncHandler(async (request, response) => {
  const { id } = request.params;

  try {
    const user = await User.findById(id)
      .populate({
        path: "balance.totalOwedByYou.user",
        select: "name",
      })
      .select("balance.totalOwedByYou");

    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }

    let totalOwedByYou = 0;
    const usersYouOweMap = new Map();

    user.balance.totalOwedByYou.forEach((entry) => {
      totalOwedByYou += entry.amount;

      const userId = entry.user._id.toString();
      if (!usersYouOweMap.has(userId)) {
        usersYouOweMap.set(userId, {
          user: {
            _id: entry.user._id,
            name: entry.user.name,
          },
          amount: entry.amount,
        });
      } else {
        usersYouOweMap.get(userId).amount += entry.amount;
      }
    });

    const usersYouOwe = Array.from(usersYouOweMap.values());

    response.status(200).json({ users: usersYouOwe, totalOwedByYou });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error fetching users you owe money to", error });
  }
});

// Fetch Total Owed To You
export const fetchTotalOwedToYou = asyncHandler(async (request, response) => {
  const { id } = request.params;

  try {
    const user = await User.findById(id).select("balance.totalOwedToYou");

    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }

    let totalOwedToYou = 0;

    // Aggregate total amount owed to 'id' across all users
    user.balance.totalOwedToYou.forEach((entry) => {
      totalOwedToYou += entry.amount;
    });

    response.status(200).json({ totalOwedToYou });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error fetching total owed to you", error });
  }
});

// Fetch Total You Owe
export const fetchTotalYouOwe = asyncHandler(async (request, response) => {
  const { id } = request.params;

  try {
    const user = await User.findById(id).select("balance.totalOwedByYou");

    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }

    let totalOwedByYou = 0;

    // Aggregate total amount owed by 'id' across all users
    user.balance.totalOwedByYou.forEach((entry) => {
      totalOwedByYou += entry.amount;
    });

    response.status(200).json({ totalOwedByYou });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error fetching total you owe", error });
  }
});
