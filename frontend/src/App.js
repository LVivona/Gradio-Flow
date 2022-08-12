import ReactEnviorment from './Components/ReactFlow/ReactFlowEnv'
import { useState } from 'react'
import { useThemeDetector } from './helper/visual'
 


export default function App() {
  const [theme, setTheme] = useState(useThemeDetector)
  return(
      <>
        
        <div className=' absolute top-4 right-5 z-50' >
          <h1 className='text-3xl' onClick={()=> setTheme(theme === "" ? "dark" : "")}>{theme  ? '🌙' : '☀️'}</h1>  
        </div>

        <ReactEnviorment theme={theme ? 'dark' : ''}/>
      </>
      
  )
};
