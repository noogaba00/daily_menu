const resultEl = document.getElementById("result");
const pickBtn = document.getElementById("pickBtn");
const addToggleBtn = document.getElementById("addToggleBtn");
const cancelAddBtn = document.getElementById("cancelAddBtn");
const addForm = document.getElementById("addForm");
const nameInput = document.getElementById("nameInput");
const categoryInput = document.getElementById("categoryInput");
const listEl = document.getElementById("restaurantList");
const emptyMsg = document.getElementById("emptyMsg");

async function fetchRestaurants() {
  const res = await fetch("/api/restaurants");
  const data = await res.json();
  renderList(data);
}

function renderList(items) {
  listEl.innerHTML = "";
  if (items.length === 0) {
    emptyMsg.classList.remove("hidden");
    return;
  }
  emptyMsg.classList.add("hidden");

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "restaurant-item";
    li.innerHTML = `
      <span>
        <span class="name">${escapeHtml(item.name)}</span>
        ${item.category ? `<span class="category">${escapeHtml(item.category)}</span>` : ""}
      </span>
      <button class="delete-btn" data-id="${item.id}">삭제</button>
    `;
    listEl.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

pickBtn.addEventListener("click", async () => {
  pickBtn.disabled = true;
  resultEl.innerHTML = `<span class="placeholder">뽑는 중...</span>`;

  try {
    const res = await fetch("/api/random");
    const data = await res.json();

    if (!res.ok) {
      resultEl.innerHTML = `<span class="placeholder">${escapeHtml(data.error)}</span>`;
      return;
    }

    resultEl.innerHTML = `
      🎉 ${escapeHtml(data.name)}
      ${data.category ? `<span class="category-tag">${escapeHtml(data.category)}</span>` : ""}
    `;
  } catch (err) {
    resultEl.innerHTML = `<span class="placeholder">오류가 발생했습니다.</span>`;
  } finally {
    pickBtn.disabled = false;
  }
});

addToggleBtn.addEventListener("click", () => {
  addForm.classList.toggle("hidden");
  if (!addForm.classList.contains("hidden")) {
    nameInput.focus();
  }
});

cancelAddBtn.addEventListener("click", () => {
  addForm.classList.add("hidden");
  addForm.reset();
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const category = categoryInput.value.trim();

  if (!name) return;

  const res = await fetch("/api/restaurants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, category }),
  });

  if (res.ok) {
    addForm.reset();
    addForm.classList.add("hidden");
    fetchRestaurants();
  } else {
    const data = await res.json();
    alert(data.error || "추가에 실패했습니다.");
  }
});

listEl.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;
  const id = btn.dataset.id;
  if (!confirm("이 식당을 삭제할까요?")) return;

  await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
  fetchRestaurants();
});

fetchRestaurants();
