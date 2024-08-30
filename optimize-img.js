import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Function to compress and optimize an image
async function compressImage(inputPath, outputPath, options = {}) {
    try {
        const image = sharp(inputPath);

        // Apply optional resizing
        if (options.resize) {
            image.resize(options.resize.width, options.resize.height);
        }

        // Convert to WebP and apply compression settings
        image.webp({
            quality: options.quality || 80, // Set the quality of the output WebP (default: 80)
            lossless: options.lossless || false, // Whether to use lossless compression (default: false)
        });

        // Write the output file
        await image.toFile(outputPath);
        console.log(`Image optimization complete: ${outputPath}`);
    } catch (error) {
        console.error('Error during image compression:', error);
    }
}

// Compress all images in a directory
async function compressImagesInDirectory(inputDir, outputDir, options = {}) {
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    const files = fs.readdirSync(inputDir);

    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, `${path.parse(file).name}.webp`);

        await compressImage(inputPath, outputPath, options);
    }
}

// Example usage
const inputDir = '../assets/images/unopt';
const outputDir = '../assets/images/optimized';

// Options for compression
const options = {
    resize: { width: 7360, height: 4912 }, // Resize images to 1024x1024
    quality: 80, // Set WebP quality to 80
    lossless: false, // Use lossy compression
};

compressImagesInDirectory(inputDir, outputDir, options);
