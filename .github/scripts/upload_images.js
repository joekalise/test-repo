   const fs = require('fs');
   const path = require('path');
   const fetch = require('node-fetch');
   const base64 = require('base64-js');

   const imagesDirectory = './images';

   const uploadImages = async () => {
     const images = fs.readdirSync(imagesDirectory).filter(file => /\.(png|jpg|jpeg)$/i.test(file));
     
     for (const image of images) {
       const imagePath = path.join(imagesDirectory, image);
       const imageData = fs.readFileSync(imagePath).toString('base64');
       
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
         const response = await fetch('https://api.lokalise.com/api2/projects/2901816966436c8ba73ff3.12518449/screenshots', options);
         const json = await response.json();
         console.log(json);
       } catch (err) {
         console.error(`Failed to upload ${image}:`, err);
       }
     }
   };

   uploadImages();   const fs = require('fs');
   const path = require('path');
   const fetch = require('node-fetch');
   const base64 = require('base64-js');

   const imagesDirectory = './images';

   const uploadImages = async () => {
     const images = fs.readdirSync(imagesDirectory).filter(file => /\.(png|jpg|jpeg)$/i.test(file));
     
     for (const image of images) {
       const imagePath = path.join(imagesDirectory, image);
       const imageData = fs.readFileSync(imagePath).toString('base64');
       
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
         const response = await fetch('https://api.lokalise.com/api2/projects/2901816966436c8ba73ff3.12518449/screenshots', options);
         const json = await response.json();
         console.log(json);
       } catch (err) {
         console.error(`Failed to upload ${image}:`, err);
       }
     }
   };

   uploadImages();
