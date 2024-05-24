const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Books = require("../models/book");

let book;

describe("Books routes Test", function () {

    beforeEach(async function () {
        await db.query("DELETE FROM books");
        book = {
            "isbn": "test0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        };
        let b1 = await Books.create(book);
    });

    afterEach(async () => {
        await db.query(`DELETE FROM books`)
    });
   
    describe("GET /", function () {
        test("show all books", async function () {
            let response = await request(app).get("/books/");
            expect(response.statusCode).toEqual(200)
            expect(response.body).toEqual({books: [book]})

        });
    });
    
    describe("GET /:isbn", function () {
        test("can get one book", async function () {
            let response = await request(app).get(`/books/${book.isbn}`);    
            expect(response.statusCode).toEqual(200)
            expect(response.body).toEqual({book: book})
        });

        test('cannot get invalid book isbn', async function () {
            let book2 = book;
            book2.isbn = 5;
            let response = await request(app).get(`/books/${book2.isbn}`);
            expect(response.statusCode).toEqual(404);
        });
    });

    describe("POST /", function () {
        test("post a new book", async function () {
            let book2 = book;
            book2.isbn = "1";
            let response = await request(app).post("/books/").send({"book": book2});
            expect(response.statusCode).toEqual(201);
            expect(response.body).toEqual({book: book2})
        });

        test('cannot post invalid book data', async function () {
            let book2 = book;
            book2.isbn = 5;
            let response = await request(app).post("/books/").send({"book": book2});
            expect(response.statusCode).toEqual(400);
        });
    });

    describe("PUT /:isbn", function () {
        test("can update a book", async function () {
            let book2 = {
                "isbn": "test0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Test tesing",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            };       
            let response = await request(app).put(`/books/${book.isbn}`).send({"book": book2});    
            expect(response.statusCode).toEqual(200)
            expect(response.body).toEqual({book: book2})
        });
        test('cannot updated invalid book data', async function () {
            let book2 = {
                "isbn": 5,
                "amazon_url": 5,
                "author": "Test tesing",
                "language": "english",
                "pages": "264",
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            };     
            let response = await request(app).post("/books/").send({"book": book2});
            expect(response.statusCode).toEqual(400);
        });
    });

    describe("DELETE /:isbn", function () {
        test("delete a book", async function () {
            let response = await request(app).delete(`/books/${book.isbn}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({ message: "Book deleted" })
        });
    });


});
  
afterAll(async function () {
    await db.end();
});