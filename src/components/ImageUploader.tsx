import React, { FormEvent, MouseEventHandler, useRef, useState } from "react";
import "./ImageUploader.css";
import { ImageIcon } from "./svg/ImageIcon";


interface uploaderState  {
    files?: FileList,
    state: 'none' | 'over' | 'drop' | 'uploading' | 'success',
}
export const ImageUploader = () => {
    const [useDragState, setDragState] = useState({
        state: 'none'
    } as uploaderState)

    const refForm = useRef<HTMLFormElement>(null)
    const refInput = useRef<HTMLInputElement>(null)

    const handleSubmit = async (event:FormEvent) => {
        refForm.current?.submit()
        // event.preventDefault()

        // if(refForm.current == null) return;

        // const formData = new FormData(refForm.current)

        // const response = await fetch("http://localhost:4000/api/upload",{
        //     method: 'POST',
        //     headers: {
        //         'Content-Teyp':'multipart/form-data'
        //     },
        //     body: formData
        // })
        // console.log(response)
    }
    
    const handleChoseFile = (event:React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        refInput.current?.click()
    }

    const onDrag = (event: React.DragEvent<HTMLElement>) =>{
        event.preventDefault()
        event.stopPropagation()
        if(useDragState.state === 'drop' || useDragState.state === 'uploading') return;
        if((event.type === 'dragenter' || event.type == 'dragover')){
            setDragState({...useDragState,state:'over'})
        }
        else {
            setDragState({...useDragState,state:'none'})
        }
    }
    const onDrop = (event: React.DragEvent<HTMLElement>) =>{
        event.preventDefault()
        event.stopPropagation()
        if(useDragState.state === 'uploading') return;
        setDragState({state:'drop', files: event.dataTransfer.files})
        if(useDragState.files?.item){
            setDragState({...useDragState,state: 'uploading'})
            if(refInput.current){
                refInput.current.files = event.dataTransfer.files           
            }
        }
    }

    if(useDragState.state !== "uploading"){
        return (
        <div className="uploader">
            <h2 className="uploader_title">Upload your image</h2>
            <span className="uploader_info">file should be jpg or png</span>
            <form action="http://localhost:4000/api/upload" className="uploader_form" encType="multipart/form-data" ref={refForm} method='POST'>
                <label 
                htmlFor="fileUploaded" 
                className={`uploader_area ${useDragState.state}`} 
                onDragOver={onDrag} 
                onDragEnter={onDrag} 
                onDragLeave={onDrag} 
                onDrop={onDrop}
                >
                    <ImageIcon/>
                    <span className="uploader_info drag">Drag & drop your image here</span>
                    <input type="file" name="file" id="fileUploaded" className="uploader_input" ref={refInput} onChange={handleSubmit}/>
                </label>
                <span className="uploader_info">Or</span>
                <button className="uploader_btn" onClick={handleChoseFile}>Chose a file</button>
            </form>
        </div>
        )
    }
    return (
        <div className="loader">
            <span>Uploading</span>
            <span className="loader_bar"></span>
        </div>
    )
}