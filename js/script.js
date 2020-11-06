const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')


function animate() {
    animationId = requestAnimationFrame(animate)
    //Clear the whole board 
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
animate()