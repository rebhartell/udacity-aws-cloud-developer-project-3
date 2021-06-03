import { Request, Response, Router } from 'express';
import { v4 as uuid } from 'uuid';
import * as AWS from '../../../../aws';
import { requireAuth } from '../../requireAuth';
import { FeedItem } from '../models/FeedItem';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const pid: string = uuid();
    console.log(new Date().toLocaleString() + `: ${pid} - START - Get all feed items`);

    const items = await FeedItem.findAndCountAll({ order: [['id', 'DESC']] });

    items.rows.map((item) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });

    const n: number = items.count;
    console.log(new Date().toLocaleString() + `: ${pid} - END   - Return ${n} feed items` );

    res.send(items);
});

//Add an endpoint to GET a specific resource by Primary Key
router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;

    const item = await FeedItem.findByPk(id);

    if (!item) {
        res.status(404).send({
            status: 404,
            error: "Not found"
        })
    }

    if (item.url) {
        item.url = AWS.getGetSignedUrl(item.url);
    }
    res.send(item);
});

// update a specific resource
router.patch('/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        let { id } = req.params;

        const caption = req.body.caption;
        const fileName = req.body.url;

        const item = await FeedItem.findByPk(id);

        if (!item) {
            res.status(409).send({
                status: 409,
                error: "Conflict - not found"
            })
        }

        // check Caption is valid
        if (!caption) {
            return res.status(400).send({ message: 'Caption is required or malformed' });
        } else {
            item.caption = caption;
        }

        // check Filename is valid
        if (!fileName) {
            return res.status(400).send({ message: 'File url is required' });
        } else {
            item.url = fileName;
        }

        const updated_item = await item.update({
            caption: item.caption,
            url: item.url
        },
            { where: { id: id } });

        updated_item.url = AWS.getGetSignedUrl(updated_item.url);
        res.status(201).send(updated_item);

    });


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
        let { fileName } = req.params;
        const url = AWS.getPutSignedUrl(fileName);
        res.status(201).send({ url: url });
    });

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is the key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
        const caption = req.body.caption;
        const fileName = req.body.url;

        // check Caption is valid
        if (!caption) {
            return res.status(400).send({ message: 'Caption is required or malformed' });
        }

        // check Filename is valid
        if (!fileName) {
            return res.status(400).send({ message: 'File url is required' });
        }

        const item = await new FeedItem({
            caption: caption,
            url: fileName
        });

        const saved_item = await item.save();

        saved_item.url = AWS.getGetSignedUrl(saved_item.url);
        res.status(201).send(saved_item);
    });

export const FeedRouter: Router = router;

function uuidv4() {
        throw new Error('Function not implemented.');
    }
