import { UUIDVersion } from "express-validator/src/options";
import mongoose, { Schema } from "mongoose";

export type createTask = mongoose.Document & {
    id:string,
    done: Boolean,
    dueDate: Date,
    title: string,
};

const createTaskSchema = new mongoose.Schema({
    id:String,
    done: Boolean,
    dueDate: Date,
    title: String,
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true , collection: "createTask"});

export const CreateTask = mongoose.model<createTask>("ChangeRequest", createTaskSchema);