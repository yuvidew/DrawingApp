const canvas = document.querySelector('canvas'),
ctx = canvas.getContext('2d'),
toolBtn = document.querySelectorAll('.tool'),
fillColor = document.getElementById('fill-color'),
sizeSlider = document.getElementById('size-slider'),
lineColor = document.getElementById('color'),
clearBtn = document.getElementById('clear'),
sevedBtn = document.getElementById('sevedBtn')

let prevMouseX , prevMouseY, sanapshot , 
isDrawing = false,
selectedTool = 'brush'
brusWidth = 5,
selectedColor = 'balck'

const setCanvasBg = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0 , 0, canvas.width , canvas.height)
    ctx.fillStyle = selectedColor;
}

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBg()
})

const drawRect = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.fillRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
    ctx.beginPath();
    let redius = Math.sqrt(Math.pow((prevMouseX - e.offsetX) , 2) + Math.pow((prevMouseY - e.offsetY) , 2))
    ctx.arc(prevMouseX , prevMouseY , redius , 0 , 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX , prevMouseY)
    ctx.lineTo(e.offsetX , e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX , e.offsetY)
    ctx.closePath()
    ctx.stroke()
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const startDrawing = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()// this methode is create new path to drawpoint
    ctx.lineWidth = brusWidth
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    sanapshot = ctx.getImageData(0 , 0 , canvas.width , canvas.height)
}

const drawing = (e) => {
    if(!isDrawing) return
    ctx.putImageData(sanapshot , 0, 0)

    if(selectedTool === 'brush' || selectedTool === 'eraser'){
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor
        ctx.lineTo(e.offsetX , e.offsetY);
        ctx.stroke()
    }else if(selectedTool === 'rectangle'){
        drawRect(e)
    }else if(selectedTool === 'circle'){
        drawCircle(e)
    }else{
        drawTriangle(e)
    }
    //lineTo methode creates a new line.. ctx.lineTo(x-coordinate , y-coordinate)
}
toolBtn.forEach(btn => {
    btn.addEventListener('click' , () => {
        document.querySelector('.option .action').classList.remove('action');
        btn.classList.add('action')
        selectedTool = btn.id
    })
})

sevedBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

sizeSlider.addEventListener('change', () => brusWidth = sizeSlider.value)
lineColor.addEventListener('input', () => selectedColor = lineColor.value)

clearBtn.addEventListener('click' , () => {
    ctx.clearRect(0 , 0 , canvas.width , canvas.height)
    setCanvasBg()
})

canvas.addEventListener('mousedown' , startDrawing)
canvas.addEventListener('mousemove' , drawing)
canvas.addEventListener('mouseup' , () => isDrawing = false)