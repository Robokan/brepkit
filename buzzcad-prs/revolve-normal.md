A planar profile whose plane is perpendicular to the revolve axis sweeps no volume (a rectangle in `z = 0` turned about Z), but `revolve` built an empty, degenerate solid from it. It now returns an error saying so.

## Tests

- Added `revolve_profile_normal_to_axis_error` in `revolve.rs`: a unit square revolved about an axis normal to its plane is refused.
- `cargo test -p brepkit-operations --lib revolve` and `cargo clippy -p brepkit-operations --all-targets -- -D warnings` pass.
- `compound_cut_edge_tangent_tools_stays_analytic` fails now and then in a full parallel `--lib` run, on unmodified `main` too; it passes alone (it reads a process-wide fallback counter that other tests' fallbacks can bump).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
