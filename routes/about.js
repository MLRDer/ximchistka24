const express = require('express');
const router = express.Router();
const About = require('../models/About');
const multer = require('multer');
const fs = require('fs');
require('dotenv/config');

const admin_url = process.env.admin_url
const localhost = process.env.backend
const frontend = process.env.frontend

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		const type = file.originalname.split('.');
		cb(null, `${new Date().getTime()}.${type[type.length - 1]}`);
	}
});

const fileFilter = (req, file, cb) => {
	// reject a file
	cb(null, file.mimetype.includes('image'));
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

function deleteFile(path) {
	fs.stat(path, function (err, stats) {
		if (err) {
			return console.error(err);
		}

		fs.unlink(path, function (err) {
			if (err) {
				return console.log(err);
			}
		});
	});
}


router.get('/', async (req, res) => {
	try {
		const data = await About.findById('5fa81e341f39c03a2c756fc5');

		res.status(200).json(data);
	}
	catch (err) {
		res.status(400).json({
			success: true,
			message: err.message
		});
	}
});

router.post('/', async (req, res) => {
	try {
		const about = new About({
			title: req.body.title,
			body: req.body.body,
			address: req.body.address,
			email: req.body.email,
			phone1: req.body.phone1,
			phone2: req.body.phone2,
			instagram: req.body.instagram,
			telegram: req.body.telegram,
			facebook: req.body.facebook
		});

		const saved = await about.save();
		res.redirect(`http://ximchistka24.uz/${admin_url}`)
		// res.status(200).json(saved);
	}
	catch (err) {
		res.status(400).json({
			success: false,
			message: err.message
		});
	}
});

// Edit about//////////////////////////////////////////////////
router.get('/:id', async (req, res) => {
	try {
		const about = await About.findById('5fa81e341f39c03a2c756fc5');
		// res.status(200).json({
		// 	success: true,
		// 	message: "Xizmat muvaffaqiyatli o'chirildi!"
		// });
	}
	catch (err) {
		res.status(400).json({
			success: false,
			message: err.message
		});
	}
});

router.post('/:id', async (req, res) => {
	try {
		const about = await About.findByIdAndUpdate(req.params.id,
			{
				$set: {
					title: req.body.title,
					body: req.body.body,
					address: req.body.address,
					email: req.body.email,
					phone1: req.body.phone1,
					phone2: req.body.phone2,
				}
			}, { new: true }
		);

		const saved = await about.save();
		res.redirect(`http://ximchistka24.uz/${admin_url}`)
		// res.status(200).json(saved);
	}
	catch (err) {
		res.status(400).json({
			success: false,
			message: err.message
		});
	}
});


router.patch('/image', upload.single('image'), async (req, res) => {
	try {
		const about = await About.findById("5f9400e6d620c9193c5f1fd3");
		if (about.image) {
			deleteFile(about.image);
		}
		about.image = `uploads/${req.file.filename}`;
		const updated = await about.save();

		res.status(200).json(updated);
	}
	catch (err) {
		res.status(400).json({
			success: false,
			message: err.message
		});
	}
});


module.exports = router;
