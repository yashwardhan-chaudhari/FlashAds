# FlashAds — Product Requirements Document (PRD)

Date: 30 Sep 2026 · Author: Yashwardhan Chaudhari

---

## 1. Product overview

FlashAds is a two-sided web marketplace where businesses find, price and book outdoor and digital advertising space (hoardings, LED screens, banners) directly from board owners, for exactly the dates they need.

**Tagline:** Find. Book. Advertise.

### 1.1 Problem

- Advertisers discover boards through brokers, phone calls and site visits, with no transparent pricing or availability.
- Board owners have no reliable channel to reach small and mid-size advertisers, and manage bookings in notebooks or WhatsApp.
- Double bookings, unclear rates for short durations and slow back-and-forth are common.
- Digital (LED) inventory is sold by time slots, which most directories do not support.

### 1.2 Solution

A searchable, admin-moderated marketplace with a duration-based pricing engine, backend-enforced availability, booking approval workflow, in-app messaging and (later) online payments. It works for traditional boards (booked by days, weeks, months) and for digital boards (booked by ad length, frequency and campaign duration).

### 1.3 Product goals

1. Let a business go from search to booking request in under 5 minutes.
2. Let a board owner list a board in under 10 minutes.
3. Make double booking impossible by enforcing availability on the server.
4. Give owners and advertisers one place for requests, approvals and conversations.
5. Keep the platform trustworthy: every board is reviewed by an admin before it goes public.

### 1.4 Success metrics

| Metric | Definition | MVP target (first 90 days after launch) |
| --- | --- | --- |
| Approved boards | Boards with status approved | 100 |
| Registered advertisers (board owners) | Users with role advertiser | 40 |
| Registered clients | Users with role client | 300 |
| Booking requests | Requests created | 150 |
| Request-to-approval rate | Approved / requests | 50% or higher |
| Double bookings | Overlapping approved bookings on one board | 0 |
| Time to first booking request | Registration to first request | Under 24 hours for 60% of clients |
| Advertiser response time | Request to approve/reject | Under 24 hours median |

These targets are starting assumptions; adjust them once you know your launch city and outreach plan.

---

## 2. Users and personas

FlashAds has three roles. Users choose Client or Advertiser at registration; Admin accounts are created by the platform team, never through public sign-up.

| Role | Who they are | Main goal | Key permissions |
| --- | --- | --- | --- |
| Client | Business owner, marketing manager or agency that wants to advertise | Find a suitable board and book it for specific dates at a clear price | Browse, search, favorite, request bookings, message owners, review completed campaigns |
| Advertiser (board owner) | Owner of hoardings, LED screens or banners | Fill inventory, manage requests, get paid | Add and edit own boards, set pricing and availability, approve or reject requests on own boards, message clients |
| Admin | FlashAds operations team | Keep the marketplace trustworthy and healthy | Approve or reject boards, manage users and bookings, view platform analytics |

### 2.1 Persona: Rahul, the client

Rahul runs a coaching institute in Pune and wants a hoarding near a busy junction for 15 days before admissions open. He needs to compare boards by area, budget and traffic, see one total price for his dates, and know the board is actually free.

### 2.2 Persona: Meena, the board owner

Meena owns four hoardings and one LED screen in Hinjewadi. She wants qualified requests without phone calls, a calendar that stops overlapping bookings, and a simple way to say yes or no.

### 2.3 Persona: Admin

The admin reviews each new board for completeness and legitimacy (photos, address, price), then approves it. The admin also watches users, bookings and revenue.

### 2.4 Naming note

The roles in the database are `client`, `advertiser` and `admin`. In the interface, the registration options read "I want to advertise" (client) and "I own advertising boards" (advertiser). Keeping these labels consistent avoids confusion, because "advertiser" in code means the board owner.

---

## 3. Scope

The MVP is the smallest product that lets a real advertiser list a board and a real client book it without double booking. Payments, reviews and analytics come after that loop works.

| Release | Includes | Priority |
| --- | --- | --- |
| MVP (v1.0) | Branding and public site, auth with roles, role dashboards, Add/Edit/Delete Board, Cloudinary images, admin approval, Explore with search, filters and sort, board details with Leaflet map, duration pricing engine, availability check, booking request and approval, My Bookings, Booking Requests | Must have |
| v1.1 | Messaging, favorites, in-app notifications | Should have |
| v1.2 | Razorpay payments and payment verification, reviews and ratings | Should have |
| v1.3 | Admin analytics with charts, digital-board (LED) slot booking | Should have |
| Later | Real-time chat, email and SMS notifications, invoices, multi-city expansion, mobile app, saved searches, agency accounts | Could have |

### 3.1 Out of scope for v1

- Online payments, refunds and payouts (v1.2).
- Creative upload and approval of ad artwork.
- Printing, installation or proof-of-display services.
- Native mobile apps (the site must be fully responsive instead).
- Multi-language interface.

### 3.2 Assumptions

- Launch market is Pune, India; prices are in INR (₹).
- Bookings are requests that the board owner must approve; there is no instant booking in v1.
- Payment happens after approval and, until v1.2, offline between the parties.
- The platform earns a commission or listing fee, to be decided (see open questions).

---

## 4. Functional requirements

Requirement IDs use FR-module-number. Priority: **M** = must (MVP), **S** = should (v1.1 to v1.3), **C** = could (later).

### 4.1 Authentication and accounts (AUTH)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-AUTH-1 | Users register with name, email, phone, password and a role choice (client or advertiser). | M |
| FR-AUTH-2 | Passwords are hashed with bcrypt; plain text is never stored or logged. | M |
| FR-AUTH-3 | Login returns a signed JWT; protected API routes reject missing or invalid tokens. | M |
| FR-AUTH-4 | After login, users land on their role dashboard (/client/dashboard, /advertiser/dashboard, /admin/dashboard). | M |
| FR-AUTH-5 | Email is unique; duplicate registration shows a clear error. | M |
| FR-AUTH-6 | Profile page lets users edit name and phone. | S |
| FR-AUTH-7 | Password reset by email link. | S |

### 4.2 Board management (BRD)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-BRD-1 | An advertiser can create a board with title, description, board type, city, area, address, latitude, longitude, width, height, traffic level, visibility, prices (day, week, month), images and availability dates. | M |
| FR-BRD-2 | New boards start as pending and are not public. | M |
| FR-BRD-3 | An advertiser can edit or delete only their own boards; editing an approved board's key fields (price, location, size) sends it back to pending. | M |
| FR-BRD-4 | Image upload to Cloudinary, at least 1 and at most 8 images per board, JPG/PNG/WebP, 5 MB each. | M |
| FR-BRD-5 | An advertiser can mark a board unavailable without deleting it. | M |
| FR-BRD-6 | Board types: hoarding, unipole, LED digital screen, banner, bus shelter, other. | M |

### 4.3 Admin approval (ADM)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-ADM-1 | Admin sees a queue of pending boards with owner, location, images and pricing. | M |
| FR-ADM-2 | Admin approves or rejects a board; a rejection requires a reason shown to the owner. | M |
| FR-ADM-3 | Only approved boards appear in Explore and can be booked. | M |
| FR-ADM-4 | Admin can view and deactivate users and view all bookings. | S |

### 4.4 Marketplace and board details (MKT)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-MKT-1 | /explore lists approved boards with pagination (12 per page). | M |
| FR-MKT-2 | Search by city, area, board type and budget. | M |
| FR-MKT-3 | Filters: price range, traffic level, size, board type, availability for chosen dates. | M |
| FR-MKT-4 | Sort by lowest price, highest price, newest. | M |
| FR-MKT-5 | /boards/:id shows photo gallery, title, location, type, size, traffic, visibility, owner name, pricing, availability and an OpenStreetMap/Leaflet map. | M |
| FR-MKT-6 | Explore and details pages are public; booking requires login. | M |

### 4.5 Booking (BKG)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-BKG-1 | A client selects start and end dates; the system shows duration and total price before submitting. | M |
| FR-BKG-2 | The backend rejects any request that overlaps an approved booking or falls outside the board's availability window. | M |
| FR-BKG-3 | A client can cancel a pending booking; the advertiser can approve or reject it. | M |
| FR-BKG-4 | Clients see My Bookings with board, dates, duration, amount and status. | M |
| FR-BKG-5 | Advertisers see Booking Requests with client, board, dates, amount and Approve/Reject buttons. | M |
| FR-BKG-6 | The price is calculated and stored on the server at request time; client-sent totals are ignored. | M |
| FR-BKG-7 | Approved bookings past their end date become completed automatically. | S |

### 4.6 Messaging, favorites, notifications (COM)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-COM-1 | A client can start a conversation with a board owner from a board page; both see the thread under /messages. | S |
| FR-COM-2 | Messages are stored in the database and load on refresh; real-time delivery is later. | S |
| FR-COM-3 | A client can favorite or unfavorite a board and view all favorites. | S |
| FR-COM-4 | In-app notifications for: new booking request, approval, rejection, new message. | S |

### 4.7 Payments and reviews (PAY)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-PAY-1 | After approval the client pays through Razorpay; the server verifies the payment signature before confirming the booking. | S |
| FR-PAY-2 | Booking states record payment status (unpaid, paid, failed). | S |
| FR-PAY-3 | After a completed booking the client can rate 1 to 5 stars and comment once per booking. | S |

### 4.8 Dashboards and analytics (DSH)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-DSH-1 | Client dashboard shows active campaigns, pending bookings, completed campaigns and total spending. | M |
| FR-DSH-2 | Advertiser dashboard shows total, active and pending boards, booking requests and earnings. | M |
| FR-DSH-3 | Admin dashboard shows total users, advertisers, clients, boards, pending boards, bookings, completed bookings and platform revenue, with charts for registrations, boards, bookings and revenue. | S |

### 4.9 Acceptance criteria for the core loop

1. A new advertiser registers, adds a board with 3 images, and sees it as pending.
2. An admin approves it and it appears in Explore within one page refresh.
3. A client searches by city and type, opens the board, picks 10 Oct to 25 Oct, and sees 15 days with the correct total.
4. The client submits; the advertiser sees the request and approves it.
5. A second client requesting 20 Oct to 30 Oct on the same board is refused by the API with a clear unavailable message, even if the front end is bypassed.
6. A client cannot open another client's booking or edit another owner's board (403).

---

## 5. Pricing engine and availability rules

The pricing engine turns a date range into the cheapest valid total using the board's daily, weekly and monthly rates. It runs on the server; the front end only previews the result.

### 5.1 Duration rules

- Duration is end date minus start date, so 10 Oct to 25 Oct is 15 days, matching the original plan. Whether the end date is also a display day is an open question.
- A month is 30 days and a week is 7 days for pricing purposes.
- Minimum booking is 1 day; maximum is limited by the board's availability window.

### 5.2 Pricing algorithm

For a duration of D days, with rates M (per month), W (per week) and d (per day):

1. Take as many full months as fit: m = floor(D / 30).
2. From the remainder, take as many full weeks as fit: w = floor((D − 30m) / 7).
3. Charge the leftover days at the daily rate: r = D − 30m − 7w.
4. Total = m × M + w × W + r × d.
5. Cap each tier by the next larger unit: the days charge never exceeds one week's rate, and the weeks-plus-days charge never exceeds one month's rate. For example, at ₹1,000 per day and ₹6,000 per week, 6 days costs ₹6,000, not more.

```
Total = m * M + w * W + r * d
m = floor(D / 30)
w = floor((D - 30m) / 7)
r = D - 30m - 7w
```

### 5.3 Worked examples

Rates: daily ₹1,000, weekly ₹6,000, monthly ₹25,000.

| Duration | Breakdown | Total |
| --- | --- | --- |
| 3 days | 3 daily | ₹3,000 |
| 7 days | 1 week (cheaper than 7 × ₹1,000 = ₹7,000) | ₹6,000 |
| 15 days | 2 weeks + 1 day | ₹13,000 |
| 26 days | 3 weeks + 5 days = ₹23,000; 1 month = ₹25,000; cheaper option wins | ₹23,000 |
| 30 days | 1 month | ₹25,000 |
| 40 days | 1 month + 1 week + 3 days | ₹34,000 |

### 5.4 Availability rules

- A booking is a date range [start, end). Two ranges overlap when startA < endB and startB < endA.
- Only bookings with status approved (and, once payments exist, paid or awaiting payment) block dates. Pending requests do not block, but the advertiser sees overlaps when deciding.
- On approving a request, the server re-checks for overlap inside a transaction-safe update so two simultaneous approvals cannot both succeed.
- A request must fall within the board's available-from and available-until dates.
- Boards marked unavailable cannot receive requests.
- Example: an approved booking on 1 Oct to 10 Oct blocks a request for 5 Oct to 15 Oct, but allows 11 Oct to 20 Oct.

### 5.5 Digital-board campaigns (v1.3)

Digital boards are booked by ad length, display frequency, daily hours and campaign length, for example 10-second spots, every 60 seconds, 10 AM to 10 PM, for 30 days. The owner sets a rate card per slot (for example, price per 1,000 plays or per daily slot-hour); the engine multiplies plays per day by days and applies the owner's rate. Slot capacity is limited so the same screen time is never oversold.

---

## 6. User flows and booking lifecycle

Each role has one main path through the product; the booking status lifecycle is the rule set that connects the client and advertiser paths.

### 6.1 Client journey

1. Register as a client and log in.
2. Explore boards and search by city, area, type and budget; apply filters and sort.
3. Open a board, choose start and end dates, and see the duration and total price.
4. Send a booking request.
5. Track status under My Bookings and message the owner with questions.
6. After approval, pay online and later leave a review (both v1.2).

### 6.2 Advertiser journey

1. Register as a board owner and log in.
2. Add a board with details, location, size, pricing, images and availability dates.
3. Wait for admin approval; if rejected, read the reason, fix the board and resubmit.
4. Receive booking requests and approve or reject each one.
5. Track boards, requests and earnings on the dashboard.

### 6.3 Admin journey

1. Log in and open the pending boards queue.
2. Review owner, location, images and pricing, then approve or reject with a reason.
3. Monitor users, bookings and platform figures.

### 6.4 Booking status lifecycle

```
Client requests -> Pending -> (owner approves) -> Approved -> (end date passes) -> Completed
                   Pending -> (owner rejects)  -> Rejected
                   Pending -> (client cancels) -> Cancelled
```

A request starts as pending, and only the board owner can approve or reject it; the client can cancel while it is pending. Approved bookings become completed automatically after their end date. Boards follow their own cycle: pending, then approved or rejected, and an owner can set an approved board to unavailable.

---

## 7. Data model and API

MongoDB collections are modelled with Mongoose. Every document has createdAt and updatedAt timestamps.

### 7.1 Collections

| Collection | Key fields | Notes |
| --- | --- | --- |
| users | name, email (unique), phone, password (bcrypt hash), role (client, advertiser, admin), isActive | Password never returned by the API |
| boards | ownerId, title, description, boardType, city, area, address, latitude, longitude, width, height, trafficLevel, visibility, images[], pricePerDay, pricePerWeek, pricePerMonth, availableFrom, availableUntil, status (pending, approved, rejected, unavailable), rejectionReason | Index on city, area, boardType, status, price |
| bookings | boardId, clientId, advertiserId, startDate, endDate, durationDays, totalAmount, priceBreakdown, status (pending, approved, rejected, cancelled, completed), paymentStatus | Compound index on boardId, startDate, endDate for overlap checks |
| messages | conversationId, senderId, receiverId, boardId, body, readAt | Conversation groups a client and an owner for one board |
| favorites | userId, boardId | Unique pair |
| notifications | userId, type, refId, message, readAt | Created by server events |
| reviews | boardId, clientId, bookingId, rating (1 to 5), comment | One per completed booking |
| payments (v1.2) | bookingId, razorpayOrderId, razorpayPaymentId, amount, status | Written only after signature verification |

### 7.2 REST API (MVP)

| Method and path | Purpose | Access |
| --- | --- | --- |
| POST /api/auth/register | Create user | Public |
| POST /api/auth/login | Return JWT and user | Public |
| GET /api/auth/me | Current user | Logged in |
| GET /api/boards | List approved boards with search, filter, sort, pagination | Public |
| GET /api/boards/:id | Board details | Public (approved) or owner or admin |
| POST /api/boards | Create board (status pending) | Advertiser |
| PUT /api/boards/:id | Edit own board | Advertiser (owner) |
| DELETE /api/boards/:id | Delete own board | Advertiser (owner) |
| GET /api/boards/mine | Own boards | Advertiser |
| POST /api/upload | Upload image to Cloudinary | Advertiser |
| PATCH /api/admin/boards/:id/approve | Approve board | Admin |
| PATCH /api/admin/boards/:id/reject | Reject board with reason | Admin |
| POST /api/pricing/quote | Return duration and price for a board and dates | Public |
| GET /api/boards/:id/availability | Booked date ranges | Public |
| POST /api/bookings | Create booking request (server re-validates dates and price) | Client |
| GET /api/bookings/mine | Client's bookings | Client |
| GET /api/bookings/requests | Requests on own boards | Advertiser |
| PATCH /api/bookings/:id/approve | Approve request | Advertiser (owner of board) |
| PATCH /api/bookings/:id/reject | Reject request | Advertiser (owner of board) |
| PATCH /api/bookings/:id/cancel | Cancel pending request | Client (owner of booking) |

v1.1 to v1.3 add /api/messages, /api/favorites, /api/notifications, /api/payments and /api/reviews, plus /api/admin/stats.

### 7.3 API conventions

- JSON in and out; errors return `{ success: false, message, code }` with correct HTTP status (400, 401, 403, 404, 409 for date conflicts).
- Authorization header: Bearer token.
- Inputs validated on the server (for example with Joi or Zod) before touching the database.
- Pagination with page and limit query parameters.

---

## 8. Architecture, stack and non-functional requirements

FlashAds is a standard full-stack web application: a React single-page client, a Node and Express REST API, and MongoDB, with images and payments delegated to specialist services.

### 8.1 Architecture

```
React client on Vercel  <-- REST + JWT -->  Node + Express API (Render or Railway)
(React + Vite, Tailwind CSS,                (Auth: JWT + bcrypt, role and ownership checks,
 React Router, Leaflet map)                  pricing and availability)
        |                                          |-- MongoDB Atlas (all application data)
        |-- map tiles --> OpenStreetMap            |-- Cloudinary (board images)
                                                   |-- Razorpay (payments, v1.2)
```

The browser never talks to MongoDB, Cloudinary uploads or Razorpay directly with secrets; the API holds all keys and enforces every rule.

### 8.2 Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React with Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Backend | Node.js with Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT and bcrypt |
| Images | Cloudinary |
| Maps | OpenStreetMap with Leaflet |
| API testing | Postman or Thunder Client |
| Version control | Git and GitHub |
| Payments | Razorpay (v1.2) |
| Deployment | Vercel (client), Render or Railway (API), MongoDB Atlas |

### 8.3 Non-functional requirements

| Area | Requirement |
| --- | --- |
| Performance | Explore and details pages render in under 3 seconds on a typical 4G connection; API responses under 500 ms at the 95th percentile for list and quote calls. |
| Responsive design | Fully usable from 360 px wide phones to desktop. |
| Routing | Every route works after a browser refresh; the host is configured with a single-page-app fallback so /login and dashboards never return 404. |
| Security | See 8.4. |
| Reliability | Booking creation is idempotent-safe against double clicks; overlap checks run on the server. |
| Data | Daily database backups on Atlas; indexes on search and overlap fields. |
| Images | Automatic Cloudinary resizing and compression; lazy-loaded in lists. |
| Accessibility | Keyboard navigable forms, labels on inputs, sufficient color contrast (WCAG AA). |
| Observability | Server logs with request IDs; errors never expose stack traces to clients. |
| Maintainability | Folder structure as in the plan (client and server), ESLint and Prettier, environment variables for all secrets. |

### 8.4 Security requirements

- Passwords hashed with bcrypt; JWTs signed with a secret from environment variables and given an expiry.
- Role-based middleware on every protected route, plus ownership checks on every board and booking action.
- A client cannot edit another user's board, read another client's booking, reach admin routes or change another user's details.
- An advertiser cannot edit another owner's board, approve their own board or see another owner's bookings.
- Admin can approve boards and manage users and bookings.
- Input validation and sanitization on every endpoint; rate limiting on login and registration; CORS restricted to the deployed front end; Helmet security headers.
- File uploads restricted by type and size.
- Secrets (MONGO_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, later Razorpay keys) live only in environment variables and are never committed to GitHub; .env is in .gitignore.

---

## 9. UX, branding and page inventory

FlashAds must look like its own product, not a generic directory: fast, clean and confident, with advertising energy.

### 9.1 Brand

| Element | Direction |
| --- | --- |
| Name | FlashAds |
| Tagline | Find. Book. Advertise. |
| Logo concept | Lightning bolt combined with a digital billboard or screen and the letter F; a custom logo is designed separately rather than using a stock icon. |
| Colors | Blue for technology and trust, orange for energy and advertising, white and dark neutrals for a clean interface; dark mode is a later option. |
| Tone | Direct, professional, plain language ("Book this board", not jargon). |

### 9.2 Public pages

| Route | Page | Content |
| --- | --- | --- |
| / | Home | Navbar, hero with search, board categories, featured boards, how it works, why FlashAds, for advertisers, for businesses, testimonials, footer |
| /explore | Explore | Search bar, filters, sort, board cards, pagination |
| /boards/:id | Board details | Gallery, facts, pricing, availability, map, date picker with price quote, Book This Board, favorite, message owner |
| /how-it-works | How it works | Steps for clients and board owners |
| /about | About | Mission and team |
| /contact | Contact | Contact form |
| /login, /register | Auth | Register has two paths: "I want to advertise" and "I own advertising boards" |

### 9.3 Dashboards

| Area | Navigation |
| --- | --- |
| Client (/client/dashboard) | Dashboard, Explore Boards, My Bookings, Favorites, Messages, Profile |
| Advertiser (/advertiser/dashboard) | Dashboard, My Boards, Add Board, Booking Requests, Messages, Earnings, Profile, Settings |
| Admin (/admin/dashboard) | Dashboard, Pending Boards, Users, Bookings, Analytics |

### 9.4 UX principles

- Show the total price and duration as soon as dates are chosen, before any commitment.
- Show unavailable dates clearly in the date picker and explain conflicts in plain words.
- Mobile first: most owners and clients will use phones.
- Every list has an empty state, a loading state and an error state.
- Forms validate inline and keep user input on error.
- Add Board is a guided multi-step form (information, location, size and visibility, pricing, images, availability) with a preview before Publish.

---

## 10. Roadmap, testing, risks and open questions

Build in strict order: authentication, boards, marketplace, booking and availability first; payments come only after bookings work reliably.

### 10.1 Roadmap

1. **Foundation** — React and Express setup, branding, routing, Atlas, auth, role dashboards
2. **Boards** — Board model, Add, Edit and Delete Board, Cloudinary images, admin approval
3. **Marketplace** — Explore, search, filters, sort, board details, Leaflet map
4. **Booking** — Pricing engine, availability, booking request, My Bookings, Booking Requests
   - **Gate 1:** the core loop passes acceptance criteria 4.9
5. **Launch** — Security testing, bug fixing, three-account test, deployment
   - **Gate 2:** security checks and the three-account test pass
6. **Growth** — v1.1 messaging, favorites, notifications; v1.2 Razorpay, reviews; v1.3 analytics, digital boards

Phases follow the 30-stage build order in the original plan and are sequenced, not dated, until a launch date is chosen. Both gates must pass before the next phase starts.

### 10.2 Testing plan

Test with three accounts: client, advertiser and admin.

| Role | Journey to test |
| --- | --- |
| Client | Register, log in, explore, search, view board, select dates, see price, book, check My Bookings, message the owner |
| Advertiser | Register, log in, add board, upload images, set price, submit, wait for approval, receive a booking, approve it |
| Admin | Log in, view dashboard, view and approve a board, view users, view bookings |

Before deployment, also check every item below.

- No 404s on any route, including after a browser refresh (the earlier login 404 issue must not recur).
- No broken buttons, console errors or API errors; correct redirects after login and logout.
- Image upload works for valid files and fails clearly for invalid ones.
- No duplicate or overlapping bookings, even with two browsers submitting at once.
- Prices match the worked examples in section 5.3.
- Unauthorized access attempts return 401 or 403.
- Mobile layouts work at 360 px width.

### 10.3 Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Too few boards at launch, so clients see an empty marketplace | Low client retention | Onboard board owners first, seed with real listings in one city, and market to owners before clients |
| Owners do not respond to requests | Clients lose trust | Notifications, response-time metric, auto-expire requests after a set period |
| Fake or inaccurate listings | Trust and legal risk | Admin approval, required photos and address, report-a-listing feature later |
| Double booking through race conditions | Broken promises to advertisers | Server-side overlap checks and atomic approval |
| Off-platform deals bypass fees | Revenue loss | Deliver value in payments, reviews and reporting; keep commission fair |
| Scope creep | MVP delayed | Follow the phase order; defer everything marked S or C |
| Secrets committed to GitHub | Security breach | .env ignored, secret scanning, rotate keys if exposed |