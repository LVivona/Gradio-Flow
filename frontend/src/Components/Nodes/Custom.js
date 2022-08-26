import React from "react"

export default class CustomNodeIframe extends React.Component {
    constructor({data}){
      super()
      this.myRef = React.createRef()
      this.state = {
        reachable : true,
        selected : true,
        data : data
      }
    }

    handelSelected = () => {
      fetch(this.state.data.host, {mode: 'no-cors'}).then((re) => {
        this.setState({reachable : true, selected : !this.state.selected, data : this.state.data})
      }).catch(()=>{
        this.setState({reachable : false, selected : !this.state.selected, data : this.state.data})
      })
    }

    handelEvent = (e) => {
      console.log(e.type)
      if(e.type === "mousedown"){
        console.log("down")
      }
      else {
        console.log("up")
      }


    }


    render(){
      
      return (
        <>
        { this.state.selected && this.state.reachable ? 
                <>
                <div className="w-full h-10 top-0 hover:bg-black" onClick={this.handelEvent} onMouseDown={this.handelEvent} onMouseUp={this.handelEvent}>
                  
                </div>               

                <div className='relative h-[540px] w-[600px] overflow-hidden m-0 p-0 shadow-2xl' onClick={()=>this.handelSelected()}>
                  <div className={`absolute h-full w-full ${this.state.data.colour} border-1shadow-2xl shadow-black rounded-xl -z-20`}></div>
                  <iframe 
                      id="iframe"
                      ref={this.myRef} 
                      src={this.state.data.host} 
                      title={this.state.data.label} 
                      frameBorder="0" className=" -z-10 container h-full p-2 flex-grow space-iframe overflow-scroll " allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; document-domain; encrypted-media; fullscreen; geolocation; gyroscope; layout-animations; legacy-image-formats; magnetometer; microphone; midi; oversized-images; payment; picture-in-picture; publickey-credentials-get; sync-xhr; usb; vr ; wake-lock; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"></iframe>
                </div>
                </> :
        <>
        <div className='break-words'> 
          <div className=' h-auto text-center pointer-events-none'>  
            <div className='hexagon pointer-events-auto break-words text-center hover:animate-pulse dark:bg-black dark:text-white' onClick={()=>this.handelSelected()} >
            <p className='z-50 pointer-events-none break-words font-sans font-bold'>{this.state.data.label}</p>
            </div>
          </div>
        </div>
        </> }
      
      </>
      )
    }

  }
  