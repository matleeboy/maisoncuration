// api/get-product-meta.js
// Vercel serverless function: /api/get-product-meta?url=...

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const url = req.query.url;
    if (!url) {
      res.status(400).json({ error: 'Missing url parameter' });
      return;
    }

    let targetUrl;
    try {
      targetUrl = decodeURIComponent(url);
      // Validate URL
      new URL(targetUrl);
    } catch {
      res.status(400).json({ error: 'Invalid url parameter' });
      return;
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/120.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      res
        .status(500)
        .json({ error: `Failed to fetch URL: ${response.status}` });
      return;
    }

    const html = await response.text();

    // If the content is not HTML, bail early
    if (!html || !html.includes('<html')) {
      res.status(500).json({ error: 'Fetched content is not HTML' });
      return;
    }

    const safeMatch = (regex) => {
      try {
        const match = html.match(regex);
        return match ? match[1].trim() : '';
      } catch {
        return '';
      }
    };

    const getMetaContent = (propertyName) => {
      const regex = new RegExp(
        `<meta[^>]+(?:property|name)=["']${propertyName}["'][^>]*content=["']([^"']+)["'][^>]*>`,
        'i'
      );
      return safeMatch(regex);
    };

    const getTitleTag = () =>
      safeMatch(/<title[^>]*>([^<]+)<\/title>/i);

    const ogTitle = getMetaContent('og:title');
    const twitterTitle = getMetaContent('twitter:title');
    const titleTag = getTitleTag();
    const ogImage = getMetaContent('og:image');
    const twitterImage = getMetaContent('twitter:image');

    const rawTitle = ogTitle || twitterTitle || titleTag || 'Curated Item';

    let brand = '';
    let name = rawTitle;

    const separators = [' - ', ' | ', ' — ', ' – '];
    for (const sep of separators) {
      if (rawTitle.includes(sep)) {
        const parts = rawTitle.split(sep);
        if (parts.length >= 2) {
          const left = parts[0];
          const right = parts.slice(1).join(sep);
          if (left && right) {
            brand = left.trim();
            name = right.trim();
          }
        }
        break;
      }
    }

    // Derive brand from hostname if we didn't find one
    if (!brand) {
      const hostname = new URL(targetUrl).hostname.replace(/^www\./, '');
      brand = hostname.split('.')[0] || 'Brand';
      brand = brand.charAt(0).toUpperCase() + brand.slice(1);
    }

    name = name.replace(/[\|\-–—].+$/, '').trim();
    if (!name || name.length < 3) name = rawTitle;

    let image = ogImage || twitterImage || '';
    if (image && image.startsWith('/')) {
      const base = new URL(targetUrl);
      image = `${base.protocol}//${base.host}${image}`;
    }

    const screenshot =
      `https://api.microlink.io/?url=${encodeURIComponent(
        targetUrl
      )}&screenshot=true&embed=screenshot.url`;

    const result = {
      url: targetUrl,
      title: rawTitle,
      brand,
      name,
      image: image || screenshot,
      screenshotUrl: screenshot,
    };

    res.setHeader('Cache-Control', 'max-age=3600');
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in get-product-meta:', err);
    res
      .status(500)
      .json({ error: 'Internal server error', detail: String(err) });
  }
}
