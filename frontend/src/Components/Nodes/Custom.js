import React from "react"
import {TbResize} from 'react-icons/tb'
import {BiCube} from 'react-icons/bi'
import {BsTrash} from 'react-icons/bs'
import {CgLayoutGridSmall} from 'react-icons/cg'
import '../../css/counter.css'
export default class CustomNodeIframe extends React.Component {
    constructor({id , data}){
      super()
      this.myRef = React.createRef()
      this.id = id
      this.state = {
        reachable : this.handelFetch,
        selected : true,
        data : data,
        width : 600,
        height : 540,
        size : false
      }
 
    }

    handelSelected = () => {
      this.setState({reachable : this.state.reachable, selected : !this.state.selected, data : this.state.data, width : this.state.width, height : this.state.height, size : this.state.size})
    }

    handelFetch = () => {
      fetch(this.state.data.host, {mode: 'no-cors'}).then((re) => {
        this.setState({reachable : true, selected : this.state.selected, data : this.state.data, width : this.state.width, height : this.state.height, size : this.state.size})
      }).catch(()=>{
        this.setState({reachable : false, selected : this.state.selected, data : this.state.data, width : this.state.width, height : this.state.height, size : this.state.size})
      })
    }

    handelSizeState = () => {
      this.setState({reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width : this.state.width, height : this.state.height, size : !this.state.size})
    }

    onNodeClick = (id) => {
      this.state.data.delete(id)
    }

    handelOnChange(evt, type){
      this.setState({reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width :  type === "width" ? parseInt(evt.target.value) : this.state.width, height : type === "height" ? parseInt(evt.target.value) : this.state.height, size : this.state.size})

    }

    handelSize(evt, increment, change){
      console.log(evt,increment)
      if (evt === "Enter"){
        this.setState({reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width :  change === "width" ? increment : this.state.width, height : change === "height" ? increment : this.state.height, size : this.state.size})
        change === "width" ? this.myRef.current.style.width = `${increment}px` : this.myRef.current.style.height = `${increment}px` 
      } else if (evt === "increment") {
        this.setState({reachable : this.state.reachable, selected : this.state.selected, data : this.state.data, width :  change === "width" ? this.state.width + increment : this.state.width, height : change === "height" ? this.state.height + increment : this.state.height, size : this.state.size})
        change === "width" ? this.myRef.current.style.width = `${parseInt(this.state.width) + increment}px` : this.myRef.current.style.height = `${parseInt(this.state.height) + increment}px` 
      }

    }

    Counter(focus, count){
      return (<div className="custom-number-input h-10 w-32 dark:text-white text-black ">
                <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                  <button data-action="decrement" className=" border-2 border-dotted border-fuchsia-300 hover:border-rose-600 rounded-l-xl hover:animate-pulse h-full w-20 cursor-pointer outline-none " onClick={(e)=> {this.handelSize("increment", -5, focus)}}>
                    <span className="m-auto text-2xl font-bold">−</span>
                  </button>
                  <input type="number" className="outline-none focus:outline-none border-fuchsia-300 border-y-2 border-dotted text-center w-full font-semibold text-md focus:from-fuchsia-200 md:text-basecursor-default flex items-cente outline-none bg-transparent" name="input-number" value={count} onChange={(e) => this.handelOnChange(e, focus)} onKeyDown={(e) => {this.handelSize(e.key, count, focus)}}></input>
                  <button data-action="increment" className="border-2 border-dotted border-fuchsia-300 hover:border-Green-Emerald rounded-r-xl hover:animate-pulse h-full w-20  cursor-pointer" onClick={(e)=> {this.handelSize("increment", 5, focus)}} >
                    <span className="m-auto text-2xl font-bold">+</span>
                  </button>
                </div>
              </div>)
    }
    
    render(){
      return (<>
        { this.state.reachable &&
                <>
                  <div className=" flex w-full h-10 top-0 cursor-pointer" onClick={this.handelEvent}>
                  <div title="Collaspse Node" className=" duration-300 cursor-pointer shadow-xl border-2 dark:border-white border-black h-10 w-10 mr-2 -mt-3 bg-Warm-Blue rounded-xl" onClick={this.handelSelected}><CgLayoutGridSmall className="h-full w-full text-white p-1"/></div>

                   
                    <div className={` flex ${this.state.selected ? '' : 'w-0 hidden'}`}>
                      <div title="Adjust Node Size" className="duration-300 cursor-pointer shadow-xl border-2 dark:border-white border-black h-10 w-10 mr-2 -mt-3 bg-Warm-Violet rounded-xl" onClick={this.handelSizeState}><TbResize className="h-full w-full text-white p-1"/></div>
                      <a href={this.state.data.host} target="_blank" rel="noopener noreferrer"><div title="Gradio Host Site" className="duration-300 cursor-pointer shadow-xl border-2 dark:border-white border-black h-10 w-10 mr-2 -mt-3 bg-Warm-Pink rounded-xl"><BiCube className="h-full w-full text-white p-1"/></div></a>
                      <div title="Delete Node" className="duration-300 cursor-pointer shadow-xl border-2 dark:border-white border-black h-10 w-10 mr-2 -mt-3 bg-Warm-Red rounded-xl" onClick={() => this.onNodeClick(this.id)}><BsTrash className="h-full w-full text-white p-1"/></div>
                    
                      { this.state.size && <div className="duration-300 flex w-[60%] h-full  mr-2 -mt-3 space-x-4">
                        {this.Counter("width", this.state.width)}
                        {this.Counter("height", this.state.height)}
                      </div>}
                    </div>
                  
                  </div>               
                
                  <div className={`relative w-[${this.state.width}px] h-[${this.state.height}px] overflow-hidden m-0 p-0 shadow-2xl`} ref={this.myRef}>
                    <div className={`absolute h-full w-full ${this.state.data.colour} border-1shadow-2xl shadow-black rounded-xl -z-20`}></div>
                    <iframe 
                        id="iframe" 
                        src={this.state.data.host} 
                        title={this.state.data.label} 
                        frameBorder="0" className=" -z-10 container h-full p-2 flex-grow space-iframe overflow-scroll " allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; document-domain; encrypted-media; fullscreen; geolocation; gyroscope; layout-animations; legacy-image-formats; magnetometer; microphone; midi; oversized-images; payment; picture-in-picture; publickey-credentials-get; sync-xhr; usb; vr ; wake-lock; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"></iframe>
                  </div>
                </>
        } </>)
    }
}