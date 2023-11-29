import express from "express";


const router = express.Router();

router.get("/", getUsers);
router.get("/:uid", getUserById);
router.post("/", createUser);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUserById);

export default router;
