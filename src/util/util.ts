import fs from 'fs';
import Jimp = require('jimp');

export enum errorMessages {
  READ = 'Unable to read image URL, please ensure resource exists.',
  FILTER = 'Unable to filter image.',
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  const photo = await Jimp.read(inputURL).catch((e) => {
    console.log(e);
    throw new Error(errorMessages.READ);
  });

  const relativePath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
  const absolutePath = __dirname + relativePath;

  return photo
    .resize(256, Jimp.AUTO) // resize
    .quality(60) // set JPEG quality
    .greyscale() // set greyscale
    .writeAsync(absolutePath)
    .then((_) => absolutePath)
    .catch((e) => {
      console.log(e);
      throw new Error(errorMessages.FILTER);
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export function deleteLocalFiles(files: string[]) {
  for (const file of files) {
    deleteLocalFile(file);
  }
}

export const deleteLocalFile = (path: string) => fs.unlinkSync(path);
