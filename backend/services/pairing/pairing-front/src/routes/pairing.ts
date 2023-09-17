import { Request, Response } from "express";
import { get } from "../controllers/pairing";

const express = require("express");
const router = express.Router();

router.get("/", get);

export default router;
