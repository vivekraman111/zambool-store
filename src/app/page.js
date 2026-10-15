// page.js

import { ServerRenderer } from "zambool";
import { ClientData } from "./client";
import "./server.js";

async function fetchResources(urls) {
  const entries = await Promise.all(
    Object.entries(urls).map(async ([key, url]) => [
      key,
      await fetchJson(url),
    ])
  );

  return Object.fromEntries(entries);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  return response.json();
}

const CONTENT_URL =
  "https://zambool-store-933344993326-ap-south-1-an.s3.ap-south-1.amazonaws.com/content";

const STORE_URLS = {
  page: `${CONTENT_URL}/store.json`,
  data: `${CONTENT_URL}/store-data.json`,
};

export default async function Home() {
  const resources = await fetchResources(STORE_URLS);

  return (
    <ClientData data={resources.data}>
      <ServerRenderer tree={resources.page} />
    </ClientData>
  );
}
