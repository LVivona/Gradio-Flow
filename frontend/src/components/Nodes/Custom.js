import React from "react"
import {TbResize} from 'react-icons/tb'
import {BiCube, BiRefresh} from 'react-icons/bi'
import {BsTrash} from 'react-icons/bs'
import {CgLayoutGridSmall} from 'react-icons/cg'
import '../../css/counter.css'

export default class CustomNodeIframe extends React.Component {
    constructor({id , data}){
      super()
      this.myRef = React.createRef()
      this.state = {
        id : id,
        reachable : this.isFetchable(data.host),
        selected : true,
        data : data,
        width : 540,
        height : 600,
        size : false,
        iframe : 0,
        initial_pos : 0,
        initial_size : 0, 
      }
 
    }

    handelSelected = () => {
      this.setState({id : this.state.id, reachable : this.state.reachable, selected : !this.state.selected, data : this.state.data, width : this.state.width, height : this.state.height, size : this.state.size, iframe : this.state.iframe, initial_pos : this.state.initial_pos, initial_size : this.state.initial_size})
    }

    handelSizeState = () => {
        this.setState({id : this.state.id, reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width : this.state.width, height : this.state.height, size : !this.state.size, iframe : this.state.iframe, initial_pos : this.state.initial_pos, initial_size : this.state.initial_size})
      }

    isFetchable = async (host) => {

      fetch(host, {mode: 'no-cors'}).then((re) => {
        return true
      }).catch((err)=>{
        return false
      })
      return false
    }


    onNodeClick = (id) => {
      this.state.data.delete(id)
    }

    onRefresh(){
      if(!this.isFetchable(this.state.data.host)){ 
        this.onNodeClick(this.state.id)
      } else{
        this.setState({id : this.state.id, reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width : this.state.width, height : this.state.height, size : this.state.size, iframe : this.state.iframe + 1, initial_pos : this.state.initial_pos, initial_size : this.state.initial_size})
      }
    }

    handelOnChange(evt, type){
      this.setState({id : this.state.id, reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width :  type === "width" ? parseInt(evt.target.value) : this.state.width, height : type === "height" ? parseInt(evt.target.value) : this.state.height, size : this.state.size, iframe : this.state.iframe, initial_pos : this.state.initial_pos, initial_size : this.state.initial_size})
        type === "width" ? this.myRef.current.style.width = `${parseInt(evt.target.value)}px` : this.myRef.current.style.height = `${parseInt(evt.target.value)}px` 
    }

    handelSize(evt, increment, change){
      if (evt === "increment") {
        this.setState({id : this.state.id, reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width :  change === "width" ? this.state.width + increment : this.state.width, height : change === "height" ? this.state.height + increment : this.state.height, size : this.state.size, iframe : this.state.iframe, initial_pos : this.state.initial_pos, initial_size : this.state.initial_size})
        change === "width" ? this.myRef.current.style.width = `${this.state.width + increment}px` : this.myRef.current.style.height = `${this.state.height + increment}px` 
      }

    }
    
    //(Experimental) resize nodes by dragging
    initial = (e) => {
      this.setState({id : this.state.id, reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width : this.state.width, height : this.state.height , size : this.state.size, iframe : this.state.iframe, initial_pos :  e.clientY, initial_size : this.myRef.current.offsetHeight })
    }

    resize = (e) => {
      var new_height = parseInt(this.state.initial_size) + parseInt(e.clientY - this.state.initial_pos)
      this.setState({id : this.state.id, reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width :  this.state.width, height : new_height, size : this.state.size, iframe : this.state.iframe, initial_pos : this.state.initial_pos, initial_size : this.state.initial_size})
      this.myRef.current.style.height = `${new_height}px`
    }

    Counter(focus, size){
      return (<div className="custom-number-input h-10 w-32 dark:text-white text-black ">
                <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                  <button data-action="decrement" className=" border-2 border-dotted border-Retro-dark-blue hover:border-rose-700 rounded-l-xl hover:animate-pulse h-full w-20 cursor-pointer outline-none " onClick={(e)=> {this.handelSize("increment", -5, focus)}}>
                    <span className="m-auto text-2xl font-bold">−</span>
                  </button>
                  <input type="number" className="focus:outline-none border-Retro-dark-blue border-y-2 border-dotted text-center w-full font-semibold text-md focus:from-fuchsia-200 md:text-basecursor-default flex items-cente outline-none bg-transparent" name="input-number" value={size} onChange={(e) => this.handelOnChange(e, focus)} onKeyDown={(e) => {this.handelSize(e.key, size, focus)}}></input>
                  <button data-action="increment" className="border-2 border-dotted border-Retro-dark-blue hover:border-green-400 rounded-r-xl hover:animate-pulse h-full w-20  cursor-pointer" onClick={(e)=> {this.handelSize("increment", 5, focus)}} >
                    <span className="m-auto text-2xl font-bold">+</span>
                  </button>
                </div>
              </div>)
    }
        
    render(){
      if (!this.state.reachable) {this.onNodeClick(this.state.id) }
      return (<>
                <>
                  <div className=" flex w-full h-10 top-0 cursor-pointer" onClick={this.handelEvent}>
                  <div title="Collaspse Node" className=" duration-300 cursor-pointer shadow-xl border-2 border-white h-10 w-10 mr-2 -mt-3 bg-Warm-Blue rounded-xl" onClick={this.handelSelected}><CgLayoutGridSmall className="h-full w-full text-white p-1"/></div>

    
                    <div className={` flex ${this.state.selected ? '' : 'w-0 hidden'}`}>
                      <div title="Adjust Node Size" className="duration-300 cursor-pointer shadow-xl border-2 dark:border-white border-white h-10 w-10 mr-2 -mt-3 bg-Warm-Violet rounded-xl" onClick={this.handelSizeState}><TbResize className="h-full w-full text-white p-1"/></div>
                      <a href={this.state.data.host} target="_blank" rel="noopener noreferrer"><div title="Gradio Host Site" className="duration-300 cursor-pointer shadow-xl border-2 dark:border-white border-white h-10 w-10 mr-2 -mt-3 bg-Warm-Pink rounded-xl"><BiCube className="h-full w-full text-white p-1"/></div></a>
                      <div title="Delete Node" className="duration-300 cursor-pointer shadow-xl border-2 dark:border-white border-white h-10 w-10 mr-2 -mt-3 bg-Warm-Red rounded-xl" onClick={() => this.onNodeClick(this.state.id)}><BsTrash className="h-full w-full text-white p-1"/></div>
                      <div title="Refresh Node" className="duration-300 cursor-pointer shadow-xl border-2 dark:border-white border-white h-10 w-10 mr-2 -mt-3 bg-Warm-Orange rounded-xl" onClick={() => this.onRefresh()}><BiRefresh className="h-full w-full text-white p-1"/></div>

                      { this.state.size && <div className="duration-300 flex w-auto h-full  mr-2 -mt-3 space-x-4">
                        {this.Counter("width", this.state.width)}
                        {this.Counter("height", this.state.height)}
                      </div>}
                    </div>
                  
                  </div>               
                
                  <div id="draggable" className={`relative w-[540px] h-[600px] overflow-hidden m-0 p-0 shadow-2xl`} ref={this.myRef}>
                    <div className={`absolute h-full w-full ${this.state.data.colour} border-1 shadow-2xl rounded-xl -z-20`}></div>
                    <iframe 
                        id="iframe" 
                        key={this.state.iframe}
                        src={this.state.data.host} 
                        title={this.state.data.label} 
                        frameBorder="0" 
                        className=" -z-10 container h-full p-2 flex-grow space-iframe overflow-scroll " 
                        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"></iframe>
                  </div>
                  {/* (Experimental) Do not uncomment */}
                   <div className={`absolute bottom-0 w-full h-10 bg-transparent border-1 shadow-2xl rounded-xl z-10 cursor-ns-resize`} 
                       draggable
                       onDragStart={(e) => { this.initial(e) }}
                       onDrag={(e) => { this.resize(e) }}
                       ></div> 
                </>
        </>)
    }
}
