/**
 * The parchment panel and the oxblood border it floats inside.
 *
 * The panel is fixed rather than part of the flow, and the four border bars sit
 * above the 3D canvas — so the bottle is clipped to the panel without the
 * canvas needing a mask, a wrapper, or its own stacking context.
 */
export function Frame() {
  return (
    <>
      <div
        className="paper-grain pointer-events-none fixed z-[5] bg-parchment"
        style={{inset: 'var(--frame)'}}
        aria-hidden="true"
      />

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
        <div className="absolute inset-x-0 top-0 bg-oxblood" style={{height: 'var(--frame)'}} />
        <div className="absolute inset-x-0 bottom-0 bg-oxblood" style={{height: 'var(--frame)'}} />
        <div className="absolute inset-y-0 left-0 bg-oxblood" style={{width: 'var(--frame)'}} />
        <div className="absolute inset-y-0 right-0 bg-oxblood" style={{width: 'var(--frame)'}} />
      </div>
    </>
  );
}
