# digit-backend

Welcome to digit-ecoomerce, the backend API for digit eCommerce website. I created this API which provides various endpoints to manage products, product categories, blogs, blog categories, user authentication, and more for an online store.

## Table of Contents

- [Getting Started](#getting-started)
  - [Documentation](#documentation)
  - [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Products](#products)
  - [Product Categories](#product-categories)
  - [Blogs](#blogs)
- [Usage](#usage)
- [License](#license)

## [Getting Started](#getting-started)
Prerequisites

If you would like to use this api, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB installed and running
- Git installed (for cloning the repository)

## [Documentation](#documentation)
Documentation

[Digitic Documentation](https://documenter.getpostman.com/view/27910115/2s9YJhveXE)

### [Installation](#installation)

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/trillionclues/digit-backend.git
   ```

2. Install the required dependencies:

   ```
   cd digit-backend
   npm install OR yarn 
   ```

3. Configure your environment variables by creating a `.env` file and adding your settings:

   ```env
   PORT=5000
   DATABASE_URI=mongodb://localhost/your-database
   JWT_SECRET=your-jwt-secret
   MAIL_ID: GMAIL MAIL ID
   MP=GMAIL MAIL APP PASSWORD
   CLOUD_NAME=CLOUDINARY_NAME
   API_KEY=CLOUDINARY_api_KEY
   API_SECRET=CLOUDINARY_SECRET
   ```

4. Start the server:

   ```
   npm run dev
   ```

Now, the backend server should be up and running.


## [API Endpoints](#api-endpoints)
Access the API endpoints as described in the [API Endpoints](#api-endpoints) section below.

### [Authentication](#authentication)
- POST /api/user/register: Register a new user.
- POST /api/user/password: Change user password.
- POST /api/user/forgot-password-token: Change user password token.
- POST /api/user/login: Login an existing user.
- GET /api/user/logout: Logout the current user.
- GET /api/user/:id: Get the current user.
- GET /api/user/all-users: Get all users.
- DEL /api/user/:id: Delete the current users.

etc...
...

### [Products](#products)
- GET /api/product/: Get a list of all products.
- GET /api/product/:id: Get details of a specific product.
- POST /api/product: Create a new product.
- PUT /api/product/:id: Update an existing product.
- DELETE /api/product/:id: Delete a product.
...

### [Product Categories](#product-categories)
- GET /api/category/: Get a list of all product categories.
- GET /api/category/:id: Get details of a specific product category.
- POST /api/category: Create a new product category.
- PUT /api/category/:id: Update an existing product category.
- DELETE /api/category/:id: Delete a product category.
...

### [Blogs](#blogs)
- GET /api/blog: Get a list of all blogs.
- GET /api/blogs/:id: Get details of a specific blog.
- POST /api/blog: Create a new blog.
- PUT /api/blog/:id: Update an existing blog.
- PUT /api/blog/likes: Update blog post likes.
- PUT /api/blog/dislikes: Update blog post dislikes.
- DELETE /api/blog/:id: Delete a blog.
...


## [Usage](#usage)

- Make HTTP requests to the respective API endpoints using your favorite API client (e.g., Postman, Insomnia) or integrate them into your frontend application.

- Refer to the API endpoints documentation above for more details on request payloads and response formats.

## [License](#license)
This project is licensed under the MIT License.

Feel free to create an issue if yout think there is a bug or an error.

##WAGMI