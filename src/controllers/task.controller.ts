import { Request, Response } from "express";
import Task from "../models/Task.js";

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({
        success: false,
        message: "Title is required",
      });
      return;
    }

    const task = await Task.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "task created successfully",
      data: task,
    });
  } catch (error: unknown) {
    console.error("create task error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
