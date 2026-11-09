const jwt = require("jsonwebtoken");

// ক্লায়েন্ট বা হেডার থেকে সাধারণত "Bearer <token>" আকারে আসে
const authHeader =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFSS08iLCJpYXQiOjE3OTQyMTcyOTcsImV4cCI6MTc5NDIyMDg5N30.BbmOkF6G9wfSLwPy0uFFOfj-h8xPWj-hnDPJM7gGiJI";

// 'Bearer ' বাদ দিয়ে শুধু আসল টোকেনটি আলাদা (split) করা
const token = authHeader.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : authHeader;

// টোকেন ডিকোড করা
const decoded = jwt.decode(token);

console.log("Extracted Token:", token);
console.log("\nDecoded Data:", decoded);
