const express = require('express');
const axios = require('axios'); 
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const baseApiUrl = 'https://ykhedr00776-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai';

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "customer successfully registered, now you can login " });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${baseApiUrl}/books`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching book list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn; 
    try {
        const response = await axios.get(`${baseApiUrl}/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching book details" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author; 
    try {
        const response = await axios.get(`${baseApiUrl}/author/${author}`);
        res.status(200).json({ bookbyauthor: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title; 
    try {
        const response = await axios.get(`${baseApiUrl}/title/${title}`);
        res.status(200).json({ bookbytitle: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; 
  const book = books[isbn]; 
  if (book) {
      
      if (Object.keys(book.reviews).length >= 0) {
          res.status(200).json({ reviews: book.reviews });
      } 
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
