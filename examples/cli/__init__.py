from __future__ import annotations

import logging

import typer
from rich.logging import RichHandler

app = typer.Typer(
    name="virtual-clinic",
    help="Virtual Clinic CLI",
    no_args_is_help=True,
)


@app.callback()
def _setup(
    verbose: int = typer.Option(
        0,
        "--verbose",
        "-v",
        count=True,
        help="Increase log verbosity (-v info, -vv debug).",
    ),
) -> None:
    """Configure logging based on verbosity level."""
    level = {0: logging.WARNING, 1: logging.INFO}.get(verbose, logging.DEBUG)
    logging.basicConfig(
        level=level,
        format="%(message)s",
        datefmt="[%X]",
        handlers=[
            RichHandler(
                rich_tracebacks=True,
                tracebacks_show_locals=False,
                show_path=False,
            )
        ],
    )


# Register commands -----------------------------------------------------------

from cli.interview import interview as _interview_fn  # noqa: E402

app.command()(_interview_fn)
