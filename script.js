const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particlesArray

// Get mouse position

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height) * (canvas.width)  / (85**2)
}

window.addEventListener(`mousemove`,
    function(event) {
        mouse.x = event.x
        mouse.y = event.y
    }
)

// Create particle

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x
        this.y = y
        this.directionX = directionX
        this.directionY = directionY
        this.size = size
        this.color = color
    }

    // Method to draw individual particle

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0.2 * Math.PI, false)
        ctx.fillStyle = '#ffff'
        ctx.fill()
        // ctx.stroke()
    }
    // Check particle position, check mouse position, move the particles, draw the particles

    update() {

        // Check if particle is still within canvas

        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY
        }

        // Check if collision - mouse posiiton / particle position 

        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx**2 + dy**2)

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 4
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 4
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 4
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 4
            }
        }

        // Move particles

        this.x += this.directionX
        this.y += this.directionY

        // Draw particles

        this.draw()
    }
}

// Create particle array

function init() {
    particlesArray = []
    let numberOfParticles = (canvas.height * canvas.width) / 8000

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2)
        let directionX = (Math.random() * 5) -2.5
        let directionY = (Math.random() * 5) -2.5
        let color = '#ffff'

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
}

// Check if particles are close ennought to draw line between theme

function connect(){
    let opacityvalue = 1

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) **2)
                            + ((particlesArray[a].y - particlesArray[b].y) **2)

            if (distance < (canvas.width * canvas.height) / 50) {
                opacityvalue = 1 - (distance / 20000)
                ctx.strokeStyle = 'rgba(100, 100,100, ' + opacityvalue +')'
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
                ctx.stroke()
            }
        }
    }
}


// Animation loop

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
    }
    connect()
}

// Resize event

window.addEventListener('resize',
    function() {
        canvas.width = innerWidth
        canvas.height = innerHeight
        mouse.radius = (canvas.height * canvas.width ) / (80 ** 2)
        init ()
    }
)

// Mouse out event

window.addEventListener('mouseout',
    function () {
        mouse.x = undefined
        mouse.y = undefined
    }
)

init();
animate();