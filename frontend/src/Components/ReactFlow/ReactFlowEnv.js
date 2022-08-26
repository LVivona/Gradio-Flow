import CustomNodeIframe from "../Nodes/Custom.js";
import '../../css/dist/output.css'
import '../../css/CustomNode.css'
import ReactFlow, { Background,
                    applyNodeChanges,
                    applyEdgeChanges,
                    ReactFlowProvider,
                    } from 'react-flow-renderer';
import React ,{ useState, useCallback, useRef } from 'react';
import Navbar from '../Navagation/navbar';
import { useThemeDetector } from '../../helper/visual'
 
const types = {
    custom : CustomNodeIframe,
  }

export default function ReactEnviorment() {

    const [theme, setTheme] = useState(useThemeDetector())
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const reactFlowWrapper = useRef(null);



    const onNodesChange = useCallback(
      (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
      [setNodes]
    );
  
    const onEdgesChange = useCallback(
      (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
      [setEdges]
    );
  
    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const deleteNode = (id) =>{setNodes((nds) => nds.filter(n => n.id !== id ))}

    const onDrop = useCallback(
      (event) => {
        event.preventDefault();
  
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const host = event.dataTransfer.getData('application/host');
        const name = event.dataTransfer.getData('application/name');
        const colour = event.dataTransfer.getData('application/colour');
        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }
  
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
          id: `${name}-${nodes.length}`,
          type,
          position,
          data: { label: `${name}`, host : `${host}`, colour : `${colour}`, delete : deleteNode },
        };
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance, nodes]);

    return (
      <>          
        <div className=' absolute top-4 right-5 z-50' onClick={()=> setTheme(!theme)}>
          <h1 className='text-4xl select-none' >{theme  ? '🌙' : '☀️'}</h1>  
        </div>
        <div className={`flex h-screen w-screen ${theme ? "dark" : ""} transition-all`}>
          <Navbar/>
          <ReactFlowProvider>
            <div className="h-screen w-screen" ref={reactFlowWrapper}>
              <ReactFlow nodes={nodes} edges={edges} nodeTypes={types} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodesDelete={deleteNode} onDragOver={onDragOver} onDrop={onDrop} onInit={setReactFlowInstance}  fitView>
              <Background variant='dots' size={1} className=" bg-white dark:bg-neutral-800"/>
            </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
      </>
    );
  }
