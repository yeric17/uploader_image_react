import React, { FormEvent, useRef, useState } from "react";
import { ImageLoader } from "./ImageLoader";
import { ImagePreview } from "./ImagePreview";
import "./ImageUploader.css";
import { ImageIcon } from "./svg/ImageIcon";


interface uploaderState  {
    state: 'none' | 'over' | 'drop' | 'uploading' | 'success' | 'error',
    link: string
}

const API_HOST = import.meta.env.VITE_PUBLIC_API_HOST

const typesSupported = ['image/png','image/jpeg']

export const ImageUploader = () => {
    const [useDragState, setDragState] = useState({
        state: 'none'
    } as uploaderState)

    const refForm = useRef<HTMLFormElement>(null)
    const refInput = useRef<HTMLInputElement>(null)

    const handleSubmit = async (event:FormEvent) => {
        event.preventDefault()
        if(refForm.current == null) return;
        
        if(refInput.current == null) return;
        if(refInput.current.files == null) return;
        console.log(refInput.current.files[0].type)
        if(!typesSupported.includes(refInput.current.files[0].type)) return;
        
        setDragState({...useDragState,state:'uploading'})
        const formData = new FormData(refForm.current)

        try {
            const response = await fetch(`${API_HOST}/upload`,{
                method: 'POST',
                body: formData
            })
            
            if(response.ok){
                const json = await response.json()
                console.log(json)
                setDragState({state:'success', link: json.image.url})
                return;
            }
        } catch(err) {
            setDragState({...useDragState,state:'error'})
        } finally {
            setDragState({...useDragState,state:'none'})
        }
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
        if(refInput.current == null) return;
        refInput.current.files = event.dataTransfer.files
        const newEvent = new Event('change',{bubbles:true})
        refInput.current.dispatchEvent(newEvent);
    }
    

    const handleChange = () => {
        console.log("input change")
        const newEvent = new Event('submit',{bubbles:true})
        if(refForm.current == null) return;
        
        refForm.current.dispatchEvent(newEvent)
    }

    if(useDragState.state === "uploading"){
        return (
            <ImageLoader/>
        )
    }
    else if (useDragState.state === "success"){
        return (
            <ImagePreview link={useDragState.link}/>
        )
    }
    return (
        <div className="uploader">
            <h2 className="uploader_title">Upload your image</h2>
            <span className="uploader_info">file should be {typesSupported.map(el=>el.split('/')[1]).join(", ")}</span>
            <form className="uploader_form" encType="multipart/form-data" ref={refForm} onSubmit={handleSubmit}>
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
                    <input type="file" name="file" id="fileUploaded" className="uploader_input" ref={refInput} onChange={handleChange}/>
                </label>
                <span className="uploader_info">Or</span>
                <button className="btn primary" onClick={handleChoseFile}>Chose a file</button>
            </form>
        </div>
    )
}