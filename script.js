// Point this to your Vercel project API
const API_BASE = 'https://maisoncuration.vercel.app/api';

const FAMILY_PASSPHRASE = "Porsche";
let currentProfile = 'mat';
let currentCategory = 'shirts';
let currentHomeCategory = 'all';

const defaultArchive = {
  profiles: {
    mat: {
      name: "Mathew's Archive",
      categories: {
        shirts: [
          {
            name: "Black Gran Sasso Polo",
            brand: "Gran Sasso",
            price: "$350",
            url: "",
            image:
              "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop",
            tags: ["100% Merino"],
          },
        ],
        jackets: [
          {
            name: "Plaid Wool Jacket",
            brand: "Massimo Dutti",
            price: "$450",
            url: "",
            image:
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
            tags: ["Wool"],
          },
        ],
        pants: [],
        blazers: [],
        shoes: [],
        fragrance: [
          {
            name: "Tom Ford Private Blend",
            brand: "Tom Ford",
            price: "$310",
            url: "",
            image:
              "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop",
            tags: ["Leather"],
          },
        ],
        sweaters: [
          {
            name: "Charcoal Grey Quarter-Zip",
            brand: "Isaia",
            price: "$520",
            url: "",
            image:
              "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
            tags: ["Fine Knit"],
          },
        ],
        watches: [
          {
            name: "Suede-Yoke Puffer Vest",
            brand: "Brunello Cucinelli",
            price: "$1,800",
            url: "",
            image:
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
            tags: ["Outerwear"],
          },
        ],
        gifts: [
          {
            name: "Vintage Driver Sunglasses",
            brand: "Persol",
            price: "$320",
            url: "",
            image:
              "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop",
            tags: ["Gift Idea"],
          },
        ],
      },
    },
    krystin: {
      name: "Krystin's Archive",
      categories: {
        shirts: [],
        jackets: [],
        pants: [],
        blazers: [
          {
            name: "Ribbed Knit Blazer",
            brand: "Gran Sasso",
            price: "$420",
            url: "",
            image:
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop",
            tags: ["Black Merino"],
          },
        ],
        shoes: [],
        fragrance: [
          {
            name: "Ojai Eau de Parfum",
            brand: "L'Objet",
            price: "$195",
            url: "",
            image:
              "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop",
            tags: ["100ml"],
          },
        ],
        sweaters: [],
        watches: [],
        gifts: [
          {
            name: "Rose Noire de Parfum",
            brand: "L'Objet",
            price: "$225",
            url: "",
            image:
              "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop",
            tags: ["Gift Idea"],
          },
        ],
      },
    },
    kids: {
      name: "Kids' Archive",
      categories: {
        shirts: [],
        jackets: [],
        pants: [],
        blazers: [],
        shoes: [],
        fragrance: [],
        sweaters: [],
        watches: [],
        gifts: [
          {
            name: "Custom Travel Map Placemats",
            brand: "Custom",
            price: "",
            url: "",
            image:
              "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
            tags: ["Travel"],
          },
        ],
      },
    },
  },
  furniture: [
    {
      name: "Custom Built-in Closets",
      brand: "Architectural Millwork",
      room: "Master Suite",
      category: "bedroom",
      price: "$8,500",
      url: "",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
      tags: ["Wood Paneling"],
    },
  ],
};

let archiveData =
  JSON.parse(localStorage.getItem("maisonArchive")) || defaultArchive;

function saveArchive() {
  localStorage.setItem("maisonArchive", JSON.stringify(archiveData));
}

/* LOGIN */

function handleLogin(event) {
  event.preventDefault();
  const val = document.getElementById("passphraseInput").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (val === FAMILY_PASSPHRASE) {
    localStorage.setItem("maisonAuth", "unlocked");
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app-content").style.display = "block";
  } else {
    errorMsg.style.display = "block";
    document.getElementById("passphraseInput").value = "";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("reset") === "true") {
    localStorage.removeItem("maisonAuth");
  }

  if (localStorage.getItem("maisonAuth") === "unlocked") {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app-content").style.display = "block";
  } else {
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("app-content").style.display = "none";
  }
});

/* VIEW SWITCHING */

function switchView(viewName) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));

  if (viewName === "home") {
    document.getElementById("view-home").classList.add("active");
    document
      .querySelector('.nav-btn[onclick*="home"]')
      ?.classList.add("active");
  } else if (viewName === "home-furniture") {
    document.getElementById("view-furniture").classList.add("active");
    document
      .querySelector('.nav-btn[onclick*="home-furniture"]')
      ?.classList.add("active");
    setupHomeSubTabs();
    renderFurniture();
  }
}

/* PROFILE OPENING */

function openProfile(profileKey) {
  currentProfile = profileKey;
  const profile = archiveData.profiles[profileKey];
  document.getElementById("profile-heading").innerText = profile.name;
  document.getElementById("form-owner-label").innerText = profile.name;

  const categories = [
    { key: "shirts", label: "Shirts" },
    { key: "jackets", label: "Jackets" },
    { key: "pants", label: "Pants" },
    { key: "blazers", label: "Blazers" },
    { key: "shoes", label: "Shoes" },
    { key: "fragrance", label: "Fragrance" },
    { key: "sweaters", label: "Sweaters" },
    { key: "watches", label: "Watches & Acc." },
    { key: "gifts", label: "Gift Ideas" },
  ];

  const subTabsContainer = document.getElementById("profile-sub-tabs");
  subTabsContainer.innerHTML = "";
  categories.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.className = `sub-tab-btn ${index === 0 ? "active" : ""}`;
    btn.innerText = cat.label;
    btn.onclick = () => {
      document
        .querySelectorAll(".sub-tab-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = cat.key;
      renderProfileItems();
    };
    subTabsContainer.appendChild(btn);
  });

  currentCategory = categories[0].key;
  renderProfileItems();

  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById("view-profile").classList.add("active");
}

/* HOME SUB-TABS (FOREVER HOME) */

function setupHomeSubTabs() {
  const categories = [
    { key: 'all', label: 'All' },
    { key: 'furniture', label: 'Furniture' },
    { key: 'fixtures', label: 'Fixtures' },
    { key: 'lights', label: 'Lights' },
    { key: 'tiles', label: 'Tiles' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'living-room', label: 'Living Room' },
    { key: 'bathroom', label: 'Bathroom' },
    { key: 'bedroom', label: 'Bedroom' },
    { key: 'yard', label: 'Yard' },
    { key: 'garage', label: 'Garage' },
    { key: 'gym', label: 'Gym' },
  ];

  const container = document.getElementById('home-sub-tabs');
  if (!container) return;

  container.innerHTML = '';
  categories.forEach((cat, index) => {
    const btn = document.createElement('button');
    btn.className = `sub-tab-btn ${index === 0 ? 'active' : ''}`;
    btn.innerText = cat.label;
    btn.onclick = () => {
      document
        .querySelectorAll('#home-sub-tabs .sub-tab-btn')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentHomeCategory = cat.key;
      renderFurniture();
    };
    container.appendChild(btn);
  });

  currentHomeCategory = 'all';
}

/* SMART EXTRACT (APPAREL) */

async function smartExtractFromLink() {
  const urlInputEl = document.getElementById("itemUrl");
  const urlInput = urlInputEl.value.trim();
  if (!urlInput) return;

  const autoNotice = document.getElementById("autoNotice");
  autoNotice.innerText = "⏳ Fetching details from product page...";

  try {
    const res = await fetch(
      `${API_BASE}/get-product-meta?url=${encodeURIComponent(urlInput)}`
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    // { url, title, brand, name, image, screenshotUrl }

    document.getElementById("itemBrand").value = data.brand || "";
    document.getElementById("itemName").value = data.name || "";
    document.getElementById("itemImg").value =
      data.image || data.screenshotUrl || "";

    const fullLower = (urlInput + " " + (data.title || "")).toLowerCase();
    let detected = "shirts";
    if (/shirt|polo|tee|top|button/i.test(fullLower)) detected = "shirts";
    else if (/jacket|puffer|coat|outerwear|vest/i.test(fullLower))
      detected = "jackets";
    else if (/pant|trousers|jean|chino|denim/i.test(fullLower))
      detected = "pants";
    else if (/blazer|sportcoat|suit/i.test(fullLower)) detected = "blazers";
    else if (/shoe|boot|loafer|sneaker|footwear|ghillie/i.test(fullLower))
      detected = "shoes";
    else if (/fragrance|perfume|cologne|scent|eau|parfum/i.test(fullLower))
      detected = "fragrance";
    else if (/sweater|knit|cardigan|pullover|quarter/i.test(fullLower))
      detected = "sweaters";
    else if (/watch|belt|bag|accessory|sunglasses|wallet|vest/i.test(fullLower))
      detected = "watches";
    else if (/gift|present|wishlist/i.test(fullLower)) detected = "gifts";

    document.getElementById("itemCategory").value = detected;

    autoNotice.innerText = `✨ Brand: ${data.brand || "Unknown Brand"} | Item: ${
      data.name || "Item"
    } (Preview ready)`;
  } catch (err) {
    console.error("smartExtractFromLink error:", err);
    document.getElementById("autoNotice").innerText =
      "⚠️ Could not auto-fetch details (you can fill them in manually).";
  }
}

/* SMART EXTRACT (FURNITURE – heuristic only) */

function smartExtractFurniture() {
  const urlInput = document.getElementById("furnUrl").value.trim();
  if (!urlInput) return;

  try {
    const urlObj = new URL(urlInput);
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(
      urlInput
    )}&screenshot=true&embed=screenshot.url`;
    document.getElementById("furnImg").value = screenshotUrl;

    const hostname = urlObj.hostname.replace("www.", "");
    const pathSegments = urlObj.pathname.split("/").filter(Boolean);

    let guessedMaker = hostname.split(".")[0];
    guessedMaker =
      guessedMaker.charAt(0).toUpperCase() + guessedMaker.slice(1);

    let guessedPiece =
      pathSegments.length > 0
        ? pathSegments[pathSegments.length - 1]
        : "Furniture Piece";
    guessedPiece = guessedPiece
      .replace(/[-_]+/g, " ")
      .replace(/\.\w+$/, "");
    guessedPiece = guessedPiece
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    document.getElementById("furnMaker").value = guessedMaker;
    document.getElementById("furnName").value = guessedPiece;
    document.getElementById("furnRoom").value = "Living Space";
    document.getElementById("furnAutoNotice").innerText =
      "✨ Furniture details & screenshot captured successfully";
  } catch (e) {
    console.error("smartExtractFurniture error:", e);
  }
}

/* RENDERING – PROFILE */

function renderProfileItems() {
  const grid = document.getElementById("profile-product-grid");
  grid.innerHTML = "";
  const items =
    archiveData.profiles[currentProfile].categories[currentCategory] || [];

  if (items.length === 0) {
    grid.innerHTML =
      `<p style="color: var(--text-muted); font-size: 0.9rem;">No items cataloged in this category yet.</p>`;
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    const tagsHtml = item.tags
      ? item.tags.map((t) => `<span class="tag">${t}</span>`).join("")
      : "";
    const linkHtml = item.url
      ? `<a href="${item.url}" target="_blank" class="product-link">View Product &rarr;</a>`
      : "<span></span>";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="card-thumbnail" />
      <div class="card-body">
        <div>
          <h4>${item.name}</h4>
          <div class="product-meta">
            ${item.brand}${item.price ? ` • ${item.price}` : ""}
          </div>
          <div class="tags-container">${tagsHtml}</div>
        </div>
        <div class="card-footer-actions">
          ${linkHtml}
          <button class="delete-btn" onclick="deleteProfileItem(${index})">Remove</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function deleteProfileItem(index) {
  if (confirm("Are you sure you want to remove this item from the archive?")) {
    archiveData.profiles[currentProfile].categories[currentCategory].splice(
      index,
      1
    );
    saveArchive();
    renderProfileItems();
  }
}

/* RENDERING – FOREVER HOME */

function renderFurniture() {
  const grid = document.getElementById("furniture-product-grid");
  grid.innerHTML = "";
  const allItems = archiveData.furniture || [];

  const items =
    currentHomeCategory === 'all'
      ? allItems
      : allItems.filter(
          (item) =>
            (item.category || '').toLowerCase() ===
            currentHomeCategory.toLowerCase()
        );

  if (items.length === 0) {
    grid.innerHTML =
      `<p style="color: var(--text-muted); font-size: 0.9rem;">No items in this category yet.</p>`;
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    const tagsHtml = item.tags
      ? item.tags.map((t) => `<span class="tag">${t}</span>`).join("")
      : "";
    const linkHtml = item.url
      ? `<a href="${item.url}" target="_blank" class="product-link">View Product &rarr;</a>`
      : "<span></span>";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="card-thumbnail" />
      <div class="card-body">
        <div>
          <h4>${item.name}</h4>
          <div class="product-meta">
            ${item.brand} • Room: ${item.room || ''}${
      item.price ? ` • ${item.price}` : ""
    }
          </div>
          <div class="tags-container">${tagsHtml}</div>
        </div>
        <div class="card-footer-actions">
          ${linkHtml}
          <button class="delete-btn" onclick="deleteFurnitureItem(${index})">Remove</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function deleteFurnitureItem(index) {
  if (
    confirm(
      "Are you sure you want to remove this piece from the Forever Home archive?"
    )
  ) {
    archiveData.furniture.splice(index, 1);
    saveArchive();
    renderFurniture();
  }
}

/* FORM HANDLERS */

function handleAddItem(event) {
  event.preventDefault();
  const category = document.getElementById("itemCategory").value;
  const name = document.getElementById("itemName").value;
  const brand = document.getElementById("itemBrand").value;
  const priceEl = document.getElementById("itemPrice");
  const price = priceEl ? priceEl.value.trim() : "";
  const url = document.getElementById("itemUrl").value;
  const image =
    document.getElementById("itemImg").value ||
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop";

  const newItem = { name, brand, price, url, image, tags: [brand] };
  archiveData.profiles[currentProfile].categories[category].push(newItem);
  saveArchive();
  renderProfileItems();
  document.getElementById("addItemForm").reset();
  document.getElementById("autoNotice").innerText =
    "✨ Paste a link to auto-extract details and generate screenshot";
}

function handleAddFurniture(event) {
  event.preventDefault();
  const name = document.getElementById("furnName").value;
  const brand = document.getElementById("furnMaker").value;
  const room = document.getElementById("furnRoom").value;
  const priceEl = document.getElementById("furnPrice");
  const price = priceEl ? priceEl.value.trim() : "";
  const category = document.getElementById("furnCategory").value;
  const url = document.getElementById("furnUrl").value;
  const image =
    document.getElementById("furnImg").value ||
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop";

  const newFurn = {
    name,
    brand,
    room,
    price,
    category,
    url,
    image,
    tags: [room, category],
  };
  archiveData.furniture.push(newFurn);
  saveArchive();
  renderFurniture();
  document.getElementById("addFurnitureForm").reset();
  document.getElementById("furnAutoNotice").innerText =
    "✨ Paste a link to auto-extract details and screenshot";
}
