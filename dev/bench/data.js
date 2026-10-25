window.BENCHMARK_DATA = {
  "lastUpdate": 1792906880393,
  "repoUrl": "https://github.com/Robokan/brepkit",
  "entries": {
    "Boolean perf": [
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "f88abfa8e125bc4355deeb5d7b5a0021ed611e8d",
          "message": "fix(algo): drop a closed section lying wholly in a plane face's hole\n\nA bore tilted just off a boss's axis crosses the plate the boss is fused\nto inside the boss's round hole in that face. The exact plane x cylinder\ntrim found no crossings and left the closed ellipse to the sampled\nrestriction, which reads no holes, so it was kept and split the bore's\nwall along a curve no face shared; the wall was dropped and the cut fell\nback to a mesh. A closed section crossing none of the face's edges, holes\nincluded, whose point lies outside the face's exact outline is dropped.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-24T22:35:12-07:00",
          "tree_id": "76df4f9c28832f83aa81df49bf583580b22c5cfe",
          "url": "https://github.com/Robokan/brepkit/commit/f88abfa8e125bc4355deeb5d7b5a0021ed611e8d"
        },
        "date": 1792906704488,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 847878,
            "range": "± 1254",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 925570,
            "range": "± 2309",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11389,
            "range": "± 14",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 518232,
            "range": "± 1120",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 39476715,
            "range": "± 694937",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "630287eaebf4841187c981993e6c100b1e55be74",
          "message": "chore: point the corpus at the latest replays\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-24T22:35:48-07:00",
          "tree_id": "f71e283d4c6e83f82652f38ca492c85eec6c1f2f",
          "url": "https://github.com/Robokan/brepkit/commit/630287eaebf4841187c981993e6c100b1e55be74"
        },
        "date": 1792906879997,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1015725,
            "range": "± 18150",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1112755,
            "range": "± 3523",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13572,
            "range": "± 15",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 649824,
            "range": "± 682",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 45898379,
            "range": "± 95681",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}