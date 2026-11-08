// Node.js এর বিল্ট-ইন crypto মডিউল (কোনো সার্ভার বা থার্ড পার্টি প্যাকেজ লাগবে না)
const crypto = require("crypto");

const password = "mySecretPassword123ef";

// SHA-256 দিয়ে হ্যাশ তৈরি
const hash1 = crypto.createHash("sha256","57ee6f3224e75bfdd3e").update(password).digest("hex");
console.log("Original Password :", password);
console.log("Hashed Output     :", hash1);


