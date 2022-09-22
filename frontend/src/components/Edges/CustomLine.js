import React from 'react';
import { getBezierPath } from 'react-flow-renderer';

const CustomLine = ({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  connectionLineType,
  connectionLineStyle,
}) => {

    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
  return (
    <g>
      <path
        fill="none"
        stroke="#00FF4A"
        strokeWidth={7}
        className="animated"
        d={edgePath}
      />
    </g>
  );
};

export default CustomLine;