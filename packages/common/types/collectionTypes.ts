import { ObjectId } from 'mongodb';
import { Hotel } from './hotel';
import { City } from './city';
import { Country } from './country';

type CollectionId = {
    _id: ObjectId | string;
};

export type HotelCollection = CollectionId & Hotel;

export type CityCollection = CollectionId & City;

export type CountryCollection = CollectionId & Country;
