import HttpError from "../models/HttpError";
import {v4 as uuid} from 'uuid'
const dummyPlaces = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous skiy Scrappers in the world!',
        location: {
            lat: 40.7484474,
            long: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
]
export const getPlaceById=(req,res,next)=>{
    const placeid = req.params.placeid;
    const place = dummyPlaces.find(data => data.id === placeid);
    if (!place) {
        throw new HttpError('could not find place with given id')
        //asynchronous is next(error)
        //syncronous
        //return throw new Error('message');
    }
    res.json({ place })

}
export const getPlaceByUserId=(req,res,next)=>{
    const uid = req.params.uid;
    const place = dummyPlaces.find(data => data.creator === uid);
    // if (!place) {
    //     const error = new Error('could not provide a place for the given user id');
    //     error.code = 404;
    //    return next(error);
    // }
    if (!place) {
        throw new HttpError('could not provide a place for the given user id', 404)
    }
    res.json({ place })
}

export const createPlace=(req,res,next)=>{
    //express.json() to use req.body
    const {title,description,coordinates,address,creator}=req.body;
    console.log('title,description,coordinates,address,creator',title,description,coordinates,address,creator)
    const createdPlace={
        id:uuid(),
        title,
        description,
        location:coordinates,
        address,
        creator
    }
    dummyPlaces.push(createdPlace)
    //201 for success
    res.status(201).json({createdPlace:createdPlace})

}