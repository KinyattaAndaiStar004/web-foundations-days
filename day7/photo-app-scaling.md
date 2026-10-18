# Day 7 Assignment: Scaling a Photo-Sharing App

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed of photos from people they follow.

The following assumptions are used for the scaling estimates:

- The application has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo is 2 MB, and each thumbnail is 50 KB.
- A day has 86,400 seconds, and a year has 365 days.
- Peak traffic is estimated at five times the average traffic.
- All uploaded photos and their thumbnails are retained for one year.
- Storage calculations use decimal units: 1 GB = 1,000 MB and 1 TB = 1,000 GB.
- Upload and feed-view rates are averages over 24 hours; actual traffic will vary throughout the day.

### Daily Active Users (DAU)

Daily active users are calculated as follows:

10,000,000 × 10% = 1,000,000 users.

Therefore, SnapShare has **1 million daily active users**.

## 2. Traffic and Storage Estimates

### Uploads per Second

Daily uploads = 1,000,000 users × 1 photo = 1,000,000 uploads per day.

Average uploads per second:

1,000,000 ÷ 86,400 = 11.57 uploads per second.

Peak uploads per second:

11.57 × 5 = 57.87 uploads per second.

Therefore, SnapShare should plan for approximately **12 average uploads per second and 58 peak uploads per second**.

### Feed Views per Second

Daily feed views = 1,000,000 users × 50 pages = 50,000,000 feed views per day.

Average feed views per second:

50,000,000 ÷ 86,400 = 578.70 feed views per second.

Peak feed views per second:

578.70 × 5 = 2,893.52 feed views per second.

Therefore, SnapShare should plan for approximately **579 average feed views per second and 2,894 peak feed views per second**.

These figures count feed pages, not individual photos displayed within each page.

### Photo Storage per Year

Each original photo is 2 MB.

Daily original photo storage:

1,000,000 × 2 MB = 2,000,000 MB = 2 TB per day.

Annual original photo storage:

2 TB × 365 = 730 TB per year.

Each thumbnail is 50 KB.

Daily thumbnail storage:

1,000,000 × 50 KB = 50 GB per day.

Annual thumbnail storage:

50 GB × 365 = 18.25 TB per year.

Total annual photo storage:

730 TB + 18.25 TB = 748.25 TB per year.

Therefore, SnapShare requires approximately **748.25 TB of new storage per year** for original photos and thumbnails. This estimate excludes backups, replication, metadata, and other storage overhead.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view 50 feed pages per day but upload only one photo per day.

The application receives approximately 50 million feed views and 1 million uploads daily, meaning feed views outnumber uploads by 50 to 1.

This affects the design because feed requests must be served quickly and efficiently. SnapShare should use a CDN to deliver images close to users, a cache to reuse frequently requested data, and a database read replica to handle read queries separately from writes. Load balancing and additional application servers will help handle traffic spikes.

## 4. Why Photos Should Not Be Stored Inside the Database

Original photos and thumbnails should be stored in object storage rather than directly inside the relational database.

Photos are large binary files, and storing them in database rows would increase database size, backup time, storage costs, and the workload required to serve images. Object storage is designed to store large files efficiently and scale as the number of photos grows.

The database should store metadata such as the photo ID, user ID, caption, upload time, object-storage key, and thumbnail key. The actual image files should be kept in object storage and delivered through a CDN.

## 5. Architecture Diagram

                       +-------------------+
                       |       Users       |
                       +-------------------+
                                 |
                                 v
                       +-------------------+
                       |        CDN        |
                       | Cached image files|
                       +-------------------+
                                 |
                                 | Cache miss / API request
                                 v
                       +-------------------+
                       |   Load Balancer   |
                       +-------------------+
                                 |
                   +-------------+-------------+
                   |             |             |
                   v             v             v
             +-----------+ +-----------+ +-----------+
             | App Server| | App Server| | App Server|
             +-----------+ +-----------+ +-----------+
                   |             |             |
                   +-------------+-------------+
                                 |
                    +------------+------------+
                    |                         |
                    v                         v
             +-------------+           +-------------+
             |    Cache    |           |  Database   |
             | Feed/session|           |   Primary   |
             |    data     |           +-------------+
             +-------------+                  |
                                              | Replication
                                              v
                                       +--------------+
                                       | Read Replica |
                                       +--------------+

 Photo upload processing:

             +-------------+
             | App Server  |
             +-------------+
                    |
                    v
             +----------------+
             | Object Storage |
             | Original photo |
             +----------------+
                    |
                    v
             +----------------+
             | Message Queue  |
             | Thumbnail job  |
             +----------------+
                    |
                    v
             +----------------+
             | Thumbnail      |
             | Worker         |
             +----------------+
                    |
                    v
             +----------------+
             | Object Storage |
             | Thumbnail file |
             +----------------+

 The application records photo metadata in the primary database.
 The CDN delivers cached original photos and thumbnails to users.

## 6. What Each Component Does

1. CDN:Delivers cached photos and thumbnails from locations closer to users, reducing latency and traffic to the origin servers.
2. Load balancer:Distributes incoming application requests across multiple app servers to prevent one server from becoming overloaded.
3. App servers:Handle authentication, upload validation, feed generation, business logic, and communication with other services.
4. Cache:Stores frequently accessed feed data and metadata in fast memory to reduce repeated database queries.
5. Primary database:Stores persistent information such as users, relationships, captions, photo metadata, and upload records, and handles writes.
6. Read replica:Maintains a copy of the primary database and handles suitable read queries to reduce the primary database's workload.
7. Object storage:Stores original photo files and thumbnails independently of the database, supporting large storage volumes.
8. Message queue:Holds thumbnail-generation jobs so photo uploads can complete without waiting for image processing.
9. Thumbnail worker:Consumes queued jobs, generates smaller image versions, stores them in object storage, and reports completion or failure.

## 7. Photo Upload Flow

1. A user signs in and selects a photo to upload.
2. The app server authenticates the user and validates the file type, file size, and upload permissions.
3. The original photo is uploaded to object storage, either through the app server or through a secure, time-limited upload URL.
4. After the upload succeeds, the application creates a thumbnail-generation job containing the photo ID and object-storage key.
5. The job is placed in the message queue, allowing the upload request to finish without waiting for the thumbnail.
6. The app server records the photo metadata in the primary database, including the user ID, caption, storage key, upload time, and processing status.
7. A thumbnail worker retrieves the job from the queue and downloads or reads the original photo from object storage.
8. The worker generates a 50 KB thumbnail, where practical, and saves it in object storage under a separate key.
9. The worker updates the photo's metadata or processing status to indicate that the thumbnail is ready. Failed jobs can be retried, with safeguards against duplicate processing.
10. The photo becomes available in the user's feed according to the application's publication rules. The CDN can then cache and deliver the original photo and thumbnail to viewers.

If the original photo uploads successfully but thumbnail generation is delayed, the application can show the original photo or a placeholder until the thumbnail is ready.

## 8. Trade-Offs

### Trade-Off 1: Caching vs. Freshness

Caching feed data improves performance and reduces database load, but users may temporarily see outdated information after a new photo is uploaded. SnapShare must balance cache duration against freshness and invalidate or update relevant cached entries when necessary.

### Trade-Off 2: Asynchronous Processing vs. Immediate Availability

Using a message queue and background worker allows uploads to complete quickly without waiting for thumbnails. However, thumbnails may not be available immediately, and the system must handle failed jobs, retries, and duplicate messages.

### Trade-Off 3: Read Replicas vs. Data Consistency

Read replicas reduce the workload on the primary database and help the system scale, but replication lag can cause users to see slightly outdated feed data. Recent updates can be read from the primary database when immediate consistency is important.

### Trade-Off 4: CDN Performance vs. Cost and Invalidation

A CDN reduces image-loading time and origin traffic, but it introduces delivery and cache-management costs. Cached images may remain outdated until their cache expires or the application invalidates them.

## 9. Conclusion

SnapShare should use a horizontally scalable application architecture with a CDN, load balancer, multiple app servers, caching, a primary database and read replica, object storage, a message queue, and thumbnail workers.

With one million daily active users, approximately 748.25 TB of new image storage per year, and peak feed traffic approaching 2,894 page views per second, the architecture should prioritize efficient reads, scalable file storage, and asynchronous image processing.

The estimates provide a starting point for capacity planning. Actual production capacity should be validated through monitoring, load testing, and measurements of real user traffic.
