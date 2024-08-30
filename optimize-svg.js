import { optimize } from 'svgo';  //npm install svgo
import fs from 'fs';
import path from 'path';

// Function to compress an SVG file
async function compressSVG(inputPath, outputPath) {
    try {
        const svgData = fs.readFileSync(inputPath, 'utf8');
        
        const result = optimize(svgData, {
            path: inputPath,
            multipass: true, // Enables multiple optimization passes
            plugins: [
                'removeDimensions',  // Removes width and height attributes
                'removeAttrs',       // Removes unnecessary attributes
                'removeComments',    // Removes comments
                'removeMetadata',    // Removes <metadata>
                'removeTitle',       // Removes <title>
                'convertColors',     // Converts colors to shorter form
                'removeStyleElement' // Removes <style> elements
            ]
        });

        fs.writeFileSync(outputPath, result.data, 'utf8');
        console.log(`SVG optimization complete: ${outputPath}`);
    } catch (error) {
        console.error('Error during SVG compression:', error);
    }
}

// Compress all SVG files in a directory
async function compressSVGsInDirectory(inputDir, outputDir) {
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    const files = fs.readdirSync(inputDir);

    for (const file of files) {
        if (path.extname(file) === '.svg') {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file);

            await compressSVG(inputPath, outputPath);
        }
    }
}

// Example usage
const inputDir = 'path/to/your/svgs';
const outputDir = 'path/to/output_svgs';

compressSVGsInDirectory(inputDir, outputDir);
