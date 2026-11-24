window.BENCHMARK_DATA = {
  "lastUpdate": 1795550494649,
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
          "message": "docs: the third engine is the main reference for the corpus replay\n\nA case is judged against the third engine's answer where it has one, and\nagainst Open CASCADE's only as the fallback; neither is the truth, and\nthe independent judge (sample points, volume formulas, validity) still\nbreaks ties. The first replay after the switch shifts statuses for that\nreason alone.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
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
          "id": "41727a12d186b0422f8255ba8a68a96cec9c8dd4",
          "message": "chore: point the corpus at the latest replay\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T14:17:21-07:00",
          "tree_id": "95dd1ac5db66769b89412e03bfce0b8059fb52e6",
          "url": "https://github.com/Robokan/brepkit/commit/41727a12d186b0422f8255ba8a68a96cec9c8dd4"
        },
        "date": 1792963225275,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1064314,
            "range": "± 3605",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1157151,
            "range": "± 14679",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13639,
            "range": "± 110",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 665461,
            "range": "± 9255",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 48244572,
            "range": "± 705450",
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
          "id": "6db305dbd364015780c7e34658ba34b09882bd1c",
          "message": "chore: point the corpus at the latest replays\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T17:11:07-07:00",
          "tree_id": "dfe568e2d16d615b9ffbf76f61f8c3cbfef5783a",
          "url": "https://github.com/Robokan/brepkit/commit/6db305dbd364015780c7e34658ba34b09882bd1c"
        },
        "date": 1792973634339,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1059180,
            "range": "± 1232",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1150186,
            "range": "± 1453",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13699,
            "range": "± 55",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 666698,
            "range": "± 514",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 47723838,
            "range": "± 134944",
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
          "id": "3cdd9a69b486c503bea6ddf06b46c394bd51ef66",
          "message": "docs: the profile chords fix; point the corpus at the 16003-case replay\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T19:36:21-07:00",
          "tree_id": "4a3406e44b1de5aab430648757dc2b9b5f987bef",
          "url": "https://github.com/Robokan/brepkit/commit/3cdd9a69b486c503bea6ddf06b46c394bd51ef66"
        },
        "date": 1792982333156,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 854053,
            "range": "± 2076",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 933941,
            "range": "± 2720",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11405,
            "range": "± 36",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 525727,
            "range": "± 11130",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 39317342,
            "range": "± 55329",
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
          "id": "e590babd0b8e053f5ceef64931135e080640bf3a",
          "message": "docs: take the next problem from the corpus's work queue\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-25T20:48:21-07:00",
          "tree_id": "1178c6eccdb9bf69723acbd710aa66f8f014dffc",
          "url": "https://github.com/Robokan/brepkit/commit/e590babd0b8e053f5ceef64931135e080640bf3a"
        },
        "date": 1792986658946,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 859054,
            "range": "± 1122",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 938374,
            "range": "± 5881",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11664,
            "range": "± 39",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 533383,
            "range": "± 808",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 39464212,
            "range": "± 116511",
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
          "id": "c99b33609998185cfbf0f1b80f76dfe77e48ead1",
          "message": "docs: imported bodies measured on their surfaces; point the corpus at replay 20261026-020152\n\nProgress row for PRIORITIES #2, the batch-three PR bodies, and the\ncorpus with the pulled work queue and the latest replay.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-26T07:32:22-07:00",
          "tree_id": "09e87322abefe45b843da86ddd4b53fc52c751a9",
          "url": "https://github.com/Robokan/brepkit/commit/c99b33609998185cfbf0f1b80f76dfe77e48ead1"
        },
        "date": 1793025331606,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1059675,
            "range": "± 13274",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1147195,
            "range": "± 1494",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13487,
            "range": "± 43",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 662446,
            "range": "± 650",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 48021682,
            "range": "± 1291816",
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
          "id": "a25ffe10c556cda390856ad73e14fa6e61716c99",
          "message": "chore(examples): corpus_case fuses multi-solid inputs group by group\n\nAs the BuzzCAD bridge does: the solids whose boxes meet are fused in\nturn, each step reported, and STEP=<i> writes the i-th pair out.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-26T08:10:09-07:00",
          "tree_id": "bcf9f909296648b0eb9102e8988256aa6874a743",
          "url": "https://github.com/Robokan/brepkit/commit/a25ffe10c556cda390856ad73e14fa6e61716c99"
        },
        "date": 1793027589356,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 622488,
            "range": "± 12885",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 679059,
            "range": "± 4036",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8779,
            "range": "± 125",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 400647,
            "range": "± 12141",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 31578184,
            "range": "± 357681",
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
          "id": "a011c0d45ffcaa55fcbb2cea379fd0619319fcc5",
          "message": "chore: point the corpus at the #5 note\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-26T08:10:45-07:00",
          "tree_id": "559864ff972cbc62cfc345b476a460d1bf3dd56e",
          "url": "https://github.com/Robokan/brepkit/commit/a011c0d45ffcaa55fcbb2cea379fd0619319fcc5"
        },
        "date": 1793027734141,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 646502,
            "range": "± 3594",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 650973,
            "range": "± 20051",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8322,
            "range": "± 340",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 408578,
            "range": "± 1581",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 31936694,
            "range": "± 1183831",
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
          "id": "755f7ab36b7be38c361ab6502157a461b962fdb7",
          "message": "fix(measure): keep the old anchor for solids with torus faces\n\nThe torus closed forms read wrong about a point off the torus's axis:\na torus cut by planes, measured about its pieces' centres, summed short\n(torus_plane_cut's three piece-sum tests). Solids with torus faces keep\nthe old anchor until those forms are fixed.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-10-26T08:37:29-07:00",
          "tree_id": "cd782e4ebca2e2c809522d15896cb6be7e0e1b34",
          "url": "https://github.com/Robokan/brepkit/commit/755f7ab36b7be38c361ab6502157a461b962fdb7"
        },
        "date": 1793035164132,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 613403,
            "range": "± 11276",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 663295,
            "range": "± 8430",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8730,
            "range": "± 1906",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 375989,
            "range": "± 6746",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 30627500,
            "range": "± 305840",
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
          "id": "2f7a83efa34c9747785d88e70f098449410285f7",
          "message": "chore(scripts): corpus sync skips the cases thinned out of the corpus\n\nThe corpus repo lists the near-repeat cases and unused shapes it removed in\nthinned.txt (its tools/thin_corpus.py).  The sync copies a machine's own\nrecordings into the repo, so without this every machine would bring them\nback on its next sync.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T09:55:43-08:00",
          "tree_id": "7aaeca7c3f33061e1678fb35fd3ed761d80981f9",
          "url": "https://github.com/Robokan/brepkit/commit/2f7a83efa34c9747785d88e70f098449410285f7"
        },
        "date": 1793901619548,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1108788,
            "range": "± 22242",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1203072,
            "range": "± 18736",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 14448,
            "range": "± 100",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 702278,
            "range": "± 8197",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 51426563,
            "range": "± 577277",
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
          "id": "409e265ecfe4d12dfa37a59cb70d6ddf3b2befed",
          "message": "docs(buzzcad): progress for 2026-11-05, PR bodies, corpus pointer\n\nToday's row (thinned corpus, replay 20261105-123124, the algo fixes and\n#15's fillet fixes), the open PRs #2289, #2290 and #2295 with their\nbodies, and the corpus at its latest sync.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T15:28:51-08:00",
          "tree_id": "d4f52f775f8bfc49e4ec13de0c55011fa1ef3811",
          "url": "https://github.com/Robokan/brepkit/commit/409e265ecfe4d12dfa37a59cb70d6ddf3b2befed"
        },
        "date": 1793922367823,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1142439,
            "range": "± 6957",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1246248,
            "range": "± 9527",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13455,
            "range": "± 55",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 740306,
            "range": "± 745",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29560288,
            "range": "± 38710",
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
          "id": "1af64dc312446f8f53485bbfe9d5a244f9ef95ef",
          "message": "fix(blend): closed contacts cut their face's seam; refuse crossing rim rounds\n\nA closed contact's vertex now cuts the face's own seam whatever the split\npolicy, so both rims of a wall can be rounded at once; the walker's\nfinite-difference probes wrap at a closed surface's seam; a curved face's\nextent includes its surface's own bound; and rounds on both rims of a wall\nthat cross are refused. corpus_fillet gains face, edge, tessellation and\nvolume-timing modes. Progress and PR body updated.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T17:27:06-08:00",
          "tree_id": "4828af0df2adb87a4150c8667b9b866ad18c2f87",
          "url": "https://github.com/Robokan/brepkit/commit/1af64dc312446f8f53485bbfe9d5a244f9ef95ef"
        },
        "date": 1793928618630,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1134413,
            "range": "± 4808",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1219827,
            "range": "± 6128",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13566,
            "range": "± 290",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 733616,
            "range": "± 1292",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29449926,
            "range": "± 55317",
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
          "id": "e78ba6cf7675064831d85efbf0e6c6332a982073",
          "message": "fix(blend): crossing check projects onto the contacts, scales its loop test\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T19:07:23-08:00",
          "tree_id": "7ae545998ba85b4cf5dea46a16449971392dbe37",
          "url": "https://github.com/Robokan/brepkit/commit/e78ba6cf7675064831d85efbf0e6c6332a982073"
        },
        "date": 1793934632947,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1140345,
            "range": "± 4633",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1227437,
            "range": "± 2198",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13471,
            "range": "± 13",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 736935,
            "range": "± 1260",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29446097,
            "range": "± 37439",
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
          "id": "97f73b471b3ce93b96a04fef7884e47966c3e0c5",
          "message": "docs(buzzcad): the edge matching is BuzzCAD e6ad9f4\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T19:07:49-08:00",
          "tree_id": "ddf7f43a0142f980c19db627bcd5e5af0156aea9",
          "url": "https://github.com/Robokan/brepkit/commit/97f73b471b3ce93b96a04fef7884e47966c3e0c5"
        },
        "date": 1793934828098,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1146383,
            "range": "± 3042",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1233203,
            "range": "± 10240",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13570,
            "range": "± 32",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 734841,
            "range": "± 1959",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29448610,
            "range": "± 62663",
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
          "id": "cf5ae289dceb2367270ad8e1dac25c76280ee75b",
          "message": "fix(blend): a closed fillet band's seam is its round's arc, not a chord\n\nBoth closed-band paths minted the band's seam as a straight line between\nits contact points, standing off the band by up to r(1 - cos(θ/2)); a\nreader meshing the band out to its edges read it short. The seam is now\nthe torus band's tube circle, or the walked band's section arc, through\nboth points. The round-rim and spline-rim tests check every edge lies on\nits faces. Progress and the PR body for #2296.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T20:10:37-08:00",
          "tree_id": "d06f9176b219c372ce67a8c2fbff6e20ae263834",
          "url": "https://github.com/Robokan/brepkit/commit/cf5ae289dceb2367270ad8e1dac25c76280ee75b"
        },
        "date": 1793938439212,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1144630,
            "range": "± 3506",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1232808,
            "range": "± 4593",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13476,
            "range": "± 25",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 737021,
            "range": "± 1860",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29800146,
            "range": "± 124501",
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
          "id": "f5e7f56285626fa39fa8437697c92bf316df6b67",
          "message": "fix(blend): refuse a closed contact on a plane face that a hole crosses\n\nA closed contact on a plane face kept every hole of the face whole. A hole\nthe contact runs through, or one between the contact and the rim, then\ncrosses the trimmed outline or lies outside it, its wall standing through\nthe band; the result validated and brepkit's own volume read right, but\nanother reader read the solid 6% light. Each hole other than the rounded\nrim must now lie wholly on the kept side, or the trim is refused.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T21:01:49-08:00",
          "tree_id": "089947461377cc4b134b580071bc29972cbdc08f",
          "url": "https://github.com/Robokan/brepkit/commit/f5e7f56285626fa39fa8437697c92bf316df6b67"
        },
        "date": 1793941502342,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1146237,
            "range": "± 2712",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1235139,
            "range": "± 3463",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13564,
            "range": "± 13",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 742969,
            "range": "± 1709",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29759870,
            "range": "± 73871",
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
          "id": "34c6a2627770ea5d6734b7597945c6e9349eb456",
          "message": "docs(buzzcad): progress, PR #2297 body, corpus pointer\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T21:16:19-08:00",
          "tree_id": "bdb0a082eb3407821e5f5f505289526f3e248395",
          "url": "https://github.com/Robokan/brepkit/commit/34c6a2627770ea5d6734b7597945c6e9349eb456"
        },
        "date": 1793942373515,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1144042,
            "range": "± 8336",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1234888,
            "range": "± 30716",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13673,
            "range": "± 138",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 757674,
            "range": "± 5747",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 30536633,
            "range": "± 1064999",
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
          "id": "8b7b627a9f6e115a465948eee67577b3a4649618",
          "message": "test(blend): unit tests for a closed band's seam curve\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T21:27:52-08:00",
          "tree_id": "11820bd6bf42690933424ca982db560119361bd3",
          "url": "https://github.com/Robokan/brepkit/commit/8b7b627a9f6e115a465948eee67577b3a4649618"
        },
        "date": 1793943047833,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 944212,
            "range": "± 23242",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1028197,
            "range": "± 8329",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10949,
            "range": "± 135",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 629086,
            "range": "± 3533",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 24015247,
            "range": "± 123021",
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
          "id": "2b1e92870994a1e56b771fca159dc9416100538f",
          "message": "docs(buzzcad): progress, PR #2298 body, #2297 review fixes, corpus pointer\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T22:29:03-08:00",
          "tree_id": "f816a3c97ba1462b3d329a38e1b20c6a20ad4f49",
          "url": "https://github.com/Robokan/brepkit/commit/2b1e92870994a1e56b771fca159dc9416100538f"
        },
        "date": 1793946736396,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1143143,
            "range": "± 1864",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1234313,
            "range": "± 4500",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13481,
            "range": "± 61",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 740121,
            "range": "± 3197",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29651392,
            "range": "± 1520470",
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
          "id": "f50abb4befd3b295987df70e3e7a867ce718960f",
          "message": "docs(buzzcad): progress, PR #2299 body, corpus pointer\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-05T23:12:16-08:00",
          "tree_id": "449f7634a096716bc3f76e7f08e58a8dc573d3fb",
          "url": "https://github.com/Robokan/brepkit/commit/f50abb4befd3b295987df70e3e7a867ce718960f"
        },
        "date": 1793949299425,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 692501,
            "range": "± 29447",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 753459,
            "range": "± 45280",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8695,
            "range": "± 24",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 451346,
            "range": "± 2520",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 19038574,
            "range": "± 82964",
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
          "id": "18020fc518d4a88edb6d1ec70499968ab72c1aa6",
          "message": "docs(buzzcad): self-crossing trimmed plane faces found; gate tried and reverted\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T00:14:46-08:00",
          "tree_id": "374cabc9045be8c9205bfbd282961b109e443234",
          "url": "https://github.com/Robokan/brepkit/commit/18020fc518d4a88edb6d1ec70499968ab72c1aa6"
        },
        "date": 1793953080194,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1143565,
            "range": "± 2411",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1231358,
            "range": "± 13676",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13469,
            "range": "± 392",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 741868,
            "range": "± 1990",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29599795,
            "range": "± 81256",
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
          "id": "534e746494bbd698663e4cac14cc7695a4d752bc",
          "message": "docs(buzzcad): progress, review fixes for #2297-#2299\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T00:53:47-08:00",
          "tree_id": "06c60c8522a1c9822b5d53d5e8cd9c210e94882c",
          "url": "https://github.com/Robokan/brepkit/commit/534e746494bbd698663e4cac14cc7695a4d752bc"
        },
        "date": 1793955424094,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1151802,
            "range": "± 12128",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1235286,
            "range": "± 10913",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13381,
            "range": "± 8",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 736927,
            "range": "± 2433",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29863424,
            "range": "± 75392",
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
          "id": "9ce3c86a7e1379c2b8665bb2b76a972f762ac210",
          "message": "docs(buzzcad): progress, tilted end faces and spoke spurs (#15)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T14:42:54-08:00",
          "tree_id": "2a7dfbdf700c5b4132bce954853d7e96c9b14c11",
          "url": "https://github.com/Robokan/brepkit/commit/9ce3c86a7e1379c2b8665bb2b76a972f762ac210"
        },
        "date": 1794005170491,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1141663,
            "range": "± 36752",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1229538,
            "range": "± 2735",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13600,
            "range": "± 50",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 733118,
            "range": "± 2624",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29658451,
            "range": "± 83035",
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
          "id": "311f22a8ac7f28d66a56c6aa199f028124786f79",
          "message": "docs(buzzcad): PR #2300, tilted end faces\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T15:06:04-08:00",
          "tree_id": "e4a28e3b1f2cc6e6d45c1e17822b1a92cbc4f7f6",
          "url": "https://github.com/Robokan/brepkit/commit/311f22a8ac7f28d66a56c6aa199f028124786f79"
        },
        "date": 1794006550570,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 988565,
            "range": "± 12889",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1077377,
            "range": "± 25760",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11310,
            "range": "± 115",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 655872,
            "range": "± 7125",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 24544258,
            "range": "± 207161",
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
          "id": "778b50cc4a810c82f1a74b6eaf66469a3a2ed8d1",
          "message": "docs(buzzcad): progress, curved end faces (#15)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T18:09:32-08:00",
          "tree_id": "6b277144a095f32e9b6d6da451696702ad4fe3e8",
          "url": "https://github.com/Robokan/brepkit/commit/778b50cc4a810c82f1a74b6eaf66469a3a2ed8d1"
        },
        "date": 1794017574941,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1150248,
            "range": "± 2089",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1238790,
            "range": "± 3789",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13515,
            "range": "± 82",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 743441,
            "range": "± 16621",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29649507,
            "range": "± 45827",
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
          "id": "6268fb420623dc8152fa10e3156082a8e0cb4ecb",
          "message": "docs(buzzcad): corpus pointer, PRIORITIES #15 curved end faces\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T18:10:17-08:00",
          "tree_id": "dc60f50a545e7e5154afa641a10d759580021945",
          "url": "https://github.com/Robokan/brepkit/commit/6268fb420623dc8152fa10e3156082a8e0cb4ecb"
        },
        "date": 1794017776737,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1114110,
            "range": "± 8647",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1208791,
            "range": "± 10477",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13782,
            "range": "± 251",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 724376,
            "range": "± 9157",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29295107,
            "range": "± 77277",
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
          "id": "0bdca767189bf01419261de695e71d58136eb32d",
          "message": "docs(buzzcad): progress, unequal-stripe set-backs (#15), PR #2301\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T19:22:44-08:00",
          "tree_id": "d116e82410af984fb583a344d121d67480555c2c",
          "url": "https://github.com/Robokan/brepkit/commit/0bdca767189bf01419261de695e71d58136eb32d"
        },
        "date": 1794021961268,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1145787,
            "range": "± 979",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1238758,
            "range": "± 8043",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13666,
            "range": "± 27",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 745207,
            "range": "± 2034",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29502655,
            "range": "± 37146",
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
          "id": "6ed7ea89c1bdd93f12b016f884800ef08a6e64d4",
          "message": "docs(buzzcad): progress, tangent kinks, ruling rounds, mitre limit, spline cap notch (#15)\n\nAlso corpus_fillet: a PICK filter and a VERTS switch.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T22:22:44-08:00",
          "tree_id": "90f8900a9167454c7deed89d804d859bd9e14d71",
          "url": "https://github.com/Robokan/brepkit/commit/6ed7ea89c1bdd93f12b016f884800ef08a6e64d4"
        },
        "date": 1794032747326,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 922196,
            "range": "± 1089",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 997091,
            "range": "± 1485",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11632,
            "range": "± 300",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 587313,
            "range": "± 1029",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 24098221,
            "range": "± 199072",
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
          "id": "6dd821ebd652bf798e8609656246e17815439f8c",
          "message": "docs(buzzcad): PRs #2303 review fixes and #2304\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-06T22:27:55-08:00",
          "tree_id": "22bc710a40e8ed83946dc7e8d88f14ac3735a4b4",
          "url": "https://github.com/Robokan/brepkit/commit/6dd821ebd652bf798e8609656246e17815439f8c"
        },
        "date": 1794033083995,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1193425,
            "range": "± 2918",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1293907,
            "range": "± 6693",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 14712,
            "range": "± 35",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 762680,
            "range": "± 1328",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 30626440,
            "range": "± 326011",
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
          "id": "b4f123a403eec8e709556bb71d4d53d495be8617",
          "message": "docs(buzzcad): progress, extruded mitre, torus run-on, #2304 review fixes (#15)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-07T00:19:40-08:00",
          "tree_id": "48b270427373643285c060f86f163bcd28a252c6",
          "url": "https://github.com/Robokan/brepkit/commit/b4f123a403eec8e709556bb71d4d53d495be8617"
        },
        "date": 1794039760832,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 925816,
            "range": "± 909",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1002516,
            "range": "± 1036",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11696,
            "range": "± 97",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 589904,
            "range": "± 1227",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 23739428,
            "range": "± 32683",
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
          "id": "d54b59d90cf99ff9b45ffdb0fdec3be63ded5c51",
          "message": "docs(buzzcad): progress, torus run-on to curved caps (#15)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-07T01:46:22-08:00",
          "tree_id": "c71272984466de2d97cbfff60fe67243373c1beb",
          "url": "https://github.com/Robokan/brepkit/commit/d54b59d90cf99ff9b45ffdb0fdec3be63ded5c51"
        },
        "date": 1794044986414,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1096623,
            "range": "± 2888",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1193848,
            "range": "± 2852",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 12797,
            "range": "± 13",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 738176,
            "range": "± 3471",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 27977646,
            "range": "± 136267",
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
          "id": "6484bc0c46b43f7aa347058b106af3ef03717315",
          "message": "chore(corpus): PRIORITIES #15 update\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-07T01:46:29-08:00",
          "tree_id": "10269b79416dbbf96b262cf20cef3666f09a6fe9",
          "url": "https://github.com/Robokan/brepkit/commit/6484bc0c46b43f7aa347058b106af3ef03717315"
        },
        "date": 1794045179824,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1148425,
            "range": "± 22742",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1234538,
            "range": "± 1772",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13649,
            "range": "± 35",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 738713,
            "range": "± 1345",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29450109,
            "range": "± 524860",
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
          "id": "c6c055f8d9a2877dab2647b33edcea386110883d",
          "message": "chore(corpus): PRIORITIES #15 update\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-07T04:49:30-08:00",
          "tree_id": "fbbd8f6c9d1841351f64498c9d5fdb8bb09dab16",
          "url": "https://github.com/Robokan/brepkit/commit/c6c055f8d9a2877dab2647b33edcea386110883d"
        },
        "date": 1794055970607,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1094021,
            "range": "± 2949",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1185270,
            "range": "± 2294",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13320,
            "range": "± 37",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 701709,
            "range": "± 1171",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 28931270,
            "range": "± 266799",
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
          "id": "59911ac8850bb8b17ed8f234be2571d14635a71b",
          "message": "chore(corpus): PRIORITIES #15 update\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-07T04:49:30-08:00",
          "tree_id": "f90329fc649f6b3217f7239580fa9cf3ea414a67",
          "url": "https://github.com/Robokan/brepkit/commit/59911ac8850bb8b17ed8f234be2571d14635a71b"
        },
        "date": 1794072097762,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1050087,
            "range": "± 6710",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1164869,
            "range": "± 12626",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 12262,
            "range": "± 22",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 701918,
            "range": "± 10454",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 27270522,
            "range": "± 82885",
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
          "id": "65cd4e70a029c91efc4e71c91a4dde2757091430",
          "message": "chore(fork): commit hooks keep private names out of main\n\nRobokan/brepkit is public, main and BUZZCAD.md included. The fork's\npre-commit and commit-msg hooks now run scripts/check-commit-words.sh on\nevery commit: staged lines, file names and the message, against the\nnames above the marker in the corpus's private word list (a missing list\nfails). BUZZCAD.md states the engine naming rule.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-07T09:22:23-08:00",
          "tree_id": "3029a75f3e2bb3f891886ece4bf266d1f51ae7b3",
          "url": "https://github.com/Robokan/brepkit/commit/65cd4e70a029c91efc4e71c91a4dde2757091430"
        },
        "date": 1794072352777,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1099250,
            "range": "± 1518",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1191752,
            "range": "± 3946",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13309,
            "range": "± 53",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 711371,
            "range": "± 1699",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29178129,
            "range": "± 262268",
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
          "id": "7227a6d50a89d49894a3c2ff47780b2037e0a6bc",
          "message": "fix(blend): refuse a walk step whose contact leaps along its face\n\nA ball too big for a hollow of a face, wedged where it cannot roll on,\ndrives its contact away along the face, and one step can then land on\nanother solution far along it. The band built through such sections\nstands off the face. A step whose contact moves more than 100 times the\nspine's step is now treated as a failed solve: the step halves, and the\nwalk fails if it never settles.\n\nSeen on a plate 100 thick with a drafted B-spline wall, its top rim\nrounded at r = 100: the contact ran 68 times the rim's speed, then\njumped 520 in one step; the band stood 36 off the wall and meshing the\nresult ran for minutes. The fillet now fails at once.\n\nAlso: BUZZCAD.md names each engine where \"the reference engine\" was\nambiguous; corpus_fillet times each face's mesh (TESSF).\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-07T12:08:59-08:00",
          "tree_id": "17540334682fcaad147df9402810a3658e050a9f",
          "url": "https://github.com/Robokan/brepkit/commit/7227a6d50a89d49894a3c2ff47780b2037e0a6bc"
        },
        "date": 1794082341234,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 652125,
            "range": "± 4931",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 722845,
            "range": "± 3902",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8428,
            "range": "± 73",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 433988,
            "range": "± 12869",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18918816,
            "range": "± 375582",
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
          "id": "a7833b9aa6e11e5499746baea403f24ff79791c7",
          "message": "chore(corpus): full replay 20261107-131300, PRIORITIES #15 update\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-07T17:11:29-08:00",
          "tree_id": "73b8b15d5fd7c9fbe79747f724f5802fcba897f2",
          "url": "https://github.com/Robokan/brepkit/commit/a7833b9aa6e11e5499746baea403f24ff79791c7"
        },
        "date": 1794100490839,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1115548,
            "range": "± 4339",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1214335,
            "range": "± 2085",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13229,
            "range": "± 35",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 908410,
            "range": "± 14144",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29162136,
            "range": "± 42542",
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
          "id": "14e2e1b133c8ecde3c6055efe279171453011fc0",
          "message": "docs(buzzcad): a closed contact cut on its face's seam (#15)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-08T16:29:49-08:00",
          "tree_id": "0c8bbebe3a63008d573b2730ea3c444c0e80efc3",
          "url": "https://github.com/Robokan/brepkit/commit/14e2e1b133c8ecde3c6055efe279171453011fc0"
        },
        "date": 1794190753414,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 931391,
            "range": "± 19893",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1019432,
            "range": "± 21476",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10456,
            "range": "± 176",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 772147,
            "range": "± 7776",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 24099358,
            "range": "± 347428",
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
          "id": "894a3e7031dd9753777f03cd5aac0f53cb4e92ed",
          "message": "fix(operations): revolved bands hold their volume exactly\n\nA circle arc whose centre is a millionth of its radius off the revolve axis\nnow sweeps a sphere centred on the axis, not a NURBS band (sketch round-off\nfar from the origin left a bite 9.6e-7 off a tilted axis).  A NURBS face that\ncovers its whole surface is integrated over the surface's parameters rather\nthan its mesh, so a revolved half ellipse measures exact instead of 1.2e-6\nshort.  The STEP writer was already right; a regression test checks both\ncases in brepkit and through write_step / read_step.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-08T18:17:45-08:00",
          "tree_id": "6eb4bc23cdecbc6d237dc332025c81840da4f0bd",
          "url": "https://github.com/Robokan/brepkit/commit/894a3e7031dd9753777f03cd5aac0f53cb4e92ed"
        },
        "date": 1794191656717,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 696612,
            "range": "± 5435",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 765165,
            "range": "± 4690",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 9027,
            "range": "± 31",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 577259,
            "range": "± 4594",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18975558,
            "range": "± 143971",
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
          "id": "8b85ab25a5bf1eb8aba574972a0347047e4b119a",
          "message": "docs(buzzcad): #15 full round, fillet replays 20261110\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T11:45:36-08:00",
          "tree_id": "05a3ec64f12ef18379d294c3052d0c0642ea718f",
          "url": "https://github.com/Robokan/brepkit/commit/8b85ab25a5bf1eb8aba574972a0347047e4b119a"
        },
        "date": 1794340148793,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 909220,
            "range": "± 1441",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 991844,
            "range": "± 12853",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11376,
            "range": "± 5",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 761773,
            "range": "± 1709",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 23576493,
            "range": "± 176804",
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
          "id": "fd6f5e976b72b2d66e7c129b70984faf05caa9e0",
          "message": "fix(blend): an edge picked twice in one fillet set is rounded once\n\nTwo picks landing on the same edge ask for the same round; the builder\nrefused every such edge as \"requested more than once\", and with it the\nwhole fillet. Within one set a repeated edge is now taken once; an edge\nasked for in two sets, with two laws, is still refused.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T13:11:26-08:00",
          "tree_id": "7390ce2fb26360e605243464ab3870b7f34aabf6",
          "url": "https://github.com/Robokan/brepkit/commit/fd6f5e976b72b2d66e7c129b70984faf05caa9e0"
        },
        "date": 1794345261775,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 687622,
            "range": "± 5619",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 754127,
            "range": "± 10089",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8763,
            "range": "± 26",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 589297,
            "range": "± 13492",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18532806,
            "range": "± 503270",
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
          "id": "f6009b426a5bccd12e14de1511b4b34e4bf3990e",
          "message": "docs(buzzcad): #15 pivot round, fillet replay 20261110-140058\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T14:12:46-08:00",
          "tree_id": "cc37fdf6048a4b63282c83c7affc01e1b36479eb",
          "url": "https://github.com/Robokan/brepkit/commit/f6009b426a5bccd12e14de1511b4b34e4bf3990e"
        },
        "date": 1794348963439,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 952485,
            "range": "± 10586",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 989784,
            "range": "± 4155",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11321,
            "range": "± 15",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 761439,
            "range": "± 7548",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 23471681,
            "range": "± 235116",
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
          "id": "924483fdff43e28d37bfce31247d350710c1819c",
          "message": "docs(buzzcad): #15 crossing rounds pivot, fillet replay 20261110-144528\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T14:54:58-08:00",
          "tree_id": "7811a0bb13b35e0b190c4e3e6af7b93ac9eafae2",
          "url": "https://github.com/Robokan/brepkit/commit/924483fdff43e28d37bfce31247d350710c1819c"
        },
        "date": 1794351478978,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 904819,
            "range": "± 7373",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 987028,
            "range": "± 24340",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11241,
            "range": "± 70",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 757828,
            "range": "± 2626",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 23501750,
            "range": "± 49548",
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
          "id": "3d6947643867ed9490e64eb50d957c2afb3d692a",
          "message": "docs(buzzcad): #15 walked rounds pivot, fillet replay 20261110-162837\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T16:49:49-08:00",
          "tree_id": "f431c95ed865ae4c2ea5adbbebbbca801a65dfae",
          "url": "https://github.com/Robokan/brepkit/commit/3d6947643867ed9490e64eb50d957c2afb3d692a"
        },
        "date": 1794358367282,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 698668,
            "range": "± 2532",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 759345,
            "range": "± 5361",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8917,
            "range": "± 24",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 608884,
            "range": "± 30426",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18740546,
            "range": "± 161918",
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
          "id": "0f3bc08373fe466377a0a064833a4f703c6321ae",
          "message": "docs(buzzcad): #15 walked rounds run on over a kinked round end, fillet replay 20261110-183247\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T18:54:20-08:00",
          "tree_id": "ae323e71a4a51db0a3341244aaffd5bdbe5a3750",
          "url": "https://github.com/Robokan/brepkit/commit/0f3bc08373fe466377a0a064833a4f703c6321ae"
        },
        "date": 1794365854204,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 694279,
            "range": "± 3295",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 763403,
            "range": "± 10793",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 9065,
            "range": "± 130",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 599309,
            "range": "± 2236",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 19805751,
            "range": "± 126134",
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
          "id": "5ac72e9f967548355b3d1a8d6f47ce2283d0cae5",
          "message": "docs(buzzcad): #15 closed annuli meet along the first round's contact, fillet replay 20261110-200914\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T20:29:38-08:00",
          "tree_id": "0895c4472fb8df6043fa4abfb0176c7f4be31a88",
          "url": "https://github.com/Robokan/brepkit/commit/5ac72e9f967548355b3d1a8d6f47ce2283d0cae5"
        },
        "date": 1794371605460,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1227384,
            "range": "± 20137",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1274967,
            "range": "± 16022",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 14447,
            "range": "± 28",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 980806,
            "range": "± 1682",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 30199775,
            "range": "± 54163",
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
          "id": "d656ff4f1ed735e2c4afd4c827aeab0a7a53e9f4",
          "message": "docs(buzzcad): #15 thin walls and ledges pivot, root-cause triage, fillet replay 20261110-224320\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T23:00:57-08:00",
          "tree_id": "9dd5a009d863cb92a68fd00eaa57450a577c0a06",
          "url": "https://github.com/Robokan/brepkit/commit/d656ff4f1ed735e2c4afd4c827aeab0a7a53e9f4"
        },
        "date": 1794380687133,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1115135,
            "range": "± 6367",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1219230,
            "range": "± 14214",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 12729,
            "range": "± 51",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 948423,
            "range": "± 2657",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 28686175,
            "range": "± 75589",
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
          "id": "519e20b01d6a027a354189899f96d0f61cc8060e",
          "message": "chore(buzzcad): corpus with INHERITED.md\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-10T23:33:30-08:00",
          "tree_id": "e61b66b137839b5dfabff01d1452825984d97768",
          "url": "https://github.com/Robokan/brepkit/commit/519e20b01d6a027a354189899f96d0f61cc8060e"
        },
        "date": 1794382584433,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 675490,
            "range": "± 29496",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 729153,
            "range": "± 4196",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8794,
            "range": "± 92",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 579982,
            "range": "± 2619",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18684403,
            "range": "± 161954",
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
          "id": "01415860280a61793ed49b1eaf096ce080b72e46",
          "message": "docs(buzzcad): #15 tangent chain over split faces, triage, fillet replay 20261110-235728\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-11T00:19:00-08:00",
          "tree_id": "ad9a90cd470fe55e67f4d6b0cc70889d91b10045",
          "url": "https://github.com/Robokan/brepkit/commit/01415860280a61793ed49b1eaf096ce080b72e46"
        },
        "date": 1794385349833,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 910203,
            "range": "± 3226",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 992085,
            "range": "± 4390",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11265,
            "range": "± 22",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 758989,
            "range": "± 2069",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 24203657,
            "range": "± 141017",
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
          "id": "b01ca8f6608996ea70b44b87c73dfc1ace8ae1f2",
          "message": "chore(buzzcad): corpus with the 20261111-114938 fillet replay\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-11T11:55:07-08:00",
          "tree_id": "10a4f210ea28ecf3d69fd810fdb2726f70765d63",
          "url": "https://github.com/Robokan/brepkit/commit/b01ca8f6608996ea70b44b87c73dfc1ace8ae1f2"
        },
        "date": 1794427128624,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 989621,
            "range": "± 24963",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1065580,
            "range": "± 25541",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11212,
            "range": "± 307",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 836533,
            "range": "± 16128",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 25147428,
            "range": "± 2135300",
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
          "id": "a366790bb970455328dca530e8a6caa5e612be0e",
          "message": "docs(buzzcad): #15 open-band pivot and open-round hole guard, fillet replay 20261111-131808\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-11T13:42:02-08:00",
          "tree_id": "9ddee1ecad2e577bbe60964e2e4d2cff42bc2ecb",
          "url": "https://github.com/Robokan/brepkit/commit/a366790bb970455328dca530e8a6caa5e612be0e"
        },
        "date": 1794433568609,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1114515,
            "range": "± 3333",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1219741,
            "range": "± 4752",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 12980,
            "range": "± 35",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 953355,
            "range": "± 9112",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29031953,
            "range": "± 193101",
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
          "id": "be72e8bfb53f4907f1ac54c36e85b97517d85e02",
          "message": "docs(buzzcad): SPEED.md, the brief for an agent speeding brepkit up\n\nTargets from replay 20261111-150832 (boolean timeouts, mesh-fallback\ntime, measure timeouts), what counts as a speedup (no case changes\nstatus), how to measure, and the rules for working beside the fix agent.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-11T17:23:54-08:00",
          "tree_id": "47ea423766e61f8316e456417d2638e5a40b380d",
          "url": "https://github.com/Robokan/brepkit/commit/be72e8bfb53f4907f1ac54c36e85b97517d85e02"
        },
        "date": 1794446826022,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 921518,
            "range": "± 22230",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 993414,
            "range": "± 1694",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11309,
            "range": "± 14",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 774778,
            "range": "± 10662",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 23583833,
            "range": "± 44590",
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
          "id": "4a89c5605b6e0a0eb95de58980244ea5e106f07f",
          "message": "fix(io): a sphere keeps its file's frame, read and written\n\nThe STEP reader built every SPHERICAL_SURFACE about +Z, whatever its\nplacement said, so a turned sphere's latitude circles and meridian seams\ncame in off the (u, v) grid: sections with them were windowed wrong, and\na lens (two balls' common part) fused with a collar touching its rim had\nits caps cut along circles they do not hold, the result a whole ball and\nmore, ten times too big, and valid. The sphere is now read in the file's\nframe (falling back to +Z only where the frame is degenerate), and the\nwriter writes the sphere's own frame, so its latitudes read back as such.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-11T17:43:20-08:00",
          "tree_id": "c2582411e58e027ad1b6812b17b8ff6aa2301886",
          "url": "https://github.com/Robokan/brepkit/commit/4a89c5605b6e0a0eb95de58980244ea5e106f07f"
        },
        "date": 1794448100387,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1119759,
            "range": "± 63408",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1212601,
            "range": "± 38534",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13435,
            "range": "± 42",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 938667,
            "range": "± 10514",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29282360,
            "range": "± 55876",
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
          "id": "dcdbf8b7e1aefbfed106ff29805a2eb95aecd3c6",
          "message": "docs(buzzcad): SPEED.md points at the corpus's speed queue and profiler\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-11T18:28:50-08:00",
          "tree_id": "6b5742729a75101036fc92f8dc55c7343a7fdd7e",
          "url": "https://github.com/Robokan/brepkit/commit/dcdbf8b7e1aefbfed106ff29805a2eb95aecd3c6"
        },
        "date": 1794450710471,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 681436,
            "range": "± 14537",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 754428,
            "range": "± 14651",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8875,
            "range": "± 83",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 604235,
            "range": "± 10818",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 19246183,
            "range": "± 193715",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "87b130ad2f71aca08553a5d3fabcef4c23af6257",
          "message": "docs(buzzcad): SPEED.md records the first speed changes\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-11T22:07:30-08:00",
          "tree_id": "de5ef42cac0ba0f8babc8a1d2d32320f0aacf92b",
          "url": "https://github.com/Robokan/brepkit/commit/87b130ad2f71aca08553a5d3fabcef4c23af6257"
        },
        "date": 1794463873317,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1125441,
            "range": "± 5027",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1216699,
            "range": "± 3731",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13241,
            "range": "± 1112",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 938684,
            "range": "± 15934",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29171837,
            "range": "± 132600",
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
          "id": "ac7a9424e61bb4c21168d565f468244a4fd30911",
          "message": "docs(buzzcad): progress on booleans, B-spline coincidence and elliptic extrusions\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T06:46:02-08:00",
          "tree_id": "f0e59e13aba61979e3538564d1d290bd334db9a1",
          "url": "https://github.com/Robokan/brepkit/commit/ac7a9424e61bb4c21168d565f468244a4fd30911"
        },
        "date": 1794494936448,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 648008,
            "range": "± 34555",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 717567,
            "range": "± 12335",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8275,
            "range": "± 198",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 562037,
            "range": "± 8829",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 17706971,
            "range": "± 1118172",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "5ec2cf9cc507e0d52a0895cb2ea78b575efeff94",
          "message": "Merge remote-tracking branch 'origin/main'\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T07:30:10-08:00",
          "tree_id": "268f21fb9d4bbaa452a1949d119a8c2bbcd7adfd",
          "url": "https://github.com/Robokan/brepkit/commit/5ec2cf9cc507e0d52a0895cb2ea78b575efeff94"
        },
        "date": 1794498686559,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1130422,
            "range": "± 2741",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1220605,
            "range": "± 4474",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13298,
            "range": "± 36",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 936316,
            "range": "± 2266",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29804605,
            "range": "± 370360",
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
          "id": "c08284074405f6e3f1dadea763c4b72bef649137",
          "message": "Merge remote-tracking branch 'origin/main'",
          "timestamp": "2026-11-12T07:56:14-08:00",
          "tree_id": "1c00fd77b4a42557496b6cf9338590786d4e47bc",
          "url": "https://github.com/Robokan/brepkit/commit/c08284074405f6e3f1dadea763c4b72bef649137"
        },
        "date": 1794500227226,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 950706,
            "range": "± 6279",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 990161,
            "range": "± 1916",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11518,
            "range": "± 352",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 758065,
            "range": "± 3757",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 23546125,
            "range": "± 97178",
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
          "id": "e63e24ab499b5290f04e72f978f41761ca0a4fc4",
          "message": "docs(buzzcad): progress on the ball and dome, the speed batch measured\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T09:15:40-08:00",
          "tree_id": "0d9fdba24c7c6fcbecafac72e4daa45932fc64cd",
          "url": "https://github.com/Robokan/brepkit/commit/e63e24ab499b5290f04e72f978f41761ca0a4fc4"
        },
        "date": 1794503960241,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1120076,
            "range": "± 1693",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1213517,
            "range": "± 2806",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13234,
            "range": "± 1250",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 929859,
            "range": "± 2550",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29202054,
            "range": "± 101951",
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
          "id": "8a1bbd924bbf77e945970243f97c575fdb22a8d4",
          "message": "docs(buzzcad): progress on the pinched side face and the notch hull\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T10:29:40-08:00",
          "tree_id": "fbafef99f3a4b458304a7d4989850e572bb43c60",
          "url": "https://github.com/Robokan/brepkit/commit/8a1bbd924bbf77e945970243f97c575fdb22a8d4"
        },
        "date": 1794508353504,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 628182,
            "range": "± 1612",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 702870,
            "range": "± 33054",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8259,
            "range": "± 100",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 556116,
            "range": "± 19443",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 17306268,
            "range": "± 150494",
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
          "id": "efd1403d9324a5e9326e77e1c6a21d5b9597d270",
          "message": "docs(buzzcad): #2373 in flight\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T10:49:20-08:00",
          "tree_id": "ba323d7892c47dd482be104ed6035c2d8ec5fb3b",
          "url": "https://github.com/Robokan/brepkit/commit/efd1403d9324a5e9326e77e1c6a21d5b9597d270"
        },
        "date": 1794509586369,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 665161,
            "range": "± 11508",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 738006,
            "range": "± 19491",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8825,
            "range": "± 677",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 572979,
            "range": "± 8046",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 17775223,
            "range": "± 601361",
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
          "id": "6b86238ba350d931cd1edeb36b42a1283e6ed94f",
          "message": "docs(buzzcad): the chamfer past its face, #2378 in flight\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T12:02:46-08:00",
          "tree_id": "1bbbe70e7db27af1e0c2490a89c25565949f91f4",
          "url": "https://github.com/Robokan/brepkit/commit/6b86238ba350d931cd1edeb36b42a1283e6ed94f"
        },
        "date": 1794513947122,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 679044,
            "range": "± 2810",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 738191,
            "range": "± 44918",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8854,
            "range": "± 56",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 583682,
            "range": "± 11821",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18326215,
            "range": "± 625857",
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
          "id": "9c399e8f606cf2b1e2a62ad6963b4d57fb1bdd5a",
          "message": "docs(buzzcad): chamfers through the blend engine and whole rims, #2379 and #2380 in flight\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T13:25:52-08:00",
          "tree_id": "015523600f50b0844c5abc07e7a7b06b8818a9a6",
          "url": "https://github.com/Robokan/brepkit/commit/9c399e8f606cf2b1e2a62ad6963b4d57fb1bdd5a"
        },
        "date": 1794518935496,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 665363,
            "range": "± 3090",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 738745,
            "range": "± 29386",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8616,
            "range": "± 56",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 573974,
            "range": "± 25120",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18379391,
            "range": "± 607890",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "ea9fa527fa54415a8daf75d7eb76063bcc2f2ded",
          "message": "docs(buzzcad): SPEED.md records the parallel volume, the projection caches and the fair timing\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T13:56:45-08:00",
          "tree_id": "be49bb2f6d5192903d3ea042c5a03a2cb0ad701e",
          "url": "https://github.com/Robokan/brepkit/commit/ea9fa527fa54415a8daf75d7eb76063bcc2f2ded"
        },
        "date": 1794520878290,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1132903,
            "range": "± 3426",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1228353,
            "range": "± 39916",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13611,
            "range": "± 424",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 942780,
            "range": "± 2727",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29388505,
            "range": "± 40633",
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
          "id": "ebe9398db4e64a2fec4f568e09526f045df65ff3",
          "message": "chore(io): corpus_fillet runs two-distance chamfers with the bridge's reference faces\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T14:37:52-08:00",
          "tree_id": "9dc421ddf50af34cb1bb1f18584788170909756a",
          "url": "https://github.com/Robokan/brepkit/commit/ebe9398db4e64a2fec4f568e09526f045df65ff3"
        },
        "date": 1794523277260,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 835837,
            "range": "± 3062",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 904681,
            "range": "± 2317",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 9581,
            "range": "± 12",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 704976,
            "range": "± 1830",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21988851,
            "range": "± 52005",
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
          "id": "ba73527ddca1987f03f76855853f38245a527e2a",
          "message": "docs(buzzcad): chamfers into inside corners, onto slanted ends, across whole faces and two-distance flat bevels; #2381-#2384 in flight\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T15:41:09-08:00",
          "tree_id": "78f6c60f2741012f9823b8ad31c95c0fc3da0554",
          "url": "https://github.com/Robokan/brepkit/commit/ba73527ddca1987f03f76855853f38245a527e2a"
        },
        "date": 1794527072962,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1120269,
            "range": "± 1427",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1217125,
            "range": "± 5551",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13498,
            "range": "± 1278",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 937407,
            "range": "± 39931",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29203710,
            "range": "± 366223",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "b13af9e277b370da85d9789f3cabb92a19adb7ea",
          "message": "docs(buzzcad): SPEED.md records the ray patches and section ranges kept\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T18:32:48-08:00",
          "tree_id": "2f92bafe8259039097949499c3a9e66439d08b29",
          "url": "https://github.com/Robokan/brepkit/commit/b13af9e277b370da85d9789f3cabb92a19adb7ea"
        },
        "date": 1794537394554,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1127682,
            "range": "± 19820",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1216000,
            "range": "± 8574",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 12779,
            "range": "± 68",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 929005,
            "range": "± 13213",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29188292,
            "range": "± 156228",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "4cb2048f12996a4e5dd8a0bb2e9697ed23d6a403",
          "message": "docs(buzzcad): SPEED.md records the one-pass point and partials\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T20:07:15-08:00",
          "tree_id": "40f6594dff31479590703ff094791bea2b3d8ef2",
          "url": "https://github.com/Robokan/brepkit/commit/4cb2048f12996a4e5dd8a0bb2e9697ed23d6a403"
        },
        "date": 1794543034971,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 921193,
            "range": "± 5071",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1001053,
            "range": "± 868",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11104,
            "range": "± 26",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 764562,
            "range": "± 2495",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 23733460,
            "range": "± 31589",
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
          "id": "9ab80c3715cf4c9d3959f50c39fabf000ed7af90",
          "message": "docs(buzzcad): rounds along faces whose edges stand off their surface; the trimming failures triaged\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-12T22:14:56-08:00",
          "tree_id": "90c551d718468fd95d269522cd5e3956bceb2959",
          "url": "https://github.com/Robokan/brepkit/commit/9ab80c3715cf4c9d3959f50c39fabf000ed7af90"
        },
        "date": 1794550718234,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1129487,
            "range": "± 12359",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1220567,
            "range": "± 18947",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13090,
            "range": "± 64",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 929696,
            "range": "± 2667",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29256511,
            "range": "± 128916",
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
          "id": "6c76425fbd7e9bcc50efd7a5808438b7e00407b7",
          "message": "docs(buzzcad): rounds over through-bores cut back; torus bands split at coaxial circles\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-13T00:25:07-08:00",
          "tree_id": "5869fae4601c0f8de569f08c50cbb345d01c10ed",
          "url": "https://github.com/Robokan/brepkit/commit/6c76425fbd7e9bcc50efd7a5808438b7e00407b7"
        },
        "date": 1794558529882,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1137237,
            "range": "± 4492",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1229493,
            "range": "± 1103",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13406,
            "range": "± 68",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 954900,
            "range": "± 4724",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 29870808,
            "range": "± 122172",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "9fc4b874d0865b93c52ea03886dcffd9eeff51d3",
          "message": "Merge origin/main\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-13T00:44:13-08:00",
          "tree_id": "b57d3bc700256ab778e6d94c0489ba0bc503bdf2",
          "url": "https://github.com/Robokan/brepkit/commit/9fc4b874d0865b93c52ea03886dcffd9eeff51d3"
        },
        "date": 1794560881839,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 833821,
            "range": "± 770",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 910181,
            "range": "± 2037",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 9416,
            "range": "± 230",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 698505,
            "range": "± 2915",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21899696,
            "range": "± 44927",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "1ddad1defb84cc2baac041aa51da4c6e770e12dc",
          "message": "docs(buzzcad): SPEED.md records the kept sections, the parallel seeds and survey, and the Bezier split's rows\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-13T09:43:16-08:00",
          "tree_id": "f0d6020d755afcc2a422883c72ded0d10335f9c3",
          "url": "https://github.com/Robokan/brepkit/commit/1ddad1defb84cc2baac041aa51da4c6e770e12dc"
        },
        "date": 1794592005404,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 751403,
            "range": "± 8648",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 816837,
            "range": "± 13610",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8195,
            "range": "± 571",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 667141,
            "range": "± 23810",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18511830,
            "range": "± 396152",
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
          "id": "e6ff0ce68ed5ed26377c04d35645a32ce67d0325",
          "message": "Merge remote-tracking branch 'origin/main'\n\n# Conflicts:\n#\tbuzzcad-corpus\n#\tcrates/algo/src/pave_filler/phase_ef.rs",
          "timestamp": "2026-11-13T11:53:06-08:00",
          "tree_id": "c8c2ca9a759011ecebcc7cade381f19d16be6e26",
          "url": "https://github.com/Robokan/brepkit/commit/e6ff0ce68ed5ed26377c04d35645a32ce67d0325"
        },
        "date": 1794599825514,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 907878,
            "range": "± 4207",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 956142,
            "range": "± 19433",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10003,
            "range": "± 28",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 593531,
            "range": "± 3325",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21099013,
            "range": "± 270053",
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
          "id": "b15136bfb9cd62d0e6982246302a3e877f318868",
          "message": "Merge remote-tracking branch 'upstream/main'\n\n# Conflicts:\n#\tcrates/math/src/nurbs/intersection/surface_marching.rs\n#\tcrates/math/src/nurbs/projection.rs\n#\tcrates/math/src/nurbs/surface.rs",
          "timestamp": "2026-11-13T12:12:48-08:00",
          "tree_id": "b33e68e7f1493024f1ae0e92e6439e9c69a7fb37",
          "url": "https://github.com/Robokan/brepkit/commit/b15136bfb9cd62d0e6982246302a3e877f318868"
        },
        "date": 1794603979313,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 914453,
            "range": "± 2241",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 965317,
            "range": "± 103825",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10199,
            "range": "± 86",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 600078,
            "range": "± 4582",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 20560349,
            "range": "± 90541",
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
          "id": "b794bf9846b2c9049d801038d6bc3333ce73b20a",
          "message": "docs(buzzcad): upstream 4.11.13 merged; three fix PRs opened\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-13T13:47:21-08:00",
          "tree_id": "450f89b72c82882359af284b29b682ea9a4a63e0",
          "url": "https://github.com/Robokan/brepkit/commit/b794bf9846b2c9049d801038d6bc3333ce73b20a"
        },
        "date": 1794606641974,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 806773,
            "range": "± 22756",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 864329,
            "range": "± 24132",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8417,
            "range": "± 33",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 544279,
            "range": "± 31014",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18579828,
            "range": "± 80119",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "a2b2ab50f60a986202961ae0cd4476ede73ed3c8",
          "message": "docs(buzzcad): SPEED.md records the upstream 4.11.13 merge, the arrangement's chord tie and the replay\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-13T15:02:55-08:00",
          "tree_id": "6d4cf17ec59b2592f92ba3e2f70f9ad26a7e78d7",
          "url": "https://github.com/Robokan/brepkit/commit/a2b2ab50f60a986202961ae0cd4476ede73ed3c8"
        },
        "date": 1794611155081,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 637717,
            "range": "± 1856",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 677265,
            "range": "± 6125",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 6913,
            "range": "± 595",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 432947,
            "range": "± 6938",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 14384445,
            "range": "± 121817",
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
          "id": "cb96687af05dc8b67fdd1d209f34cf886d0162b7",
          "message": "Merge remote-tracking branch 'origin/main'\n\n# Conflicts:\n#\tbuzzcad-corpus",
          "timestamp": "2026-11-13T16:46:33-08:00",
          "tree_id": "c2a8520b26f4fdf253261e2f2dc4d264f237c4f1",
          "url": "https://github.com/Robokan/brepkit/commit/cb96687af05dc8b67fdd1d209f34cf886d0162b7"
        },
        "date": 1794617441520,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1138860,
            "range": "± 40399",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1204593,
            "range": "± 74821",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 12118,
            "range": "± 77",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 756866,
            "range": "± 2299",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 25509504,
            "range": "± 75919",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "3fd8163049d5a9da33ad2a6a5c1dc46e7084b2c8",
          "message": "docs(buzzcad): the four measures and the B-spline side edges fixed; replay 20261114-003322\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-14T01:35:35-08:00",
          "tree_id": "7f3a4021f37784077cb1069a5f11a27c792b235b",
          "url": "https://github.com/Robokan/brepkit/commit/3fd8163049d5a9da33ad2a6a5c1dc46e7084b2c8"
        },
        "date": 1794649161720,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1112110,
            "range": "± 6146",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1183349,
            "range": "± 15427",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10658,
            "range": "± 31",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 748854,
            "range": "± 5458",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 23875190,
            "range": "± 126842",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "bf638c0dc93b6d9a0ae4a066e1300bce1f23aa07",
          "message": "docs(buzzcad): #2433 and #2434 opened\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-14T07:17:46-08:00",
          "tree_id": "c2cad7da6737e5409dd97268c73dd72512c0ffc0",
          "url": "https://github.com/Robokan/brepkit/commit/bf638c0dc93b6d9a0ae4a066e1300bce1f23aa07"
        },
        "date": 1794669687185,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1132321,
            "range": "± 75211",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1189010,
            "range": "± 34789",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11846,
            "range": "± 573",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 755705,
            "range": "± 3755",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 25421589,
            "range": "± 250878",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "eb62ac79a63a8e2f6db1ffcc8e5a8a2fb8a0cb72",
          "message": "docs(speed): span bound, grid rows and lie-on early exit; replay 20261114-090830\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-14T09:44:14-08:00",
          "tree_id": "777bb2722759dbc6dff4771a912dd889107df1dd",
          "url": "https://github.com/Robokan/brepkit/commit/eb62ac79a63a8e2f6db1ffcc8e5a8a2fb8a0cb72"
        },
        "date": 1794678446388,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 909142,
            "range": "± 9075",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 956240,
            "range": "± 6819",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 9966,
            "range": "± 42",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 594808,
            "range": "± 2440",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 20413146,
            "range": "± 90152",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "acc6aceb6288f5c91f95a47f03220ffff87142cd",
          "message": "docs(speed): upstream 4.11.14 and the spline mesh fix; replay 20261114-185906\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-14T23:01:59-08:00",
          "tree_id": "150880767f280d533d20c721f84fe9bc93d6e489",
          "url": "https://github.com/Robokan/brepkit/commit/acc6aceb6288f5c91f95a47f03220ffff87142cd"
        },
        "date": 1794726332337,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1123581,
            "range": "± 36571",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1181705,
            "range": "± 2929",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11935,
            "range": "± 43",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 745865,
            "range": "± 21346",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 25188471,
            "range": "± 50816",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "5e21d2355dc7a6084b169ee9b2b9360053313f53",
          "message": "docs(speed): the 30 worst boolean losers; replay 20261115-015237\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-15T02:21:01-08:00",
          "tree_id": "af363b22b4d07e1fd57e96e496bed4582d6a91e1",
          "url": "https://github.com/Robokan/brepkit/commit/5e21d2355dc7a6084b169ee9b2b9360053313f53"
        },
        "date": 1794738237036,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 636621,
            "range": "± 6934",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 676136,
            "range": "± 4606",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 6995,
            "range": "± 132",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 426687,
            "range": "± 142218",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 14443003,
            "range": "± 261076",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "79788faa369aa86496bb9b733d507ec84ce34924",
          "message": "docs(speed): booleans past Open CASCADE's total time; replay 20261115-122809\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-15T13:05:32-08:00",
          "tree_id": "6036e8b2cf5b47120e8a75a4848bbcc15c454952",
          "url": "https://github.com/Robokan/brepkit/commit/79788faa369aa86496bb9b733d507ec84ce34924"
        },
        "date": 1794776909699,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 632164,
            "range": "± 6040",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 678735,
            "range": "± 29490",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 6957,
            "range": "± 217",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 422352,
            "range": "± 3608",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 14518131,
            "range": "± 132710",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "092baeb7a5ac8194a0ab8fd2162b2d35d02437fc",
          "message": "docs(speed): valley walk cycles and seed grid roots; replay 20261115-160737\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-15T16:34:55-08:00",
          "tree_id": "2799d62609c05eb1e90bd27711ae017e768b379e",
          "url": "https://github.com/Robokan/brepkit/commit/092baeb7a5ac8194a0ab8fd2162b2d35d02437fc"
        },
        "date": 1794789524045,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1100804,
            "range": "± 4505",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1161619,
            "range": "± 7472",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11621,
            "range": "± 33",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 739210,
            "range": "± 5586",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 25100353,
            "range": "± 56828",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "8a8c7b0c15568c6aa96941873894d1f01965c96c",
          "message": "docs(speed): bodies of PRs #2478 and #2496\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-15T17:51:42-08:00",
          "tree_id": "8f6436e0109d120fe14af6bfd14b11fa43d1b539",
          "url": "https://github.com/Robokan/brepkit/commit/8a8c7b0c15568c6aa96941873894d1f01965c96c"
        },
        "date": 1794794120584,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1152169,
            "range": "± 7095",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1218174,
            "range": "± 9982",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 12119,
            "range": "± 111",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 768634,
            "range": "± 5491",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 25742698,
            "range": "± 130002",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "505df9b92c84aca7cf0deead89311ba49f7825a7",
          "message": "docs(speed): the span index sent upstream as PR #2517\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-15T18:59:24-08:00",
          "tree_id": "7a1d53af5c8bac04c51f8b5991c43e408d16068c",
          "url": "https://github.com/Robokan/brepkit/commit/505df9b92c84aca7cf0deead89311ba49f7825a7"
        },
        "date": 1794798159342,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 825955,
            "range": "± 11886",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 845203,
            "range": "± 26932",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8303,
            "range": "± 24",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 536767,
            "range": "± 10724",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18232705,
            "range": "± 81153",
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
          "id": "7ca2f2a563115785349fe5f04fff8ba34d055982",
          "message": "Merge remote-tracking branch 'origin/main'\n\n# Conflicts:\n#\tbuzzcad-corpus",
          "timestamp": "2026-11-15T20:22:43-08:00",
          "tree_id": "8080cbde7903f76a011cb80afa49170a1ad24c03",
          "url": "https://github.com/Robokan/brepkit/commit/7ca2f2a563115785349fe5f04fff8ba34d055982"
        },
        "date": 1794803160363,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 666075,
            "range": "± 5748",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 709305,
            "range": "± 43015",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8148,
            "range": "± 64",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 449364,
            "range": "± 5400",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 15371838,
            "range": "± 263766",
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
          "id": "510a201437324150474443ea0745a29ee6ce497c",
          "message": "docs(buzzcad): progress row for ten both-fail fillets\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-15T22:01:14-08:00",
          "tree_id": "7b9f19c0a48c52405c6748257b9bcc87125b63a6",
          "url": "https://github.com/Robokan/brepkit/commit/510a201437324150474443ea0745a29ee6ce497c"
        },
        "date": 1794809084404,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 911102,
            "range": "± 2102",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 968750,
            "range": "± 2375",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10795,
            "range": "± 46",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 596195,
            "range": "± 12089",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 20626783,
            "range": "± 164883",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "6135b0553a8f5f07c7bcfd9b43f93a35fdd4c45f",
          "message": "Merge upstream 4.11.28\n\nUpstream landed the speed PRs #2496 and #2537 (the span index and the\nclear-edge skip, with the maintainer's review fixes and a projection\nthat proves its foot nearest), and its own fixes since 4.11.25.\n\nResolutions:\n\n- math: the span index is upstream's, with the fork's line hits and\n  nearest-point lookups the classifier still reads; the fork's own\n  closest-point search goes, upstream's proven projection replaces it.\n- algo (face splitter): upstream's holes in a winding-chain band are\n  carried into the fork's split band builder, which the touching-saddle\n  split shares; a cylinder piece and a torus piece both read their\n  winding.\n- algo (builder_solid): upstream's new pass splits a curve that shares\n  its ends with another path. A coplanar face's section along a curved\n  edge reaches assembly as the edge's chord, on a plane the curve lies\n  in and on no face a curve of its group bounds; it stands for the\n  curve, as a ball's chord does for its arc, and joins its path\n  (`spline_cap_flush_fuse` fell back without it).\n- blend: upstream's plane/cylinder side round is tried first, the\n  fork's ruling round after it; the notch check reads a B-spline cap\n  edge piece by piece within upstream's convex region.\n- tessellate: upstream's chord splitting and edge breaks; the fork's\n  snap of curve ends to vertices a file's tolerance off stays.\n\nPose sweep and truth audit match upstream line for line. Tests: 4,588\npass; `rod_lying_on_a_plate_into_a_block_fuses_exactly` fails at pose 1,\nturn 0 as it does on main before this merge.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-16T12:34:23-08:00",
          "tree_id": "4aa035b5f00b99349c5e0a70501c72be5fbada1d",
          "url": "https://github.com/Robokan/brepkit/commit/6135b0553a8f5f07c7bcfd9b43f93a35fdd4c45f"
        },
        "date": 1794861493117,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 941844,
            "range": "± 1587",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 999781,
            "range": "± 10171",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11423,
            "range": "± 178",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 616717,
            "range": "± 3027",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21599394,
            "range": "± 162277",
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
          "id": "3630d0d182ed75030970085198d36707e6c0d3aa",
          "message": "Merge remote-tracking branch 'origin/main'",
          "timestamp": "2026-11-16T16:40:14-08:00",
          "tree_id": "a7263491d70cc6fb267a1f775ab09521e7592203",
          "url": "https://github.com/Robokan/brepkit/commit/3630d0d182ed75030970085198d36707e6c0d3aa"
        },
        "date": 1794878522308,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1182051,
            "range": "± 4813",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1251248,
            "range": "± 18632",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13313,
            "range": "± 58",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 778970,
            "range": "± 13168",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 27319107,
            "range": "± 182760",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "c919c69ea9f73a7bb0206fa7603fa6899ff80e53",
          "message": "Merge remote-tracking branch 'origin/main'",
          "timestamp": "2026-11-16T17:24:22-08:00",
          "tree_id": "5321428d050ee263f0cbaaa1857360208f49d3e5",
          "url": "https://github.com/Robokan/brepkit/commit/c919c69ea9f73a7bb0206fa7603fa6899ff80e53"
        },
        "date": 1794878944011,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 942287,
            "range": "± 6769",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 998432,
            "range": "± 1441",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11549,
            "range": "± 22",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 611053,
            "range": "± 58832",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21007529,
            "range": "± 228874",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "a8d35f152765a36a1d825105a021b6388732c014",
          "message": "chore: corpus with the 4.11.28 merge's replays and notes\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-16T17:28:58-08:00",
          "tree_id": "07ed49488073208615739a0b4f3cd6403236f904",
          "url": "https://github.com/Robokan/brepkit/commit/a8d35f152765a36a1d825105a021b6388732c014"
        },
        "date": 1794879170313,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1167685,
            "range": "± 3038",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1238039,
            "range": "± 262376",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13199,
            "range": "± 40",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 765792,
            "range": "± 1729",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26154527,
            "range": "± 355909",
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
          "id": "7a4cb65e490912ff5951dea5d9317b4357b6a1d9",
          "message": "docs(buzzcad): progress row for the merge's regressions; the fixes not yet sent upstream\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-16T18:27:02-08:00",
          "tree_id": "f8f6f9ec1a5ce45d6207ef11483eafd85129935c",
          "url": "https://github.com/Robokan/brepkit/commit/7a4cb65e490912ff5951dea5d9317b4357b6a1d9"
        },
        "date": 1794882629768,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 941424,
            "range": "± 3990",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1000026,
            "range": "± 2186",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11948,
            "range": "± 243",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 615417,
            "range": "± 2682",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21064565,
            "range": "± 78265",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "f134834cd77d3fad1b97b44cda98bcc972c01bef",
          "message": "chore: corpus with the speed tools\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-16T18:40:38-08:00",
          "tree_id": "4f24435fc129c152d6554ef15c450b9f787b7b87",
          "url": "https://github.com/Robokan/brepkit/commit/f134834cd77d3fad1b97b44cda98bcc972c01bef"
        },
        "date": 1794883463990,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 938210,
            "range": "± 63457",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 998206,
            "range": "± 2406",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11384,
            "range": "± 11",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 622386,
            "range": "± 7984",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 20925294,
            "range": "± 58051",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "fd556197ab5b07d11862e477353a580b2f952539",
          "message": "docs(speed): where the speed tools and case sets live\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-16T18:41:03-08:00",
          "tree_id": "8f703561c085dcdfdb7fdf9a515d5c313f32c38b",
          "url": "https://github.com/Robokan/brepkit/commit/fd556197ab5b07d11862e477353a580b2f952539"
        },
        "date": 1794883680761,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1005209,
            "range": "± 10193",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1060092,
            "range": "± 24029",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10806,
            "range": "± 268",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 675048,
            "range": "± 5046",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21268559,
            "range": "± 54197",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "b47b7aa11583b197f8aabba9a446f388669f9439",
          "message": "chore: corpus with the volume replay\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-16T23:39:00-08:00",
          "tree_id": "27662ac457447bfe18d94d1e55cf1f82ff3c8b20",
          "url": "https://github.com/Robokan/brepkit/commit/b47b7aa11583b197f8aabba9a446f388669f9439"
        },
        "date": 1794901325709,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 783958,
            "range": "± 86560",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 891016,
            "range": "± 103792",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8370,
            "range": "± 11",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 539943,
            "range": "± 54525",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 16116161,
            "range": "± 1439709",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "bd5c1ab51babbcafaa7e8436fde0f7024d9cad49",
          "message": "docs(speed): S6, display data side by side; S5 looked at\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-17T01:09:25-08:00",
          "tree_id": "8fbc7db3c91c1f540225d3c922f7eeda5a31013f",
          "url": "https://github.com/Robokan/brepkit/commit/bd5c1ab51babbcafaa7e8436fde0f7024d9cad49"
        },
        "date": 1794906763681,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 942558,
            "range": "± 18455",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1000019,
            "range": "± 1536",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11703,
            "range": "± 136",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 611254,
            "range": "± 2289",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 20994703,
            "range": "± 47108",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "committer": {
            "email": "eric.d.vaughan@gmail.com",
            "name": "Robokan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "b55aacc949ac7b50d70f2f5494c6199bd5348fd3",
          "message": "docs(speed): S5, a big body's query mesh scales with it, creases exact\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-17T08:08:52-08:00",
          "tree_id": "aed01be099145052ee59a0c9a169339d836f2e46",
          "url": "https://github.com/Robokan/brepkit/commit/b55aacc949ac7b50d70f2f5494c6199bd5348fd3"
        },
        "date": 1794931968112,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1281848,
            "range": "± 185496",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1238216,
            "range": "± 4094",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13578,
            "range": "± 315",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 770026,
            "range": "± 3169",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26345143,
            "range": "± 242814",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "b66960dd37b767053709e913dfe2c514de14d8e0",
          "message": "fix(blend): swallow a curved narrow face between tilted end faces\n\nAn open round wider than the narrow face beside it pivots on the face's\nfar edge, and the face goes. That was taken only where the far edge's\nends lay in the round's end sections, so a fan blade's tip (a strip\nrounded past its width, its ends leaning) failed.\n\n- The far edge is carried straight on past its free ends, so the end\n  sections still find their pivot; only the inner sections are held to\n  lie on the faces.\n- The band is carried past its ends and cut back to the end faces. The\n  pivoted contact ends exactly on the far edge's corner (it stopped\n  1e-5 off, leaving sliver edges the incidence audit refused), and the\n  other contacts are snapped onto the cap's corner edges.\n- The residual check reads the contact only on tangent sides, and skips\n  pivoted end sections clamped to a B-spline's domain.\n- An open round whose narrow face cannot be swallowed keeps its walked\n  contacts, as before.\n\nTest `fillet_swallow_with_tilted_ends.rs`: a leaning strip rounded at\nr 0.8 to 2, the removed sweep integrated. Below r 1.25 the solid is\nexact but the end face's mesh doubles a triangle over its shallow\nnotch, so the mesh is checked from 1.25.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-18T09:14:33-08:00",
          "tree_id": "e266559f831481db8780c73bb7927d11dde285f4",
          "url": "https://github.com/Robokan/brepkit/commit/b66960dd37b767053709e913dfe2c514de14d8e0"
        },
        "date": 1795022352705,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1212089,
            "range": "± 8229",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1284360,
            "range": "± 70358",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 14273,
            "range": "± 47",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 789016,
            "range": "± 3542",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 27575060,
            "range": "± 247524",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "c6a04316fd9d454ecc2d97a05d38d075f071e81d",
          "message": "docs(buzzcad): work autonomously, sending each fix upstream as it lands\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-18T11:27:56-08:00",
          "tree_id": "619d05b16d67a5e8756da626794612dc965e5168",
          "url": "https://github.com/Robokan/brepkit/commit/c6a04316fd9d454ecc2d97a05d38d075f071e81d"
        },
        "date": 1795030960442,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 942164,
            "range": "± 10206",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1001281,
            "range": "± 4513",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11140,
            "range": "± 40",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 618966,
            "range": "± 22447",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21463372,
            "range": "± 548665",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "30cc0128fc78af5de81236c0ef10dd8b1b57834f",
          "message": "fix(blend): cut out the crossing of a round's contact past a tight tip\n\nA round a little wider than the bend at its outline's tip cannot roll\nround the tip: its contact on the plane runs back past it, loops and\ncrosses itself. It was refused (\"turns back on itself\").\n\nThe crossing is cut out. The two sections through the crossing point,\npinned by a Newton solve on the walker, bound the cut: both are arcs of\none ball, centred where the ball's path crosses itself. Between them the\ncontact on the plane stands still at the crossing point, the contact on\nthe wall runs on as walked, and each section is the arc from the point\nto the wall contact, tangent to the wall there. The band is three\ninterpolated pieces joined C0. The run-on check reads each piece apart,\nand the residual check skips tangency where a contact stands still.\n\nThe repro tool gains FACES (each face's area) and FLIPFACE takes a list.\n\nTest `fillet_round_past_a_tip.rs`: a B-spline nose bending 22.5,\nrounded at r 21 to 26, the removed volume against its rate below the\nbend; refused without the change.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-18T13:09:03-08:00",
          "tree_id": "7413cd1ac0669a4148a7699854e647569aeadfb3",
          "url": "https://github.com/Robokan/brepkit/commit/30cc0128fc78af5de81236c0ef10dd8b1b57834f"
        },
        "date": 1795036383223,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1175060,
            "range": "± 2972",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1244693,
            "range": "± 3723",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13653,
            "range": "± 73",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 768938,
            "range": "± 2326",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 27039955,
            "range": "± 406682",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "48b567c7570244cc2535463fcd162a1f9f7e74ef",
          "message": "docs(buzzcad): the fillet backlog sent upstream as #2639\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-18T14:17:05-08:00",
          "tree_id": "4019795900e40ef81251919c8b23820d1c03c99e",
          "url": "https://github.com/Robokan/brepkit/commit/48b567c7570244cc2535463fcd162a1f9f7e74ef"
        },
        "date": 1795040405188,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 705082,
            "range": "± 5164",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 748229,
            "range": "± 7603",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8366,
            "range": "± 517",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 471071,
            "range": "± 8958",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 15908623,
            "range": "± 66996",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "9a28fe1cd2d4d5d729279c60313fa2c38172b6fc",
          "message": "chore: ignore extra cargo target directories\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-18T14:17:36-08:00",
          "tree_id": "2e4ea7c48bf3e83c4caa2698d850d99cd4bf9bba",
          "url": "https://github.com/Robokan/brepkit/commit/9a28fe1cd2d4d5d729279c60313fa2c38172b6fc"
        },
        "date": 1795040618314,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 821210,
            "range": "± 22240",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 910535,
            "range": "± 14197",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 9787,
            "range": "± 266",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 546247,
            "range": "± 7745",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 18850587,
            "range": "± 21436",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "a6572fa8d75d6fdd95ad3ae3711b80efe0176765",
          "message": "docs(buzzcad): the spindle torus read-back and the held 4.11.32 merge; corpus_fillet FACES checks orientation\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-18T15:11:40-08:00",
          "tree_id": "b2ce7d628864b54fee837a1d5115a80033bb076e",
          "url": "https://github.com/Robokan/brepkit/commit/a6572fa8d75d6fdd95ad3ae3711b80efe0176765"
        },
        "date": 1795043752094,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1174638,
            "range": "± 18352",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1256787,
            "range": "± 39240",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 12470,
            "range": "± 39",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 786556,
            "range": "± 8669",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 25232575,
            "range": "± 69101",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "a9e43f8d21ba11cd539265f1dece9844630f3b2a",
          "message": "fix(topology): with no seed, face normals follow the readings' convention\n\n`normalize_face_normals` reads each face's boundary winding about its\neffective normal and turns the faces that disagree with the solid's\nconvention. With no seed to read that convention from (a round that\nrebuilt every face of its input, both outlines of a plate rounded), the\nrebuilt faces voted on it. Where more bands were built backwards than\ninput faces were trimmed right, the vote went backwards and every face\nwas turned to match: each loop then ran clockwise about a normal facing\nout. brepkit's own measures take a loop's region either way, but a STEP\nreader on a closed surface takes such a loop as a hole: a spindle torus\nband read back as the whole torus less the face.\n\nThe readings are all taken in one convention, a boundary running\ncounterclockwise about its face's effective normal, so with no seed\nthat convention holds and the faces built backwards are the ones turned.\n\nTest `fillet_rounded_both_outlines_wound_out.rs`: a plate read from STEP\nrounded round both outlines; its caps' loops run counterclockwise about\ntheir normals (clockwise without the change). The orientation unit tests\nnow expect turned faces turned back however many there are.\n\n`corpus_fillet` FACES=1 prints each face's orientation, loop winding and\nan off-normal classification; FACES=loops, FACES=surfaces, FACESIN.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-18T17:15:06-08:00",
          "tree_id": "49f9fe8ed2b4fdf8b785c451243e3b7cba386d1f",
          "url": "https://github.com/Robokan/brepkit/commit/a9e43f8d21ba11cd539265f1dece9844630f3b2a"
        },
        "date": 1795051100908,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 944942,
            "range": "± 22702",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1000552,
            "range": "± 5246",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11221,
            "range": "± 24",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 615955,
            "range": "± 4782",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 20968871,
            "range": "± 27924",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "0ad0295407b64ba7e49289be5d12a8f1a8a4a025",
          "message": "chore: corpus with the tip, orientation and measure fixes' replays\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-18T18:01:57-08:00",
          "tree_id": "aa8a3ecac97359fe5bbdc7703705aa8d02bed366",
          "url": "https://github.com/Robokan/brepkit/commit/0ad0295407b64ba7e49289be5d12a8f1a8a4a025"
        },
        "date": 1795053928261,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 985714,
            "range": "± 11818",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1036328,
            "range": "± 9296",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10629,
            "range": "± 110",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 659300,
            "range": "± 6499",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 20755284,
            "range": "± 55100",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "f804d2b6e279363d8a9b172cb75854dd89065e04",
          "message": "docs(buzzcad): 4.11.32 held on its branch for the trimmer's crossing loops\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-19T00:55:12-08:00",
          "tree_id": "fd5aa55d31d7644f4155ebccf547f13b44dafef8",
          "url": "https://github.com/Robokan/brepkit/commit/f804d2b6e279363d8a9b172cb75854dd89065e04"
        },
        "date": 1795078708648,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 944823,
            "range": "± 68173",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1000759,
            "range": "± 16869",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11161,
            "range": "± 33",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 614197,
            "range": "± 2693",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21105167,
            "range": "± 89448",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "658ef96776ae8e86e55e9791174814c8b5c489da",
          "message": "chore: corpus with the ledge run-up replay and note\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-19T16:51:14-08:00",
          "tree_id": "7403e1360ea64bba8c29ba675fb440165d81f2a0",
          "url": "https://github.com/Robokan/brepkit/commit/658ef96776ae8e86e55e9791174814c8b5c489da"
        },
        "date": 1795136122328,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1162247,
            "range": "± 3296",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1228907,
            "range": "± 43408",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13545,
            "range": "± 61",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 761541,
            "range": "± 2355",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26303606,
            "range": "± 100464",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "8c55984235513512e54ce89bbdc4420f6e549c50",
          "message": "docs(buzzcad): the ledge run-up sent upstream as #2641\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-19T17:40:03-08:00",
          "tree_id": "9e69a95f944fe770642c48a695a423f3d69cc27e",
          "url": "https://github.com/Robokan/brepkit/commit/8c55984235513512e54ce89bbdc4420f6e549c50"
        },
        "date": 1795139038475,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1170418,
            "range": "± 3237",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1235694,
            "range": "± 1655",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13365,
            "range": "± 37",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 766906,
            "range": "± 2497",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26613328,
            "range": "± 91196",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "11620e938bd496074f786079122def6eaddce496",
          "message": "chore: corpus with the convex run-off replay and note\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-19T19:42:54-08:00",
          "tree_id": "c3727e540e94bcdbedd9f62148842e207308bd8b",
          "url": "https://github.com/Robokan/brepkit/commit/11620e938bd496074f786079122def6eaddce496"
        },
        "date": 1795146395296,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1171972,
            "range": "± 4042",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1237541,
            "range": "± 1994",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13349,
            "range": "± 53",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 766829,
            "range": "± 3832",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26212485,
            "range": "± 33475",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "02f6948a6faf2bd9d67e67786baaa3450fcc9e5d",
          "message": "chore: corpus with the 4.11.32 merge's replays\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-20T01:31:22-08:00",
          "tree_id": "d495ba11fb9559b2b1838ca1b776b0c44000f694",
          "url": "https://github.com/Robokan/brepkit/commit/02f6948a6faf2bd9d67e67786baaa3450fcc9e5d"
        },
        "date": 1795167271890,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 719718,
            "range": "± 15412",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 778977,
            "range": "± 12703",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8875,
            "range": "± 55",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 494073,
            "range": "± 4682",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 16796599,
            "range": "± 216896",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "f0b5d8a6f9994406ff777e3d8384d4a6e7b9b9ea",
          "message": "docs(buzzcad): the backlog sent upstream as #2642-#2645\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-20T16:17:23-08:00",
          "tree_id": "7f2a97f5628c381b57e9f7a9bb6f0b5e620fb227",
          "url": "https://github.com/Robokan/brepkit/commit/f0b5d8a6f9994406ff777e3d8384d4a6e7b9b9ea"
        },
        "date": 1795220474965,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1178103,
            "range": "± 3905",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1240006,
            "range": "± 1597",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13436,
            "range": "± 57",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 779930,
            "range": "± 1490",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26508391,
            "range": "± 35180",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "156c37fd402bc2eb840b64f6181f81342583fcc7",
          "message": "fix(blend): run a round's own end wall up first, and run a short band on\n\nA concave round at a ledge whose end wall runs on under the ledge ran\nthe walls up past that end wall and left the ledge's loop crossing\nitself. The end wall is now the first wall run up, its runout edge\ndropped from the wire. A NURBS band ending short of the wall it must\nreach is run on past its end section (its last span extrapolated)\nbefore the run-up is planned.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-21T10:07:08-08:00",
          "tree_id": "9933ca4eb8c6c99f14504d02343b3f086f54ff7f",
          "url": "https://github.com/Robokan/brepkit/commit/156c37fd402bc2eb840b64f6181f81342583fcc7"
        },
        "date": 1795284615961,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 698486,
            "range": "± 13644",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 761602,
            "range": "± 2901",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 8604,
            "range": "± 125",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 454596,
            "range": "± 10111",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 15759283,
            "range": "± 257789",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "c648c23154c98f588923bbfa7f24ad9393bef65f",
          "message": "docs(buzzcad): the 84157 fix sent up in #2641\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-21T11:00:32-08:00",
          "tree_id": "5d5b6e5f733ead00ff227d66331d772902a1096e",
          "url": "https://github.com/Robokan/brepkit/commit/c648c23154c98f588923bbfa7f24ad9393bef65f"
        },
        "date": 1795287827644,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 999983,
            "range": "± 306",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1008172,
            "range": "± 3655",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11410,
            "range": "± 32",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 639440,
            "range": "± 5359",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21388968,
            "range": "± 62252",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "53ff1a31d027c7711c85b04baffb9957ff6083a2",
          "message": "chore: bump the corpus to its lobe notes\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-21T11:22:57-08:00",
          "tree_id": "dc29c623793b10a321db6b965aa29505a9bfc1da",
          "url": "https://github.com/Robokan/brepkit/commit/53ff1a31d027c7711c85b04baffb9957ff6083a2"
        },
        "date": 1795289196088,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 950234,
            "range": "± 28535",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1001864,
            "range": "± 5398",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11429,
            "range": "± 155",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 623732,
            "range": "± 3974",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 22340656,
            "range": "± 519771",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "6180acb91d483483ed24e7accfedaf595d6e00ff",
          "message": "fix(blend): a walked end on a curved cap allows the cap's stand-off too\n\nA walked round cut back to a curved cap ends each contact on the cap's\ncorner edge with its face, within as far as that edge stands off the\nface. The contact is cut on the cap's surface, so a file's skin edge\nstanding off the cap as well moves the cut by both: the allowance now\nadds the edge's stand-off from the cap. A wing's top rounded to its tip\nhad its wall contact cut 1.24e-3 from the skins' shared edge, 1.08e-3\noff the side and 1.03e-3 off the cap; the end was left to a runout\npatch whose line crossed the top's outline.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-21T13:35:14-08:00",
          "tree_id": "1d8cefb2f6adfa1cc3aa9814555d831bcd659b3f",
          "url": "https://github.com/Robokan/brepkit/commit/6180acb91d483483ed24e7accfedaf595d6e00ff"
        },
        "date": 1795297146941,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1179740,
            "range": "± 4749",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1242721,
            "range": "± 3519",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13595,
            "range": "± 108",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 792564,
            "range": "± 6654",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26547384,
            "range": "± 758525",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "1336d277a2127138fe241e8634b77e4a19299130",
          "message": "docs(buzzcad): the walked cap fix sent up in #2641\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-21T14:20:44-08:00",
          "tree_id": "f1d4b945397705c1655ad411366bdc4d43b489d7",
          "url": "https://github.com/Robokan/brepkit/commit/1336d277a2127138fe241e8634b77e4a19299130"
        },
        "date": 1795299902415,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1195808,
            "range": "± 8662",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1257663,
            "range": "± 7660",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13097,
            "range": "± 134",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 810163,
            "range": "± 7845",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 25916406,
            "range": "± 309638",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "bfc45a16ee38e4cb3b6fff3b72c533fab64d1f45",
          "message": "fix(blend): split off a ledge's corner a runout line cuts across\n\nA round closed by a runout patch has the patch's line on the ledge run\nfrom the contact's end to the ledge's corner. Where the ledge's outline\nfirst steps a little the round's way along a short edge and then\ncrosses that line, the ledge's loop ran out past the crossing and back,\ncrossing itself. The line is now cut at the crossing: the ledge keeps\nit to there and its outline on from there, the corner cut off becomes\na face of its own on the ledge's surface, and the patch takes the line\nin two pieces.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-21T16:34:40-08:00",
          "tree_id": "dbe189cd2431083e7f651d03c910c1b5ddb2bf35",
          "url": "https://github.com/Robokan/brepkit/commit/bfc45a16ee38e4cb3b6fff3b72c533fab64d1f45"
        },
        "date": 1795307882427,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 994675,
            "range": "± 11376",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1035733,
            "range": "± 10775",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11818,
            "range": "± 190",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 633322,
            "range": "± 6600",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21991048,
            "range": "± 245218",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "ab6a2eaf019de36c5e73d96e9553d6dee44952f8",
          "message": "docs(buzzcad): the runout notch fix sent up in #2641\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-21T17:21:10-08:00",
          "tree_id": "9f671078960de4a04358ba6b937df335055a0520",
          "url": "https://github.com/Robokan/brepkit/commit/ab6a2eaf019de36c5e73d96e9553d6dee44952f8"
        },
        "date": 1795310674821,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 877866,
            "range": "± 27910",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 905857,
            "range": "± 35404",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 10045,
            "range": "± 21",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 578960,
            "range": "± 6328",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 19382294,
            "range": "± 75923",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "70d342365fc658913affebf4c8e1944e7a6656ab",
          "message": "docs(buzzcad): the Tuner corner fix, corpus bumped to its notes\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-21T23:44:34-08:00",
          "tree_id": "b00f23f0f219066c9408ee6d3a44744b70d58d5f",
          "url": "https://github.com/Robokan/brepkit/commit/70d342365fc658913affebf4c8e1944e7a6656ab"
        },
        "date": 1795333682942,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 951359,
            "range": "± 2902",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1003878,
            "range": "± 11618",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11337,
            "range": "± 28",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 626756,
            "range": "± 26738",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21250521,
            "range": "± 334466",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "04872741e89bfd98726708886d2be0af72fc47a0",
          "message": "docs(buzzcad): #2646 landed the stack; the rest of #2641 is #2685\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-22T01:31:38-08:00",
          "tree_id": "cabfa1859744d5476a650d0d1e459d29305e8516",
          "url": "https://github.com/Robokan/brepkit/commit/04872741e89bfd98726708886d2be0af72fc47a0"
        },
        "date": 1795340109165,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 958914,
            "range": "± 14407",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1018582,
            "range": "± 7207",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11566,
            "range": "± 177",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 625618,
            "range": "± 3431",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21996810,
            "range": "± 129942",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "f3ed140ec4f4dedd4b327f725fd3c1ae24a76af7",
          "message": "chore(buzzcad): corpus with the 4.11.36 merge's replays\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-22T13:40:34-08:00",
          "tree_id": "8868926879d97ee3c85098a96f00e365dbae460a",
          "url": "https://github.com/Robokan/brepkit/commit/f3ed140ec4f4dedd4b327f725fd3c1ae24a76af7"
        },
        "date": 1795383877971,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1179679,
            "range": "± 30896",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1249560,
            "range": "± 5850",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13462,
            "range": "± 22",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 795297,
            "range": "± 2544",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26642914,
            "range": "± 101823",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "a5fff15840bd5bce4e1789f1b65e165eb7cacdc3",
          "message": "docs(buzzcad): the 4.11.36 merge's fixes are #2718 and #2724\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-22T15:36:42-08:00",
          "tree_id": "4d9cc15a69936f0ffc7cab3d9d3ebfeafc0d5206",
          "url": "https://github.com/Robokan/brepkit/commit/a5fff15840bd5bce4e1789f1b65e165eb7cacdc3"
        },
        "date": 1795390802350,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 949224,
            "range": "± 6814",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1003011,
            "range": "± 19626",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11407,
            "range": "± 9",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 625735,
            "range": "± 1888",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21503361,
            "range": "± 73827",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "817b52b89fc4fa54136da0b3dd1055624e767668",
          "message": "docs(buzzcad): 7 of the merge's lost booleans back\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-23T01:33:51-08:00",
          "tree_id": "53019fe6003996e955ea7a21d538bd55cb212e62",
          "url": "https://github.com/Robokan/brepkit/commit/817b52b89fc4fa54136da0b3dd1055624e767668"
        },
        "date": 1795426637763,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 948187,
            "range": "± 19812",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1002545,
            "range": "± 2228",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 11663,
            "range": "± 93",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 625923,
            "range": "± 2455",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 21328677,
            "range": "± 38021",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "2810a53bca6212630e3914f1a5471d00cc3ddfc1",
          "message": "docs(buzzcad): the one-step designs, and the near-flat cone cutoff\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-23T08:20:37-08:00",
          "tree_id": "b01f62a20a0c65d8a6dbd00a9bc53c5dc409945f",
          "url": "https://github.com/Robokan/brepkit/commit/2810a53bca6212630e3914f1a5471d00cc3ddfc1"
        },
        "date": 1795451073032,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1222093,
            "range": "± 6083",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1294376,
            "range": "± 4946",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 14712,
            "range": "± 43",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 809086,
            "range": "± 4029",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 27298178,
            "range": "± 43711",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "9b3eeba0c3e8186772eae03b7846ae59a6f70812",
          "message": "docs(buzzcad): the long-chord sag fix and replay 20261123-134249\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-23T15:21:33-08:00",
          "tree_id": "d6d6d0713dd4d0fb47bb3dac0db5b034fd8e2de4",
          "url": "https://github.com/Robokan/brepkit/commit/9b3eeba0c3e8186772eae03b7846ae59a6f70812"
        },
        "date": 1795476291659,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 857637,
            "range": "± 21284",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 908676,
            "range": "± 19506",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 9850,
            "range": "± 20",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 570876,
            "range": "± 4712",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 19221593,
            "range": "± 75397",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "eb1e5d978cc48e016446fb520c8238a59e9d9219",
          "message": "docs(buzzcad): the rim-arc chamfer and the walked ball corner\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-23T21:10:33-08:00",
          "tree_id": "0983405abce3144505eb1d99574ea97d1aff366e",
          "url": "https://github.com/Robokan/brepkit/commit/eb1e5d978cc48e016446fb520c8238a59e9d9219"
        },
        "date": 1795497284296,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1168378,
            "range": "± 2371",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1237103,
            "range": "± 2322",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13650,
            "range": "± 34",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 776046,
            "range": "± 5232",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26428419,
            "range": "± 74746",
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
          "id": "d17441e1c69a14c5d21f3578213a91618d1b27d3",
          "message": "fix(blend): merge a chamfer end's two coplanar faces at an inside corner\n\nA chamfer whose edge ends at an inside corner of two end faces in one\nplane (a strip's top running into a post rising above it, its wall into a\nslab beside the post) bares a triangle between them. The triangle was\nspliced into one end face and the other was left beside it in the same\nplane, a face too many. The two are now merged into one.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-23T23:40:36-08:00",
          "tree_id": "0d1d57f48c911586dc620ead1bd771f904bec708",
          "url": "https://github.com/Robokan/brepkit/commit/d17441e1c69a14c5d21f3578213a91618d1b27d3"
        },
        "date": 1795506283205,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1168572,
            "range": "± 4271",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1236391,
            "range": "± 4299",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13777,
            "range": "± 81",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 783279,
            "range": "± 2803",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26614994,
            "range": "± 328259",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "committer": {
            "email": "66281732+Robokan@users.noreply.github.com",
            "name": "Eric Vaughan",
            "username": "Robokan"
          },
          "distinct": true,
          "id": "bf1eae653ce1d9e968f87b9cb4819e6e62c5259e",
          "message": "chore: corpus with replay 20261124-095909\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>",
          "timestamp": "2026-11-24T11:57:47-08:00",
          "tree_id": "769354d5608a89bc4f42325edc6c6aa1c478be74",
          "url": "https://github.com/Robokan/brepkit/commit/bf1eae653ce1d9e968f87b9cb4819e6e62c5259e"
        },
        "date": 1795550494131,
        "tool": "cargo",
        "benches": [
          {
            "name": "boolean/cut_box_box",
            "value": 1176426,
            "range": "± 14650",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/fuse_box_box",
            "value": 1245513,
            "range": "± 40373",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/intersect_box_box",
            "value": 13645,
            "range": "± 113",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/cut_cylinder_through_box",
            "value": 782108,
            "range": "± 4920",
            "unit": "ns/iter"
          },
          {
            "name": "boolean/perforated_cut_36",
            "value": 26506948,
            "range": "± 100493",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}