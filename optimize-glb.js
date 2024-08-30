//npm install --save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf sharp
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { resample, prune, dedup, draco, textureCompress } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp'; // Node.js only

// Function to optimize a GLB file
async function optimizeGLB(inputPath, outputPath) {
    // Configure I/O with Draco compression support
    const io = new NodeIO()
        .registerExtensions(ALL_EXTENSIONS)
        .registerDependencies({
            'draco3d.decoder': await draco3d.createDecoderModule(),
            'draco3d.encoder': await draco3d.createEncoderModule(),
        });

    // Read the GLB file
    const document = await io.read(inputPath);

    // Apply transformations to optimize the GLB file
    await document.transform(
        // Losslessly resample animation frames
        resample(),
        // Remove unused nodes, textures, or other data
        prune(),
        // Remove duplicate vertex or texture data, if any
        dedup(),
        // Compress mesh geometry with Draco
        draco(),
        // Convert textures to WebP (requires Node.js)
        textureCompress({
            encoder: sharp,
            targetFormat: 'webp',
            resize: [1024, 1024], // Resize textures to 1024x1024, adjust as needed
        }),
        // Custom transform: enable/disable backface culling
        backfaceCulling({ cull: true })
    );

    // Write the optimized GLB to a new file
    await io.write(outputPath, document);
}

// Custom transform: enable/disable backface culling
function backfaceCulling(options) {
    return (document) => {
        for (const material of document.getRoot().listMaterials()) {
            material.setDoubleSided(!options.cull);
        }
    };
}


const inputPath = '../sourcepathtoGLB/item.glb';
const outputPath = '../outpath/item.glb';
optimizeGLB(inputPath, outputPath).then(() => {
    console.log('GLB optimization complete.');
}).catch((error) => {
    console.error('Error during GLB optimization:', error);
});
