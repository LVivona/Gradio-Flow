import React, { Component } from "react";
import {BsArrowLeftShort, BsSearch} from 'react-icons/bs';
import "../../css/dist/output.css"
import {ReactComponent as ReactLogo} from '../../images/logo.svg'
import { random_colour, random_emoji } from "../../helper/visual";
import { Message, Header, Modal, Button, Icon } from 'semantic-ui-react'

export default class Navbar extends Component{
    constructor(){
        super() 
        this.fetch_classes()
        this.temp_host = 0
    }

    state = {open : true,
        menu : [],
        colour : [],
        text : "",
        name : "",
        emoji : [],
        mode : false,
        modal : false,
        error : false
       }

    async fetch_classes(){
        try {
        setInterval( async () => {
            const menu = []
            await fetch("http://localhost:2000/api/open/ports", { method: 'GET', mode : 'cors',})
                .then(response => response.json())
                .then(data => {
                    for (var i = 0; i < data.length; i++){
                        menu.push(data[i])
                    }
                })
                .catch(error => {console.log(error)})
                
                var diff = menu.length - this.state.menu.length
                if(diff !== 0){
                   this.hanelTabs(menu, diff)
                }
        },1000);    
        }catch(e){
            console.log(e)
        }
    }

    append_gradio = () => {
        // var expression = /((http([s]){0,1}:\/\/){0,1}(localhost|127.0.0.1){1}(([:]){0,1}[\0-9]{4}){0,1}\/{0,1}){1}/g;
        // var regex = new RegExp(expression);
        // if(!this.state.text.match(regex) || (this.state.text === "http://localhost:3001/")){
        //     this.setState({open : this.state.open,
        //                    menu : this.state.menu,
        //                    text: this.state.text,
        //                    name : this.state.name,
        //                    colour : this.state.colour,
        //                    emoji : this.state.emoji,
        //                    error : true,
        //                    modal : this.state.modal })
        //     return
        // }
        
        // if((this.state.text.includes("localhost") || this.state.text.includes("127.0.0.1")) 
        //     && this.state.menu.some(e => e.host === this.state.text)){
        //         this.setState({open : this.state.open,
        //                        menu : this.state.menu,
        //                        text: this.state.text,
        //                        name : this.state.name,
        //                        colour : this.state.colour,
        //                        emoji : this.state.emoji,
        //                        error : true,
        //                        modal : this.state.modal  })

        //         return
            
        // }
        fetch(this.state.text, {method : "GET", mode: 'no-cors'}).then((re) => {
            console.log(re)   
            fetch("http://localhost:2000/api/append/port", {method: 'POST', mode : 'cors', headers : { 'Content-Type' : 'application/json' }, body: JSON.stringify({file : "", kwargs : {}, name : this.state.name === "" ?`temp_class_${this.temp_host++}` : `${this.state.name}`, port: 0 , host : this.state.text}) }).then(resp => {
                this.setState({open : this.state.open,
                               menu : this.state.menu,
                               text: "",
                               name : "",
                               colour : this.state.colour,
                               emoji : this.state.emoji,
                               error : false,
                               modal : false  })

            }).catch(() => this.setState({open : this.state.open,
                                          menu : this.state.menu,
                                          text: this.state.text,
                                          colour : this.state.colour,
                                          emoji : this.state.emoji,    
                                          error : true,
                                          modal : this.state.modal }))
          })
    }

    handelModal = (bool) => {
        this.setState({open : this.state.open,
                       menu : this.state.menu,
                       text: this.state.text,
                       name: this.state.name,
                       colour : this.state.colour,
                       emoji : this.state.emoji, 
                       error : !bool ? false : this.state.error ,
                       modal : bool})
    }


    onDragStart = (event, nodeType, item, index) => {
        console.log(item)
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/host', item.host)
        event.dataTransfer.setData('application/name', item.name)
        event.dataTransfer.setData('application/colour', this.state.colour[index])
        event.dataTransfer.setData('application/item',  JSON.stringify(item))
        
        event.dataTransfer.effectAllowed = 'move';
      };

    onDragDrop = (e) => {
        e.preventDefault();
        var item  = JSON.parse(e.dataTransfer.getData('application/item'));
        fetch("http://localhost:2000/api/remove/port", {method : "POST", mode: 'cors', headers : { 'Content-Type' : 'application/json' }, body: JSON.stringify(item) }).then((re)=>{
        })
    }

    hanelTabs = (e, d) => {

        // if less then 0 we must remove colour's and emoji's
        // get index of the object
        // remove
        var c = []
        var j = []
        if(d < 0){
            var a = this.state.menu.filter(item => !e.includes(item)) // get the items not in menu anymore
            c = this.state.colour
            j = this.state.emoji
            for(var k=0; k < d; k++){
                c.splice(this.state.menu.indexOf(a[k]), 1)
                j.splice(this.state.menu.indexOf(a[k]), 1)
            }
            this.setState({open : this.state.open, menu : e, text: this.state.text, name: this.state.name, colour : c, emoji : j,   error : this.state.error, modal : this.state.modal })
        }else{
            //append new colours
            for(var i =0; i < d; i++){
                c.push(random_colour());
                j.push(random_emoji());
            }
            this.setState({open : this.state.open, menu : e, text: this.state.text, name: this.state.name, colour : this.state.colour.concat(c), emoji : this.state.emoji.concat(j), error : this.state.error, modal : this.state.modal })
        }
    }

    appendTabs = () => {
        this.setState({open : this.state.open, menu : this.state.menu, text: this.state.text, name: this.state.name, colour : [...this.state.colour, random_colour] , emoji : [...this.state.emoji, random_emoji],  error : this.state.error, modal : this.state.modal })
    }

    handelNavbar = () => {
        this.setState({open : !this.state.open, menu : this.state.menu, text: this.state.text, name: this.state.name, colour : this.state.colour, emoji : this.state.emoji,  error : this.state.error, modal : this.state.modal  })
    }

    updateText(e, type){
        this.setState({open : this.state.open, menu : this.state.menu, text: type === "text" ? e.target.value : this.state.text, name: type === "name" ? e.target.value : this.state.name, colour : this.state.colour, emoji : this.state.emoji,  error : this.state.error, modal : this.state.modal  })
    }

    subComponents(item, index){
        

        if (this.state.colour.length === 0 || this.state.emoji.length === 0){
          this.hanelTabs()  
        } 
        return(<>
                <li key={`${item.name}-${item.port}`} onDragStart={(event) => this.onDragStart(event, 'custom', item, index)} 
                    className={` text-white text-md flex text-center items-center cursor-pointer shadow-lg
                                 p-5 px-2 mt-4 ${ this.state.open ? `hover:animate-pulse ${this.state.colour[index] === null ? "" : this.state.colour[index]} ` : `hidden`} rounded-md mt-2 cursor-grabbing`} draggable>
                    <span className="text-2xl font-medium ">            </span>
                    <span className={`text-base font-medium flex-1 text-left" ${this.state.open ? "" : "hidden"}`}>{`${this.state.emoji[index] === null ? "" : this.state.emoji[index]} ${item.name}`}</span>    
                </li >      
        </>)
    }


    render(){
        return (<div>
        
            <div className={`z-10 flex-1 float-left bg-white dark:bg-stone-900 h-screen p-5 pt-8 ${this.state.open ? "lg:w-72 md:64 sm:w-60" : "w-10"} duration-300 absolute shadow-2xl border-black border-r-[1px] dark:border-white dark:text-white`}>

            <BsArrowLeftShort onClick={this.handelNavbar} className={`  bg-white text-Retro-darl-blue text-3xl rounded-full absolute -right-3 top-9 border border-black cursor-pointer ${!this.state.open && 'rotate-180'} dark:border-white duration-300 dark:text-white dark:bg-stone-900 `}/>

                <div className="inline-flex w-full">
                    <h1 className={`font-sans font-bold text-lg ${this.state.open ? "" : "hidden"} duration-500 ml-auto mr-auto`}> <ReactLogo className="w-9 h-9 ml-auto mr-auto"/> Gradio Flow </h1>
                </div>

                <div className={`rounded-md text-center ${this.state.open ? "" : "px-0"} py-3`} onClick={() => {this.handelModal(true)}}>
                    <div className={` text-center bg-transparent w-full h-10 border border-slate-300 hover:border-Retro-purple hover:animate-pulse border-dashed rounded-md py-2 pl-5 ${this.state.open ? "pr-3" : "hidden"} shadow-sm sm:text-sm`}>
                        <Icon className=" block mr-auto ml-auto" name="plus"/>
                    </div>
                </div>

                <Modal
                    basic
                    open={this.state.modal}
                    size='small'
                >
                <Header className="select-none space-y-4" icon>
                    🌐 
                    <br/>
                    Append Shared Gradio Hosts 
                </Header>
                <Modal.Content>
                <div className=" text-center select-none">Host other HugginFace Models or Gradio application via shared lin</div>
                <div className={`flex items-center rounded-md bg-light-white mt-6  border-dashed`}>
                <label className="relative block w-full">
                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3`}>
                        <BsSearch className="block float-left cursor-pointer mr-2"/>
                    </span>
                    <input className={`placeholder:italic placeholder:text-slate-400 block bg-transparent w-full border border-slate-300 border-dashed rounded-md py-2 pl-9 ${this.state.open ? "pr-3" : "hidden"} shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1  sm:text-sm`} 
                           placeholder={`stream localhost...`}
                           type="text" name="search"
                           onChange={(e) => {
                            this.updateText(e, "text")
                           }}
                        
                           />
                </label>
                </div>
                <div className={`flex items-center rounded-md bg-light-white mt-6  border-dashed`}>
                <label className="relative block w-full">
                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3`}>
                        <Icon className="block float-left cursor-pointer mr-2" name="address card"/>
                    </span>
                    <input className={`placeholder:italic placeholder:text-slate-400 block bg-transparent w-full border border-slate-300 border-dashed rounded-md py-2 pl-9 ${this.state.open ? "pr-3" : "hidden"} shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1  sm:text-sm`} 
                           placeholder={`Name...` }
                           type="text" name="search"
                           onChange={(e) => {
                            this.updateText(e, "name")
                           }}
                           />
                </label>
                </div>

                { this.state.error &&
                <Message negative>
                <Message.Header>🚫 Connection to url</Message.Header>
                    <p>🤔 Either the connection is forbidden, already exist within the menu or it is unreachable... </p>  
                </Message>
                }

                </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' inverted onClick={() => {this.handelModal(false)}}>
                        <Icon name='remove' /> Exit
                        </Button>
                        <Button color='green' inverted onClick={() => {this.append_gradio()}}>
                        <Icon name='checkmark' /> Append
                        </Button>
                    </Modal.Actions>                    
                </Modal>

                <div className=" relative z-10 h-auto overflow-auto pt-4">
                    <ul className="pt-2">
                    {this.state.menu.map((menu, index) => {return this.subComponents(menu, index)})}
                    </ul>
                </div>

                <div className={`${this.state.open ? "" : "hidden"} absolute bottom-0 left-0 w-full text-center p-5`} onDragOver={(e)=> {e.preventDefault()}} onDrop={(e)=>{this.onDragDrop(e)}}>
                    <div className={` text-center bg-transparent w-full h-10 border border-red-600 border-dashed rounded-md py-2 pl-5 p-4 ${this.state.open ? "pr-3" : "hidden"} shadow-sm sm:text-sm`}>
                        <Icon name='trash alternate' />                   
                    </div>
                </div>
            </div>
            
        </div>)
    }
}

/**
 *                 
 * **/