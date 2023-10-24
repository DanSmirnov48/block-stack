var canvas, ctx, h, w, run;
var box_h, box_x, box_w, temp = null;
var v = 5;
var stack_arr = [], score = 0, best = 0;
var colors = ['#ff0041', '#e4f609', '#3dfd02', '#7c00ff'], clr;

window.addEventListener('load', init);
window.addEventListener('resize', () => {
    window.location.reload();
});

document.getElementById('settingsBtn').addEventListener('click', () => $('.overlay').toggleClass('open'));
document.getElementById('close').addEventListener('click', () => $('.overlay').toggleClass('open'));

document.getElementById('resetBtn').addEventListener('click', () =>{
    localStorage.setItem('best_scored', 0);
    best = Number(localStorage.best_scored) | 0;
    document.getElementById('best').innerText = best;
});

let difficulty = localStorage.getItem('difficulty') !== null ? 
                localStorage.getItem('difficulty') : 'medium';
document.getElementById('difficulty').value = localStorage.getItem('difficulty') !== null ? 
                localStorage.getItem('difficulty') : 'medium'; 

document.getElementById('settings-form').addEventListener('change', e =>{
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty)
});

function init(){
    document.getElementById('play').addEventListener('click', () => {
        document.getElementsByClassName('start')[0].style.display = 'none';
        document.getElementById('settingsBtn').style.display = 'none';
        game();
    });

    canvas = document.getElementById('canvas');
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    canvas.addEventListener('click', canvas_update);

    stack_arr = [];
    score = 0;
    best = Number(localStorage.best_scored) | 0;
    document.getElementById('best').innerText = best;
    clr = colors[Math.floor(Math.random() * colors.length)];

    box_h = Math.floor(h / 20);
    box_w = Math.floor(w / 2.3);
    box_x = (w / 2 - (box_w / 2));

    let box1 = new Box(box_x, h - 4 * box_h, box_w, h);
    box1.draw();
    stack_arr.push(box1);

}

function draw(){
    let grd = ctx.createLinearGradient(0, 0, h, w);
    grd.addColorStop(1, "#240b36");
    grd.addColorStop(0, "#c31432");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    updating_score();

    if(temp){
        temp.draw(); temp.move();
    }
    for(let i = 0; i < stack_arr.length; i++) {
        stack_arr[i].draw();
    }
    run = requestAnimationFrame(draw);
}

function game() {
    stack_arr = [];
    score = 0;

    if(difficulty === 'easy') v = 3;
    if(difficulty === 'medium') v = 4;
    if(difficulty === 'hard') v = 6;
    
    canvas.style.filter = 'blur(0px)';
    box_h = Math.floor(h / 20);
    box_w = Math.floor(w / 2.3);
    box_x = (w / 2 - (box_w / 2));

    let box1 = new Box(box_x, h - 4 * box_h, box_w, h);
    box1.draw();
    stack_arr.push(box1);

    let len = stack_arr.length - 1;
    temp = new Box(-stack_arr[len].w, stack_arr[len].y - box_h, stack_arr[len].w);
    temp.m = true;
    draw();
}

function updating_score() {
    let s = document.getElementById('score');
    let b = document.getElementById('best');

    if(score < 10){
        s.innerText = '0' + score;
    }else{
        s.innerText = score;
    }

    if(best <= score){
        best = score;
        if(typeof (Storage) !== undefined){
            localStorage.best_scored = "" + best + "";
        }
    }
    if(best < 10){
        b.innerText = '0' + best;
    }else{
        b.innerText = best;
    }
}

function canvas_update() {
    if(stack_arr[stack_arr.length - 1].y < 8 * box_h){
        for(let i = 0; i < stack_arr.length; i++){
            stack_arr[i].y += 3 * box_h;
        }
        temp.y += 3 * box_h;
    }

    if(temp.x + temp.w < box_x || temp.x > box_x + box_w){
        cancelAnimationFrame(run);
        canvas.style.filter = 'blur(10px)';
        document.getElementsByClassName('start')[0].style.display = 'flex';
        document.getElementById('settingsBtn').style.display = 'block';
        updating_score();
        clr = colors[Math.floor(Math.random() * colors.length)];
    }

    if(temp.x <= box_x){
        box_w = temp.x + temp.w - box_x;
        score += 1;
    }else if (temp.x + temp.w >= box_x + box_w){
        box_w = box_x + box_w - temp.x;
        score += 1;
        box_x = temp.x;
    }
    updating_score();

    if(difficulty === 'easy'){
        if (score % 6 == 0) v *= 1.15;
    }
    if(difficulty === 'medium'){
        if (score % 4 == 0) v *= 1.15;
    }
    if(difficulty === 'hard'){
        if (score % 2 == 0) v *= 1.10;
    }

    let temp_box = new Box(box_x, temp.y, box_w);
    stack_arr.push(temp_box);

    let a = stack_arr[stack_arr.length - 1];
    let b;
    if(stack_arr.length % 2 == 1){
        b = -a.w;
    }else {
        b = w - 2;
    }
    temp = new Box(b, a.y - box_h, box_w);
    if(b < 0){
        if (v < 0){
            v = -v;
        }
    }else if (b > 0){
        if (v > 0) {
            v = -v;
        }
    }
    temp.m = true;
}