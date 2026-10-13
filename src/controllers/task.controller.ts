import { Request, Response } from "express";
import Task from "../models/Task.js";

import mongoose from "mongoose";

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

export const getAllTasks = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: unknown) {
    console.error("get all tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: unknown) {
    console.error("Get task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    if (
      title === undefined &&
      description === undefined &&
      completed === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
      return;
    }

    const updates: {
      title?: string;
      description?: string;
      completed?: boolean;
    } = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        res.status(400).json({
          success: false,
          message: "Title must be a non-empty string",
        });
        return;
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        res.status(400).json({
          success: false,
          message: "Description must be a string",
        });
        return;
      }

      updates.description = description.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        res.status(400).json({
          success: false,
          message: "Completed must be a boolean",
        });
        return;
      }

      updates.completed = completed;
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error: unknown) {
    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error: unknown) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};
