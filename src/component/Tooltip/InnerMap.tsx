import React, {createRef, useState, useEffect} from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';

let ctx, canvas, canvasRef = createRef<HTMLCanvasElement>()
let img = new Image()

export default function InnerMap(props) {
    const {children, 
        text, onClick=(data)=>{}, 
        image=null, Mark=null, 
        allview=true,
        wdt = 400, hgt = 200
    } = props
    useEffect(() => {
        console.log(Mark)
        canvas = canvasRef.current
        ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "red"

        canvas.addEventListener('mousedown', (ev) => {
            onClick({
                x : ev.offsetX,
                y : ev.offsetY
            })
        })
        if(image !== null) {            
            img.src = `./imgs/${image}`
            img.onload = () => {
                ctx.drawImage(img, 0, 0, wdt, hgt)
                if(Mark !== null) {
                    console.log('draw Mark')
                    ctx.beginPath()
                    ctx.arc(Mark.x, Mark.y, 3, 0, 2 * Math.PI)
                    ctx.fill()
                }
            }
            
        }
    }, [image])

    if(Mark !== null) {
        if(typeof ctx !== 'undefined') {
            ctx.drawImage(img, 0, 0, wdt, hgt)
            ctx.beginPath()
            ctx.arc(Mark.x, Mark.y, 3, 0, 2 * Math.PI)
            ctx.fill()
        }
    }

    return (
        <div><canvas ref={canvasRef} width={wdt} height={hgt}/></div>
    )
}