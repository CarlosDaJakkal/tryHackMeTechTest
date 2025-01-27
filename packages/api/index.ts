import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Filter, ObjectId } from 'mongodb';
import MongoDatabase from './db/MongoDatabase';

dotenv.config();

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    await import('./db/startAndSeedMemoryDB');
}

const PORT = process.env.PORT || 3001;

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

const DATABASE_URL = process.env.DATABASE_URL;
const app = express();

app.use(cors());
app.use(express.json());

await initializeDatabase();
initializeHttpRoutes(app);

app.listen(PORT, () => {
    console.log(`API Server Started at ${PORT}`);
});

/**
 * Initializes the MongoDB database connection.
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
    await MongoDatabase.initDb({
        connectionString: DATABASE_URL,
        databaseName: 'test',
    });
}

/**
 * Initializes all the HTTP routes for the API server.
 * @param {Application} app - The express app to attach the routes to.
 */
function initializeHttpRoutes(app: Application) {
    app.get('/hotels/:id', async (req, res) => {
        const id = req.params.id;

        try {
            res.json(await fetchHelper('hotels', id));
        } catch (error) {
            console.error(
                `Error occurred while while fetching the hotel id ${id}`,
                error
            );

            res.status(500).json({
                error: 'An error occurred while fetching data',
            });
        }
    });

    app.get('/cities/:id', async (req, res) => {
        const id = req.params.id;

        try {
            res.json(await fetchHelper('cities', id));
        } catch (error) {
            console.error(
                `Error occurred while while fetching the city id ${id}`,
                error
            );

            res.status(500).json({
                error: 'An error occurred while fetching data',
            });
        }
    });

    app.get('/countries/:id', async (req, res) => {
        const id = req.params.id;

        try {
            res.json(await fetchHelper('countries', id));
        } catch (error) {
            console.error(
                `Error occurred while while fetching the country id ${id}`,
                error
            );

            res.status(500).json({
                error: 'An error occurred while fetching data',
            });
        }
    });

    app.get('/hotels', async (req, res) => {
        try {
            const searchQuery = req.query.search as string;
            let filter = {};

            if (searchQuery) {
                const searchRegex = new RegExp(searchQuery, 'i');
                filter = {
                    $or: [
                        { chain_name: searchRegex },
                        { hotel_name: searchRegex },
                        { city: searchRegex },
                        { country: searchRegex },
                    ],
                };
            }

            res.json(await searchHelper('hotels', filter));
        } catch (error) {
            console.error(
                'Error occurred while querying the hotels collection:',
                error
            );

            res.status(500).json({
                error: 'An error occurred while fetching data',
            });
        }
    });

    app.get('/cities', async (req, res) => {
        try {
            const searchQuery = req.query.search as string;
            let filter = {};

            if (searchQuery) {
                filter = { name: new RegExp(searchQuery, 'i') };
            }

            res.json(await searchHelper('cities', filter));
        } catch (error) {
            console.error(
                'Error occurred while querying the cities collection:',
                error
            );

            res.status(500).json({
                error: 'An error occurred while fetching data',
            });
        }
    });

    app.get('/countries', async (req, res) => {
        try {
            const searchQuery = req.query.search as string;
            let filter = {};

            if (searchQuery) {
                filter = { country: new RegExp(searchQuery, 'i') };
            }

            res.json(await searchHelper('countries', filter));
        } catch (error) {
            console.error(
                'Error occurred while querying the countries collection:',
                error
            );

            res.status(500).json({
                error: 'An error occurred while fetching data',
            });
        }
    });
}

/**
 * Fetches a document from the database based on the provided collection name
 * and id. Will throw an error if the document is not found.
 *
 * @param {string} collectionName The name of the MongoDB collection to query.
 * @param {string} id The id of the document to fetch.
 */
async function fetchHelper(collectionName: string, id: string) {
    try {
        const collection = MongoDatabase.getDb().getCollection(collectionName);

        return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
        throw error;
    }
}

/**
 * Searches a MongoDB collection for documents matching the provided filter.
 * Will throw an error if a database error occurs.
 *
 * @param {string} collectionName The name of the MongoDB collection to query.
 * @param {Filter<any>} filter The filter to apply to the search.
 */
async function searchHelper(collectionName: string, filter: Filter<any>) {
    try {
        const collection = MongoDatabase.getDb().getCollection(collectionName);

        return await collection.find(filter).limit(10).toArray();
    } catch (error) {
        throw error;
    }
}
