window.BENCHMARK_DATA = {
  "lastUpdate": 1794082341833,
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
      }
    ]
  }
}