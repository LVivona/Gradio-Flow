import { Modal, Icon, Message} from 'semantic-ui-react'
import "../../css/dist/output.css"
import {ReactComponent as Gradio} from '../../images/gradio.svg'
import {ReactComponent as Streamlit} from '../../images/streamlit.svg'
import {ReactComponent as Exit} from '../../images/exit.svg'
import { useState } from 'react'
import {BsSearch} from 'react-icons/bs';

export default function Import(props){
    const [tab, setTab] = useState("gradio")
    const [subTab, setSubTab] = useState(0)

    return (<div>
        <Modal
            basic
            className=''
            open={props.open}
            size='fullscreen'
            >
                <div className='w-full shadow-lg rounded-lg'>
                    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-100 rounded-t-lg border-gray-200 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800" id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
                        <li className="" onClick={()=>{
                            setTab("gradio") 
                            props.catch ? props.handelError(false) : props.handelError(props.catch)  }}>
                            <button id="gradio-tab" data-tabs-target="#Gradio" type="button" role="tab" aria-controls="gradio" aria-selected={tab === "gradio" ? "true" : "false"} className={`inline-block p-4 rounded-tl-lg ${ tab === "gradio" ? 'bg-gray-200'  : 'hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 focus:bg-gray-700'}`}><Gradio className=" w-20 h-10"/></button>
                        </li>
                        <li className="" onClick={()=>{
                            setTab("streamlit")
                            props.catch ? props.handelError(false) : props.handelError(props.catch) }}>
                            <button id="services-tab" data-tabs-target="#Streamlit" type="button" role="tab" aria-controls="services" aria-selected="false" className={`inline-block p-4 rounded-tl-lg ${ tab === "streamlit" ? 'bg-gray-200'  : 'hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 focus:bg-gray-700'}`}><Streamlit className=" w-20 h-10"/></button>
                        </li>
                    </ul>
                    <div className='absolute right-5 top-5 z-20 mr-5'
                         onClick={()=>{
                            props.quitHandeler(false)
                            props.catch ? props.handelError(false) : props.handelError(props.catch) }}>
                        <button type="button"
                                className=" bg-neutral-300 rounded-2xl p-2 inline-flex items-center justify-center dark:bg-neutral-700 hover:opacity-70 focus:outline-none">
                        <Exit className=" w-[20px] h-[20px] text-gray-400 dark:text-white"/>
                        </button>
                    </div> 
                </div>
                    { tab === "gradio" &&
                        <div className='w-full bg-white'>
                        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-200 border-gray-200 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800" id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
                            <li className="" onClick={()=>{
                                setSubTab(0)
                                props.catch ? props.handelError(false) : props.handelError(props.catch) }}>
                                <button id="local-sub-tab" data-tabs-target="#local" type="button" role="tab" aria-controls="local-gradio" aria-selected={tab === "gradio" ? "true" : "false"} className={`inline-block p-4 px-6 text-base font-sans font-bold ${subTab === 0 ? 'bg-gray-300' : '' } hover:bg-gray-300 `}>Local</button>
                            </li>
                            <li className="" onClick={()=>{
                                setSubTab(1)
                                props.catch ? props.handelError(false) : props.handelError(props.catch) }}>
                            <button id="shared-sub-tab" data-tabs-target="#Gradio" type="button" role="tab" aria-controls="shared-gradio" aria-selected={tab === "gradio" ? "true" : "false"} className={`inline-block p-4 px-6 text-base font-sans font-bold  ${subTab === 1 ? 'bg-gray-300' : '' }  hover:bg-gray-300  `}>Shared</button>
                            </li>
                        </ul>
                        {subTab === 0 && <Local/>}
                        {subTab === 1 && <Shared type="gradio" textHandler={props.textHandler} appendHandler={props.appendHandler} handelError={props.handelError} catch={props.catch}/>}

                        {props.catch && <div className='p-5'>
                                        <Message floating negative>
                                        <Message.Header className=" text-lg text-center">🚫 Something went wrong...</Message.Header>
                                            <br/>
                                            <h1 className=" underline pb-3 font-bold text-lg">🤔 Possible Things That could of happen <br/></h1>
                                            <ul className="font-bold">
                                                    <li key={"error_1"}>- The input was empty</li>
                                                    <li key={"error_2"}>- The connection was forbidden</li>
                                                    <li key={"error_3"}>- The name was already taken</li>
                                                    <li key={"error_4"}>- The link you gave did not pass the regex</li>
                                                    <ul className="px-6">
                                                        <li key={"error_5"}>- http://localhost:xxxx</li>
                                                        <li key={"error_6"}>- http://xxxxx.gradio.app</li>
                                                        <li key={"error_7"}>- https://hf.space/embed/$user/$space_name/+</li>
                                                    </ul>
                                                    <li>- link already exist within the menu</li>
                                                </ul>
                        
                                        </Message>
                                        </div>}
                        </div> 
                    }
                    { tab === "streamlit" && 
                    <div className='w-full bg-white'>
                        <Shared type="streamlit" textHandler={props.textHandler} appendHandler={props.appendHandler} handelError={props.handelError} catch={props.catch}/>
                    </div>
                    }

                </Modal>
    </div>)
}

function Local(props){
    return (
        <div className='p-5'>
        <Message floating>
            
            <Message.Header>🏗️ Comming soon...</Message.Header> 
            <Message.Content className='p-5'>
            This tab will allow you grab your function from a given directory and build
            your own tabular module gradio functions
            </Message.Content>

        </Message>
        </div>
    )
}

function Shared(props){
    const [preview, setPreview] = useState("")
    const [fetchable, setFetch] = useState(false)

    const isFetchable = async (url) => {
        const pattern = {
            share : /^https?:\/\/*([0-9]{5})*(-gradio)*(.app)?(\/)?$/,
            hugginFace : /^https?:\/\/*(hf.space)\/*(embed)\/*([a-zA-Z0-9+_-]+)\/*([a-zA-Z0-9+_-]+)\/*([+])?(\/)?$/
        } 

        if (!pattern.share.test(url) &&
            !pattern.hugginFace.test(url)){
                setFetch(false)
                return
            }

        
        fetch(url, {mode : "no-cors"}).then((re) => {
            console.log(re)
            if(re.url.includes("http://localhost:3000")){
                setFetch(false)    
            } else { 
                setFetch(true)
                props.catch ? props.handelError(false) : props.handelError(props.catch)  
            }
            
          }).catch((err)=>{
            setFetch(false)
          })
          setFetch(false)
        }
    
    return (
        <div className='w-full shadow-lg' onKeyPress={(e)=>{
            if (e.key.includes("Enter")) props.appendHandler(props.type)
        }}>
            <div className='p-5'>
            <Message floating>            
                         <div className={`flex items-center rounded-md bg-light-white mt-6 border-dashed`}>
                            <label className="relative block w-full p-5 focus:shadow-xl">
                                <span className={`absolute inset-y-0 left-0 flex items-center pl-8`}>
                                    <BsSearch className="block float-left cursor-pointer text-gray-500"/>
                                </span>
                                <input className={`placeholder:italic placeholder:text-slate-400 text-black dark:text-white block w-full border border-slate-300 border-dashed rounded-md py-2 pl-9 pr-3 focus:shadow-xl focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm bg-transparent`}  
                                    placeholder={`URL`}
                                    type="text" name="search"
                                    onChange={(e) => {
                                        props.textHandler(e, "text")
                                        setPreview(e.target.value)
                                         setFetch(isFetchable(e.target.value))
                                    }}
                                    />
                            </label>
                        </div>   
                        { fetchable === true && <div className=' w-full'>
                            <h1 className=' text-xl font-sans font-bold text-center text-black mb-2'> Preview </h1>
                            <div className='p-3 px-1 w-3/4 h-80 bg-gray-200 mr-auto ml-auto rounded-xl'>
                                <div className='w-full h-full overflow-hidden relative -ml-[5px]'>
                                <iframe title='Preview' src={preview} className=' absolute top-0 bottom-0 left-0 -right-[25px] overflow-y-scroll w-full h-full mr-auto ml-auto'/>
                                </div>
                            </div>
                        </div>}
                        <div className={`flex items-center rounded-md bg-light-white dark:bg-[#1b1c1d] mt-6  border-dashed`}>
                    <label className="relative block p-5 w-full focus:shadow-xl">
                        <span className={`absolute inset-y-0 left-0 flex items-center pl-7`}>
                            <Icon className=" text-gray-500 block float-left cursor-pointer mr-2" name="address card"/>
                        </span>
                        <input className={`placeholder:italic placeholder:text-slate-400 text-black dark:text-white block bg-transparent w-full border border-slate-300 border-dashed rounded-md py-2 pl-9 pr-3 focus:shadow-xl focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1  sm:text-sm`} 
                            placeholder={`Name ( > 20 Characters)` }
                            type="text" name="search"
                            autoComplete='off'
                            onChange={(e) => {
                                props.textHandler(e, "name")
                               }}
                            />
                    </label>
                    </div> 
                    <div className=' right-0 ml-5'>
                        <button className="relative inline-flex justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-sans font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                onClick={()=>{props.appendHandler(props.type)}}>
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#1b1c1d] rounded-md group-hover:bg-opacity-0">
                                Enter
                            </span>
                        </button>
                    </div>
                </Message>
                </div>
                </div>  
                         
    )
}