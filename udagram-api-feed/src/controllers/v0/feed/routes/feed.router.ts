import { NextFunction, Request, Response, Router } from 'express';
import * as AWS from '../../../../aws';
import { requireAuth } from '../../requireAuth';
import { FeedItem } from '../models/FeedItem';


const router: Router = Router();


/**
 * Add endpoint to get all Feed Items
 */
router.get('/',

  async (req: Request, res: Response, next: NextFunction) => {
    const items = await FeedItem.findAndCountAll({ order: [['id', 'DESC']] });

    items.rows.map((item) => {
      if (item.url) {
        item.url = AWS.getGetSignedUrl(item.url);
      }
    });

    res.status(200).send(items);
    res.statusMessage = 'All Feed Items returned'

    next();
  }
);


/**
 * Add endpoint to get Feed Item specified by id
 */
 router.get('/:id',

  async (req: Request, res: Response, next: NextFunction) => {
    // id is a string 
    const { id } = req.params;

    if (Math.round(+id) !== +id) {
      res.status(400);
      return next(new Error('Bad request'));
    }

    const item = await FeedItem.findByPk(id);

    if (!item) {
      res.status(404);
      return next(new Error('Not found'));
    }

    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }

    res.status(200).send(item);
    res.statusMessage = 'Item returned'

    next();
  }
);


/**
 * Add endpoint to get update Feed Item specified by id
 */
 router.patch('/:id',

  requireAuth,

  async (req: Request, res: Response, next: NextFunction) => {
    // id is a string 
    const { id } = req.params;

    if (Math.round(+id) !== +id) {
      res.status(400);
      return next(new Error('Bad request'));
    }

    const caption = req.body.caption;
    const fileName = req.body.url;

    const item = await FeedItem.findByPk(id);

    if (!item) {
      res.status(409);
      return next(new Error('Conflict no Feed Item to update'));
    }

    // check Caption is valid
    if (!caption) {
      res.status(400);
      return next(new Error('Caption is required or malformed'));
    }

    item.caption = caption;

    // check Filename is valid
    if (!fileName) {
      res.status(400);
      return next(new Error('File url is required'));
    }

    item.url = fileName;

    const updatedItem: FeedItem = await item.update(
      {
        caption: item.caption,
        url: item.url,
      },
      { where: { id: id } }
    );

    updatedItem.url = AWS.getGetSignedUrl(updatedItem.url);

    res.status(200).send(updatedItem);
    res.statusMessage = 'Feed Item updated'

    next();
  }
);



/**
 * Add endpoint to get the signed URL needed to put a new Feed Item image into the S3 Bucket
 */
router.get('/signed-url/:fileName',

  requireAuth,

  async (req: Request, res: Response, next: NextFunction) => {
    const { fileName } = req.params;

    // check Filename is valid
    if (!fileName) {
      res.status(400);
      return next(new Error('File url is required'));
    }

    const url = AWS.getPutSignedUrl(fileName);

    res.status(200).send({ url: url });
    res.statusMessage = 'Signed URL returned'

    next();
  }
);


/**
 * Add endpoint to post the meta data after an image file has been uploaded to the S3 Bucket
 * The url is the file name (key) of the image in the S3 Bucket
 */
router.post('/',

  requireAuth,

  async (req: Request, res: Response, next: NextFunction) => {
    const caption = req.body.caption;
    const url = req.body.url;

    // check Caption is valid
    if (!caption) {
      res.status(400);
      return next(new Error('Caption is required or malformed'));
    }

    // check Filename is valid
    if (!url) {
      res.status(400);
      return next(new Error('File url is required'));
    }

    const item = new FeedItem({
      caption: caption,
      url: url
    });

    const savedItem: FeedItem = await item.save();

    savedItem.url = AWS.getGetSignedUrl(savedItem.url);

    res.status(201).send(savedItem);
    res.statusMessage = 'Feed Item saved'

    next();
  }
);


export const FeedRouter: Router = router;
