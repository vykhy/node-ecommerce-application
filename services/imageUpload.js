const multer = require("multer");
const fs = require("fs");
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

/**
 * deletes files
 * @param {array of paths of files to delete} array
 * @returns
 */
exports.deleteMultiple = (array) => {
  return Promise.all(
    array.map(
      (filePath) =>
        new Promise((res, rej) => {
          try {
            fs.unlink(filePath, (err) => {
              if (err) throw err;
              //console.log(`image ${filePath} has been deleted`);
            });
          } catch (err) {
            throw err;
          }
        })
    )
  );
};
