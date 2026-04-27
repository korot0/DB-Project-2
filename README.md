# Backend – LMS Rental Project (Node.js + Express + SQLite3)

---

## 1. Set up your project

Run this in your terminal at the root of `DB-Project-2`:

```
npm init
```

It will prompt you with questions — press `Enter` through all of them except **entry point**, where you should type `server.js`. This creates a `package.json` file which tracks your project's dependencies.

Then install your packages:

```
npm install express better-sqlite3 cors
```

This creates a `node_modules/` folder and a `package-lock.json` — don't touch either of those.

---

## 2. Set up `db.js`

This file's only job is to open your `library.db` file and export the connection so your route files can use it. At the top you import `better-sqlite3`, point it at your database file, and export it.

Docs: [better-sqlite3 – opening a database](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#new-databasepath-options)

---

## 3. Set up `server.js`

This is your main file — the one you'll run to start the server. It needs to do the following in order:

1. Import Express and CORS
2. Create the Express app with `const app = express()`
3. Apply middleware — `cors()` so your frontend can talk to it, and `express.json()` so it can read request bodies
4. Serve your `public/` folder statically with `express.static()` — this means visiting `localhost:3000` will load your `index.html` automatically
5. Import and register each route file
6. Start listening on a port with `app.listen(3000)`

Docs: [Express hello world](https://expressjs.com/en/starter/hello-world.html), [express.static()](https://expressjs.com/en/starter/static-files.html)

You start the server by running:

```
node server.js
```

Then open `http://localhost:3000` in your browser.

---

## 4. Route files

Each route file follows the same pattern:

1. Import Express and create a router with `express.Router()`
2. Import your `db.js` connection
3. Define your route (GET or POST) — inside it, run your SQL query and send the result back as JSON
4. Export the router

Then in `server.js` you register it like `app.use('/checkout', checkoutRouter)` — meaning your frontend will call `http://localhost:3000/checkout` to hit that route.

Docs: [Express Router](https://expressjs.com/en/4x/api.html#router), [res.json()](https://expressjs.com/en/4x/api.html#res.json)

### Specific notes per route

- **`checkout.js`** — `POST` because you're inserting data. Your frontend sends Card No, Book ID, Branch ID, and dates in the request body (`req.body`). Insert into `Book_Loan`, then query `Book_Copies` for the updated row and return it. The copy decrement happens automatically via trigger — you don't write that in JS.

- **`borrower.js`** — `POST`. Insert without CardNo. After inserting, `better-sqlite3` gives you back `lastInsertRowid` which is the auto-generated CardNo — use that to query the new row and return it.

- **`book.js`** — `POST`. You're doing multiple inserts (Book, Book_Authors, and 5 rows in Book_Copies). Wrap them all in a `better-sqlite3` transaction so if one fails they all roll back. Docs: [transactions](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#transactionfunction---function)

- **`copies.js`** — `GET`. The book title comes from the URL as a query parameter, e.g. `/copies?title=Dune`. Access it via `req.query.title`. Docs: [req.query](https://expressjs.com/en/4x/api.html#req.query)

- **`late.js`** — `GET`. Two query parameters for the date range, e.g. `/late?from=2024-01-01&to=2024-12-31`.

- **`fees.js`** — Two separate routes in one file. `/fees/borrower` for 6a and `/fees/book` for 6b. Both query `vBookLoanInfo`. All filter parameters are optional except Borrower ID in 6b — handle missing parameters with an `if` check before building your query.

### For running SQL in better-sqlite3

- `.all()` — returns an array of rows (use for tables)
- `.get()` — returns a single row (use after INSERT to fetch the new record)
- `.run()` — executes without returning rows (use for INSERT/UPDATE)

Docs: [.all() / .get() / .run()](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#allbindparameters---array-of-rows)

---

## 5. Frontend fetch calls

Once your backend is running, go into your `index.html` and add event listeners to each submit button. Each one should:

1. Grab the input values from the form fields
2. Call `fetch()` pointing at the correct route
3. Parse the JSON response
4. Loop through the results and build `<tr>` rows to inject into the result table

Docs: [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
