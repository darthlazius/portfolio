/* ============================================================
   KUSHAGRAM — terminal portfolio logic
   boot sequence · decrypt effects · achievements · easter eggs
   ============================================================ */

"use strict";

const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ================= ACHIEVEMENTS ================= */
const ACHIEVEMENTS = {
  breach:   { name: "SYSTEM BREACHED",   desc: "Survived the boot sequence" },
  reader:   { name: "FILE INSPECTOR",    desc: "Decrypted every file" },
  deep:     { name: "DEEP DIVER",        desc: "Reached the bottom of the rabbit hole" },
  glitch:   { name: "REALITY GLITCHED",  desc: "Poked the mainframe 5 times" },
  konami:   { name: "FOLLOW THE WHITE RABBIT", desc: "Entered the Matrix" },
  ping:     { name: "HANDSHAKE INITIATED", desc: "Opened a contact link" },
  shell:    { name: "SHELL SHOCKED",       desc: "Opened the CTF terminal" },
  blood:    { name: "FIRST BLOOD",         desc: "Captured your first flag" },
  champion: { name: "CTF CHAMPION",        desc: "Captured all 3 flags" },
};
const unlocked = new Set(JSON.parse(localStorage.getItem("ach") || "[]"));

function unlock(id) {
  if (unlocked.has(id) || !ACHIEVEMENTS[id]) return;
  unlocked.add(id);
  localStorage.setItem("ach", JSON.stringify([...unlocked]));
  updateAchCount();
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `🏆 ${ACHIEVEMENTS[id].name}<small>${ACHIEVEMENTS[id].desc}</small>`;
  $("#toasts").appendChild(t);
  setTimeout(() => t.remove(), 4200);
}

function updateAchCount() {
  $("#ach-count").textContent = `🏆 ${unlocked.size}/${Object.keys(ACHIEVEMENTS).length}`;
}

/* ================= BOOT SEQUENCE ================= */
const BOOT_LINES = [
  { t: "KUSHAGRAM BIOS v1.337 — PHOSPHOR EDITION", d: 300 },
  { t: "Copyright (C) 1995-2026, KGRAM Industries", d: 200 },
  { t: "", d: 150 },
  { t: "CPU ........................ 486DX2 @ 66MHz [OVERCLOCKED]", d: 120 },
  { t: "MEMORY TEST ................ 65536 KB <span class='ok'>OK</span>", d: 150 },
  { t: "DETECTING CURIOSITY ........ <span class='ok'>FOUND</span>", d: 150 },
  { t: "", d: 100 },
  { t: "> ESTABLISHING UPLINK TO MAINFRAME...", d: 350 },
  { bar: "BYPASSING FIREWALL ", d: 35 },
  { bar: "CRACKING ENCRYPTION ", d: 28 },
  { t: "SPOOFING IDENTITY .......... <span class='warn'>root</span>", d: 200 },
  { t: "INTRUSION DETECTION ........ <span class='err'>DISABLED</span>", d: 250 },
  { t: "", d: 150 },
  { t: "DECRYPTING PROFILE: kushagram.dat", d: 250 },
  { t: "  [FILE 01] about.enc ......... <span class='ok'>DECRYPTED</span>", d: 130 },
  { t: "  [FILE 02] experience.enc .... <span class='ok'>DECRYPTED</span>", d: 130 },
  { t: "  [FILE 03] projects.enc ...... <span class='ok'>DECRYPTED</span>", d: 130 },
  { t: "  [FILE 04] blogs.enc ......... <span class='ok'>DECRYPTED</span>", d: 130 },
  { t: "  [FILE 05] skills.enc ........ <span class='ok'>DECRYPTED</span>", d: 130 },
  { t: "  [FILE 06] contact.enc ....... <span class='ok'>DECRYPTED</span>", d: 200 },
  { t: "", d: 250 },
  { t: "<span class='granted'>&gt;&gt; ACCESS GRANTED &lt;&lt;</span>", d: 900 },
];

let bootSkipped = false;

async function runBoot() {
  const out = $("#boot-text");
  const skip = () => { bootSkipped = true; };
  window.addEventListener("keydown", skip, { once: true });
  $("#boot").addEventListener("click", skip, { once: true });

  for (const line of BOOT_LINES) {
    if (bootSkipped) break;
    if (line.bar) {
      // animated progress bar
      const row = document.createElement("div");
      out.appendChild(row);
      for (let i = 0; i <= 20 && !bootSkipped; i++) {
        const pct = Math.round((i / 20) * 100);
        row.innerHTML = line.bar + "▓".repeat(i) + "░".repeat(20 - i) + " " + pct + "%";
        await sleep(line.d);
      }
      row.innerHTML = line.bar + "▓".repeat(20) + " 100% <span class='ok'>OK</span>";
    } else {
      const row = document.createElement("div");
      row.innerHTML = line.t || "&nbsp;";
      out.appendChild(row);
      await sleep(line.d);
    }
    out.scrollTop = out.scrollHeight;
  }
  endBoot();
}

function endBoot() {
  const boot = $("#boot");
  boot.classList.add("boot-out");
  setTimeout(() => {
    boot.remove();
    $("#site").classList.remove("hidden");
    initSite();
    unlock("breach");
  }, 450);
}

/* ================= TEXT SCRAMBLE / DECRYPT ================= */
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#$%&@01";

function scrambleIn(el) {
  const final = el.dataset.final || el.textContent;
  el.dataset.final = final;
  let frame = 0;
  const total = 24;
  const timer = setInterval(() => {
    frame++;
    const reveal = Math.floor((frame / total) * final.length);
    let txt = final.slice(0, reveal);
    for (let i = reveal; i < final.length; i++) {
      txt += final[i] === " " ? " "
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = txt;
    if (frame >= total) { clearInterval(timer); el.textContent = final; }
  }, 35);
}

/* ================= TYPED TAGLINE ================= */
async function typeTagline() {
  const phrases = [
    "cybersecurity enthusiast",
    "breaking things since '02",
    "ex-Oracle · ex-JioStar",
    "trust no input",
  ];
  const el = $("#typed-tagline");
  let i = 0;
  while (true) {
    const p = phrases[i % phrases.length];
    for (let c = 1; c <= p.length; c++) { el.textContent = p.slice(0, c); await sleep(55); }
    await sleep(1800);
    for (let c = p.length; c >= 0; c--) { el.textContent = p.slice(0, c); await sleep(25); }
    await sleep(300);
    i++;
  }
}

/* ================= MAIN SITE INIT ================= */
function initSite() {
  updateAchCount();
  typeTagline();
  $("#year").textContent = new Date().getFullYear();

  // clock
  setInterval(() => {
    $("#clock").textContent = new Date().toLocaleTimeString("en-GB");
  }, 1000);

  // reveal-on-scroll: terminal windows slide in, headers scramble, skills fill
  const decrypted = new Set();
  const allSections = $$(".file-section").length;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);

      e.target.querySelectorAll(".terminal-window").forEach((w, i) =>
        setTimeout(() => w.classList.add("revealed"), i * 150));

      const h = e.target.querySelector("[data-decrypt]");
      if (h) scrambleIn(h);

      e.target.querySelectorAll(".skill").forEach((s) => {
        const lvl = +s.dataset.level || 0;
        s.querySelector(".skill-bar").style.setProperty("--w", lvl + "%");
        s.querySelector(".skill-pct").textContent = lvl + "%";
      });

      decrypted.add(e.target.id);
      if (decrypted.size >= allSections) unlock("reader");
    }
  }, { threshold: 0.15 });

  $$(".file-section").forEach((s) => io.observe(s));

  // deep diver: reach the footer
  new IntersectionObserver((es, o) => {
    if (es.some((e) => e.isIntersecting)) { unlock("deep"); o.disconnect(); }
  }).observe($("footer"));

  // glitch: click/tap the name 5 times (desktop ASCII art or mobile wordmark)
  let clicks = 0;
  $$("#ascii-name, #ascii-name-mobile").forEach((el) =>
    el.addEventListener("click", () => {
      el.classList.remove("glitch");
      void el.offsetWidth; // restart animation
      el.classList.add("glitch");
      if (++clicks >= 5) unlock("glitch");
    }));

  // handshake: open any contact link
  $$("#contact a").forEach((a) =>
    a.addEventListener("click", () => unlock("ping")));
}

/* ================= KONAMI → MATRIX RAIN ================= */
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let kPos = 0;
window.addEventListener("keydown", (e) => {
  kPos = e.key === KONAMI[kPos] ? kPos + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (kPos === KONAMI.length) { kPos = 0; toggleMatrix(); unlock("konami"); }
});

let matrixOn = false, matrixTimer = null;
function toggleMatrix() {
  const cv = $("#matrix");
  matrixOn = !matrixOn;
  cv.classList.toggle("on", matrixOn);
  if (!matrixOn) { clearInterval(matrixTimer); return; }

  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const fs = 16, cols = Math.floor(cv.width / fs);
  const drops = Array(cols).fill(1);
  const glyphs = "アァカサタナハマヤラ0123456789ABCDEF$#@";

  matrixTimer = setInterval(() => {
    ctx.fillStyle = "rgba(5, 8, 5, 0.08)";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#00ff41";
    ctx.font = fs + "px monospace";
    drops.forEach((y, i) => {
      ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * fs, y * fs);
      drops[i] = (y * fs > cv.height && Math.random() > 0.975) ? 0 : y + 1;
    });
  }, 50);
}

/* ================= CONSOLE EASTER EGG ================= */
console.log("%c>> ACCESS LOG: you opened the console. respect. <<", "color:#00ff41;background:#000;font-size:14px;padding:4px 8px;");
console.log("%cTry the Konami code on the page: ↑↑↓↓←→←→BA", "color:#ffb000;");

/* ============================================================
   CTF TERMINAL — mini challenges
   1. crypto_101  : ROT13 riddle           → flag{r0t13_cr4ck3d}
   2. hidden_files: ls -a + base64         → flag{h1dd3n_1n_pl41n_s1ght}
   3. priv_esc    : password in history    → flag{pr1v_3sc4l4t3d}
   ============================================================ */

const CTF = {
  challenges: [
    { id: "crypto_101",   flag: "flag{r0t13_cr4ck3d}",          hint: "riddle.txt looks scrambled. caesar would be proud. try: rot13 <text>" },
    { id: "hidden_files", flag: "flag{h1dd3n_1n_pl41n_s1ght}",  hint: "not every file shows up with plain ls... and that string looks base64-ish. try: ls -a, then base64 -d <text>" },
    { id: "priv_esc",     flag: "flag{pr1v_3sc4l4t3d}",         hint: "root keeps secrets in /root/flag.txt. someone left a password in their shell history..." },
  ],
  solved: new Set(JSON.parse(localStorage.getItem("ctf_solved") || "[]")),
  sudoPass: "tr1n1ty",
  awaitingSudoPass: false,
};

const VFS = {
  "readme.txt": [
    "WELCOME TO THE KUSHAGRAM CTF RANGE",
    "----------------------------------",
    "3 flags are hidden in this terminal. Format: flag{...}",
    "Capture them with: submit flag{...}",
    "",
    "Type 'help' for commands, 'flags' for progress, 'hint <1-3>' if stuck.",
    "Happy hacking. Everything here is in scope ;)",
  ].join("\n"),
  "riddle.txt": "fbzrgvzrf lbh whfg unir gb ebgngr... synt{e0g13_pe4px3q}",
  "notes.txt": [
    "sysadmin TODO:",
    "  [ ] tell root to stop leaving passwords in shell history",
    "  [ ] find out why there's a hidden vault file in this directory",
    "  [x] procrastinate",
  ].join("\n"),
  ".hidden_vault": "ZmxhZ3toMWRkM25fMW5fcGw0MW5fczFnaHR9",
  ".bash_history": [
    "sudo -s",
    "echo 'note to self, root password is tr1n1ty' ",
    "history -c   # oops, forgot to actually run this",
  ].join("\n"),
};

const ROOT_FS = {
  "/root/flag.txt": "flag{pr1v_3sc4l4t3d}",
};

const cli = { el: null, out: null, input: null, history: [], hPos: 0, opened: false };

function cliPrint(text = "", cls = "") {
  const div = document.createElement("div");
  if (cls) div.className = cls;
  div.textContent = text;
  cli.out.appendChild(div);
  cli.out.scrollTop = cli.out.scrollHeight;
}

function cliPrintFlagLine(text) {
  const div = document.createElement("div");
  div.innerHTML = `<span class="o-flag">${text}</span>`;
  cli.out.appendChild(div);
  cli.out.scrollTop = cli.out.scrollHeight;
}

function rot13(s) {
  return s.replace(/[a-zA-Z]/g, (c) =>
    String.fromCharCode((c <= "Z" ? 90 : 122) >= c.charCodeAt(0) + 13
      ? c.charCodeAt(0) + 13 : c.charCodeAt(0) - 13));
}

function saveCtf() {
  localStorage.setItem("ctf_solved", JSON.stringify([...CTF.solved]));
}

function flagsStatus() {
  const lines = ["CTF PROGRESS:"];
  CTF.challenges.forEach((c, i) => {
    const done = CTF.solved.has(c.id);
    lines.push(`  [${done ? "x" : " "}] ${i + 1}. ${c.id.padEnd(14)} ${done ? c.flag : "????????"}`);
  });
  lines.push(`  ${CTF.solved.size}/3 flags captured`);
  return lines.join("\n");
}

const CLI_COMMANDS = {
  help() {
    cliPrint([
      "AVAILABLE COMMANDS:",
      "  ls [-a]          list files (some files hide from plain ls)",
      "  cat <file>       print file contents",
      "  rot13 <text>     rotate text by 13 (crypto-fu)",
      "  base64 -d <str>  decode base64",
      "  sudo <cmd>       run command as root (password required)",
      "  submit <flag>    submit a captured flag",
      "  flags            show CTF progress",
      "  hint <1-3>       get a hint for a challenge",
      "  whoami | pwd | echo | history | clear | exit",
    ].join("\n"), "o-dim");
  },
  ls(args) {
    const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
    const files = Object.keys(VFS).filter((f) => showAll || !f.startsWith("."));
    const prefix = showAll ? [".", ".."] : [];
    cliPrint([...prefix, ...files].join("   "));
  },
  cat(args) {
    const f = args[0];
    if (!f) return cliPrint("usage: cat <file>", "o-err");
    if (f.startsWith("/root/")) return cliPrint(`cat: ${f}: Permission denied (try sudo)`, "o-err");
    if (f in VFS) return cliPrint(VFS[f]);
    cliPrint(`cat: ${f}: No such file or directory`, "o-err");
  },
  rot13(args) {
    if (!args.length) return cliPrint("usage: rot13 <text>", "o-err");
    cliPrint(rot13(args.join(" ")));
  },
  base64(args) {
    if (args[0] !== "-d" || !args[1]) return cliPrint("usage: base64 -d <string>", "o-err");
    try { cliPrint(atob(args[1])); }
    catch { cliPrint("base64: invalid input", "o-err"); }
  },
  sudo(args) {
    if (!args.length) return cliPrint("usage: sudo <command>", "o-err");
    CTF.awaitingSudoPass = args.join(" ");
    cliPrint("[sudo] password for guest:", "o-warn");
    $("#cli-prompt").textContent = "password:";
  },
  submit(args) {
    const guess = (args[0] || "").trim();
    if (!guess) return cliPrint("usage: submit flag{...}", "o-err");
    const ch = CTF.challenges.find((c) => c.flag === guess);
    if (!ch) return cliPrint("✗ INCORRECT FLAG. keep digging.", "o-err");
    if (CTF.solved.has(ch.id)) return cliPrint(`already captured: ${ch.id}`, "o-warn");
    CTF.solved.add(ch.id);
    saveCtf();
    cliPrintFlagLine(`✓ FLAG CAPTURED — ${ch.id} [${CTF.solved.size}/3]`);
    unlock("blood");
    if (CTF.solved.size === CTF.challenges.length) {
      cliPrint("ALL FLAGS CAPTURED. you are now certified dangerous.", "o-warn");
      unlock("champion");
    }
  },
  flags() { cliPrint(flagsStatus(), "o-warn"); },
  hint(args) {
    const n = parseInt(args[0], 10);
    if (!n || n < 1 || n > CTF.challenges.length) return cliPrint("usage: hint <1-3>", "o-err");
    cliPrint(`hint[${n}]: ${CTF.challenges[n - 1].hint}`, "o-dim");
  },
  whoami() { cliPrint("guest (for now...)"); },
  id() { cliPrint("uid=1337(guest) gid=1337(guest) groups=1337(guest),31337(curious)"); },
  pwd() { cliPrint("/home/guest/ctf"); },
  echo(args) { cliPrint(args.join(" ")); },
  history() { cliPrint(cli.history.map((h, i) => `  ${i + 1}  ${h}`).join("\n") || "(empty)"); },
  clear() { cli.out.innerHTML = ""; },
  man() { cliPrint("What manual page do you want?\nFor instance, try 'man tcp'... just kidding, try 'help'.", "o-dim"); },
  exit() { toggleCli(false); },
  rm(args) {
    if (args.join(" ").includes("-rf /")) {
      cliPrint("rm: nice try. this incident will be reported to no one.", "o-err");
    } else cliPrint("rm: permission denied (museum pieces, do not touch)", "o-err");
  },
};
CLI_COMMANDS.quit = CLI_COMMANDS.exit;
CLI_COMMANDS.ctf = CLI_COMMANDS.flags;

function runCliLine(raw) {
  const line = raw.trim();

  // sudo password flow
  if (CTF.awaitingSudoPass) {
    const pendingCmd = CTF.awaitingSudoPass;
    CTF.awaitingSudoPass = false;
    $("#cli-prompt").textContent = "guest@ctf:~$";
    cliPrint("password: " + "*".repeat(line.length), "o-dim");
    if (line !== CTF.sudoPass) {
      return cliPrint("sudo: 1 incorrect password attempt. (hint: history files are gossipy)", "o-err");
    }
    // run the pending command as root — only root files are interesting
    const m = pendingCmd.match(/^cat\s+(\S+)/);
    if (m && m[1] in ROOT_FS) {
      cliPrint("# access granted, welcome root", "o-warn");
      return cliPrint(ROOT_FS[m[1]]);
    }
    if (pendingCmd === "-s" || pendingCmd === "su") {
      return cliPrint("root shell? bold. the flag lives at /root/flag.txt", "o-warn");
    }
    return cliPrint(`sudo: ${pendingCmd}: nothing interesting happens. (psst: /root/flag.txt)`, "o-dim");
  }

  cliPrint("guest@ctf:~$ " + line, "o-cmd");
  if (!line) return;
  cli.history.push(line);
  cli.hPos = cli.history.length;

  const [cmd, ...args] = line.split(/\s+/);
  const fn = CLI_COMMANDS[cmd];
  if (fn) fn(args);
  else cliPrint(`${cmd}: command not found (type 'help')`, "o-err");
}

function toggleCli(open) {
  cli.el.classList.toggle("cli-closed", !open);
  if (open) {
    cli.input.focus();
    if (!cli.opened) {
      cli.opened = true;
      unlock("shell");
      cliPrint("CONNECTION ESTABLISHED — kushagram ctf range v1.0", "o-warn");
      cliPrint("3 flags hidden inside. type 'help' to begin, 'cat readme.txt' for the briefing.\n", "o-dim");
    }
  }
}

function initCli() {
  cli.el = $("#cli");
  cli.out = $("#cli-out");
  cli.input = $("#cli-in");

  $("#term-toggle").addEventListener("click", (e) => {
    e.preventDefault();
    toggleCli(cli.el.classList.contains("cli-closed"));
  });
  $("#cli-close").addEventListener("click", () => toggleCli(false));

  window.addEventListener("keydown", (e) => {
    if (e.key === "`" && document.activeElement !== cli.input) {
      e.preventDefault();
      toggleCli(cli.el.classList.contains("cli-closed"));
    }
    if (e.key === "Escape") toggleCli(false);
  });

  cli.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      runCliLine(cli.input.value);
      cli.input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cli.hPos > 0) cli.input.value = cli.history[--cli.hPos] || "";
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cli.hPos < cli.history.length) cli.input.value = cli.history[++cli.hPos] || "";
    }
  });
}

/* ================= GO ================= */
initCli();
runBoot();
