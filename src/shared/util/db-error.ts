export const dbError = (error: any, doc: any, next: any) => {

    if (error.name === "MongoError" && error.code === 11000) {
        next(new Error("There was a duplicate key error"));
    } else {
        next(error);
    }
};
