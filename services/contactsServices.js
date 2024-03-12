import Contact from "../models/Contact.js";

export function listContacts() {
  return Contact.find();
}

export function addContact(data) {
  return Contact.create(data);
}

export function getContactById(contactId) {
  return Contact.findOne({ _id: contactId });
}

export function updateContactById(id, data) {
  return Contact.findByIdAndUpdate(id, data, {new: true, runValidators: true});
}

export function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}