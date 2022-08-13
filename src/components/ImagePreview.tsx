
import { useState } from "react"
import "./ImagePreview.css"
import { CheckIcon } from "./svg/CeckIcon"



interface IPreviewProps {
    link: string
}

export const ImagePreview = ({link}:IPreviewProps) => {
    const [useIsCopy, setIsCopy] = useState(false)
    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(link)
        setIsCopy(true)
        setTimeout(() => {
            setIsCopy(false)
        }, 3000);
    }
    return (
        <div className="uploader_preview">
            <span className="uploader_icon">
                <CheckIcon/>
            </span>
            <h2 className="uploader_preview_title">Upload Successfully!</h2>
            <div className="uploader_preview_content">
                <img className="uploader_preview_image" src={link} alt="preview"/>
                <label className="uploader_preview_link" htmlFor="bntLink">
                    <span>{link}</span>
                    <button id="bntLink" className={`btn${useIsCopy?' success':' primary'}`}  onClick={handleCopyLink}>
                        {useIsCopy?'Copied':'Copy Link'}
                    </button>
                </label>
            </div>
        </div>
    )
}