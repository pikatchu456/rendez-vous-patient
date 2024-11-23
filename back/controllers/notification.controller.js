import db from "../config/db.js";
import asyncHandler from "express-async-handler";

const authMiddleware = asyncHandler(async (req, res, next) => {});

const getAllNotification = asyncHandler(async (req, res, next) => {
    try{

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Error in notification',
            success: false,
            error
        })
    }

});

export {
    authMiddleware,
    getAllNotification
};