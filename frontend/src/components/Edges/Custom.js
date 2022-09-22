import React from 'react';
import {BiX} from 'react-icons/bi'
import { getBezierPath, getEdgeCenter } from 'react-flow-renderer';

import '../../css/dist/output.css';

const foreignObjectSize = 40;

const onEdgeClick = (evt, id) => {
  evt(id)
};

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={{stroke : "#00FF4A", strokeWidth : "6"}}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={200}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
          <div className=" flex w-10 h-10 dark:bg-black bg-white border-2 rounded-xl hover:shadow-lg text-center duration-200" onClick={() => onEdgeClick(data.delete, id)}>
            <BiX className=' flex-1 w-9 h-9 text-black dark:text-white'/>
          </div>
      </foreignObject>
    </>
  );
}
