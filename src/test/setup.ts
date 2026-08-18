import '@testing-library/jest-dom/vitest';

// idb-keyval uses indexedDB; mock with an in-memory shim for tests
import 'fake-indexeddb/auto';
