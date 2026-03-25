import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { PouchPart } from '@/hooks/usePouchBuilder';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PouchAvatarProps {
  shape?: PouchPart | null;
  color?: PouchPart | null;
  expression?: PouchPart | null;
  accessory?: PouchPart | null;
  background?: PouchPart | null;
  size?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Wrap svg_data that contains gradients in a <defs> block */
function wrapGradient(svgData: string): string {
  if (svgData.includes('<radialGradient') || svgData.includes('<linearGradient')) {
    return `<defs>${svgData}</defs>`;
  }
  return svgData;
}

/** Apply fill color to a shape SVG by wrapping in a colored <g> */
function coloredShape(shapeSvg: string, hex: string): string {
  return `<g style="color:${hex}">${shapeSvg}</g>`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const PouchAvatar = React.memo(function PouchAvatar({
  shape,
  color,
  expression,
  accessory,
  background,
  size = 80,
  className,
}: PouchAvatarProps) {
  const svgContent = useMemo(() => {
    const layers: string[] = [];

    // Layer 1: background
    if (background?.svg_data) {
      layers.push(wrapGradient(background.svg_data));
    }

    // Layer 2: shape (with color fill applied)
    if (shape?.svg_data) {
      const hex = color?.svg_data ?? '#cccccc';
      layers.push(coloredShape(shape.svg_data, hex));
    }

    // Layer 3: expression
    if (expression?.svg_data) {
      layers.push(expression.svg_data);
    }

    // Layer 4: accessory
    if (accessory?.svg_data) {
      layers.push(accessory.svg_data);
    }

    return layers.join('\n');
  }, [shape, color, expression, accessory, background]);

  return (
    <svg
      width={size}
      height={Math.round(size * 0.8)}
      viewBox="0 0 100 80"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('overflow-visible', className)}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
});
