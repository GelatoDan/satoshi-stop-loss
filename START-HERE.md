# START HERE — Satoshi Stop Loss Cowork Project

Welcome to the SSL project workspace. Read this file first, then read INSTRUCTIONS.md before touching anything else.

---

## Quick Orient

This is a pre-seed DeFi protocol project. Two core documents already exist in `docs/`:

1. **`ssl_spec_v0.1.docx`** — Full protocol whitepaper. Read this to understand what SSL is and how it works technically.
2. **`ssl_open_questions_analysis.docx`** — Strategic analysis of 6 open design questions, with recommended positions. Read this to understand *why* decisions were made.

Do not contradict decisions already made in these documents without flagging the conflict explicitly.

---

## Available Tasks

Tasks live in the `tasks/` folder. Each has a full brief. Current task list:

### Protocol Development
| File | Task | Priority |
|---|---|---|
| `tasks/update-spec.md` | Update protocol spec with resolved OQ decisions | High |
| `tasks/architecture-diagrams.md` | Build technical architecture diagrams | Medium |
| `tasks/token-model.md` | Build full token economics model (Excel) | High |

### Research
| File | Task | Priority |
|---|---|---|
| `tasks/competitive-research.md` | Map the competitive landscape | High |
| `tasks/legal-matrix.md` | Build jurisdiction-by-jurisdiction legal risk matrix | High |
| `tasks/satoshi-wallet-research.md` | Research current state of Patoshi pattern wallet attribution | Medium |

### Go-To-Market
| File | Task | Priority |
|---|---|---|
| `tasks/marketing-launch-plan.md` | Full marketing, launch & scaling plan | High |
| `tasks/pitch-deck.md` | Build investor pitch deck | High |
| `tasks/community-strategy.md` | Design community & developer relations strategy | Medium |

---

## Suggested Starting Sequence

If you're starting fresh on this project, the recommended order is:

1. Read `INSTRUCTIONS.md` (full context)
2. Skim `docs/ssl_spec_v0.1.docx` (understand the protocol)
3. Skim `docs/ssl_open_questions_analysis.docx` (understand the decisions)
4. Run `tasks/competitive-research.md` (grounds everything else)
5. Run `tasks/token-model.md` (needed for pitch deck and marketing)
6. Run `tasks/marketing-launch-plan.md` (the big one)

---

## File Naming Convention

- Spec versions: `ssl_spec_v0.2.docx`, `ssl_spec_v0.3.docx` etc.
- Research outputs: `research/[topic]-research-[date].docx`
- Working files: `working/[deliverable]-[date].[ext]`

---

## If Something Seems Wrong

If any task asks you to do something that conflicts with a decision already made in the spec or OQ analysis, **stop and flag it** before proceeding. Do not quietly override resolved decisions.
