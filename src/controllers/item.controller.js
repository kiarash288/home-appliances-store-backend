const itemService = require('../services/item.service');
const {
  ITEM_IMAGE_URL_PREFIX,
  cleanupUploadedFiles,
} = require('../middlewares/upload.middleware');

function getStatusCode(error) {
  const message = error.message || '';

  if (message.includes('not found')) {
    return 404;
  }

  return 500;
}

/**
 * Maps multer's parsed uploads (req.files) to the public URL paths the
 * service layer expects (`mainImage` string, `gallery` string array).
 */
function extractImagePaths(req) {
  const images = {};

  const mainImage = req.files?.mainImage?.[0];
  if (mainImage) {
    images.mainImage = `${ITEM_IMAGE_URL_PREFIX}/${mainImage.filename}`;
  }

  const galleryImages = req.files?.galleryImages;
  if (Array.isArray(galleryImages) && galleryImages.length > 0) {
    images.gallery = galleryImages.map(
      (file) => `${ITEM_IMAGE_URL_PREFIX}/${file.filename}`
    );
  }

  return images;
}

async function getAll(req, res) {
  try {
    const result = await itemService.getAllItems(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function getOne(req, res) {
  try {
    const item = await itemService.getItemById(req.params.id);
    return res.status(200).json(item);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const item = await itemService.createItem(
      { ...req.body, ...extractImagePaths(req) },
      req.user.id
    );
    return res.status(201).json(item);
  } catch (error) {
    // Business-rule failure (e.g. category not found): remove saved uploads
    await cleanupUploadedFiles(req);
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const item = await itemService.updateItem(req.params.id, {
      ...req.body,
      ...extractImagePaths(req),
    });
    return res.status(200).json(item);
  } catch (error) {
    await cleanupUploadedFiles(req);
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const result = await itemService.deleteItem(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(getStatusCode(error)).json({ message: error.message });
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
