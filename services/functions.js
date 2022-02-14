/**
 * return if any of the values in arguments are empty or undefined
 * @param {array} arguments
 * @returns bool
 */
exports.anyIsEmpty = (arguments) => {
  return arguments.some((argument) => argument == "" || argument == undefined);
};

/**
 *
 * @param {*} product
 * removes 'public' from image link
 * @returns null
 */
exports.formatImagePath = (product) => {
  if (product.images) {
    product.images = product.images.map((image) =>
      image.path
        ? image.path.replace("public", "")
        : image.replace("public", "")
    );
  } else product.images = [];
};
