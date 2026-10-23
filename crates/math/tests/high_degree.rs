//! Curves and surfaces of a degree past the evaluators' stack buffers (a
//! fitted B-spline of degree 14 read from a file) evaluate rather than index
//! past them. Control points evenly spaced along a line, or over a grid,
//! give a Bezier curve or patch that runs along them linearly (linear
//! precision), so each value is known exactly.
#![allow(clippy::unwrap_used, clippy::expect_used)]

use brepkit_math::nurbs::{NurbsCurve, NurbsSurface};
use brepkit_math::vec::{Point3, Vec3};

fn clamped(degree: usize) -> Vec<f64> {
    std::iter::repeat_n(0.0, degree + 1)
        .chain(std::iter::repeat_n(1.0, degree + 1))
        .collect()
}

#[test]
fn a_degree_fourteen_curve_evaluates_and_differentiates() {
    let degree = 14;
    let (a, b) = (Point3::new(1.0, 2.0, 3.0), Point3::new(15.0, -5.0, 10.0));
    #[allow(clippy::cast_precision_loss)]
    let points: Vec<Point3> = (0..=degree)
        .map(|i| a + (b - a) * (i as f64 / degree as f64))
        .collect();
    let curve = NurbsCurve::new(degree, clamped(degree), points, vec![1.0; degree + 1]).unwrap();
    for t in [0.0, 0.25, 0.5, 0.9, 1.0] {
        let p = curve.evaluate(t);
        assert!((p - (a + (b - a) * t)).length() < 1e-9, "t {t}: {p:?}");
        let d = curve.derivatives(t, 2);
        assert!(
            (d[1] - (b - a)).length() < 1e-7,
            "t {t}: tangent {:?}",
            d[1]
        );
        assert!(d[2].length() < 1e-5, "t {t}: second derivative {:?}", d[2]);
    }
}

#[test]
fn a_degree_ten_surface_evaluates_and_differentiates() {
    let degree = 10;
    #[allow(clippy::cast_precision_loss)]
    let grid: Vec<Vec<Point3>> = (0..=degree)
        .map(|i| {
            (0..=degree)
                .map(|j| {
                    Point3::new(
                        4.0 * i as f64 / degree as f64,
                        2.0 * j as f64 / degree as f64,
                        0.0,
                    )
                })
                .collect()
        })
        .collect();
    let weights = vec![vec![1.0; degree + 1]; degree + 1];
    let surface = NurbsSurface::new(
        degree,
        degree,
        clamped(degree),
        clamped(degree),
        grid,
        weights,
    )
    .unwrap();
    let mut evaluator = surface.evaluator();
    for (u, v) in [(0.0, 0.0), (0.3, 0.7), (1.0, 0.5)] {
        let want = Point3::new(4.0 * u, 2.0 * v, 0.0);
        assert!((surface.evaluate(u, v) - want).length() < 1e-9);
        assert!((evaluator.point(u, v) - want).length() < 1e-9);
        let d = surface.derivatives(u, v, 1);
        assert!((d[1][0] - Vec3::new(4.0, 0.0, 0.0)).length() < 1e-7);
        assert!((d[0][1] - Vec3::new(0.0, 2.0, 0.0)).length() < 1e-7);
        assert!((evaluator.normal(u, v).z().abs() - 1.0).abs() < 1e-9);
    }
}
