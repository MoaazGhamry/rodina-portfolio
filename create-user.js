const admin = require("firebase-admin");
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth().createUser({
  email: "rodinarshviuals@gmail.com",
  password: "nono&dody1-10-23",
})
.then(() => {
  console.log("Successfully created new user");
  process.exit(0);
})
.catch((error) => {
  console.log("Error creating new user:", error);
  process.exit(1);
});
