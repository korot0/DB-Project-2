const buttons = document.querySelectorAll(".sidebar-btn");
const panels = document.querySelectorAll(".panel");

// Toggle displaying
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document
      .getElementById("panel-" + btn.dataset.panel)
      .classList.add("active");
  });
});

// 2) Add information about a new Borrower. Do not provide the CardNo in your query. Output the card number as if you are giving a new library card.
const addBorrower = async () => {
  const name = document.querySelector("#borrower-name").value;
  const address = document.querySelector("#borrower-address").value;
  const phone = document.querySelector("#borrower-phone").value;

  const res = await fetch(`/api/borrower`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      address,
      phone,
    }),
  });

  // Display card no
  const data = await res.json();
  displayCard(data.card_no);
};

const displayCard = (cardNo) => {
  const cardNoDisplay = document.querySelector("#card-no-display");
  cardNoDisplay.textContent = `Thank you, here is your library card: ${cardNo}`;
};

// 3) Add a new Book with publisher (user can use a publisher that already exists) and author information to all 5 branches with 5 copies for each branch. Submit your editable SQL query that your code executes.
const addBook = async () => {
  const title = document.querySelector("#book-title").value;
  const authorName = document.querySelector("#book-author").value;
  const publisher = document.querySelector("#book-publisher").value;

  const res = await fetch(`/api/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      authorName,
      publisher,
    }),
  });

  // Alert data
  const data = await res.json();
  alert(data.message);
};

// 4) Given a book title list the number of copies loaned out per branch.
const copiesPerBranch = async () => {
  const title = document.querySelector("#copies-title").value;

  const res = await fetch(`/api/copies?title=${title}`);

  // TODO: Display data
  const data = await res.json();
  console.log(data);
};

// 5) Given a due date range, list the loans that were returned late, sorted by how late they were and then by due date.
const lateReturns = async () => {
  const from = document.querySelector("#late-from").value;
  const to = document.querySelector("#late-to").value;

  if (!from || !to) {
    alert("Please select both From and To dates");
    return;
  }

  try {
    const res = await fetch(`/api/late?from=${from}&to=${to}`);
    const data = await res.json();
    
    if (res.ok) {
      renderLateResults(data);
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Error fetching late returns: " + err.message);
  }
};

// 6a) Search by borrower to view late fee balance
const feesSearchBorrower = async () => {
  const card_no = document.querySelector("#fees-borrower-id").value;
  const name = document.querySelector("#fees-borrower-name").value;

  const params = new URLSearchParams();
  if (card_no) params.append("card_no", card_no);
  if (name) params.append("name", name);

  try {
    const res = await fetch(`/api/fees/borrower?${params}`);
    const data = await res.json();
    
    if (res.ok) {
      renderFeesBorrowerResults(data);
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Error searching fees: " + err.message);
  }
};

// 6b) Search by book to view late fees for a borrower
const feesSearchBook = async () => {
  const card_no = document.querySelector("#fees-book-borrower").value;
  const search = document.querySelector("#fees-book-search").value;

  if (!card_no) {
    alert("Borrower ID is required");
    return;
  }

  const params = new URLSearchParams();
  params.append("card_no", card_no);
  if (search) params.append("search", search);

  try {
    const res = await fetch(`/api/fees/book?${params}`);
    const data = await res.json();
    
    if (res.ok) {
      renderFeesBookResults(data);
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Error searching fees: " + err.message);
  }
};

// Render fees borrower results
const renderFeesBorrowerResults = (rows) => {
  const tbody = document.querySelector("#fees-borrower-results");
  
  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty">No results found</td></tr>`;
    return;
  }
  
  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.borrower_id}</td>
      <td>${row.borrower_name}</td>
      <td>${row.late_fee_balance}</td>
    </tr>
  `).join("");
};

// Render fees book results
const renderFeesBookResults = (rows) => {
  const tbody = document.querySelector("#fees-book-results");
  
  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">No results found</td></tr>`;
    return;
  }
  
  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.borrower_id}</td>
      <td>${row.book_title}</td>
      <td>${row.date_out}</td>
      <td>${row.due_date}</td>
      <td>${row.late_fee}</td>
    </tr>
  `).join("");
};

// Render late returns results
const renderLateResults = (rows) => {
  const tbody = document.querySelector("#late-results");
  
  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">No late returns found</td></tr>`;
    return;
  }
  
  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.card_no}</td>
      <td>${row.book_title}</td>
      <td>${row.due_date}</td>
      <td>${row.returned_date}</td>
      <td>${row.days_late}</td>
    </tr>
  `).join("");
};

// Load branches into dropdown on page load
const loadBranches = async () => {
  try {
    const res = await fetch("/api/branches");
    const branches = await res.json();
    const branchSelect = document.querySelector("#checkout-branch");
    
    branches.forEach((branch) => {
      const option = document.createElement("option");
      option.value = branch.branch_id;
      option.textContent = branch.branch_name;
      branchSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading branches:", err);
  }
};

// Render checkout result
const renderCheckoutResult = (data) => {
  const tbody = document.querySelector("#checkout-results");
  tbody.innerHTML = `
    <tr>
      <td>${data.book_id}</td>
      <td>${data.branch_id}</td>
      <td>${data.no_of_copies}</td>
    </tr>
  `;
};

// Wire checkout button
document.querySelector("#panel-checkout .btn-primary").addEventListener("click", addBorrower);

// Wire late returns button
document.querySelector("#panel-late .btn-primary").addEventListener("click", lateReturns);

// Wire fees borrower and book buttons
const feesBorrowerButton = document.querySelectorAll("#panel-fees .card .btn-primary")[0];
const feesBookButton = document.querySelectorAll("#panel-fees .card .btn-primary")[1];
feesBorrowerButton.addEventListener("click", feesSearchBorrower);
feesBookButton.addEventListener("click", feesSearchBook);

// Load branches when page loads
loadBranches();
