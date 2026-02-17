const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * List images from a specific folder in Cloudinary
 * @param {string} folder - The folder to list images from (default: 'img')
 * @returns {Promise<Array>} - List of image URLs
 */
const listImages = async (folder = 'img') => {
    try {
        // Use Asset Folder API (matches Cloudinary UI folders)
        const result = await cloudinary.api.resources_by_asset_folder(folder, {
            resource_type: 'image',
            max_results: 30
        });

        let images = result.resources.map(resource => ({
            id: resource.public_id,
            url: resource.secure_url,
            name: resource.filename || resource.public_id
        }));

        if (images.length === 0) {
            console.log(`[ImageService] No images found in '${folder}'. Returning empty list.`);
            return [];
        }

        return images;
    } catch (error) {
        console.error('Cloudinary List Error:', error);
        throw error;
    }
};

module.exports = {
    listImages
};
