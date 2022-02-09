const { Router } = require("express");
const router = Router();

const Joi = require("joi");

const { NotFound, BadRequest } = require("http-errors");

const contactsOperations = require("../../model");

const joiSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  phone: Joi.string(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts();
    console.log(contacts);

    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await contactsOperations.getContactById(contactId);

    if (!contact) {
      throw new NotFound();
     
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { body } = req;

  try {
    const { error } = joiSchema.validate(body);

    if (error) {
      throw new BadRequest("missing required name field");
    }

    const newContact = await contactsOperations.addContact(body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { body } = req;
  const { contactId } = req.params;

  try {
    const { error } = joiSchema.validate(body);

    if (error) {
      throw new BadRequest("missing fields");
    }

    const updateContact = await contactsOperations.updateContactById(
      contactId,
      body
    );
    if (!updateContact) {
      throw new NotFound();
    }

    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deleteContact = await contactsOperations.removeContactById(contactId);

    if (!deleteContact) {
      throw new NotFound();
    }

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = { contactsRouter: router };
