const express = require("express");
const router = express.Router();
const templateController = require("../controllers/template.Controller");

// CRUD for Templates
router.post("/", templateController.createTemplate);
router.get("/", templateController.getTemplates);
router.put("/:id", templateController.updateTemplate);
router.delete("/:id", templateController.deleteTemplate);

module.exports = router;
