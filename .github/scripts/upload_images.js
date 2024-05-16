const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const imagesDirectory = './images';

const uploadImages = async () => {
  const images = fs.readdirSync(imagesDirectory).filter(file => /\.(png|jpg|jpeg)$/i.test(file));

  if (images.length === 0) {
    console.log("No images found to upload.");
    return;
  }

  for (const image of images) {
    const imagePath = path.join(imagesDirectory, image);
    const imageData = fs.readFileSync(imagePath).toString('base64'); // Convert image to base64

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
            title: image
          }
        ]
      })
    };

    try {
      console.log(`Uploading image: ${image}`);
      const response = await fetch('https://api.lokalise.com/api2/projects/2901816966436c8ba73ff3.12518449/screenshots', options);
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Upload failed with status ${response.status}: ${errorDetails}`);
      }
      const json = await response.json();
      console.log(json);
    } catch (err) {
      console.error(`Failed to upload ${image}:`, err);
    }
  }
};

uploadImages().catch(error => {
  console.error('Unexpected error during uploadImages execution:', error);
  process.exit(1); // Ensure non-zero exit code on error
});
