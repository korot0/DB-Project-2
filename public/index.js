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

// 2) Check out a book and show the updated copy count.
const addBorrower = async () => {
  const card_no = document.querySelector("#checkout-card").value;
  const book_id = document.querySelector("#checkout-book").value;
  const branch_id = document.querySelector("#checkout-branch").value;
  const date_out = document.querySelector("#checkout-date-out").value;
  const due_date = document.querySelector("#checkout-due").value;

  if (!card_no || !book_id || !branch_id || !date_out || !due_date) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card_no: parseInt(card_no),
        book_id: parseInt(book_id),
        branch_id: parseInt(branch_id),
        date_out,
        due_date,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      renderCheckoutResult(data);
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Error checking out: " + err.message);
  }
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

// Load branches when page loads
loadBranches();
