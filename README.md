# Sokunrith Lab website

The website of Sokunrith Lab (Dr. Sokunrith Pov, Well-Being Promotion Office, The Institute for Diversity and Inclusion, Hiroshima University).

Live site (after GitHub Pages is switched on): **https://sokunrith.github.io/sokunrithlab/**

## Files

| File | What it is | Edit it? |
|---|---|---|
| `data.js` | All site content: profile, publications, conferences, projects, teaching, news, people | **Yes — this is the only file you edit** |
| `admin.html` | A form-based editor for `data.js` | No |
| `index.html`, `app.js`, `styles.css` | Page layout, rendering, and design | Only to change the design |
| `images/` | Put your portrait and member photos here | Add files |

## Switch on GitHub Pages (once)

1. Upload all files in this folder to the root of the repository (Add file → Upload files → drag everything in → Commit).
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, then **Save**.
4. After a minute or two, the site is live at the address above.

## Adding a publication, conference, project, or news item

The editor is for you only. It is not linked anywhere on the public site, and it opens only after you sign in with a GitHub token that has write access to this repository. Visitors who find the page see only a sign-in box; without your token they cannot view the editor or change anything.

1. Go to `https://sokunrith.github.io/well-being-promotion-office-report/admin.html` (bookmark it).
2. Paste your access token and click **Sign in**. Tick *Keep me signed in on this device* only on your own computer.
3. Pick a section on the left, fill in the form, click **Add entry**.
   - For publications, paste a DOI and click **Fill from DOI** to complete the title, authors, journal, volume, and pages automatically.
   - Set a status such as *Under review* or *In preparation* for future papers; they appear under *Forthcoming*.
   - Conferences with a future date appear under *Upcoming*, and move to *Past* after the date.
4. Click **Publish to website**. The live site updates about a minute later.

You can also edit `data.js` directly on GitHub (pencil icon): copy an existing entry, paste it, change the text, and commit.

## Creating your access token (once)

1. GitHub → your avatar → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories** → `well-being-promotion-office-report`.
3. Permissions → Repository permissions → **Contents: Read and write**.
4. Choose an expiry date (for example one year), generate, and store the token somewhere safe such as a password manager.

Never share the token. If it leaks, delete it on GitHub and create a new one; the old one stops working immediately.

## Changing your photo

Replace `images/sokunrith.jpg` with a new portrait-orientation photo of the same name (Add file → Upload files).
