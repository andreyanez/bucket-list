const { Router } = require('express');
const BucketListItem = require('../../models/BucketListItem.js');

const router = Router();

router.get('/', async (req, res) => {
	try {
		const getBucketListItems = await BucketListItem.find();
		if (!getBucketListItems) throw new Error('No bucket items');
		const sorted = getBucketListItems.sort((a, b) => {
			return new Date(a.date).getTime() - new Date(b.date).getTime();
		});
		res.status(200).json(sorted);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/', async (req, res) => {
	const newBucketListItem = new BucketListItem(req.body);
	try {
		const savedBucketListItem = await newBucketListItem.save();
		if (!savedBucketListItem)
			throw new Error('Something went wrong saving your data');
		res.status(200).json(savedBucketListItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const response = await BucketListItem.findByIdAndUpdate(id, req.body);
		if (!response) throw Error('Something went wrong updating the data');
		// we return the updated item, probably so we can show it changed on the client
		const updatedItem = { ...response._doc, ...req.body };
		res.status(200).json(updatedItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const removedMessage = await BucketListItem.findByIdAndDelete(id);
		if (!removedMessage) throw Error('Something went wrong erasing the data');
		res.status(200).json(removedMessage);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
