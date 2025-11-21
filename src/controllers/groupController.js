// src/controllers/groupController.js

const GroupModel = require("../models/groupModel");
const model = new GroupModel();

/**
 * CREATE GROUP
 * POST /api/groups
 */
exports.createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Group name is required" });
        }

        const newGroup = await model.create({ name });
        res.status(201).json(newGroup);

    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Error creating group", error });
    }
};

/**
 * GET ALL GROUPS
 * GET /api/groups
 */
exports.getGroups = async (req, res) => {
    try {
        const groups = await model.findAll();
        res.status(200).json(groups);
    } catch (error) {
        console.error("Error retrieving groups:", error);
        res.status(500).json({ message: "Error retrieving groups", error });
    }
};

/**
 * UPDATE GROUP
 * PUT /api/groups/:id
 */
exports.updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedGroup = await model.update(id, { name });
        res.status(200).json(updatedGroup);

    } catch (error) {
        console.error("Error updating group:", error);
        res.status(500).json({ message: "Error updating group", error });
    }
};

/**
 * DELETE GROUP
 * DELETE /api/groups/:id
 */
exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await model.delete(id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: "Error deleting group", error });
    }
};
