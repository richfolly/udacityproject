import express from 'express';
import {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  var fs = require('fs'), request = require('request')
  // return filterImageFromURL(image_url);
  // filterImageFromURL(image_url).then((result)=>{
  // res.sendFile(result);
  // res.on(`finish`,()=>deleteLocalFiles([result]));
  // }).catch((err)=>res.status(422).send(err))
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
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]


  var download = function(url: any, filename: any, callback: any){
    request.head(url, function(err: any, res: { headers: any; }, body: any){
      request(url).pipe(fs.createWriteStream(filename)).on('close', callback)
    })
  }

  /**************************************************************************** */
  app.get("/filteredimage/",async (req: Request,res: Response)=>{
    let {image_url}: any = req.query;
    if( !image_url ) {
      return res.status(422)
                .send(`Unprocessable entity`);
    }
      else{
        // download image to server
        download(image_url, 'image.png', async function(){
          // work on image by pushing to tmp folder and handling rest of actions
          const filePath = await filterImageFromURL('image.png');
          console.log(filePath)
          res.sendFile(filePath, function(){
            deleteLocalFiles([filePath]);
          });
          console.log('done');
        });

      }
  } );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the users
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}} exemple:")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();