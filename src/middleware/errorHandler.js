function errorHandler(err, req, res, next) {
    console.error(err.stack);

    if (err.code === '23505') {
        return res.status(409).json({error: 'Transaction already exists'});
    }

    if (err.name === 'validationError') {
        return res.status(400).json({error: err.message});
    }

    res.status(500).json({
        error: 'something went wrong',
        message: err.message
    });
}

module.exports = errorHandler;