const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
   const { username, password } = req.body; 

    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    
    if (authenticatedUser(username, password)) {
        
        const token = jwt.sign({ username }, "access", { expiresIn: '1h' });

        
        req.session.authorization = { accessToken: token };

        return res.status(200).json({ message: " customer successfully logged in " });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; 
  const { review } = req.query; 

  
  if (!review) {
      return res.status(400).json({ message: "Review is required" });
  }

 
  if (!req.session.authorization) {
      return res.status(403).json({ message: "User not authenticated" });
  }

  const username = req.session.authorization.username;

  
  const book = books[isbn];

  if (book) {
      
      const reviewStatus = book.reviews[username] ? 'updated' : 'added';
      
      
      book.reviews[username] = review;
      
      return res.status(200).json({
          message: `The review for the book with ISBN ${isbn} has been ${reviewStatus}.`
      });
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 

    
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    const username = req.session.authorization.username; 

    
    const book = books[isbn];

    if (book) {
        
        if (book.reviews[username]) {
            
            delete book.reviews[username];
            return res.status(200).json({
                message: `Reviews for the book with ISBN ${isbn} posted by the user ${username} have been deleted.`
            });
        } else {
            return res.status(404).json({ message: "Review not found" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
