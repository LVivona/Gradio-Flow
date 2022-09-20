import React from "react"
import { Handle, Position } from "react-flow-renderer"
import {TbResize} from 'react-icons/tb'
import {BiCube, BiRefresh} from 'react-icons/bi'
import {BsTrash, BsArrowDownRightSquare} from 'react-icons/bs'
import {CgLayoutGridSmall} from 'react-icons/cg'
import '../../css/counter.css'

const MINIMUM_HEIGHT = 600;
const MINIMUM_WIDTH = 540; 
export default class CustomNodeIframe extends React.Component {
    constructor({id , data}){
      super()
      this.myRef = React.createRef()
      this.original_width = 0;
      this.original_height = 0;
      this.original_x = 0;
      this.original_y = 0;
      this.original_mouse_x = 0;
      this.original_mouse_y = 0;
      this.state = {
        id : id,
        reachable : this.isFetchable(data.host),
        selected : false,
        data : data,
        width : 540,
        height : 600,
        size : false,
        iframe : 0,
      }
 
    }

    handelSelected = () => {
      this.setState(prevState => ({'selected' : !prevState.selected, 'size' : false }))
    }

    handelSizeState = () => {
        this.setState(prevState => ({'size' : !prevState.size}))
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
        this.setState(prevState => ({'iframe' : prevState.iframe + 1}))
      }
    }

    handelOnChange(evt, type){
      this.setState({[`${type}`] : parseInt(evt.target.value) })
      type === "width" ? this.myRef.current.style.width = `${parseInt(evt.target.value)}px` : this.myRef.current.style.height = `${parseInt(evt.target.value)}px` 
    }

    handelSize(evt, increment, change){
      if (evt === "increment") {
        this.setState({[`${change}`] :  change === "width" ? this.state.width + increment : this.state.height + increment })
        change === "width" ? this.myRef.current.style.width = `${this.state.width + increment}px` : this.myRef.current.style.height = `${this.state.height + increment}px` 
      }

    }
    
    //resize nodes by dragging
    initial = (e) => {
      this.original_width = this.myRef.current.offsetWidth
      this.original_height = this.myRef.current.offsetHeight

      this.original_x = this.myRef.current.getBoundingClientRect().left;
      this.original_y = this.myRef.current.getBoundingClientRect().top;

      this.original_mouse_x = e.clientX
      this.original_mouse_y = e.clientY
    }

    resize = (e, point) => {
      var height = 0;
      var width = 0;
      // e.dataTransfer.setDragImage(new Image(), 0, 0)
      if (point === 'bottom-right'){
        width = this.original_width + (e.clientX - this.original_mouse_x);
        height = this.original_height + (e.clientY - this.original_mouse_y)
        if (width > MINIMUM_WIDTH) {
          this.myRef.current.style.width = `${width}px`
          this.setState({'width' :  parseInt(width) , 'height' : parseInt(height)})

        }
        if (height > MINIMUM_HEIGHT) {
          this.myRef.current.style.height = `${height}px`
          this.setState({'width' :  parseInt(width) , 'height' : parseInt(height)})

        }
      } 
    }

    OnDragEnd = () => {
      this.setState({'width' : parseInt(this.myRef.current.offsetWidth), 'height' : parseInt(this.myRef.current.offsetHeight)})
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
                  <div className=" flex w-full h-10 top-0 cursor-pointer" onClick={this.handelEvent}>
                  <div title={this.state.selected ? "Collaspse Node" : "Expand Node"} className=" duration-300 cursor-pointer shadow-xl border-2 border-white h-10 w-10 mr-2 -mt-3 bg-Warm-Blue rounded-xl" onClick={this.handelSelected}><CgLayoutGridSmall className="h-full w-full text-white p-1"/></div>

    
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
                
                  <div id={`draggable`} className={`relative overflow-hidden m-0 p-0 shadow-2xl ${this.state.selected ? "w-[540px] h-[600px]" : "hidden"} duration-200`} ref={this.myRef}>

                    <div className={`absolute p-5 h-full w-full ${this.state.data.colour} shadow-2xl rounded-xl -z-20`}></div>
                                        <iframe 
                        id="iframe" 
                        key={this.state.iframe}
                        src={this.state.data.host} 
                        title={this.state.data.label}
                        frameBorder="0"
                        className="p-2 -z-10 h-full w-full ml-auto mr-auto overflow-y-scroll" 
                        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
                        ></iframe>
                  </div>
                  
                  {/*Input*/}
                  <Handle type="target"
                          id="input"
                          position={Position.Left}
                          style={!this.state.selected ? 
                                {"paddingRight" : "5px" , "marginTop" : "15px", "height" : "25px", "width" : "25px",  "borderRadius" : "3px", "zIndex" : "10000", "background" : "white", "boxShadow" : "3px 3px #888888"}
                                :{"paddingRight" : "5px" ,"height" : "25px", "width" : "25px",  "borderRadius" : "3px", "zIndex" : "10000", "background" : "white", "boxShadow" : "3px 3px #888888"}}
                          />
                  
                  {/*Output*/}
                  <Handle type="source" id="output" position={Position.Right} style={ !this.state.selected ?
                      {"paddingLeft" : "5px", "marginTop" : "15px" ,"height" : "25px", "width" : "25px",  "borderRadius" : "3px", "zIndex" : "10000", "background" : "white", "boxShadow" : "3px 3px #888888"}
                      : {"paddingLeft" : "5px", "marginTop" : "0px" ,"height" : "25px", "width" : "25px",  "borderRadius" : "3px", "zIndex" : "10000", "background" : "white", "boxShadow" : "3px 3px #888888"}}/>

                  {
                    !this.state.selected &&
                    <div 
                    id={`draggable`}
                    className={` w-[340px] h-[140px]  text-white text-md flex flex-col text-center items-center cursor-grab shadow-lg
                                 p-5 px-2 rounded-md hover:animate-pulse break-all -z-20 ${this.state.data.colour}`}>

                    <div  className="absolute text-6xl opacity-60 z-10 pt-8 ">{this.state.data.emoji}</div>    
                    <h2 className={`max-w-full font-sans text-blue-50 leading-tight font-bold text-3xl flex-1 z-20 pt-10`} style={{"textShadow" : "0px 1px 2px rgba(0, 0, 0, 0.25)"}} >{this.state.data.label}</h2>
                    </div >     
                  }
                  { this.state.size && !navigator.userAgent.match(/firefox|fxios/i)  && <>
                  
                  <div id="remove-ghost" className={`absolute select-none -bottom-0 right-0 w-5 h-5border-2 shadow-2xl rounded-xl z-10 cursor-nwse-resize hover:opacity-50  `}
                       style={{"userDrag": "none"}} 
                         draggable
                         onDragStart={(e) => { this.initial(e) }}
                         onDrag={(e) => { this.resize(e, 'bottom-right') }}
                         onDragEnd={() => {this.OnDragEnd()}}
                         >
                          <BsArrowDownRightSquare className=" text-selected-text text-2xl bg-white"/>
                          </div> 
  
                      </>
                  }
                

        </>)
    }
}