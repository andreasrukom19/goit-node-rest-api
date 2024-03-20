import Contact from "../models/Contact.js";

export function listContacts(filter = {}, query = {}) {
  return Contact.find(filter, "-createdAt -updatedAt", query);
}

export function addContact(data) {
  return Contact.create(data);
}

export function getContact(filter) {
  return Contact.findOne(filter);
}

export function updateOneContact(filter, data) {
  return Contact.findOneAndUpdate(filter, data, {new: true, runValidators: true});
}

export function removeContact(filter) {
  return Contact.findOneAndDelete(filter);
}