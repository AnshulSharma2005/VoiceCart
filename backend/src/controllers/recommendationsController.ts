import { Request, Response } from "express";
import { generateRecommendations } from "../services/recommendationService";

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { userId, currentItems, history } = req.body;

    const suggestions = await generateRecommendations(currentItems || [], history || [], userId);

    res.json({ suggestions });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};
