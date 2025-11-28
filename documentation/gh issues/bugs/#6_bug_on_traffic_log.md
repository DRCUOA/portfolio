# Fix Traffic Log Foreign KEY Constraint Error

## Problem Analysis

The error occurs due to a mismatch between how port IDs are constructed and the corrected data model:

1. **Design Error Context**: Originally, port `name` was a free-form string. This was corrected so `name` must be a Project ID. Port IDs are now generated as `${projectId}-${serverType}` (e.g., `project-123-frontend`).

2. **Root Cause**: 

- Frontend router (`frontend/src/router/index.ts:121`) constructs `portId` as `${slug}-frontend` using project **slug**
- But ports are created with ID format `${projectId}-${serverType}` using project **ID**
- These formats don't match, causing foreign key constraint failures
- Additionally, ports may not exist for all projects

3. **CRUD Areas Affected**:

- **PortController.create/update**: Now validates `name` must be existing project ID (lines 117-124, 173-182)
- **PortForm.vue**: Generates port ID as `${projectId}-${serverType}` (line 206-211)
- **Router traffic logging**: Uses project slug instead of ID (line 121)
- **TrafficController.logClick**: No validation - tries to insert with any portId
- **Legacy seeded ports**: May have inconsistent data (IDs based on slugs, names in old format)

4. **The Foreign Key Constraint**: Defined in `api/src/db.ts:75`: `FOREIGN KEY (port_id) REFERENCES ports(id)`

## Solution

Two-part fix addressing both the router logic and backend validation:

1. **Fix Router** (`frontend/src/router/index.ts`): 

- Fetch project by slug to get project ID
- Construct portId as `${projectId}-frontend` (matching new format)
- Handle cases where project doesn't exist

2. **Add Backend Validation** (`api/src/controllers/TrafficController.ts`):

- Validate portId exists before insertion
- If port doesn't exist, set `portId` to `null` (graceful degradation)
- This handles edge cases and legacy data

## Implementation Steps

1. **Update Router** (`frontend/src/router/index.ts`)

- In `router.beforeEach`, when tracking clicks:
 - Use `store.fetchProjectBySlug(slug)` to get project (async)
 - Extract `project.id` from the result
 - Construct `portId` as `${project.id}-frontend`
 - Only log if project exists
 - Handle errors gracefully (don't block navigation)

2. **Update TrafficController** (`api/src/controllers/TrafficController.ts`)

- Import `PortModel` from `../models/Port`
- In `logClick` method, before creating the log:
 - If `portId` is provided, check if it exists using `PortModel.findById(portId)`
 - If port doesn't exist, set `portId` to `null` and optionally log a warning
 - Proceed with insertion (now with `null` or valid `portId`)

3. **Test the fix**

- Start backend and frontend
- Navigate to project routes:
 - With existing ports (verify correct portId used)
 - Without ports (verify null portId, no errors)
 - With invalid slugs (verify graceful handling)
- Verify no foreign key errors occur
- Verify traffic logs are created correctly

## Files to Modify

- `frontend/src/router/index.ts` - Fix portId construction to use project ID
- `api/src/controllers/TrafficController.ts` - Add port validation before insertion

## Notes

- This addresses the ripple effects from the port name design correction
- Router fix ensures correct portId format matching new data model
- Backend validation provides safety net for edge cases and legacy data
- Both changes are minimal and focused (guardrail principle #3)
- The fix preserves existing behavior for valid portIds
- Invalid/missing portIds are gracefully handled by logging without port reference
- No database schema changes needed