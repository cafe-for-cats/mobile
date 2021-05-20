import { Router } from 'express';
import vision from '@google-cloud/vision';
import { google } from '@google-cloud/vision/build/protos/protos';
const PImage = require('pureimage');
const fs = require('fs');

const router: Router = Router();
const client = new vision.ImageAnnotatorClient();

router.get('/', async () => {
  const inputFile = 'src/assets/in.jpg';
  let outputFile = 'src/assets/out.png';
  outputFile = outputFile || 'src/assets/out.png';

  const faces = await detectFaces(inputFile);

  console.log('Highlighting...');

  await highlightFaces(inputFile, faces, outputFile, PImage);

  console.log('Finished!');
});

async function detectFaces(inputFile: string) {
  // Make a call to the Vision API to detect the faces
  const request = { image: { source: { filename: inputFile } } };
  const results = await client.faceDetection(request);
  const faces = results[0].faceAnnotations;
  const numFaces = faces?.length;

  console.log(`Found ${numFaces} face${numFaces === 1 ? '' : 's'}.`);

  return faces;
}
async function highlightFaces(
  inputFile: string,
  faces: google.cloud.vision.v1.IFaceAnnotation[] | undefined | null,
  outputFile: string,
  PImage: {
    decodeJPEGFromStream: (arg0: any) => any;
    decodePNGFromStream: (arg0: any) => any;
    encodePNGToStream: (arg0: any, arg1: any) => any;
  }
) {
  // Open the original image
  const stream = fs.createReadStream(inputFile);
  let promise;
  if (inputFile.match(/\.jpg$/)) {
    promise = PImage.decodeJPEGFromStream(stream);
  } else if (inputFile.match(/\.png$/)) {
    promise = PImage.decodePNGFromStream(stream);
  } else {
    throw new Error(`Unknown filename extension ${inputFile}`);
  }
  const img = await promise;
  const context = img.getContext('2d');
  context.drawImage(img, 0, 0, img.width, img.height, 0, 0);

  // Now draw boxes around all the faces
  context.strokeStyle = 'rgba(0,255,0,0.8)';
  context.lineWidth = '5';

  faces?.forEach((face) => {
    context.beginPath();
    let origX = 0;
    let origY = 0;

    if (face.boundingPoly?.vertices) {
      face.boundingPoly.vertices.forEach((bounds, i: number) => {
        if (bounds) {
          if (i === 0) {
            origX = bounds.x as number;
            origY = bounds.y as number;
            context.moveTo(bounds.x, bounds.y);
          } else {
            context.lineTo(bounds.x, bounds.y);
          }
        }
      });
    }

    context.lineTo(origX, origY);
    context.stroke();
  });

  // Write the result to a file
  console.log(`Writing to file ${outputFile}`);
  const writeStream = fs.createWriteStream(outputFile);
  await PImage.encodePNGToStream(img, writeStream);
}

export default router;
