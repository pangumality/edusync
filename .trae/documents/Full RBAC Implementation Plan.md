# RBAC Implementation Plan

## 1. Database Schema Updates
We will extend the Prisma schema to support dynamic permissions and audit logging while maintaining backward compatibility with the existing `UserRole` enum.

### New Models:
*   **Role**: Stores role metadata (maps to existing enums like `admin`, `teacher`).
*   **Permission**: Granular access controls (e.g., `student.create`, `finance.view`).
*   **RolePermission**: Many-to-many relation linking Roles and Permissions.
*   **AuditLog**: Records privileged actions (who, what, when).

### Changes to Existing Models:
*   **User**: Add `roleRef` relation to `Role` model (optional/nullable first) to allow future dynamic roles, but primary logic will still use the existing `role` Enum for core logic to ensure stability.

## 2. Security & Middleware
We will implement a layered security approach:

1.  **Authentication Middleware (`authMiddleware.js`)**:
    *   Verify JWT tokens (replacing the current fake token system).
    *   Attach `user` and their `permissions` to the request object.

2.  **Permission Guard (`rbacMiddleware.js`)**:
    *   Middleware factory: `requirePermission('resource', 'action')`.
    *   Checks if the authenticated user's role has the specific permission.

3.  **Scope Guard (Service Layer)**:
    *   Logic to enforce data isolation (Multi-school, Class-level, Child-level).
    *   Example: A School Admin can only query students where `student.schoolId === admin.schoolId`.

## 3. Seed Scripts
We need to populate the database with the defined RBAC structure:
1.  **Seed Roles**: Create `Super Admin`, `School Admin`, `Teacher`, `Student`, `Parent`.
2.  **Seed Permissions**: Generate granular permissions (e.g., `school.manage`, `class.view`, `payment.create`).
3.  **Map Permissions**: Assign the appropriate permissions to each Role as defined in your requirements.

## 4. Implementation Steps

1.  **Install Dependencies**: `jsonwebtoken`, `bcryptjs`.
2.  **Update Schema**: Modify `schema.prisma` and run `prisma migrate`.
3.  **Run Seeder**: Execute script to populate Roles and Permissions.
4.  **Create Middleware**: Implement `auth` and `rbac` middleware.
5.  **Refactor Auth Endpoint**: Update `/api/auth/login` to issue real JWTs and include permissions in the response.
6.  **Refactor User Endpoint**: Protect `/api/users` with the new middleware as a proof of concept.

## 5. Verification
*   Test login as Super Admin (full access).
*   Test login as School Admin (verify they cannot access other schools' data).
*   Test login as Teacher (verify access limited to their classes).
*   Verify audit logs are created for actions.
