import { Dropzone, FileItem, FileValidated, FullScreenPreview, VideoPreview } from "@dropzone-ui/react"
import { useEffect, useState } from "react"

export const FileUploader = (props?: any) => {

    const [files, setFiles] = useState<FileValidated[]>([]);
    const [imageSrc, setImageSrc] = useState<any>(undefined);
    const [videoSrc, setVideoSrc] = useState<any>(undefined);
    useEffect(() => {
      if(props.func) props.func(files)
    }, [files])
 
    const updateFiles = (incommingFiles: FileValidated[]) => {
      setFiles(incommingFiles)
    }

    const handleSee = (imageSource: any) => {
        setImageSrc(imageSource)
    }

    const handleClean = (files: FileValidated[]) => {
        console.log("list cleaned", files)
    }

    const removeFile = (id: string | number | undefined) => {
        if(id) {
            setFiles(files.filter((x) => x.id !== id));
        }
    }

    const handleWatch = (vidSrc: any) => {
      setVideoSrc(vidSrc);
    }

    const handleUpload=(responses: any)=>{
      //check the responses here
      // console.log(responses)
    }

    return (
        <Dropzone 
            onChange={(files) => updateFiles(files)} 
            onClean={handleClean}
            onUploadFinish={handleUpload}
            style={{ minWidth:"300px", minHeight:'250px' }} 
            label="Drag'n drop files here or click to browse"
            value={files} 
            maxFiles={3}
            maxFileSize={2e+8}
            accept=".png,image/*,.mp4,.jpg,.jpeg,.zip,.rar,.pdf,.docx"
            url={ props.upload ? "http://localhost:8000/api/katas/uploadFile" : undefined }
        >
          {files.map((file: FileValidated) => (
            <FileItem 
                {...file} 
                onDelete={() => removeFile(file.id)} 
                onSee={handleSee}
                onWatch={handleWatch}
                key={file.id} 
                preview
                info
                resultOnTooltip
                hd
                localization={"ES-es"}
            />
          ))}
          <FullScreenPreview
                imgSource={imageSrc}
                openImage={imageSrc}
                onClose={(e: any) => handleSee(undefined)}
            />
          <VideoPreview
              videoSrc={videoSrc}
              openVideo={videoSrc}
              onClose={(e: any) => handleWatch(undefined)}
              controls
              autoplay
          />
        </Dropzone>
      )
}