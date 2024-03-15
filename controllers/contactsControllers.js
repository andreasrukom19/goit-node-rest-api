import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (_, res) => {
    const result = await contactsService.listContacts();
    res.json(result);
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contacts with id=${id} not found`);
    }
    res.json(result);
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contacts with id=${id} not found`);
    }
    res.json({
      message: 'Delete success'
    })
};

export const createContact = async (req, res) => {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.updateContactById(id, req.body);
    if (!result) {
      throw HttpError(404, `Contacts with id=${id} not found`);
    }
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, 'Body must have at least one field')
    }
    res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404, `Contacts with id=${id} not found`);
  }
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, 'Body must have at least one field')
  }
  res.json(result);
}