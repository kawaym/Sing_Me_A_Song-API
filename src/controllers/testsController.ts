import { Request, Response } from "express";
import * as testsService from "../services/testsService.js";

export async function resetDatabase(req: Request, res: Response) {
  try {
    console.log(req);
    await testsService.resetDatabase();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
export async function seedRecommendations(req: Request, res: Response) {
  try {
    await testsService.seedRecommendations();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
