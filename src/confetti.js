
export function addConfetti() {
    const canvas = document.getElementById('confetti_canvas');
    if (!canvas) {
        return;
    }
    let times_ran = 0;
    let frame = 0;

    //destroy the canvas animation on click or on enter
    canvas.addEventListener('click', () => {
        if (canvas.style.display !== 'none') {
            canvas.style.display = 'none';
            return;
        }
    });
    window.addEventListener('keypress', (e) => {
        if (e.code === 'Enter' && canvas.style.display != 'none'){
            canvas.style.display = 'none';
            return;
        }
    });

    canvas.width  = window.innerWidth;
    const body = document.body;
    const html = document.documentElement;
    canvas.height = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );

    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
    const pieces = [];
    const numberOfPieces = 2500;
    let lastUpdateTime = Date.now();
    const x_const = 0.25;
    const max_times = 250;
    const size_const = 10;
    const gravity_const = 0.25;

    function randomColor () {
       

        let colors = ['#8FD7FF', '#316498', '#34CA34', '#FFFF40', '#FF2929', '#9c84a4'];

        return colors[Math.floor(Math.random() * colors.length)];
    }

    function update () {
        const now = Date.now(),
            dt = now - lastUpdateTime;

        for (let i = pieces.length - 1; i >= 0; i--) {
            const p = pieces[i];

            if (p.y > canvas.height) {
                pieces.splice(i, 1);
                continue;
            }

            p.y += p.gravity * dt;
            p.rotation += p.rotationSpeed * dt;
            p.x += p.x_vel;
        }

        while (pieces.length < numberOfPieces && times_ran < max_times) {
            pieces.push(new Piece(Math.random() * canvas.width, -20));
        }

        lastUpdateTime = now;

        times_ran ++;

        if (times_ran >= max_times * 10){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = '';
            canvas.width = 0;
            canvas.height = 0;
        }

    }

    function draw () {

        if (canvas.style.display === 'none'){
            cancelAnimationFrame(frame);
            return;
        }

        update();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach((p) => {
            ctx.save();

            ctx.fillStyle = p.color;

            ctx.translate(p.x + p.size / 25, p.y + p.size / 2);
            ctx.rotate(p.rotation);

            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

            ctx.restore();
        });

        frame = requestAnimationFrame(draw);
    }

    function Piece (x, y) {
        this.x = x;
        this.y = y;
        this.x_vel = (Math.random() - 0.5) * x_const;
        this.size = (Math.random() * 0.5 + 0.75) * size_const;
        this.gravity = (Math.random() * 0.5 + 0.75) * gravity_const;
        this.rotation = (Math.PI * 2) * Math.random();
        this.rotationSpeed = (Math.PI * 2) * (Math.random() - 0.5) * 0.0015;
        this.color = randomColor();
    }

    while (pieces.length < numberOfPieces) {
        pieces.push(new Piece(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    draw();
}
