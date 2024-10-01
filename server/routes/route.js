import express from "express";
import {
  forgotPassword,
  getAllUsers,
  getUserById,
  resetPassword,
  signinUser,
  signupUser,
  userLogout,
  verifyUser,
} from "../controllers/user-controller.js";
import {
  accessChat,
  addToGroup,
  createGroup,
  fetchChats,
  removefromGroup,
  renameGroup,
} from "../controllers/chat-controller.js";
import { allMessages, sendMessage } from "../controllers/message-controller.js";
import {
  addExpense,
  fetchExpenses,
  fetchTotalOwedToYou,
  fetchTotalYouOwe,
  fetchUsersWhoOweYou,
  fetchUsersYouOwe,
} from "../controllers/expense-controller.js";
import {
  fetchTransactions,
  recordTransaction,
} from "../controllers/transaction-controller.js";

const router = express.Router();

//Authentication Signin/Signup routes
router.post("/auth/signup", signupUser);
router.post("/auth/signin", signinUser);
router.post("/auth/forgotPassword", forgotPassword);
router.post("/auth/resetPassword", resetPassword);
router.put("/auth/logout", userLogout);

//Users
router.get("/getAllUsers", verifyUser, getAllUsers);
router.get("/getUserById", verifyUser, getUserById);

//Chat/Group routes
router.post("/chat", verifyUser, accessChat);
router.get("/chat/fetch", verifyUser, fetchChats);
router.post("/group", verifyUser, createGroup);
router.put("/group/rename", verifyUser, renameGroup);
router.put("/group/remove", verifyUser, removefromGroup);
router.put("/group/add", verifyUser, addToGroup);

//Message routes
router.post("/message/send", verifyUser, sendMessage);
router.get("/message/:chatId", verifyUser, allMessages);

//Expenses
router.post("/expense/add", verifyUser, addExpense);
router.get("/expense/get/:id", verifyUser, fetchExpenses);
router.get("/expense/fetchUsersWhoOweYou/:id", verifyUser, fetchUsersWhoOweYou);
router.get("/expense/fetchUsersYouOwe/:id", verifyUser, fetchUsersYouOwe);
router.get("/expense/totalYouOwe/:id", verifyUser, fetchTotalYouOwe);
router.get("/expense/totalOwedToYou/:id", verifyUser, fetchTotalOwedToYou);

//Transactions
router.post("/transaction/record", verifyUser, recordTransaction);
router.get("/transaction/fetch", verifyUser, fetchTransactions);

export default router;
