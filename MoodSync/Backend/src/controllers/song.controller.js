const songModel = require("../models/song.model");
const id3 = require("node-id3");
const storageService = require("../services/storage.service");

async function uploadSong(req,res){
    try {
        const songBuffer = req.file.buffer;
        const { mood } = req.body;
        const tags = id3.read(songBuffer) || {};
        
        const title = tags.title || req.file.originalname || "Untitled Song";

        const songUploadPromise = storageService.uploadFile(
            songBuffer,
            title + ".mp3",
            "songs"
        );

        let posterURL = "https://ik.imagekit.io/aadil/posters/default.jpeg"; // Default poster URL
        
        let posterUploadPromise = null;
        if (tags.image && tags.image.imageBuffer) {
            posterUploadPromise = storageService.uploadFile(
                tags.image.imageBuffer,
                title + ".jpeg",
                "posters"
            );
        }

        const [songFile, posterFile] = await Promise.all([
            songUploadPromise,
            posterUploadPromise
        ]);

        if (posterFile) {
            posterURL = posterFile.url;
        }

        const song = await songModel.create({
            title: title,
            url: songFile.url,
            posterURL: posterURL,
            mood,
            user: req.user.id
        });

        return res.status(201).json({
            message : "Song uploaded successfully",
            song
        })
        
    } catch (error) {
      console.log(error);
      res.status(500).json({message : "Internal Server Error"});  
    }
}

async function getAllSongs(req,res){
    try {
      const filter = { ...req.query, user: req.user.id };
      const songs = await songModel.find(filter);

      return res.status(200).json({
        message : "Songs fetched successfully",
        songs
      })
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports = {
    uploadSong,
    getAllSongs
}
