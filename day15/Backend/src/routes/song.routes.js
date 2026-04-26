const express = require("express");
const upload = require("../middlewares/upload.middleware");
const songController = require("../controllers/song.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authUser, upload.single("song"), songController.uploadSong);

router.get("/", authUser, songController.getAllSongs);


module.exports = router;
