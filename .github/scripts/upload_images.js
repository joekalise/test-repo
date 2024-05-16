const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const imagesDirectory = './images';

// Helper function to get base64 prefix based on file type
const getBase64Prefix = (fileName) => {
  const fileExtension = path.extname(fileName).toLowerCase();
  switch (fileExtension) {
    case '.png':
      return 'data:image/png;base64,';
    case '.jpg':
    case '.jpeg':
      return 'data:image/jpeg;base64,';
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
};

const uploadImages = async (changedFiles) => {
  console.log("Starting uploadImages function");

  const images = changedFiles.split('\n').filter(Boolean);
  console.log(`Found changed images: ${images.join(',')}`);

  if (images.length === 0) {
    console.log("No new or changed images found to upload.");
    return;
  }

  for (const image of images) {
    console.log(`Processing image: ${image}`);
    const imagePath = path.join(image);

    let imageData;
    try {
      // Read image and add base64 prefix
      imageData = fs.readFileSync(imagePath).toString('base64');
      const base64Prefix = getBase64Prefix(image);
      imageData = `${base64Prefix}${imageData}`;
      console.log(`Successfully read and encoded image: ${image}`);
    } catch (err) {
      console.error(`Failed to read or encode image ${image}:`, err);
      continue; // Skip this image and continue with the next one
    }

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-Api-Token': process.env.LOKALISE_API_TOKEN
      },
      body: JSON.stringify({
        screenshots: [
          {
            ocr: true,
            data: imageData,
            title: path.basename(image)
          }
        ]
      })
    };

    try {
      console.log(`Attempting to upload image: ${image}`);
      const response = await fetch('https://api.lokalise.com/api2/projects/2901816966436c8ba73ff3.12518449/screenshots', options);
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Upload failed with status ${response.status}: ${errorDetails}`);
      }
      const json = await response.json();
      console.log(`Successfully uploaded image: ${image}`, json);
    } catch (err) {
      console.error(`Failed to upload ${image}:`, err);
    }
  }
};

// Getting the list of changed files from process arguments
const changedFiles = process.argv[2];
uploadImages(changedFiles).catch(error => {
  console.error('Unexpected error during uploadImages execution:', error);
  process.exit(1); // Ensure non-zero exit code on error
});
