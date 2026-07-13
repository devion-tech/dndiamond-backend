import { Router } from "express";
import { validateRequest, validateRequestForParams } from "../middelware/validation.js";
import { verifytoken } from "../utills/jwt.helper.js";
import { createAddressValidation, updateAddressValidation } from "../validation/address.js";
import * as addressController from "../controllers/address.js";
import { commonIdValidation } from "../validation/common.js";

const router = new Router();

/* Create a new address */
router.post("/", verifytoken, validateRequest(createAddressValidation), addressController.createAddress);
router.get("/", verifytoken, addressController.getAddresses);
router.put("/:id", verifytoken, validateRequestForParams(commonIdValidation), validateRequest(updateAddressValidation), addressController.updateAddress);
router.delete("/:id", verifytoken, validateRequestForParams(commonIdValidation), addressController.deleteAddress);

export default router;
