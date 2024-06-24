const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500      // 500 means server error
    res.status(statusCode)

    //to send info to developer that where the error is coming from
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : null    // we have to do this intelligently as when its under construction then its fine that it is showing from where the error is coming from, but we don't want it to show the same when its under production
    })
}

module.exports = errorHandler