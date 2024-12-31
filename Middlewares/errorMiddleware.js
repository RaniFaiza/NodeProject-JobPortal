const errorMiddleware = (err,req,resp,next)=>{
    console.log(`err: ${err}`);
    // return resp.status(500).send({
    //     success:'false',
    //     message:"Something went wrong.",
    //     err
    // });

    const defaultErrors = {
        statuscode : 500,
        message:err
    }
 // Validation Error
    if(err.name === "ValidationError"){
        defaultErrors.statuscode = 400;
        defaultErrors.message = Object.values(err.errors).map(item=>item.message)
    }

//Duplicate error (i.e Email already exists)
if(err.code && err.code === 11000){
    defaultErrors.statuscode = 400;
    //defaultErrors.message = `${Object.keys(err.keyValue)} field has to be unique.`
    const key = Object.keys(err.keyValue);
    defaultErrors.message = `${key} field has to be unique.`

}
    resp.status(defaultErrors.statuscode).json({message:defaultErrors.message});
}

module.exports = {
    errorMiddleware,
}