# kushagram — terminal portfolio

A 90s-hacker-terminal portfolio. Pure HTML/CSS/JS, no build step, no dependencies.

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
cd portfolio && python3 -m http.server 8000
```

## Fill in your content

Everything you need to edit is in **`index.html`**, marked two ways:

- `<!-- FILL: ... -->` HTML comments tell you what goes where
- Amber `[REDACTED — ...]` placeholders are visible on the page so you can't miss them

Sections to fill:

| Section | What to add |
|---|---|
| `#about` | Your bio + interest areas |
| `#experience` | Role, dates, and bullets for Oracle and JioStar |
| `#projects` | Project/CTF cards — duplicate a `.proj-card` block per item, set `href` |
| `#blogs` | One `.blog-row` per post — set date, title, link |
| `#skills` | Skill names + `data-level="0–100"` per row |
| `#contact` | GitHub / LinkedIn / THM-HTB links (email is already set) |

When a placeholder is filled, remove the `redacted` class from that element so the amber dashed styling disappears.

## Gamification

9 achievements (persisted in localStorage), tracked in the top-right status bar:

- **SYSTEM BREACHED** — finish/skip the boot sequence
- **FILE INSPECTOR** — scroll through every section
- **DEEP DIVER** — reach the footer
- **REALITY GLITCHED** — click the big ASCII name 5 times
- **FOLLOW THE WHITE RABBIT** — Konami code (↑↑↓↓←→←→BA) toggles Matrix rain
- **HANDSHAKE INITIATED** — click a contact link
- **SHELL SHOCKED** — open the CTF terminal
- **FIRST BLOOD** — capture your first flag
- **CTF CHAMPION** — capture all 3 flags

There's also a console easter egg for anyone who opens devtools.

## CTF terminal

Press <code>`</code> (backtick) or click **terminal** in the nav to open an in-page shell
with a tiny virtual filesystem and 3 mini challenges. Visitors solve them entirely
in-terminal (`rot13` and `base64 -d` helper commands are built in) and submit with
`submit flag{...}`. `hint <1-3>` nudges stuck players.

Spoilers — solutions (don't publish this section if you fork the README):

1. **crypto_101** — `cat riddle.txt` is ROT13; `rot13 <text>` → `flag{r0t13_cr4ck3d}`
2. **hidden_files** — `ls -a` reveals `.hidden_vault`; `base64 -d <contents>` → `flag{h1dd3n_1n_pl41n_s1ght}`
3. **priv_esc** — `cat .bash_history` leaks root's password (`tr1n1ty`); `sudo cat /root/flag.txt` → `flag{pr1v_3sc4l4t3d}`

To add a challenge: add an entry to `CTF.challenges` and plant the clue as a file in
`VFS` (prefix with `.` to hide it from plain `ls`) in `script.js`.

## Deploy

It's static — push the folder to GitHub and enable GitHub Pages, or drag-drop onto Netlify.
