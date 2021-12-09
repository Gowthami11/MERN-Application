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
export const getPlacesByUserId=(req,res,next)=>{
    const uid = req.params.uid;
    const places = dummyPlaces.filter(data => data.creator === uid);
    // if (!place) {
    //     const error = new Error('could not provide a place for the given user id');
    //     error.code = 404;
    //    return next(error);
    // }
    if (!places || places.length===0) {
        throw new HttpError('could not provide a place for the given user id', 404)
    }
    res.json({ places })
}

export const createPlace=async(req,res,next)=>{
    //to validate req body
    const errors= validationResult(req);
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

export const updatePlace=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    throw new Error('Invalid inputs passed, Please check your data',422);
    const {pid}=req.params;
    const {title,description}=req.body;
    const updatedplace={...dummyPlaces.find(data=>data.id===pid)};
    const index=dummyPlaces.findIndex(d=>d.id===pid);
    updatedplace.title=title;
    updatedplace.description=description;
    dummyPlaces[index]=updatedplace
    res.status(200).json({updatedplace})

}

export const deletePlace=(req,res)=>{
    const {pid}=req.params;
     dummyPlaces=dummyPlaces.filter(d=>d.id!=pid);
    res.status(200).send({message:'Deleted place'})

}