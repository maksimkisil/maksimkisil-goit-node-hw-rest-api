const { v4 } = require("uuid");

const fs = require("fs/promises");

const FILE_PATH = require("./contactsPath");

const listContacts = async () => {
  const contacts = JSON.parse(await fs.readFile(FILE_PATH));
 

  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await listContacts();
  const result = contact.find(({ id }) => id === contactId);

  if (!result) {
    return null;
  }

  return result;
};

const updateContacts = async (contacts) => {
  await fs.writeFile(FILE_PATH, JSON.stringify(contacts, null, 2));
};

const addContact = async (body) => {
  const newContact = { id: v4(), ...body };
  const contacts = await listContacts();

  contacts.push(newContact);

  await updateContacts(contacts);

  return newContact;
};

const updateContactById = async (contactId, body) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);

  if (idx === -1) {
    return null;
  }

  contacts[idx] = { id: contactId, ...body };
  await updateContacts(contacts);
  return contacts[idx];
};

const removeContactById = async (contactId) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);

  if (idx === -1) {
    return null;
  }

  const newContacts = contacts.filter((_, index) => index !== idx);
  await updateContacts(newContacts);
  return contacts[idx];

};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
};
