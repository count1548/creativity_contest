import React, {createRef, useState, useEffect} from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';

let ctx, canvas, canvasRef = createRef<HTMLCanvasElement>()
let img = new Image()

const drawMark = (ctx, x, y) => {
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fill()
}
export default function InnerMap(props) {
    const {children, 
        text, onClick=(data)=>{}, 
        image=null, Mark=null,
        wdt = 400, hgt = 200,
        allowClick = true
    } = props
    useEffect(() => {
        canvas = canvasRef.current
        ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "red"

        img.src = `./imgs/${image}`
        
        img.onerror = () => { img.src = './imgs/noimg.png'; }
        img.onload = () => {
            ctx.drawImage(img, 0, 0, wdt, hgt)
            if(Mark)
                drawMark(ctx, wdt * Mark.x / 400, hgt * Mark.y / 200)
        }

        canvas.addEventListener('mousedown', (ev) => {
            const pos = {
                x : ev.offsetX,
                y : ev.offsetY
            }
            onClick(pos)
            if(allowClick) {
                ctx.drawImage(img, 0, 0, wdt, hgt)
                drawMark(ctx, wdt * pos.x / 400, hgt * pos.y / 200)
            }
        })
    }, [image])

    return (
        <div><canvas ref={canvasRef} width={wdt} height={hgt}/></div>
    )
}