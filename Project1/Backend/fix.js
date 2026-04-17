require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const postModel = require("./src/models/post.model");
const userModel = require("./src/models/user.model");

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await userModel.findOne();
        if (user) {
            const result = await postModel.updateMany({}, { $set: { user: user._id } });
            console.log(`Updated ${result.modifiedCount} posts to belong to User: ${user.username}`);
        } else {
            console.log("No users found.");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fix();
