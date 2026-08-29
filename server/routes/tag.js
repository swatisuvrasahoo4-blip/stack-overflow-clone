import express from "express";
import { getAllTags, getTagContent } from "../controller/tag.js";

const router = express.Router();

router.get("/", getAllTags);

router.get("/:tag", getTagContent);

export default router;