import express from 'express'
const router = express.Router();
import {getPlaceById,getPlaceByUserId,createPlace,updatePlace,deletePlace} from "../controllers/places-controllers"
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
router.get("/:placeid", getPlaceById);
router.patch("/:pid",updatePlace);
router.delete("/:pid",deletePlace);

router.get("/user/:uid", getPlaceByUserId);
router.post("/",createPlace)

module.exports = router