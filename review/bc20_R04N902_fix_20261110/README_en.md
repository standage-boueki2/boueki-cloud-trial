# R04-N9-02 (H07) fix — app candidate 21.85.4 — 10 Nov 2026

Nothing is deployed. Production is still Apps Script version 42 and app 21.85.1. The backend is unchanged since 9 Nov 21:17: v2.33 sec q (security `2111d903…d234`, deployment `bd0aef57…7fa4`, latency `5f3f4903…0288`). Synthetic data only.

Files in the Drive copy (out8_cloud_R04N902_20261110): this README, `layer_r04n9_to_r04n902.diff`, `omori-browser-n902.cjs`, `build.py`, `tsx.cjs`.
- Full layer = 9 Nov layer `app_r04n9/logic_v2185mail.js` (`26210229…3137`) + the diff (`patch -p1`). Expected result: `24e6e14b…82a5`.
- Candidate page = `python3 build.py <live 21.85.1 index.html> <layer transpiled by tsx.cjs> index-candidate-21.85.4.html 21.85.4 938c06368422`. Expected result: `22455e84…d3b2`.

## What changed (mail layer only: `app/layer_r04n9_to_r04n902.diff`, +50 / −1 lines incl. comments)
1. After the first `mail_send` sets `m.idem` and calls `saveTen()`, the layer reads `localStorage["bc20_ten_" + SES.code]` back **before the request leaves the page** (`v2185mKept`). It looks for the stored message with the same `v2185id` and requires the same `idem`, origin account (`v2185k`) and first-admission time (`v2185t0`).
2. If that cannot be confirmed, there is **no handoff**: no request and no new identity. Nothing is resent automatically. The message becomes `failed`, with the reason "Not sent: this browser could not save the send record (send ID)…" (`v2185mNoKeep`). So a stored "sending / no idem" record now only exists when nothing left the page, and the existing restore rule ("no idem → Not sent") stays truthful after reload.
3. If the account or thread changed while the identity was being computed, the refusal does not rewrite or toast the newly selected view. This is the same origin rule as F06/F07.
4. Messages of tenants that `saveTen` never stores (`src` other than `upload` / `sample2`, or a non-trial session) leave no durable record that a reload could misread, so they are not checked. That is the only bypass. It is also closed when the stored copy already contains this `v2185id`.

Unchanged: the identity formula, the 6-minute bound, origin binding, the resume/`checking` path after handoff, and other callers of `mail_send`. If browser saves fail *after* handoff, the stored record keeps its idem and resumes as before (H08).

## Build (`tools/`)
21.85.4 = live 21.85.1 `index.html` (main branch, build 4065fdd482da) + this layer transpiled (TypeScript `transpileModule`, ES2020, removeComments), inserted before the `v35Restore` trailer of the main script. The main-script CSP hash, `BC20_VER` and `BC20_BUILD` are updated.
Control: the same `tools/build.py` with the 9 Nov layer (`2621022960…3137`) reproduces candidate 21.85.3 byte for byte (`8ef05889c482a5af…255e`, build 016266d78528).

| file | sha256 |
|---|---|
| app/index-candidate-21.85.4.html (build 938c06368422, ver 21.85.4) | 22455e84bf6b91fff969ce8c7e972f37b7f8754444b4e66c5a3fcd4aa7608049 |
| app/logic_v2185mail.js | 24e6e14bdd882ac37c4ff3aac68b6699ab25e74969eb86bf42a4ab3fe02982a5 |
| main script CSP hash | sha256-4ddlSYgFjcKTi5KIDGfwTX1dKy+BIDPUlu3e1froolA= |

The demo page is unchanged (the layer is trial only). It is still the 21.85.1 demo, `5d4987fb…9e02`.

## Results (`results/`) — Nicolas's 8 Nov `browser-fixture.cjs` + `gas-harness.cjs`, unchanged; Playwright 1.63 / Chromium
`tests/omori-browser-n902.cjs` is new:
- **H07**: QuotaExceededError on every save that contains the idem. The earlier, smaller saves stay durable.
- **H08**: every save fails only after the request has left.
- **H09**: an ordinary send.
- **H10**: after a refusal, the same text is sent again with working storage.
- **H11**: no page errors.

`tests/omori-browser-n9.cjs` is O1–O3 from 9 Nov, unchanged.

| suite | v42 (v2.29secf1 `5f837f92…`) | deployment (secq_kbhist) | latency (secq_kbhist_lat) |
|---|---|---|---|
| 21.85.4 H07–H11 | 5/5 | 5/5 | 5/5 |
| 21.85.4 O1–O3 | 3/3 | 3/3 | 3/3 |
| 21.85.3 control H07–H11 | 3/5 (H07, H10) | 4/5 (H07) | 4/5 (H07) |

- **H07 on 21.85.3** reproduces your report: 1 request, 1 effect, the stored record is `sending` with no idem, and the message shows `failed` after reload.
- **H07 on 21.85.4**: 0 requests, 0 effects. It shows `failed` with the storage reason before reload, and `failed` after reload. That is now true, because nothing left the page.
- **H08 on 21.85.4**: 1 effect and 1 idem. After reload it shows `checking`, then `sent` (already sent) on deployment/latency and `unknown` on v42.
- **H10 on 21.85.3 / v42** fails only because the first send really went out, so the second is the server's 10-minute duplicate.

## Not done this round
Your E01–E09, F01–F07, ordinary 12, N1–N6 and the L05/offline matrix were **not** rerun. Your 9 Nov reproduction ZIP is not available to the environment that made this fix, so only the 8 Nov fixture was used. We will run your suites unchanged and add the numbers before asking for your OK. No live GAS run. The H07 injection is ours, written from your description, not your H07 file.
