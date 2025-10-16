








#[inline]
pub fn eval_rational_poly<const P: usize, const Q: usize>(x: f32, p: [f32; P], q: [f32; Q]) -> f32 {
    let yp = p.into_iter().rev().reduce(|yp, p| yp * x + p).unwrap();
    let yq = q.into_iter().rev().reduce(|yq, q| yq * x + q).unwrap();
    yp / yq
}
