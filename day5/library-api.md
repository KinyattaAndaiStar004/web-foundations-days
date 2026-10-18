
# Library API Design

## 1. Introduction

The Library API is a RESTful API designed to manage books in a library system. It allows users to retrieve, create, update, delete, and search for books.

Each book has the following information:

- `id`: Unique identifier for the book.
- `title`: Title of the book.
- `author`: Name of the author.
- `publishedYear`: Year the book was published.

## 2. API Endpoints

### Endpoint 1: Get All Books

- **Method:** GET
- **Path:** `/books`
- **Description:** Retrieves a list of all books in the library.
- **Success Status:** `200 OK`

**Example response:**

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publishedYear": 1958
  },
  {
    "id": 2,
    "title": "The River and the Source",
    "author": "Margaret Ogola",
    "publishedYear": 1994
  }
]
```

### Endpoint 2: Get a Single Book

- **Method:** GET
- **Path:** `/books/42`
- **Description:** Retrieves the details of a specific book using its ID.
- **Success Status:** `200 OK`

**Example response:**

```json
{
  "id": 42,
  "title": "Introduction to Computing",
  "author": "John Smith",
  "publishedYear": 2024
}
```

### Endpoint 3: Create a New Book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book in the library. The server generates a unique ID for the new book.
- **Success Status:** `201 Created`

**Example request body:**

```json
{
  "title": "Web Development Basics",
  "author": "Jane Doe",
  "publishedYear": 2025
}
```

**Example response:**

```json
{
  "id": 43,
  "title": "Web Development Basics",
  "author": "Jane Doe",
  "publishedYear": 2025
}
```

### Endpoint 4: Update a Book

- **Method:** PUT
- **Path:** `/books/42`
- **Description:** Replaces the details of an existing book using its ID.
- **Success Status:** `200 OK`

**Example request body:**

```json
{
  "title": "Advanced Computing",
  "author": "John Smith",
  "publishedYear": 2026
}
```

**Example response:**

```json
{
  "id": 42,
  "title": "Advanced Computing",
  "author": "John Smith",
  "publishedYear": 2026
}
```

### Endpoint 5: Delete a Book

- **Method:** DELETE
- **Path:** `/books/42`
- **Description:** Deletes the book with ID 42 from the library.
- **Success Status:** `204 No Content`
- **Response Body:** None. The book is deleted successfully.

### Endpoint 6: Search Books by Author

- **Method:** GET
- **Path:** `/books?author=Alice`
- **Description:** Retrieves books written by the specified author using the `author` query parameter.
- **Success Status:** `200 OK`

**Example response:**

```json
[
  {
    "id": 44,
    "title": "Learning JavaScript",
    "author": "Alice",
    "publishedYear": 2025
  }
]
```

## 3. Error Handling

The API uses HTTP status codes to communicate errors to clients.

### Error 1: 400 Bad Request

**Meaning:** The server cannot process a request because the supplied data is invalid or required information is missing.

**Example scenario:** A client attempts to create a book without providing its title.

**Example request:**

```http
POST /books
Content-Type: application/json
```

**Request body:**

```json
{
  "author": "Jane Doe",
  "publishedYear": 2025
}
```

**Error status:** `400 Bad Request`

**Example error response:**

```json
{
  "error": "Bad Request",
  "message": "The title field is required."
}
```

### Error 2: 404 Not Found

**Meaning:** The requested resource does not exist on the server.

**Example scenario:** A client requests a book with ID 999, but no book with that ID exists.

**Example request:**

```http
GET /books/999
```

**Error status:** `404 Not Found`

**Example error response:**

```json
{
  "error": "Not Found",
  "message": "Book with ID 999 was not found."
}
```

## 4. Summary

The Library API uses RESTful HTTP methods to manage books:

- `GET /books` retrieves all books.
- `GET /books/42` retrieves a specific book.
- `POST /books` creates a new book.
- `PUT /books/42` updates an existing book.
- `DELETE /books/42` deletes a book.
- `GET /books?author=Alice` retrieves books by a specified author.

The API uses appropriate HTTP status codes to communicate the outcome of each request:

- `200 OK`: The request was successful.
- `201 Created`: A new book was successfully created.
- `204 No Content`: A book was successfully deleted.
- `400 Bad Request`: The request contains invalid or missing data.
- `404 Not Found`: The requested book does not exist.

This API design provides a clear and consistent way for clients to interact with a library management system.
