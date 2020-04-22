import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFile, errorMessages } from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMETERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get('/filteredimage', async (req, res) => {
    const { image_url: url } = req.query as { image_url: string };
    if (!url) {
      return res.status(400).send('Image URL required');
    }

    try {
      const localPath = await filterImageFromURL(url);
      res.status(200).sendFile(localPath);
      res.on('finish', deleteLocalFile.bind(null, localPath));
    } catch ({ message }) {
      if (!Object.values(errorMessages).includes(message)) {
        message = 'Internal error'; // Default to avoid sending unknown error messages to user
      }
      const statusCode = message === errorMessages.READ ? 400 : 500; // Assume url was the problem if Jimp couldn't read
      res.status(statusCode).send(message);
    }
  });

  /**************************************************************************** */

  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', async (req, res) => {
    res.send('try GET /filteredimage?image_url={{}}');
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
