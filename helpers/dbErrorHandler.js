// Function to handle user signup errors(eg Duplicate values, etc...)

module.exports.errorHandler = (error) => {
    let message = '';
    if (error.code === 11000 || error.code === 11001) {
        try {
            const errInput = Object.keys(error.keyValue)[0]
            message = errInput + " can not have duplicate values"
        }
        catch {
            return 'Unique field already exists'
        }
    }
    else {
        for (err in error.errors) {
            if (error.errors[err].message) {
                message = error.errors[err].message
            }
        }
    }
    return message
}