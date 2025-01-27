import { Collection, MongoClient } from 'mongodb';

class MongoDatabase {
    private static _db: MongoDatabase;
    private readonly _config: MongoConfig;

    private _connection?: MongoClient;
    private _collections?: { [collectionName: string]: Collection };

    /**
     * Initializes the MongoDB database with the provided configuration.
     * Establishes a connection to the database and logs a success message.
     *
     * @param {MongoConfig} config - The configuration object for the MongoDB connection.
     * @throws {Error} If the connection to the database fails.
     */

    public static async initDb(config: MongoConfig) {
        this._db = new MongoDatabase(config);

        await this._db.connect();

        console.log('Successfully connected to MongoDB!');
    }

    /**
     * Gets the initialized instance of the MongoDB database.
     *
     * @throws {Error} If the database has not been initialized.
     * @returns The initialized instance of the MongoDB database.
     */

    public static getDb() {
        if (!this._db) {
            throw new Error('Database not initialized');
        }

        return this._db;
    }

    /**
     * Gets a MongoDB collection by name.
     *
     * @param collectionName The name of the collection to get.
     * @throws {Error} If the collection is not initialized or does not exist.
     * @returns The MongoDB collection.
     */
    public getCollection(collectionName: string): Collection {
        if (!this._collections) {
            throw new Error(
                'Collections not initialized. Check connection status.'
            );
        }

        if (this._collections[collectionName]) {
            return this._collections[collectionName];
        }

        const table = this._connection
            ?.db(this._config.databaseName)
            .collection(collectionName);

        if (!table) {
            throw new Error(`Collection ${collectionName} not found`);
        }

        this._collections[collectionName] = table;

        return table;
    }

    /**
     * Creates a new instance of the MongoDB database.
     * @param {MongoConfig} config The configuration for the MongoDB instance.
     * @throws {Error} If the database has already been initialized.
     */
    private constructor(config: MongoConfig) {
        this._config = config;
    }

    /**
     * Connects to the MongoDB instance.
     */
    private async connect() {
        if (this._connection) {
            await this.disconnect();
        }

        this._collections = {};

        const uri = this._config.connectionString;

        try {
            this._connection = await MongoClient.connect(uri);
            MongoDatabase._db = this;
        } catch (error: any) {
            console.error(
                `MongoDatabase::connect - Failed to connect to database using ${uri}`
            );
            throw error;
        }
    }

    /**
     * Disconnects from the MongoDB instance.
     */
    private async disconnect() {
        if (!this._connection) {
            return Promise.resolve();
        }

        const connection = this._connection;
        this._connection = undefined;

        return connection.close();
    }
}

export default MongoDatabase;

type MongoConfig = {
    connectionString: string;
    databaseName: string;
};
