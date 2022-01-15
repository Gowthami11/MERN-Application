import HttpError from "../models/HttpError";
import { v4 as uuid } from 'uuid';
import mongoose from "mongoose"
import { validationResult } from "express-validator";
import { getCoordsForAddress } from "../util/location"
import { PlaceModel } from "../models/place"
import { Uschema } from "../models/user"
import fs from 'fs'
let dummyPlaces = [
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
export const getPlaceById = async (req, res, next) => {
    const placeid = req.params.placeid;
    let place;
    try {
        place = await PlaceModel.findById(placeid)

    } catch (err) {
        return next(new HttpError('something went wrong, could not find a place', 404));
    }

    if (!place) {
        throw new HttpError('could not find place with given id')
        //asynchronous is next(error)
        //syncronous
        //return throw new Error('message');
    }
    res.json({ place: place.toObject({ getters: true }) })// to give id along with _id

}

//with populate
// const getPlacesByUserId = async (req, res, next) => {
//     const userId = req.params.uid;
  
//     // let places;
//     let userWithPlaces;
//     try {
//       userWithPlaces = await User.findById(userId).populate('places');
//     } catch (err) {
//       const error = new HttpError(
//         'Fetching places failed, please try again later',
//         500
//       );
//       return next(error);
//     }
  
//     // if (!places || places.length === 0) {
//     if (!userWithPlaces || userWithPlaces.places.length === 0) {
//       return next(
//         new HttpError('Could not find places for the provided user id.', 404)
//       );
//     }
  
//     res.json({
//       places: userWithPlaces.places.map(place =>
//         place.toObject({ getters: true })
//       )
//     });
//   };
export const getPlacesByUserId = async (req, res, next) => {
    const uid = req.params.uid;
    let places
    try {
        places = await PlaceModel.find({ creator: uid })
    }
    catch (e) {
        return next(new HttpError('fetching places failed, Please try again', 404))
    }
    // if (!place) {
    //     const error = new Error('could not provide a place for the given user id');
    //     error.code = 404;
    //    return next(error);
    // }
    if (!places || places.length === 0) {
        return next(new HttpError('could not find a place for the given user id', 404))
    }
    res.json({ places: places.map(place => place.toObject({ getters: true })) })
}

export const createPlace = async (req, res, next) => {
    //to validate req body
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return next(new HttpError('Invalid inputs passed, Please check your data', 422))
    console.log('erros', errors)
    let coordinates
    try {
        coordinates = await getCoordsForAddress(address)

    }
    catch (e) {
        return next(e)
    }
    //express.json() to use req.body
    const { title, description, address, creator } = req.body;
    // console.log('title,description,coordinates,address,creator',title,description,coordinates,address,creator,req.body)
    const createdPlace = new PlaceModel({
        title,
        description,
        location: coordinates,
        address,
        image: req.file.path,
        creator,
    })
    let user;
    try {
        user = await Uschema.findById(creator)
    }
    catch (e) {
        return next(new HttpError("Creating place failed, please try again", 500))
    }
    if (!user) {
        return next(new HttpError('Could not find user for provided Id', 404))
    }
    console.log('user', user)
    //if user exists, comes here
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        console.log("after transaction start")

        await createdPlace.save({ session: sess });
        console.log("after createdPlace save")

        user.places.push(createdPlace);// this is not normal js push, this mongoose one
        console.log("after uschema push")

        await user.save({ session: sess });
        console.log("after uschema save")
        await sess.commitTransaction()
    }
    catch (e) {
        console.log('err', e)
        return next(new HttpError('creating place failed,Please try again', 500))
    }
    //201 for success
    res.status(201).json({ createdPlace: createdPlace })

}

export const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new Error('Invalid inputs passed, Please check your data', 422);
    const { pid } = req.params;
    const { title, description } = req.body;
    let place
    try { place = await PlaceModel.findById(pid); }
    catch (e) {
        return next(new HttpError('Something went wrong, could not update place', 500))
    }
    //creator is of type mongoose object id, so need to convert to string as below
    if(place.creator.toString()!==req.userData.userId)
    {
        return next(new HttpError('You are not allowed to edit this place'))
    }



    place.title = title;
    place.description = description;
    try {
        await place.save();
    }
    catch (e) {
        return next(new HttpError('Something went wonr, could not update place save', 500))
    }
    res.status(200).json({ place: place.toObject({ getters: true }) })

}

export const deletePlace = async (req, res, next) => {
    const { pid } = req.params;
    let place;
    try {
        // populate used allows us to refer/access doc stored in other collection and o work on that data, populate works as we used ref in user and places model
        place = await PlaceModel.findById(pid).populate('creator');//creator is specific property which needs to be refered in User document

    }
    catch (e) {
        return next(new HttpError('some thing went wrong, place cannot be deleted', 500))
    }
    if (!place) {
        return next(new HttpError('Could not find place for this Id', 404))
    }
    const imagePath=place.image
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction()
    }
    catch (e) {
        return next(new HttpError('some thing went wrong, place cannot be deleted', 500))
    }
    fs.unlink(imagePath,(e)=>console.log(e)) // delete image from db
    res.status(200).send({ message: 'Deleted place' })

}