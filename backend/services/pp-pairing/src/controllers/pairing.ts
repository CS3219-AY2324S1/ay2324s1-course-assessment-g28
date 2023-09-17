import { Request, Response } from "express";

export async function get(req: Request, res: Response) {
  try {
    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    console.error(`Error while getting programming languages`, err.message);
  }
}

module.exports = {
  get,
};
