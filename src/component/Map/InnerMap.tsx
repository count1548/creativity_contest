import React, {createRef, useState, useEffect} from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';

let ctx, canvas, canvasRef = createRef<HTMLCanvasElement>()
let img = new Image()

const drawMark = (ctx, x, y, size, color = 'yellow') => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
}
const origin = {
    width : 400,
    height : 200
}
let mouseDown = false

export default function InnerMap(props) {
    const {onClick=(data)=>{}, 
        image=null, Mark=null,
        wdt = 400, hgt = 200,
        allowClick = true, specialMark = 0
    } = props
    
    const getObject_location = (pos, size) => {
        const _pos = {
            x : pos.x*origin.width / wdt,
            y : pos.y*origin.height / hgt
        }

        return Mark.find(data => {
            const target = data['location']
            if( Math.abs(target.x - _pos.x) < size && 
                Math.abs(target.y - _pos.y) < size) return true
        })
    }

    useEffect(() => {
        canvas = canvasRef.current
        ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        img.src = `./imgs/${image}`
        
        const size = 3*hgt/origin.height

        img.onerror = () => { img.src = './imgs/noimg.png'; }
        img.onload = () => {
            ctx.drawImage(img, 0, 0, wdt, hgt)
            if(Mark) {
                if(typeof Mark.length !== 'undefined') {
                    Mark.map((pos, idx) => {
                        const loc = pos['location']
                        const color = idx === specialMark ? 'red' : 'yellow'
                        drawMark(ctx, wdt * loc.x / origin.width, hgt * loc.y / origin.height, size, color)
                    })
                }
                else drawMark(ctx, wdt * Mark.x / origin.width, hgt * Mark.y / origin.height, size)
            }
            
        }

        canvas.addEventListener('mousedown', (ev) => {
            if(mouseDown) return;
            mouseDown = true
            const pos = {
                x : ev.offsetX,
                y : ev.offsetY,
            }
            console.log(pos)
            const data = {
                x : pos.x, y : pos.y,
                color : ctx.getImageData(pos.x, pos.y, 1, 1).data, //?
                object : getObject_location(pos, size)
            }
            onClick(data)
            if(allowClick) {
                ctx.drawImage(img, 0, 0, wdt, hgt)
                drawMark(ctx, wdt * pos.x / origin.width, hgt * pos.y / origin.height, size)
            }
        }); canvas.addEventListener('mouseup', ev => mouseDown = false )
    }, [image, specialMark])

    return (
        <div><canvas ref={canvasRef} width={wdt} height={hgt}/></div>
    )
}