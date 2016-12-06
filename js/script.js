// Model
var contactList = {
  contacts: [],
  addContact: function (address, name, phone_number) {
    this.contacts.push({
      address: address,
      name: name,
      phone_number: phone_number
    });
  },
  editContact: function (position, address, name, phone_number) {
    this.contacts[position].address = address;
    this.contacts[position].name = name;
    this.contacts[position].phone_number = phone_number;
  },
  deleteContact: function (position) {
    this.contacts.splice(position, 1);
  },
  sortContactsByAddress: function () {
    this.contacts.sort((function (property) {
      return function (a, b) {
        return (a[property] === b[property] ? 0 : (a[property] < b[property] ? -1 : 1));
      };
    })('address'));
  },
  sortContactsByName: function () {
    this.contacts.sort((function (property) {
      return function (a, b) {
        return (a[property] === b[property] ? 0 : (a[property] < b[property] ? -1 : 1));
      };
    })('name'));
  },
  sortContactsByPhoneNumber: function () {
    this.contacts.sort((function (property) {
      return function (a, b) {
        return (a[property] === b[property] ? 0 : (a[property] < b[property] ? -1 : 1));
      };
    })('phone_number'));
  },
  searchContacts: function (query) {
    var filtered = [];
    this.contacts.forEach(function (contact) {
      for (var property in contact) {
        if (contact[property].toLowerCase().includes(query.toLowerCase())) {
          var match = true;
          break;
        }
      }
      if (match) {
        function findMatch(originalContact) {
          return originalContact == contact;
        }
        filtered.push(contactList.contacts.filter(findMatch)[0]);
      }
    })
    return filtered;
  }
};

// View
var view = {
  displayContacts: function (contacts) {
    var contactsUl = document.querySelector('ul');
    if (!contacts)
      contacts = contactList.contacts;
    contactsUl.innerHTML = '';
    contacts.forEach(function (contact, position) {
      var contactLi = document.createElement('li');
      var contactA = document.createElement('a');
      contactLi.innerHTML = '<span class="contact">' + contact.name + '<span/>' + ' ' + contact.phone_number + ' ' + contact.address;
      contactLi.id = position;
      contactLi.appendChild(this.createDeleteButton());
      contactA.appendChild(contactLi);
      contactA.href = 'javascript:void(0)';
      contactsUl.appendChild(contactA);
    }, this)
  },
  createDeleteButton: function () {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.className = 'btn btn-danger';
    return deleteButton;
  },
  setupEventListeners: function () {
    var contactsUl = document.querySelector('ul');
    contactsUl.addEventListener('click', function (event) {
      var elementClicked = event.target;
      if (elementClicked.tagName === 'LI') {
        view.selectedContactId = parseInt(elementClicked.id);
        handlers.getContact(parseInt(elementClicked.id));
      }
      if (elementClicked.tagName === 'BUTTON') {
        handlers.deleteContact(parseInt(elementClicked.parentElement.id));
      }
    })
  }
}
view.setupEventListeners();

// Controller
var handlers = {
  // Add
  addContact: function () {
    var addContactAddressTextInput = document.getElementById('addContactAddressTextInput');
    var addContactNameTextInput = document.getElementById('addContactNameTextInput'); //
    var addContactPhoneNumberTextInput = document.getElementById('addContactPhoneNumberTextInput');
    contactList.addContact(addContactAddressTextInput.value, addContactNameTextInput.value, addContactPhoneNumberTextInput.value);
    addContactAddressTextInput.value = '';
    addContactNameTextInput.value = '';
    addContactPhoneNumberTextInput.value = '';
    this.sortContactsByName();
    view.displayContacts();
  },
  // Edit
  getContact: function (id) {
    var contact = contactList.contacts[id];
    var editContactAddressTextInput = document.getElementById('editContactAddressTextInput');
    var editContactNameTextInput = document.getElementById('editContactNameTextInput');
    var editContactPhoneNumberTextInput = document.getElementById('editContactPhoneNumberTextInput');
    editContactAddressTextInput.parentElement.parentElement.id = id;
    editContactAddressTextInput.value = contact.address;
    editContactNameTextInput.value = contact.name;
    editContactPhoneNumberTextInput.value = contact.phone_number;
  },
  editContact: function (id) {
    var editContactAddressTextInput = document.getElementById('editContactAddressTextInput');
    var editContactNameTextInput = document.getElementById('editContactNameTextInput');
    var editContactPhoneNumberTextInput = document.getElementById('editContactPhoneNumberTextInput');
    if (id)
      contactList.editContact(id, editContactAddressTextInput.value, editContactNameTextInput.value, editContactPhoneNumberTextInput.value);
    editContactAddressTextInput.value = '';
    editContactNameTextInput.value = '';
    editContactPhoneNumberTextInput.value = '';
    view.displayContacts();
  },
  // Delete
  deleteContact: function (id) {
    contactList.deleteContact(id);
    if (id === view.selectedContactId)
      this.editContact(); // Clear textInputs
    view.displayContacts();
  },
  // Sorts
  sortContactsByAddress: function () {
    contactList.sortContactsByAddress();
    view.displayContacts();
  },
  sortContactsByName: function () {
    contactList.sortContactsByName();
    view.displayContacts();
  },
  sortContactsByPhoneNumber: function () {
    contactList.sortContactsByPhoneNumber();
    view.displayContacts();
  },
  searchContacts: function () {
    var searchContactTextInput = document.getElementById('searchContactTextInput').value;
    var filtered = contactList.searchContacts(searchContactTextInput);
    view.displayContacts(filtered);
  }
}

// Get sample data
function getJSON(url) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.onload = function () {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(Error('Request didn\'t load successfully; error code:' + request.statusText));
      }
    }
    request.onerror = function () {
      reject(Error('There was a network error.'));
    };
    request.send();
  });
};
getJSON("json/581335f71000004204abaf83").then(function (response) {
  contactList.contacts = response.contacts;
  handlers.sortContactsByName();
  view.displayContacts();
}, function (Error) {
  console.log(Error);
});