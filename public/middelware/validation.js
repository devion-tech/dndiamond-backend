export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error || error === null) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message,
            })
            return
        }
        next();
    };
};

export const validateRequestForQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error || error === null) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message,
            })
            return
        }
        next();
    };
};