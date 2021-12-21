import HttpError from "../models/HttpError";
import {v4 as uuid} from 'uuid';
import mongoose from "mongoose"
import {validationResult} from "express-validator";
import {getCoordsForAddress} from "../util/location"
import {PlaceModel} from "../models/place"
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
export const getPlaceById=async(req,res,next)=>{
    const placeid = req.params.placeid;
    let place;
    try{
     place=await PlaceModel.findById(placeid)

    }catch(err){
       return next(new HttpError('something went wrong, could not find a place',404));
    }

    if (!place) {
        throw new HttpError('could not find place with given id')
        //asynchronous is next(error)
        //syncronous
        //return throw new Error('message');
    }
    res.json({ place :place.toObject({getters:true})})// to give id along with _id

}
export const getPlacesByUserId=async(req,res,next)=>{
    const uid = req.params.uid;
    let places
    try{
        places=await PlaceModel.find({creator:uid})
    }
    catch(e){
        return next(new HttpError('fetching places failed, Please try again',404))
    }
    // if (!place) {
    //     const error = new Error('could not provide a place for the given user id');
    //     error.code = 404;
    //    return next(error);
    // }
    if (!places || places.length===0) {
        throw new HttpError('could not provide a place for the given user id', 404)
    }
    res.json({ places:places.map(place=>place.toObject({getters:true})) })
}

export const createPlace=async(req,res,next)=>{
    //to validate req body
    const errors= validationResult(req);
    console.log('erros',errors)
    if(!errors.isEmpty())
    return next( new HttpError('Invalid inputs passed, Please check your data',422))
    console.log('erros',errors)
    let coordinates
    try{
     coordinates=await getCoordsForAddress(address)

    }
    catch(e){
        return next(e)
    }
    console.log('coordinates',coordinates)
    //express.json() to use req.body
    const {title,description,address,creator}=req.body;
    // console.log('title,description,coordinates,address,creator',title,description,coordinates,address,creator,req.body)
    const createdPlace=new PlaceModel({
        title,
        description,
        location:coordinates,
        address,
        image:"https://r-cf.bstatic.com/images/hotel/max1024x768/162/162633985.jpg",
        creator,
    })
    
    try{await createdPlace.save();}
    catch(e){
        new HttpError('creating place failed,Please try again',500)
    }
    //201 for success
    res.status(201).json({createdPlace:createdPlace})

}

export const updatePlace=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    throw new Error('Invalid inputs passed, Please check your data',422);
    const {pid}=req.params;
    const {title,description}=req.body;
    let place
    try{ place= await PlaceModel.findById(pid);}
    catch(e){
        return next(new HttpError('Something went wrong, could not update place',500))
    }
    place.title=title;
    place.description=description;
    try{    
        await place.save();
    }
    catch(e){
        return next(new HttpError('Something went wonr, could not update place save',500))
    }
    res.status(200).json({place:place.toObject({getters:true})})

}

export const deletePlace=async(req,res)=>{
    const {pid}=req.params;
let place;
    try{
        place=await PlaceModel.findById(pid);
        
    }
    catch(e)
    {
        return next(new HttpError('some thing went wrong, place cannot be deleted',500))
    }
    try{
       await place.remove()
    }
    catch(e)
    {
        return next(new HttpError('some thing went wrong, place cannot be deleted',500))
    }
    res.status(200).send({message:'Deleted place'})

}