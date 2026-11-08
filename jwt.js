const jwt = require("jsonwebtoken");

// ১. সিক্রেট কি (যেকোনো গোপন পাসওয়ার্ড বা স্ট্রিং)
const SECRET_KEY = "my_secret_key_123";

// ২. ইউজারের তথ্য (Payload - যা টোকেনের ভেতর রাখতে চান)
const user = {
  id: 101,
  userName: "Aftab",
  role: "admin",
};

// ==========================================
// ৩. টোকেন তৈরি করা (jwt.sign)
// ==========================================
const token = jwt.sign(user, SECRET_KEY, {
  expiresIn: "1h", // টোকেনের মেয়াদ ১ ঘণ্টা
});

console.log("-----------------------------------------");
console.log("১. তৈরি হওয়া JWT Token:\n");
console.log(token);
console.log("-----------------------------------------\n");

// ==========================================
// ৪. টোকেন চেক / ভেরিফাই করা (jwt.verify)
// ==========================================
jwt.verify(token, SECRET_KEY, (err, decoded) => {
  if (err) {
    console.log("❌ টোকেন সঠিক নয় অথবা মেয়াদ শেষ!");
  } else {
    console.log("২. টোকেন ভেরিফাই করে পাওয়া আসল তথ্য:\n");
    console.log(decoded);
    console.log("-----------------------------------------");
  }
});
