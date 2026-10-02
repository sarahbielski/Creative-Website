import type {CSSProperties, ReactNode} from 'react';
import {anchor} from '../lib/scroll';

/** Left edge of content: clear of the frame and the fixed rail. */
export const PAD_L = 'calc(var(--frame) + var(--rail) + clamp(8px, 1.2vw, 26px))';
export const PAD_R = 'calc(var(--frame) + var(--gutter))';

type SectionProps = {
  /** Registered with the scroll system so the choreography can reference it. */
  id: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Content sits under the 3D canvas unless it needs to overlap the bottle. */
  z?: number;
};

export function Section({id, children, className = '', style, z = 20}: SectionProps) {
  return (
    <section
      id={id}
      ref={anchor(id)}
      className={`relative ${className}`}
      style={{zIndex: z, paddingLeft: PAD_L, paddingRight: PAD_R, ...style}}
    >
      {children}
    </section>
  );
}

/** A display heading whose lines wipe up from behind their own mask. */
export function Lines({
  lines,
  className = '',
  as: Tag = 'h2',
}: {
  lines: readonly string[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Tag data-lines className={`m-0 ${className}`}>
      {lines.map((line) => (
        <span key={line} className="line-mask">
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
