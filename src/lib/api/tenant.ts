/**
 * The tenant the session is acting for (FE-ADR-003 phase 2, backend C3).
 *
 * Kept as a tiny module rather than read from the session store so the API
 * client does not import the store (the store imports the client for its 401
 * listener). `X-Tenant-Id` is sent only when this is non-null — single-tenant
 * pilot instances never see the header.
 */
let tenantId: string | null = null;

export function getTenantId(): string | null {
  return tenantId;
}

export function setTenantId(id: string | null): void {
  tenantId = id;
}
