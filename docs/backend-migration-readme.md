# Backend Migration - AsyncStorage to MySQL with tRPC

This document describes the backend migration from AsyncStorage (local storage) to a complete client-server architecture with MySQL database and tRPC API.

## Overview

The migration maintains backward compatibility through a compatibility shim while introducing a robust backend infrastructure for storing projects and scenarios.

## Architecture

### Components

1. **Database Schema** (`shared/db/schema.ts`)
   - Projects table with full financial analysis data
   - Scenarios table for scenario snapshots
   - Proper indexing on user_id and created_at

2. **Database Connection** (`shared/db/index.ts`)
   - Lazy database initialization
   - Graceful handling of missing DATABASE_URL
   - Re-exports schema types

3. **tRPC API Router** (`server/routers/projects.ts`)
   - Full CRUD operations for projects
   - Nested scenarios sub-router
   - Authentication on all endpoints via `protectedProcedure`
   - UUID-based IDs for projects and scenarios

4. **API Client Layer** (`lib/api/projects.ts`)
   - Vanilla tRPC client for use outside React components
   - Lazy client initialization
   - Type mapping between database and client types
   - Event emitter integration for UI updates
   - Error handling and logging

5. **Compatibility Shim** (`lib/project-storage.ts`)
   - Forwards all exports to new API client
   - Maintains backward compatibility
   - Allows gradual migration

## Files Created/Modified

### Created
- `shared/db/schema.ts` - Database schema definition
- `shared/db/index.ts` - Database connection and exports
- `server/routers/projects.ts` - tRPC projects router
- `lib/api/projects.ts` - API client layer
- `lib/project-storage-legacy.ts` - Original AsyncStorage implementation
- `docs/database-migration.md` - Migration guide
- `tests/api/projects.test.ts` - API tests

### Modified
- `drizzle/schema.ts` - Added re-exports of projects/scenarios tables
- `server/routers.ts` - Added projects router to app router
- `drizzle.config.ts` - Updated migration output directory
- `lib/project-storage.ts` - Converted to compatibility shim

## API Endpoints

### Projects

- `projects.list` - List all projects for authenticated user
- `projects.get` - Get single project by ID
- `projects.create` - Create new project
- `projects.update` - Update existing project
- `projects.delete` - Delete project (cascades to scenarios)
- `projects.duplicate` - Duplicate project with new ID

### Scenarios

- `projects.scenarios.list` - List scenarios for a project
- `projects.scenarios.create` - Create new scenario
- `projects.scenarios.delete` - Delete scenario

## Database Schema

### Projects Table

```sql
CREATE TABLE projects (
  id VARCHAR(36) PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  initial_investment INT NOT NULL,
  yearly_revenue INT NOT NULL,
  operating_costs INT NOT NULL,
  maintenance_costs INT NOT NULL,
  project_duration INT NOT NULL,
  discount_rate INT NOT NULL,
  revenue_growth INT NOT NULL,
  best_case_multiplier INT NOT NULL,
  worst_case_multiplier INT NOT NULL,
  results JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX user_id_idx (user_id),
  INDEX created_at_idx (created_at)
);
```

### Scenarios Table

```sql
CREATE TABLE scenarios (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  sales_adjustment INT NOT NULL DEFAULT 0,
  costs_adjustment INT NOT NULL DEFAULT 0,
  discount_adjustment INT NOT NULL DEFAULT 0,
  is_base INT NOT NULL DEFAULT 0,
  results JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX project_id_idx (project_id)
);
```

## Type Mappings

The API client handles type conversion between database types and client types:

- Database INT fields map to number in TypeScript
- Database JSON fields map to typed interfaces (FinancialResults)
- Database TIMESTAMP fields map to ISO date strings
- Database tinyint (is_base) maps to boolean

## Event System

The API client emits events for UI updates:

- `PROJECT_CREATED` - When a new project is created
- `PROJECT_UPDATED` - When a project is updated
- `PROJECT_DELETED` - When a project is deleted
- `PROJECT_DUPLICATED` - When a project is duplicated
- `SNAPSHOT_CREATED` - When a scenario is created
- `SNAPSHOT_DELETED` - When a scenario is deleted

## Security

- All endpoints use `protectedProcedure` requiring authentication
- User ID from auth context ensures users can only access their own data
- Scenario operations verify project ownership before proceeding
- UUIDs prevent ID enumeration attacks

## Migration Steps

1. **Set DATABASE_URL environment variable**
   ```bash
   export DATABASE_URL=mysql://user:password@host:3306/database
   ```

2. **Run database migration**
   ```bash
   npm run db:push
   ```

3. **Verify tables created**
   ```sql
   SHOW TABLES;
   DESCRIBE projects;
   DESCRIBE scenarios;
   ```

4. **Test API endpoints**
   - Create a test project through the UI
   - Verify data appears in database
   - Test update and delete operations

5. **(Optional) Migrate existing data**
   - Export existing projects from AsyncStorage
   - Import via API or direct database insert

## Backward Compatibility

All existing code continues to work through the compatibility shim:

```typescript
// Old code (still works)
import { getAllProjects } from '@/lib/project-storage';

// New code (recommended)
import { getAllProjects } from '@/lib/api/projects';
```

Both imports work identically. The old import path forwards to the new API client.

## Testing

Run the API tests:

```bash
npm test tests/api/projects.test.ts
```

The tests verify:
- Schema structure is correct
- All functions are exported
- Type safety is maintained
- Compatibility shim works

## Rollback Plan

If issues occur, you can quickly rollback:

1. Revert to using `project-storage-legacy.ts` directly
2. Update imports in affected files
3. Drop new database tables if needed

## Future Enhancements

- Add pagination to list endpoints
- Implement full-text search on project names
- Add soft delete support
- Add project sharing/collaboration
- Add audit logs for changes
- Implement optimistic UI updates
- Add offline sync capabilities

## Troubleshooting

### "Cannot find module '@/server/routers'"

Ensure TypeScript paths are configured correctly in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "DATABASE_URL is not set"

The app will work but API calls will fail. Set the environment variable:

```bash
export DATABASE_URL=mysql://user:password@host:3306/database
```

### "Project not found" errors

Ensure:
1. User is authenticated
2. Project belongs to the authenticated user
3. Project ID is a valid UUID

## Performance Considerations

- Database queries use indexes on user_id and created_at
- JSON fields used for flexible results storage
- Lazy client initialization avoids unnecessary connections
- Batch operations where possible (tRPC batching)

## Monitoring

Monitor these metrics:
- API response times
- Database connection pool usage
- Error rates by endpoint
- Projects per user distribution
- Scenario count per project

## Support

For issues or questions:
1. Check this README
2. Review `docs/database-migration.md`
3. Check test files for examples
4. Review tRPC router code for API details
