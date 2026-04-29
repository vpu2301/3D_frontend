export type DriveItemId = string;
export type SpaceId = string;
export type UserId = string;

export type DriveItemType = 'file' | 'folder';

export type FileKind =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'text'
  | 'markdown'
  | 'code'
  | 'archive'
  | 'office'
  | 'doc'   // sourceModule === 'docs'
  | 'note'  // sourceModule === 'notes'
  | 'other';

export interface Permission {
  userId: UserId;
  role: 'viewer' | 'commenter' | 'editor';
}

export interface FileVersion {
  id: string;
  uploadedAt: number;
  size: number;
  /** IDB key for the binary blob (or undefined for cross-module virtual files). */
  blobKey?: string;
}

export interface FileSummary {
  oneLine: string;
  extended: string;
}

export interface DriveItem {
  id: DriveItemId;
  name: string;
  type: DriveItemType;
  parentId: DriveItemId | null;
  ownerId: UserId;
  sharedWith: Permission[];
  starred: boolean;
  trashed: boolean;
  tags: string[];
  /** Optional folder color (hex). */
  color?: string;
  /** Optional folder emoji. */
  emoji?: string;
  createdAt: number;
  updatedAt: number;

  // ---- File-specific fields ----
  /** MIME type (only for files). */
  mimeType?: string;
  /** Size in bytes (current version, files only). */
  size?: number;
  /** AI-generated summaries (files only, optional until generated). */
  summary?: FileSummary;
  /** AI-suggested tags awaiting user approval. */
  suggestedTags?: string[];
  /** Mock-extracted text used by askAboutFile / search (PDFs, code, etc.). */
  extractedText?: string;
  /** Mock zip manifest for archive previews. */
  archiveManifest?: { name: string; size: number }[];
  /** IDB key for current version blob (files only, undefined for virtual). */
  blobKey?: string;
  /** Up to 10 prior versions. Newest first. */
  versions?: FileVersion[];
  /** Set when this Drive item is a virtual reference into another module. */
  sourceModule?: 'docs' | 'notes';
  sourceId?: string;
  /** Mock activity log entries (newest first). */
  activity?: ActivityEntry[];
  /** Mock duration for video/audio in seconds. */
  durationSeconds?: number;
  /** Optional thumbnail data URL (for non-image files where we precompute a thumb). */
  thumbnail?: string;
}

export type ActivityKind = 'uploaded' | 'viewed' | 'edited' | 'shared' | 'restored';

export interface ActivityEntry {
  id: string;
  at: number;
  by: UserId;
  kind: ActivityKind;
  detail?: string;
}

export interface Space {
  id: SpaceId;
  name: string;
  /** Natural-language definition the mock AI uses to populate. */
  definition: string;
  /** True for system Spaces; user can also create custom Spaces. */
  isAiCurated: boolean;
  fileIds: DriveItemId[];
  lastComputedAt?: number;
  emoji?: string;
}

export interface RankedFile {
  fileId: DriveItemId;
  score: number;
  reason: string;
}

export interface Citation {
  /** A short snippet that mock AI claims to have grounded the answer in. */
  snippet: string;
  /** Optional page or section locator (mocked). */
  locator?: string;
}

export interface DuplicateGroup {
  reason: 'name' | 'size' | 'name+size';
  fileIds: DriveItemId[];
}

export interface OrganizationProposalMove {
  fileId: DriveItemId;
  toFolderId: DriveItemId | null;
  /** "new:NewFolderName" indicates a folder that should be created. */
  reason: string;
}

export interface OrganizationProposal {
  newFolders: { name: string; tempId: string }[];
  moves: { fileId: DriveItemId; toTempId: string; reason: string }[];
}

/** Lightweight view used for Drive surfaces (rendering, sorting, search). */
export interface FileMeta {
  id: DriveItemId;
  name: string;
  kind: FileKind;
  size: number;
  tags: string[];
  parentId: DriveItemId | null;
  updatedAt: number;
  ownerId: UserId;
  summary?: string;
}

export type DriveViewMode = 'grid' | 'list';
export type DriveSortBy = 'name' | 'modified' | 'created' | 'size' | 'type';
export type SortDirection = 'asc' | 'desc';

export interface DriveListFilter {
  kind?: FileKind;
  ownerId?: UserId;
  sharedWithMe?: boolean;
  hasComments?: boolean;
  starred?: boolean;
  query?: string;
  tag?: string;
}
