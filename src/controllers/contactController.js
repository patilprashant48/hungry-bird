const ContactModel = require("../models/contactModel");
const model = new ContactModel();

/**
 * Convert DB row into clean contact object
 */
function formatContact(row) {
    return {
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        company: row.company,
        groups: row.groups_list ? row.groups_list.split(",").map(g => g.trim()) : []
    };
}

// --------------------------
// GET ALL CONTACTS
// --------------------------
exports.getContacts = async (req, res) => {
    try {
        const rows = await model.getAll();
        const formatted = rows.map(formatContact);
        res.json(formatted);
    } catch (err) {
        console.error("Error getContacts:", err);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
};

// --------------------------
// CREATE CONTACT
// --------------------------
exports.createContact = async (req, res) => {
    try {
        let { name, phone, email, company, groups } = req.body;

        // groups must be array → convert to CSV string
        const groupsCSV = Array.isArray(groups) ? groups.join(",") : "";

        const newContact = await model.create({
            name,
            phone,
            email,
            company,
            groups_list: groupsCSV
        });

        res.json(formatContact(newContact));
    } catch (err) {
        console.error("Error createContact:", err);
        res.status(500).json({ error: "Failed to create contact" });
    }
};

// --------------------------
// UPDATE CONTACT
// --------------------------
exports.updateContact = async (req, res) => {
    try {
        const id = req.params.id;
        let { name, phone, email, company, groups } = req.body;

        const groupsCSV = Array.isArray(groups) ? groups.join(",") : "";

        const updated = await model.update(id, {
            name,
            phone,
            email,
            company,
            groups_list: groupsCSV
        });

        res.json(formatContact(updated));
    } catch (err) {
        console.error("Error updateContact:", err);
        res.status(500).json({ error: "Failed to update contact" });
    }
};

// --------------------------
// DELETE CONTACT
// --------------------------
exports.deleteContact = async (req, res) => {
    try {
        const id = req.params.id;
        await model.delete(id);
        res.json({ success: true });
    } catch (err) {
        console.error("Error deleteContact:", err);
        res.status(500).json({ error: "Failed to delete contact" });
    }
};
