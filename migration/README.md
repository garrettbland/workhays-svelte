# Migration

Migration files and scripts, used to move from Postgres to Firebase. Uses Deno

### Notes

Need to add `service-account-key.json` and copy contents from Firebase. `.csv` files are exported from postgres db and then stored in `./database/{tablename}-manual-export.csv`. Kept out of git to not make users passwords & information public

1. Migrate Users to Auth (to have `uid` exist) and Migrate Users to Firestore
2. Migrate Employers with User id
3. Migrate Jobs with Employer id

### Scripts

- `deno migrate-jobs.ts` (Migrates local jobs to firebase)
