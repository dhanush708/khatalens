# Contributing to KhataLens

Thank you for your interest in contributing to **KhataLens**! We welcome open-source contributions from the developer community.

## Development Workflow
1. **Fork and Clone:** Clone the repository locally.
2. **Environment Setup:** Follow the instructions in [README.md](README.md) to set up Python and Node dependencies.
3. **Safety & Privacy:**
   - NEVER commit real customer names, phone numbers, or actual shop ledgers.
   - All sample ledgers must be strictly synthetic and labeled as such.
   - Never commit AWS access keys, secret tokens, or `.env` files.
4. **Code Quality:**
   - Ensure all unit tests pass: `pytest backend/tests -v`
   - Ensure frontend builds cleanly: `cd frontend && npm run build`
   - Run the accuracy benchmark: `python scripts/evaluate_accuracy.py`
5. **Submitting Changes:** Open a clear pull request describing your improvements or bug fixes.
