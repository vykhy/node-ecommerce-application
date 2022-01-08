/**
 * return if any of the values in arguments are empty or undefined
 * @param {array} arguments 
 * @returns bool
 */
exports.anyIsEmpty = (arguments) => {
    return arguments.some(argument => argument == '' || argument == undefined)
}