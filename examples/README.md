# Virtual Clinic -- Example CLI

A LangChain-powered CLI that conducts autonomous clinical interviews with simulated patients via the [Virtual Clinic](https://pypi.org/project/virtual-clinic/) API.

An Azure OpenAI LLM plays the **doctor** role with no prior access to the patient's medical records -- it must discover all clinical information through conversation alone.

## Prerequisites

- Python 3.10+
- [uv](https://docs.astral.sh/uv/) package manager
- A JWT token provided by workshop organizers
- An Azure OpenAI resource with a deployed model (e.g. `gpt-4o`)

## Setup

```bash
cp .env.example .env   # fill in your token + Azure OpenAI credentials
uv sync
```

## Usage

```bash
# Run a diagnosis interview (defaults)
uv run virtual-clinic interview

# Specify task type
uv run virtual-clinic interview --task-type treatment
uv run virtual-clinic interview -t event

# Target a specific patient
uv run virtual-clinic interview --patient-id <uuid>

# Override max turns
uv run virtual-clinic interview --max-turns 5

# Verbose logging
uv run virtual-clinic interview -v       # info level
uv run virtual-clinic interview -vv      # debug level

# Show help
uv run virtual-clinic --help
uv run virtual-clinic interview --help
```

## Configuration

Environment variables are set in the `.env` file. CLI flags override defaults.

| Variable | Required | Default |
|----------|----------|---------|
| `VIRTUAL_CLINIC_TOKEN` | Yes | -- |
| `VIRTUAL_CLINIC_BASE_URL` | No | `https://virtual-clinic-api.vercel.app` |
| `AZURE_OPENAI_ENDPOINT` | Yes | -- |
| `AZURE_OPENAI_API_KEY` | Yes | -- |
| `AZURE_OPENAI_DEPLOYMENT` | No | `gpt5` |
| `AZURE_OPENAI_API_VERSION` | No | `2024-08-01-preview` |

| CLI flag | Default |
|----------|---------|
| `--task-type` / `-t` | `diagnosis` |
| `--patient-id` / `-p` | First patient |
| `--max-turns` / `-n` | `10` |

## Project structure

```
examples/
├── cli/
│   ├── __init__.py      # Typer app, logging setup
│   ├── __main__.py      # python -m cli support
│   ├── config.py        # Pydantic Settings (env vars + .env)
│   ├── interview.py     # The interview command
│   ├── prompts.py       # System prompt and constants
│   └── utils.py         # Shared helpers (format_rich)
├── .env.example
├── pyproject.toml
└── README.md
```
