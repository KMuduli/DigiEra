// DigitalEra - Upload Controller
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Image uploaded successfully.',
    url: imageUrl,
    filename: req.file.filename,
  });
};

module.exports = { uploadImage };
