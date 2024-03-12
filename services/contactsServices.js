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

/*
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = (contacts) => {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find(contact => contact.id === contactId);
  return result || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return result;
}

export async function addContact(data) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  }
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

export async function updateContactById(id, data) {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...data };
  await updateContacts(contacts);
  return contacts[index];
}
*/