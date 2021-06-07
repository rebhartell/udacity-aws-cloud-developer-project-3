import { Request, Response, Router } from 'express';
import * as AWS from '../../../../aws';
import { timedLog } from '../../../../utils/timedLog';
import { requireAuth } from '../../requireAuth';
import { FeedItem } from '../models/FeedItem';


const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {

    const tLog = timedLog();    
    tLog.startLog("Get all feed items");

    const items = await FeedItem.findAndCountAll({ order: [['id', 'DESC']] });

    items.rows.map((item) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });

    tLog.endLog(`returned ${items.count}`);

    res.send(items);
});

//Add an endpoint to GET a specific resource by Primary Key
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const tLog = timedLog();    
    tLog.startLog(`Get feed item ${id}`);

    const item = await FeedItem.findByPk(id);

    if (!item) {

        tLog.endLog("not found");

        res.status(404).send({
            status: 404,
            error: "Not found"
        })
    }

    if (item.url) {
        item.url = AWS.getGetSignedUrl(item.url);
    }

    tLog.endLog("returned");

    res.send(item);
});

// update a specific resource
router.patch('/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const tLog = timedLog();    
        tLog.startLog(`Update feed item ${id}`);

        const caption = req.body.caption;
        const fileName = req.body.url;

        const item = await FeedItem.findByPk(id);

        if (!item) {

            tLog.endLog("not found");

            res.status(409).send({
                status: 409,
                error: "Conflict - not found"
            })
        }

        // check Caption is valid
        if (!caption) {

            tLog.endLog("Caption is required");

            return res.status(400).send({ message: 'Caption is required or malformed' });
        } else {
            item.caption = caption;
        }

        // check Filename is valid
        if (!fileName) {

            tLog.endLog("File url is required");

            return res.status(400).send({ message: 'File url is required' });
        } else {
            item.url = fileName;
        }

        const updatedItem: FeedItem = await item.update({
            caption: item.caption,
            url: item.url
        },
            { where: { id: id } });

        updatedItem.url = AWS.getGetSignedUrl(updatedItem.url);

        tLog.endLog("updated");

        res.status(201).send(updatedItem);

    });


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
        const { fileName } = req.params;

        const tLog = timedLog();    
        tLog.startLog(`Get signed url for ${fileName}`);

        const url = AWS.getPutSignedUrl(fileName);

        tLog.endLog("returned");

        res.status(201).send({ url: url });
    });

// Post meta data and the url after a file is uploaded 
// NOTE the url is the key name in the s3 bucket.
// body : {caption: string, url: string};
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
        const caption = req.body.caption;
        const url = req.body.url;

        const tLog = timedLog();    
        tLog.startLog(`Create feed item for ${url}`);

        // check Caption is valid
        if (!caption) {

            tLog.endLog("Caption is required");

            return res.status(400).send({ message: 'Caption is required or malformed' });
        }

        // check Filename is valid
        if (!url) {

            tLog.endLog("File url is required");

            return res.status(400).send({ message: 'File url is required' });
        }

        const item = await new FeedItem({
            caption: caption,
            url: url
        });

        const savedItem: FeedItem = await item.save();

        savedItem.url = AWS.getGetSignedUrl(savedItem.url);

        tLog.endLog("saved");

        res.status(201).send(savedItem);
    });

export const FeedRouter: Router = router;
