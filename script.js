async function smartExtractFromLink() {
  const input = document.getElementById("itemUrl");
  const urlInput = input.value.trim();
  if (!urlInput) return;

  const autoNotice = document.getElementById("autoNotice");
  autoNotice.innerText = "⏳ Fetching details from product page...";

  // Always prepare a Microlink screenshot URL on the front-end
  const screenshotUrl =
    `https://api.microlink.io/?url=${encodeURIComponent(
      urlInput
    )}&screenshot=true&embed=screenshot.url`;

  let brand = "";
  let name = "";
  let image = screenshotUrl; // default to screenshot

  try {
    const res = await fetch(
      `${API_BASE}/get-product-meta?url=${encodeURIComponent(urlInput)}`
    );

    if (res.ok) {
      const data = await res.json();
      brand = data.brand || "";
      name = data.name || "";
      // Prefer OG/Twitter image if API got one, otherwise our screenshot
      image = data.image || data.screenshotUrl || screenshotUrl;
    }
  } catch (e) {
    // API failed (like 403 from target site); we'll rely on URL heuristics + screenshot
    console.warn("API metadata fetch failed; falling back to URL heuristics");
  }

  // Fallback brand detection if API didn't give a clear brand
  if (!brand) {
    try {
      const urlObj = new URL(urlInput);
      const host = urlObj.hostname.toLowerCase();

      // Known luxury brands map
      const luxuryMap = {
        "gransasso": "Gran Sasso",
        "gran-sasso": "Gran Sasso",
        "shop.gransasso.it": "Gran Sasso",
        "brunello": "Brunello Cucinelli",
        "cucinelli": "Brunello Cucinelli",
        "brunellocucinelli": "Brunello Cucinelli",
        "zegna": "Zegna",
        "loro": "Loro Piana",
        "loropiana": "Loro Piana",
        "isaia": "Isaia",
        "tom-ford": "Tom Ford",
        "tomford": "Tom Ford",
        "massimodutti": "Massimo Dutti",
        "massimo-dutti": "Massimo Dutti"
      };

      const fullUrlLower = urlInput.toLowerCase();
      for (const key in luxuryMap) {
        if (fullUrlLower.includes(key)) {
          brand = luxuryMap[key];
          break;
        }
      }

      // If still not found, derive from hostname
      if (!brand) {
        let base = host.replace(/^www\./, '');
        base = base.split('.')[0];
        brand = base.charAt(0).toUpperCase() + base.slice(1);
      }
    } catch {
      brand = "Curated Brand";
    }
  }

  // Fallback name detection from URL slug if API didn't give one
  if (!name) {
    try {
      const urlObj = new URL(urlInput);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      let rawSlug =
        pathSegments.length > 0
          ? pathSegments[pathSegments.length - 1]
          : "Curated Item";

      // Strip file extensions and trailing numeric codes
      rawSlug = rawSlug.replace(/\.\w+$/, '');
      rawSlug = rawSlug.replace(/[0-9]+$/, '');

      const words = rawSlug
        .split(/[-_]+/)
        .filter((w) =>
          ![
            "en","it","fr","de",
            "product","products","item","listing",
            "men","wom","women","kids","shop"
          ].includes(w.toLowerCase())
        );

      name = words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
        .trim();

      if (!name) name = "Curated Item";
    } catch {
      name = "Curated Item";
    }
  }

  document.getElementById("itemBrand").value = brand;
  document.getElementById("itemName").value = name;
  document.getElementById("itemImg").value = image;

  const fullLower = (urlInput + " " + (name || "")).toLowerCase();
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

  autoNotice.innerText =
    `✨ Brand: ${brand || "Unknown Brand"} | Item: ${name || "Item"} (Screenshot ready)`;
}
