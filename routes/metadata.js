const express = require("express");
const router = express.Router();
const Metadata = require("../models/Metadata");
const { ethers } = require("ethers");
const ERC721_ABI = require("../contracts/ERC721.json");
const CacheService = require("../cache");

const ttl = 30; //cache for 30 seconds by default, overriden to 0 (unlimited) for getById below;
const cache = new CacheService(ttl);

const provider = new ethers.providers.JsonRpcProvider(
	process.env.ETHEREUM_RPC_URL
);
const erc721Contract = new ethers.Contract(
	process.env.CONTRACT_ADDRESS,
	ERC721_ABI.abi,
	provider
);

router.get("/", async (req, res) => {
	const totalSupply = await cache.get("TotalSupply", async () => {
		try {
			const supply = await erc721Contract.totalSupply();
			return supply.toNumber();
		} catch (err) {
			return err;
		}
	});

	try {
		const metadatas = await Metadata.find();
		res.json(metadatas);
	} catch (err) {
		res.json({ message: err });
	}
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	const exists = await cache.get(
		`Token_${id}`,
		async () => {
			try {
				await erc721Contract.ownerOf(id);
				return true;
			} catch (err) {
				return false;
			}
		},
		0
	);

	if (exists) {
		try {
			const metadata = await Metadata.findOne({ tokenId: id });

			res.json(metadata);
		} catch (err) {
			res.json({ message: err });
		}
	} else {
		res.json({ error: `Token ${id} doesn't exist` });
	}
});

router.post("/", async (req, res) => {
	const metadata = new Metadata({
		tokenId: req.body.tokenId,
		description: req.body.description,
		image: req.body.image,
		age: req.body.age,
	});

	try {
		const result = await metadata.save();
		res.status(200).json(result);
	} catch (err) {
		res.status(400).json({ message: err });
	}
});

router.put("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const metadata = await Metadata.findOneAndUpdate(
			{ tokenId: id },
			req.body,
			{ new: true }
		);
		res.json(metadata);
	} catch (err) {
		res.json({ message: err });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const removed = await Metadata.deleteOne({ tokenId: req.params.id });
		res.json(removed);
	} catch (err) {
		res.json({ message: error });
	}
});

module.exports = router;
