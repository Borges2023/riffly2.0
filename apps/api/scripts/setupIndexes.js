import path from "node:path";
import { pathToFileURL } from "node:url";
import { db } from "../connect.js";
import { collectionNames } from "../config/database.js";

const indexes = [
  { collection: collectionNames.users, spec: { email: 1 }, options: { unique: true, sparse: true } },
  { collection: collectionNames.users, spec: { plan: 1, createdAt: -1 } },
  { collection: collectionNames.songs, spec: { artist: 1, name: 1 } },
  { collection: collectionNames.songs, spec: { genre: 1, createdAt: -1 } },
  { collection: collectionNames.songs, spec: { premium: 1, createdAt: -1 } },
  { collection: collectionNames.artists, spec: { name: 1 } },
  { collection: collectionNames.playlists, spec: { userId: 1, updatedAt: -1 } },
  { collection: collectionNames.history, spec: { userId: 1, playedAt: -1 } },
  { collection: collectionNames.history, spec: { songId: 1, playedAt: -1 } },
  { collection: collectionNames.favorites, spec: { userId: 1, songId: 1 }, options: { unique: true } },
  { collection: collectionNames.followers, spec: { userId: 1, artistId: 1 }, options: { unique: true } },
  { collection: collectionNames.comments, spec: { songId: 1, createdAt: -1 } },
  { collection: collectionNames.advertisements, spec: { active: 1, slot: 1 } },
  { collection: collectionNames.subscriptions, spec: { userId: 1 }, options: { unique: true, sparse: true } },
  { collection: collectionNames.subscriptions, spec: { status: 1, updatedAt: -1 } },
  { collection: collectionNames.notifications, spec: { userId: 1, read: 1, createdAt: -1 } },
  { collection: collectionNames.reports, spec: { status: 1, createdAt: -1 } },
  { collection: collectionNames.sessions, spec: { sessionId: 1 }, options: { unique: true, sparse: true } },
  { collection: collectionNames.sessions, spec: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
  { collection: collectionNames.auditLogs, spec: { entity: 1, entityId: 1, createdAt: -1 } },
];

export async function setupIndexes() {
  for (const item of indexes) {
    await db.collection(item.collection).createIndex(item.spec, item.options);
  }

  console.log(`Created ${indexes.length} indexes`);
}

const isDirectRun = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun) {
  await setupIndexes();
}
