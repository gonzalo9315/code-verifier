import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

interface Props {
    iconButton?: any,
    variantButton?: any,
    sizeButton?: any,
    colorButton?: any,
    textButton?: any,
    title?: string,
    content: any,
    func?: any
}

export const DialogMain = ({ ...props }: Props) => {

    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        if(props.func) props.func()
    }

    return (
        <div>
            {
                props.textButton ? 
                    <Button 
                        variant={props.variantButton || 'contained'} 
                        size={props.sizeButton || 'small'} 
                        color={props.colorButton}
                        endIcon={props.iconButton} 
                        onClick={handleClickOpen}
                    >
                        {props.textButton}
                    </Button>
                :
                    <Button 
                        variant={props.variantButton || 'contained'} 
                        size={props.sizeButton || 'small'} 
                        color={props.colorButton}
                        onClick={handleClickOpen}
                    >
                        {props.iconButton} 
                    </Button>
            }
            <Dialog open={open} onClose={handleClose}>
                {
                    props.title ?
                        <DialogTitle>{props.title}</DialogTitle>
                    :
                    null
                }
                <DialogContent>
                    {props.content}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}