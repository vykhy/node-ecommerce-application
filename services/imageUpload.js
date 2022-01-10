const multer = require("multer");
const path = require("path");

/**
 * returns a function to upload multiple files
 * @param {*int} length max number of files allowed to be uploaded
 * @returns function
 */
exports.multi_upload = (length) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/");
    },
    filename: (req, file, cb) => {
      const name =
        file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      cb(null, name);
    },
  });

  const multi_upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        const err = new Error("Only .png, .jpg and .jpeg format allowed!");
        err.name = "ExtensionError";
        return cb(err);
      }
    },
  }).array("images", length);

  return multi_upload;
};
