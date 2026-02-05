const { onObjectFinalized } = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

const bucket = admin.storage().bucket();

/**
 * Storage Trigger: When an image is uploaded, generate a thumbnail.
 * Triggered for images in: products/, banners/, stores/, collections/
 */
exports.onImageUpload = onObjectFinalized(
  {
    region: "asia-south1",
    bucket: "dp-jewellers-af660.firebasestorage.app",
  },
  async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;

    // Only process images
    if (!contentType || !contentType.startsWith("image/")) {
      console.log("Not an image, skipping.");
      return;
    }

    // Skip if already a thumbnail
    const fileName = path.basename(filePath);
    if (fileName.startsWith("thumb_")) {
      console.log("Already a thumbnail, skipping.");
      return;
    }

    // Only process images in known paths
    const validPrefixes = ["products/", "banners/", "stores/", "collections/"];
    const isValidPath = validPrefixes.some((prefix) => filePath.startsWith(prefix));
    if (!isValidPath) {
      console.log(`Skipping file outside known paths: ${filePath}`);
      return;
    }

    console.log(`Processing image: ${filePath}`);

    const fileDir = path.dirname(filePath);
    const fileExtension = path.extname(filePath);
    const fileNameWithoutExt = path.basename(filePath, fileExtension);

    // Thumbnail path
    const thumbFileName = `thumb_${fileNameWithoutExt}${fileExtension}`;
    const thumbFilePath = path.join(fileDir, thumbFileName);

    // Download original to temp
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const tempThumbPath = path.join(os.tmpdir(), thumbFileName);

    try {
      await bucket.file(filePath).download({ destination: tempFilePath });

      // Generate thumbnail (300x300, maintain aspect ratio)
      await sharp(tempFilePath)
        .resize(300, 300, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(tempThumbPath);

      // Upload thumbnail
      await bucket.upload(tempThumbPath, {
        destination: thumbFilePath,
        metadata: {
          contentType: "image/jpeg",
          metadata: {
            originalFile: filePath,
            isThumb: "true",
          },
        },
      });

      console.log(`Thumbnail created: ${thumbFilePath}`);

      // Clean up temp files
      fs.unlinkSync(tempFilePath);
      fs.unlinkSync(tempThumbPath);
    } catch (error) {
      console.error("Error processing image:", error);
      // Clean up temp files on error
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      if (fs.existsSync(tempThumbPath)) fs.unlinkSync(tempThumbPath);
    }
  }
);
