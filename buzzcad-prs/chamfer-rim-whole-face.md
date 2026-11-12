## What

The rim chamfer (a closed circle between a plane cap and a coaxial
cylinder or cone wall) took a wall only when it ran between its rim and
one other whole circle. It also refused any distance that reached the
wall's far rim or the cap's centre. Three cases a part commonly has are
now built:

- **A far rim in arcs.** A rod whose wall runs on into a torus at its
  other end meets the torus along two arcs, not one circle. The arcs are
  on circles about the wall's axis, so they lie at one height on the
  wall. The chamfer leaves that end alone, and it only needs that height.
  Before, such a rod fell to the flat-bevel rebuild, which refuses curved
  edges.
- **A wall exactly the distance high.** Examples are a disc as thick as
  the chamfer, a pin as tall, and a blind hole as deep. The wall goes
  away entirely: the cone runs from the cap to the wall's far rim and
  takes over that rim's edges. "Exactly" allows 1e-6 of the rim's radius,
  for a file's digits.
- **A disc cap exactly the distance in radius.** An example is a rod's
  end chamfered at the rod's radius. The cap closes to a point: the band
  becomes a pointed cone (its circle, with a seam to the apex run out and
  back, as `make_cone` writes one), and the cap goes away.

These are still refused: a distance that consumes both the cap and the
wall, and a cap with a hole when its chamfer would reach the centre.

## Test

- `crates/operations/tests/chamfer_whole_face.rs` covers a disc, a pin on
  a plate and a blind hole, each exactly the distance high, and a rod
  chamfered at its radius. Each result is valid, has a watertight mesh at
  0.5 and 0.05, has the expected face count, and takes off the revolved
  triangle, π d² (R ∓ d/3), to 1e-9. The two refusals are checked too.
  Without the change, every build is refused.
- `crates/io/tests/chamfer_rod_end_into_torus.rs` reads a rod running into
  a torus from STEP (written by brepkit's own writer) and chamfers its end
  at 3, 9 and 12.5. Each result is valid and watertight, has 5 faces, and
  matches its closed form to 1e-6. Without the change, it is refused.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
