import CustomNodeIframe from "../Nodes/Custom.js";
import '../../css/dist/output.css'
import ReactFlow, { Background,
                    applyNodeChanges,
                    ReactFlowProvider,
                    } from 'react-flow-renderer';
import React ,{ useState, useCallback, useRef, useEffect } from 'react';
import Navbar from '../Navagation/navbar';
import { useThemeDetector } from '../../helper/visual'
 
const types = {
    custom : CustomNodeIframe,
  }

export default function ReactEnviorment() {

    const [theme, setTheme] = useState(useThemeDetector)
    const [nodes, setNodes] = useState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const reactFlowWrapper = useRef(null);


    useEffect(() => {
      const restore = () => {
      const flow = JSON.parse(localStorage.getItem('flowkey'));
        
        if(flow){
          flow.nodes.map((nds) => {
            nds.data.delete = deleteNode
          })
          setNodes(flow.nodes || [])

        }
      }
      restore()
    },[])


    const onNodesChange = useCallback(
      (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
      [setNodes]
    );
  
  
    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const deleteNodeContains = (id) =>{setNodes((nds) => nds.filter(n => !n.id.includes(`${id}-`) ))}
    const deleteNode = (id) =>{setNodes((nds) => nds.filter(n => n.id !== id ))}
    
    const onSave = useCallback(() => {
      if (reactFlowInstance) {
        alert("Saved")
        const flow = reactFlowInstance.toObject();
        localStorage.setItem('flowkey', JSON.stringify(flow));
        var labels = [];
        var colour = [];
        var emoji = [];
          for(let i = 0; i < flow.nodes.length; i++){
            if (!labels.includes(flow.nodes[i].data.label))
              colour.push(flow.nodes[i].data.colour)
              emoji.push(flow.nodes[i].data.emoji)
              labels.push(flow.nodes[i].data.label)
          }
        localStorage.setItem('colour',JSON.stringify(colour))
        localStorage.setItem('emoji', JSON.stringify(emoji))
      }
    }, [reactFlowInstance]);


    const onDrop = useCallback(
      (event) => {
        event.preventDefault();

        if(event.dataTransfer.getData('application/reactflow')  !== ""){
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const type = event.dataTransfer.getData('application/reactflow');
          const item  = JSON.parse(event.dataTransfer.getData('application/item'));
          const style = JSON.parse(event.dataTransfer.getData('application/style'));
          // check if the dropped element is valid
          if (typeof type === 'undefined' || !type) {
            return;
          }
    
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          const newNode = {
            id: `${item.name}-${nodes.length+1}`,
            type,
            position,
            dragHandle : `#draggable`,
            data: { label: `${item.name}`, host : `${item.host}`, colour : `${style.colour}`, emoji : `${style.emoji}`, delete : deleteNode },
          };

          setNodes((nds) => nds.concat(newNode));
      }
      },
      [reactFlowInstance, nodes]);

    return (
      <>          
        <div className=' absolute top-4 right-5 z-50 cursor-default select-none text-4xl ' >
          <h1 title={theme ? 'Dark Mode' : 'Light Mode'} onClick={() => setTheme(!theme)} >{theme  ? '🌙' : '☀️'}</h1> 
          <h1 title="Save" className=" pt-5" onClick={() => onSave()}>💾</h1> 
        </div>
        <div className={`flex h-screen w-screen ${theme ? "dark" : ""} transition-all`}>
          <Navbar onDelete={deleteNodeContains} colour={JSON.parse(localStorage.getItem('colour'))} emoji={JSON.parse(localStorage.getItem('emoji'))}/>
          <ReactFlowProvider>
            <div className="h-screen w-screen" ref={reactFlowWrapper}>
              <ReactFlow nodes={nodes} nodeTypes={types} onNodesChange={onNodesChange} onNodesDelete={deleteNode} onDragOver={onDragOver} onDrop={onDrop} onInit={setReactFlowInstance}  fitView>
              <Background variant='dots' size={1} className=" bg-white dark:bg-neutral-800"/>
            </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
      </>
    );
  }
