/**
 * Normalised pointer position, -1..1 from the centre of the viewport. The
 * bottle leans very slightly toward the cursor, which is the difference
 * between a render and something that feels present in the room.
 */
export const pointer = {x: 0, y: 0};

export function initPointer() {
  const onMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onLeave = () => {
    pointer.x = 0;
    pointer.y = 0;
  };

  window.addEventListener('pointermove', onMove, {passive: true});
  window.addEventListener('pointerleave', onLeave);

  return () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerleave', onLeave);
  };
}
