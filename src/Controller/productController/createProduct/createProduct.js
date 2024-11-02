/**
 * @fileoverview This module handles uploading images to Cloudinary and removes the local copy after upload.
 * @author Md. Abib Ahmed Dipto
 * @description Uploads an image to a specified Cloudinary folder and deletes the local file upon successful upload.
 * @date 2024-11-01
 * @copyright © 2024 Md. Abib Ahmed Dipto (abib.web.dev@gmail.com)
 */

// Dependencies

// Internal dependencies
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { productModel } = require("../../../Schema/productSchema");
const { merchantModel } = require("../../../Schema/MerchantSchema");
const { uploadCloudinary } = require("../../../utils/upCloudinary");
const { decodeToken } = require("../../../helpers/helper");
const { asyncHandler } = require("../../../utils/asyncaHandler");

// Create product mechanism
const createProduct = asyncHandler(async (req, res, next) => {
  // Destructure data from body
  const { name, description, category, subCategory, price, discountPrice } =
    req.body;

  // Decode token to get user data from cookies
  const DecodedData = await decodeToken(req);

  // Ensure only merchants can post products
  if (DecodedData?.Data.userRole !== "merchant") {
    return next(
      new apiError(401, `Only a merchant can post a product`, null, false)
    );
  }

  const isMerchant = await merchantModel.findOne({
    userId: DecodedData?.Data?.userId,
  });

  // Check if the user is a registered merchant
  if (!isMerchant) {
    return next(
      new apiError(
        401,
        `Sorry, only a merchant can post a product`,
        null,
        false
      )
    );
  }

  // List of fields that are not required for the creation of a product
  const nonRequiredFields = [
    "review",
    "rating",
    "discountPrice",
    "subCategory",
  ];

  // Validate required fields
  for (let field of Object.keys(req.body)) {
    // Use Object.keys for better readability
    if (nonRequiredFields.includes(field)) {
      continue;
    }
    if (!req.body[field]) {
      return next(
        new apiError(400, `Please fill the ${field} field`, null, false)
      );
    }
  }

  const image = req.files?.image;
  // Validate that an image is provided
  if (!image) {
    return next(
      new apiError(
        500,
        `Please provide one picture for posting a product`,
        null,
        false
      )
    );
  }

  // Upload the image to Cloudinary
  const imageUploadInfo = await uploadCloudinary(image[0].path);

  // Create a new product instance
  const newProduct = new productModel({
    name,
    description,
    category,
    price,
    discountPrice,
    owner: DecodedData?.Data?.userId,
    merchantId: isMerchant._id,
    image: imageUploadInfo.secure_url,
    ...(subCategory && { subCategory }),
  });

  // Save the new product to the database
  const savedProduct = await newProduct.save();

  // Check if the product was saved successfully
  if (!savedProduct) {
    return next(
      new apiError(
        500,
        `Can't create product post right now, please try again later`,
        null,
        false
      )
    );
  }

  // Respond with success message and saved product data
  return res
    .status(200)
    .json(
      new apiSuccess(true, "Product created successfully",200, savedProduct, false)
    );
});

module.exports = { createProduct };
