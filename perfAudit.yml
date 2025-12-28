Performance Audit Update: Mock → Real API Migration
DASHBOARD PAGE
Escalated to Critical:
5 separate API calls on mount (lines 56-119): With real network latency, this becomes catastrophic
Currently: ~100ms setTimeout delays
Real API: 5 × (200-500ms) = 1-2.5s sequential load time
No request batching = waterfall effect
Each stat card shows stale data until its specific request completes
New Issues:
No loading states for individual stats: Page renders with 0 values during fetch
No error handling: Failed requests silently fail, stats stay at 0
No request deduplication: If user changes time filter rapidly, old requests still in flight
Cache invalidation undefined: Refresh triggers all 5 calls again
BOOKS PAGE
Escalated to Critical:
Full dataset fetch on mount (line 59): getBooks(1, '', 100) fetches 100 books
Mock: Instant array return
Real API: Potentially fetching all books into memory
No server-side filtering/sorting — client does all work (lines 26-54)
New Issues:
Search triggers client-side filter only: No API debouncing, no server query
Status/sort changes don't refetch: Filtering happens on stale client data
Delete operation (line 87): Calls deleteBook() then fetchBooks() — full list refetch on every delete
Create/Update (lines 104-108): Same pattern — full refetch after every mutation
Network cost: Every book operation = full list reload
Pagination Implications:
Currently fetches 100 items, paginates client-side
Real API: Should use server-side pagination, but code doesn't support it
usePagination hook has no API integration
ORDERS PAGE
Escalated to Critical:
fetchOrders on every filter change (line 20):
Currently: Quick mock return
Real API: New request on every dropdown change = excessive API calls
No debouncing between status/sort changes
New Issues:
Search is client-side (lines 22-34): Filters already-fetched data
Real API: Should send search query to backend
Current: User types → no API call → filters local cache
updateOrderStatus (line 56): Triggers full fetchOrders() refetch
Updates 1 order → refetches entire list
USERS PAGE
Same Issues as Orders/Books:
Full dataset fetch on mount
Client-side filter/sort (lines 22-51)
toggleUserActive (line 73) → full refetch
No server-side search
MARKETING PAGE
New Issues:
mockBooks array (lines 8-19): Currently hardcoded
Real API: Must fetch available books for section/pack selection
Additional API call on page mount
Section/Pack CRUD operations: Currently update local state only
Real API: Each add/edit/delete = API call + potential refetch
No optimistic updates → UI lags until response
COMMON COMPONENTS
StatsCard:
New Critical Issue:
API call on every time filter change (line 115):
Dashboard has 4 StatsCards × 3 time options
User clicking through filters = rapid API request bursts
No request cancellation for in-flight requests
Tables (Books/Orders/Users):
Network Amplification:
Every mutation triggers full list refetch:
Books: Add/Edit/Delete book → fetchBooks()
Orders: Status update → fetchOrders()
Users: Toggle active → fetchUsers()
No optimistic updates: UI waits for server response
No partial updates: Update 1 item → refetch N items
HOOKS
usePagination:
Critical Mismatch:
Designed for client-side pagination of in-memory arrays
Real API pagination requires:
Page number in API request
Total count from server
Different data slicing strategy
Current code incompatible with cursor/offset pagination
NEW GLOBAL ISSUES (API-Specific)
1. Request Waterfall Cascades:
Dashboard: 5 sequential requests
Books page: Fetch books → user opens CategorySection → fetch categories → user opens AuthorsSection → fetch authors
No parallel request batching
2. No Caching Strategy:
Every page navigation refetches
No React Query / SWR / Apollo cache
Identical data refetched multiple times per session
3. Race Conditions:
Rapid filter changes on Orders/Users pages
No request cancellation (AbortController)
Later-initiated requests might resolve first → stale data displayed
4. Loading State Gaps:
Pages have top-level loading (lines 121-127 in Books/Orders/Users)
No granular loading for filter changes — appears frozen while refetching
StatsCard filter changes show no loading indicator
5. Error Handling Vacuum:
All API calls have try/catch that only console.error
No user-facing error states
No retry logic
Failed requests leave UI in inconsistent state
6. Over-fetching:
Books/Orders/Users fetch full datasets when only displaying 5-10 items
No limit parameter tied to actual display needs
Fetching 100 books to show 5 on first page
7. Mutation Patterns:
Every create/update/delete → full list refetch
No differential updates (e.g., splice updated item into existing array)
Network cost: 1 mutation = 1 write + 1 full read
UPDATED PRIORITY MATRIX
Critical (Must Fix Before Production):
Dashboard: Batch 5 API calls into single endpoint → Eliminates waterfall
Add request cancellation (AbortController) → Prevents race conditions
Implement server-side search/filter/sort → Remove client-side processing
Add debouncing to all search inputs → Reduce API call volume
Fix mutation refetch pattern → Use optimistic updates or differential fetches
Add proper error boundaries + retry logic → Handle network failures
Implement request deduplication → Prevent duplicate in-flight requests
High Priority:
Add React Query / SWR → Caching, request deduplication, retry, loading states
Implement server-side pagination → Replace usePagination client logic
Add loading states for filter changes → User feedback during refetch
Parallel request batching → Load Books + Categories + Authors simultaneously
Add request timeout handling → Prevent infinite hanging states
Medium Priority:
Optimistic UI updates → Immediate feedback before server confirmation
Stale-while-revalidate pattern → Show cached data while refetching
Prefetching strategies → Load next page data in background
Response size optimization → Request only needed fields (GraphQL or field selection)
PERFORMANCE DEGRADATION ESTIMATE
Metric	Mock Data	Real API (Current Code)	Degradation
Dashboard Initial Load	<100ms	1.5-3s (5 sequential requests)	15-30× slower
Books Page Load	<50ms	500ms-1s (100 items)	10-20× slower
Filter Change (Orders)	<10ms	300-600ms	30-60× slower
Delete Book Operation	<50ms	800ms-1.2s (delete + refetch 100)	16-24× slower
Stats Time Filter Change	<10ms	200-400ms × 4 cards	Potential 4× parallel burden
RISK SUMMARY
Without architectural changes, switching to real APIs will:
Create user-perceivable lag on every interaction
Amplify network costs by 10-50× due to over-fetching
Introduce race conditions and stale data bugs
Fail silently on network errors
Scale poorly (100 items manageable, 1000+ items will break UX)
Recommendation: Implement API caching layer (React Query) + server-side operations before migrating from mock data.