import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import path from "path";

dotenv.config();


const client = createClient();
const app: Express = express();
const port = process.env.PORT;

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
})();

app.use(express.json());

app.post('/api/add-key/:id', async (req: Request, res: Response) => {
    await client.set(req.params.id, req.body.value);
    res.send({ msg: "Key added", key: { key: req.params.id, value: req.body.value } });
});

app.delete('/api/delete-key/:id', async (req: Request, res: Response) => {
    await client.del(req.params.id);
    res.send('Key deleted');
});

app.get('/api/get-key/:id', async (req: Request, res: Response) => {
    const result = await client.get("nfc-" + req.params.id);
    res.send({ value: result });
});

app.get('/api/all-keys', async (req: Request, res: Response) => {
    const keys = await client.keys('nfc-*');
    if (!keys.length) {
        return res.send([]);
    }
    const values = await client.mGet(keys);
    res.send(keys.map((key, i) => {
        return {
            key: key,
            value: values[i]
        }
    }));
});

app.get('/api/redirect/:id', async (req: Request, res: Response) => {
    const result = await client.get("nfc-" + req.params.id);
    if (result) {
        res.redirect(result);
    } else {
        res.send('No redirect found');
    }
});

app.use(express.static('dist/public'));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});