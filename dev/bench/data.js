window.BENCHMARK_DATA = {
  "lastUpdate": 1792957196974,
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
          "id": "3e2d40694c6a7af6df678b1e565c74f4a69a9507",
          "message": "Merge upstream/main (4.2.8): the fork's fixes as upstream merged them\n\nUpstream merged eleven of the fork's fixes (#2045-#2052, #2054-#2056)\nand released them in 4.2.3-4.2.8, with dependency bumps. Their reviewed\nversions replace the fork's originals: exact planar flux and corner\nshare in the shell orientation readings, the exact ring-face sample,\nthe rim-notch bands, the exact loop areas in the STEP reader and the\nprojection's touching spans. The fork's own work is kept. Workspace\ntests pass; a full corpus replay shows no regressions.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-24T23:29:27-07:00",
          "tree_id": "294bcef2764001a8436bc89252b0fc71beb7fa90",
          "url": "https://github.com/Robokan/brepkit/commit/3e2d40694c6a7af6df678b1e565c74f4a69a9507"
        },
        "date": 1792909908548,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 612814,
            "range": "± 2531",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 683190,
            "range": "± 8136",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8572,
            "range": "± 126",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 384496,
            "range": "± 9596",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 31023116,
            "range": "± 211915",
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
          "id": "effd3d8e47829091a99ba611859a25ed579e8529",
          "message": "chore: point the corpus at the merge's replay\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-24T23:29:50-07:00",
          "tree_id": "12496b6f35265d41a1eae2cd65482bbfd0a798b4",
          "url": "https://github.com/Robokan/brepkit/commit/effd3d8e47829091a99ba611859a25ed579e8529"
        },
        "date": 1792910048007,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 592368,
            "range": "± 5831",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 655960,
            "range": "± 6991",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8214,
            "range": "± 127",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 384112,
            "range": "± 3830",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 30596328,
            "range": "± 500254",
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
          "id": "41344daef04a5f70af65c88cf6c32c00c7cd4996",
          "message": "feat(operations): two-distance chamfers with a reference face per edge\n\n`chamfer::chamfer_two_on` measures `d1` on each edge's given face and `d2`\non its other face (a distance-and-angle chamfer is `d2 = d1 * tan(angle)`).\nRound rims between a cap and a coaxial wall are cut by the rim chamfer,\nwhich now takes a cap and a wall distance; other edges go to the blend\nengine's chamfer, which takes the reference face per edge\n(`ChamferBuilder::add_edges_asymmetric_on`, `blend_ops::chamfer_v2_on`).\n\nfix(blend): the trimmer keeps a trimmed planar face's holes on the kept\nside; it dropped them, leaving the hole's wall open.\n\nfix(operations): an asymmetric chamfer's ends set each side back by its\nown face's distance; both took the larger, leaving a wedge at each end\n(the volume test had locked that in).\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T08:05:14-07:00",
          "tree_id": "821d8d961fd1d9201acface9e9d97fc6cd9dc116",
          "url": "https://github.com/Robokan/brepkit/commit/41344daef04a5f70af65c88cf6c32c00c7cd4996"
        },
        "date": 1792940890636,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1065550,
            "range": "± 2279",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1155239,
            "range": "± 21116",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13417,
            "range": "± 11",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 665086,
            "range": "± 6594",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 47814413,
            "range": "± 111198",
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
          "id": "82dc90963e4cb459fcc0fac8738e7bf6aa3127bd",
          "message": "chore: point the corpus at the chamfer replays\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T08:05:19-07:00",
          "tree_id": "8bc67bde918ce65d1108a708c97d0135d6d44a24",
          "url": "https://github.com/Robokan/brepkit/commit/82dc90963e4cb459fcc0fac8738e7bf6aa3127bd"
        },
        "date": 1792941074478,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1059270,
            "range": "± 3434",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1148861,
            "range": "± 3230",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13825,
            "range": "± 38",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 668188,
            "range": "± 1151",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 48252314,
            "range": "± 763053",
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
          "id": "602ab705a07be8ea202527d93139beb6e860d03c",
          "message": "docs: Fusion 360 is the main reference for the corpus replay\n\nA case is judged against Fusion 360's answer where it has one, and\nagainst Open CASCADE's only as the fallback; neither is the truth, and\nthe independent judge (sample points, volume formulas, validity) still\nbreaks ties. The first replay after the switch shifts statuses for that\nreason alone.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T10:11:05-07:00",
          "tree_id": "fa7b2a2509d12fc08215a9bbb8f0cd6caf291d7d",
          "url": "https://github.com/Robokan/brepkit/commit/602ab705a07be8ea202527d93139beb6e860d03c"
        },
        "date": 1792948418975,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 896674,
            "range": "± 1257",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 934593,
            "range": "± 909",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11564,
            "range": "± 24",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 529358,
            "range": "± 1558",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 39888073,
            "range": "± 219261",
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
          "id": "652cd7af78358c885fcc26c2f22be51718d6b787",
          "message": "docs: judge corpus cases against their stored reference answer\n\nA case is judged against the reference answer stored with it where there\nis one, else Open CASCADE's result; the reference is not the truth, and\nthe independent judge still breaks ties.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T10:33:46-07:00",
          "tree_id": "d10a84d8d915d91d5ca923df24b5f5391415ae81",
          "url": "https://github.com/Robokan/brepkit/commit/652cd7af78358c885fcc26c2f22be51718d6b787"
        },
        "date": 1792949784309,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 856073,
            "range": "± 1094",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 933016,
            "range": "± 18088",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11520,
            "range": "± 191",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 527011,
            "range": "± 3067",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 39309808,
            "range": "± 95073",
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
          "id": "95150b631a47d1b7c31e21c4ad14df1950bd5b65",
          "message": "docs: judge corpus cases against their stored reference answer\n\nA case is judged against the reference answer stored with it where there\nis one, else Open CASCADE's result; the reference is not the truth, and\nthe independent judge still breaks ties.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T10:11:05-07:00",
          "tree_id": "d10a84d8d915d91d5ca923df24b5f5391415ae81",
          "url": "https://github.com/Robokan/brepkit/commit/95150b631a47d1b7c31e21c4ad14df1950bd5b65"
        },
        "date": 1792950268198,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1066015,
            "range": "± 31681",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1153718,
            "range": "± 23378",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13440,
            "range": "± 28",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 668523,
            "range": "± 2334",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 48089951,
            "range": "± 148489",
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
          "id": "91e5f56a750870277265eb8e835d8aed78039f2e",
          "message": "chore: check PR branches and text against a private word list\n\nscripts/check-pr-text.sh (fork-only) checks a branch's added lines, file\nnames, commit messages and PR text against the word list kept in the\nprivate corpus submodule, and fails when the list is missing. BUZZCAD.md\nasks for it before every push of a PR branch and every PR edit.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T10:57:57-07:00",
          "tree_id": "35de7072d269897ff1c779ab631ec5d8c7481542",
          "url": "https://github.com/Robokan/brepkit/commit/91e5f56a750870277265eb8e835d8aed78039f2e"
        },
        "date": 1792951251621,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1061926,
            "range": "± 2913",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1154073,
            "range": "± 2393",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13440,
            "range": "± 40",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 665015,
            "range": "± 2568",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 47800501,
            "range": "± 177621",
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
          "id": "45195ddba701a22ab417329016340f3b26355481",
          "message": "docs: shorten the PR text check note\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T10:58:30-07:00",
          "tree_id": "36eebe445d04cb03541485837f7ff418580194a5",
          "url": "https://github.com/Robokan/brepkit/commit/45195ddba701a22ab417329016340f3b26355481"
        },
        "date": 1792951403724,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 862886,
            "range": "± 2020",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 936282,
            "range": "± 1327",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11695,
            "range": "± 154",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 529689,
            "range": "± 916",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 39413234,
            "range": "± 129831",
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
          "id": "56285fdc4d88bc1035d05daa2516785d8d33734a",
          "message": "fix(heal): join straight edges a fuse leaves in pieces across the whole solid\n\nunify_same_domain merged collinear edges one wire at a time, giving each\nmerged face its own copy of the joined edge; the face across the edge\nthen no longer shared it, the unpaired-edge check undid the merge, and\nthe pieces stayed (a block fused onto the end of a thinner one kept its\nlong side and bottom edges split where the blocks met). Picking such an\nedge picked one piece, and a chamfer along the pieces failed.\n\nA new solid-level pass joins two line edges that meet at a vertex, run\non in one direction and are used by the same two planar faces, replacing\nthe pair with one edge in every wire that uses it, so both faces keep\nsharing it. It is reverted if unpaired edges would rise.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T12:37:08-07:00",
          "tree_id": "2e464a79f339b12a0bb16f6847b8e383917fb5bb",
          "url": "https://github.com/Robokan/brepkit/commit/56285fdc4d88bc1035d05daa2516785d8d33734a"
        },
        "date": 1792957196584,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 856480,
            "range": "± 1210",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 933927,
            "range": "± 16953",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11470,
            "range": "± 33",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 527683,
            "range": "± 851",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 39470400,
            "range": "± 81545",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}