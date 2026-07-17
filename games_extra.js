// ============================================================
//  EXTRA GAMES — Implementações nativas dos 7 minigames
//  Cada função startXGame() mostra o splash dentro da janelinha
//  e o botão "Começar" chama initXGame() que inicia o jogo
// ============================================================

// ── Utilitário compartilhado ──────────────────────────────────
function openGameStage() {
    const stage = document.getElementById('gameStage');
    stage.style.display = 'flex';
    document.querySelector('.game-stats-container').style.display = 'flex';
    stage.scrollIntoView({ behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════════════
//  1. PESCADOR ECOLÓGICO
// ═══════════════════════════════════════════════════════════════
function startPescadorGame() {
    openGameStage();
    document.getElementById('gameCanvas').innerHTML = `
    <div class="game-instructions game-splash-pescador">
        <div class="splash-centered-header">
            <div class="splash-hero-icon">🎣</div>
            <h2 class="splash-title">Pescador Ecológico</h2>
            <p class="splash-subtitle">Limpe o oceano retirando o lixo do fundo do mar!</p>
        </div>
        <div class="splash-content-split">
            <div class="splash-text-side">
                <ul class="game-tutorial-list">
                    <li><div><span>1</span> Mova o barco com o mouse</div></li>
                    <li><div><span>2</span> Clique para lançar o anzol</div></li>
                    <li><div><span>3</span> Capture lixos no fundo do oceano</div></li>
                    <li><div><span>4</span> Evite capturar os peixes!</div></li>
                </ul>
            </div>
        </div>
        <button class="btn splash-btn" style="background:linear-gradient(135deg,#0ea5e9,#06b6d4);color:white;border:none;" onclick="initPescadorGame()">
            <i class="fas fa-play"></i> Começar Jogo
        </button>
    </div>`;
}

function initPescadorGame() {
    const container = document.getElementById('gameCanvas');
    container.innerHTML = '<canvas id="pescCanvas" width="820" height="560" style="display:block;margin:0 auto;border-radius:18px;box-shadow:0 0 80px rgba(14,165,233,.4);cursor:crosshair;"></canvas>';
    isGameActive = true;

    const canvas = document.getElementById('pescCanvas');
    const ctx = canvas.getContext('2d');
    const W = 820, H = 560, SURF = 110;

    let state = 'playing', pScore = 0, pLives = 3, pLevel = 1;
    let totalTrash = 0, caught = 0;
    let mouseX = W/2, flashFx = null, t = 0;
    let floats = [], particles = [], bubbles = [], seaweeds = [], corals = [], fishArr = [], trashArr = [];
    let boat = { x: W/2, w: 96, h: 34, flagPhase: 0 };
    let hook = { x: W/2, y: SURF, active: false, returning: false, hasCatch: false, catchIcon: '', speed: 5.5 };

    function updHUD() {
        if (window.__updateHUD) window.__updateHUD({ type:'UPDATE_HUD', score: pScore, lives: pLives, level: pLevel, time: caught+'/'+totalTrash });
    }

    function initLevel() {
        fishArr = []; trashArr = []; seaweeds = []; corals = []; bubbles = []; particles = []; floats = []; caught = 0;
        let fc = 3 + (pLevel-1)*2, tc = 5 + (pLevel-1)*3;
        const fishCols = ['#f97316','#eab308','#22c55e','#ec4899','#06b6d4','#a855f7','#fb923c'];
        for (let i=0; i<fc; i++) {
            fishArr.push({
                x: 120+Math.random()*(W-240), y: SURF+80+Math.random()*(H-SURF-140),
                w: 46+Math.random()*18, h: 22+Math.random()*10,
                spd: 1.2+Math.random()*1.4, dir: Math.random()<.5?1:-1,
                col: fishCols[i%fishCols.length], phase: Math.random()*Math.PI*2
            });
        }
        const trashTypes = [
            {icon:'🥫',glow:'#ef4444'},{icon:'🍶',glow:'#06b6d4'},{icon:'👟',glow:'#f59e0b'},
            {icon:'🪣',glow:'#8b5cf6'},{icon:'📦',glow:'#64748b'},{icon:'🛢️',glow:'#dc2626'}
        ];
        for (let i=0; i<tc; i++) {
            const tt = trashTypes[i%trashTypes.length];
            trashArr.push({x:60+Math.random()*(W-120), y:SURF+130+Math.random()*(H-SURF-180), done:false, icon:tt.icon, glow:tt.glow, bob:Math.random()*Math.PI*2});
        }
        // Seaweed
        for (let i=0; i<12; i++) seaweeds.push({x:20+Math.random()*(W-40), h:30+Math.random()*50, ph:Math.random()*Math.PI*2, col:`hsl(${100+Math.random()*40},70%,${35+Math.random()*20}%)`});
        // Coral
        const coralCols = ['#f43f5e','#fb923c','#fbbf24','#a855f7','#ec4899'];
        for (let i=0; i<8; i++) corals.push({x:40+Math.random()*(W-80), col:coralCols[i%coralCols.length], size:0.7+Math.random()*0.6});
        totalTrash = tc; updHUD();
    }

    function drawBG() {
        // Sky
        let sky = ctx.createLinearGradient(0,0,0,SURF);
        sky.addColorStop(0,'#0284c7'); sky.addColorStop(1,'#38bdf8');
        ctx.fillStyle=sky; ctx.fillRect(0,0,W,SURF);

        // Sun
        ctx.save();
        let sunX=W*0.85, sunY=25;
        let sunGlow = ctx.createRadialGradient(sunX,sunY,4,sunX,sunY,38);
        sunGlow.addColorStop(0,'rgba(253,224,71,.9)'); sunGlow.addColorStop(1,'rgba(253,224,71,0)');
        ctx.fillStyle=sunGlow; ctx.fillRect(sunX-40,sunY-40,80,80);
        ctx.fillStyle='#fde047'; ctx.beginPath(); ctx.arc(sunX,sunY,13,0,Math.PI*2); ctx.fill();
        ctx.restore();

        // Clouds
        ctx.save(); ctx.fillStyle='rgba(255,255,255,0.85)';
        const drawCloud=(cx,cy,s)=>{ ctx.beginPath(); ctx.arc(cx,cy,14*s,0,Math.PI*2); ctx.arc(cx+16*s,cy-6*s,18*s,0,Math.PI*2); ctx.arc(cx+34*s,cy,14*s,0,Math.PI*2); ctx.fill(); };
        drawCloud(80,30,1); drawCloud(340+(Math.sin(t*0.0004)*8),22,0.8); drawCloud(590,35,1.1);
        ctx.restore();

        // Ocean
        let ocean = ctx.createLinearGradient(0,SURF,0,H);
        ocean.addColorStop(0,'#0ea5e9'); ocean.addColorStop(0.4,'#0369a1'); ocean.addColorStop(1,'#0c2461');
        ctx.fillStyle=ocean; ctx.fillRect(0,SURF,W,H-SURF);

        // Animated light rays
        ctx.save(); ctx.globalAlpha=0.04;
        for (let i=0;i<7;i++) {
            let rx=((i*115+t*0.014)%W);
            let rg=ctx.createLinearGradient(rx,SURF,rx+18,H);
            rg.addColorStop(0,'rgba(255,255,255,.8)'); rg.addColorStop(1,'rgba(255,255,255,0)');
            ctx.fillStyle=rg;
            ctx.beginPath(); ctx.moveTo(rx,SURF); ctx.lineTo(rx+22,H); ctx.lineTo(rx+36,H); ctx.lineTo(rx+14,SURF); ctx.closePath(); ctx.fill();
        }
        ctx.restore();

        // Animated wave surface
        ctx.save();
        ctx.fillStyle='rgba(255,255,255,0.18)';
        ctx.beginPath(); ctx.moveTo(0,SURF);
        for (let x=0;x<=W;x+=4) {
            let wy = SURF + Math.sin((x*0.025)+(t*0.04))*5 + Math.sin((x*0.012)+(t*0.025))*3;
            ctx.lineTo(x,wy);
        }
        ctx.lineTo(W,0); ctx.lineTo(0,0); ctx.closePath(); ctx.fill();
        // Second wave (darker)
        ctx.fillStyle='rgba(14,165,233,0.22)';
        ctx.beginPath(); ctx.moveTo(0,SURF+4);
        for (let x=0;x<=W;x+=4) {
            let wy = SURF+4 + Math.sin((x*0.02)+(t*0.03)+1)*4 + Math.sin((x*0.009)+(t*0.02)+2)*2;
            ctx.lineTo(x,wy);
        }
        ctx.lineTo(W,SURF-4); ctx.lineTo(0,SURF-4); ctx.closePath(); ctx.fill();
        ctx.restore();

        // Sandy bottom
        let sand = ctx.createLinearGradient(0,H-48,0,H);
        sand.addColorStop(0,'#92400e'); sand.addColorStop(1,'#a16207');
        ctx.fillStyle=sand; ctx.fillRect(0,H-48,W,48);
        // Sand ripples
        ctx.save(); ctx.strokeStyle='rgba(0,0,0,.08)'; ctx.lineWidth=2;
        for (let i=0;i<10;i++) { ctx.beginPath(); ctx.ellipse(60+i*76,H-28,22,5,0,0,Math.PI); ctx.stroke(); }
        ctx.restore();
    }

    function drawSeaweed(sw) {
        ctx.save(); ctx.lineWidth=5; ctx.lineCap='round'; ctx.strokeStyle=sw.col;
        ctx.beginPath(); ctx.moveTo(sw.x,H-48);
        const segs=6, sh=sw.h/segs;
        for (let i=1;i<=segs;i++) {
            let bx=Math.sin(t*0.002+sw.ph+i*0.8)*9;
            ctx.lineTo(sw.x+bx, H-48-i*sh);
        }
        ctx.stroke(); ctx.restore();
    }

    function drawCoral(co) {
        ctx.save(); ctx.translate(co.x,H-48); ctx.scale(co.size,co.size);
        ctx.fillStyle=co.col;
        // Three branches
        [-10,0,10].forEach(ox=>{
            let bh = 18+Math.abs(ox)*0.5;
            ctx.fillRect(ox-3,-bh,6,bh);
            ctx.beginPath(); ctx.arc(ox,-bh,5,Math.PI,0,false); ctx.fill();
        });
        ctx.restore();
    }

    function drawBubble(b) {
        ctx.save(); ctx.globalAlpha=b.a;
        ctx.strokeStyle='rgba(147,197,253,0.7)'; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.stroke();
        // Highlight
        ctx.fillStyle='rgba(255,255,255,0.35)';
        ctx.beginPath(); ctx.arc(b.x-b.r*0.3,b.y-b.r*0.3,b.r*0.3,0,Math.PI*2); ctx.fill();
        ctx.restore();
    }

    function drawFish(f) {
        ctx.save(); ctx.translate(f.x,f.y); ctx.scale(f.dir<0?-1:1,1);
        let wag = Math.sin(t*0.06+f.phase)*0.18;
        // Body
        ctx.fillStyle=f.col;
        ctx.beginPath(); ctx.ellipse(0,0,f.w/2,f.h/2,wag,0,Math.PI*2); ctx.fill();
        // Tail
        ctx.save(); ctx.rotate(wag);
        ctx.fillStyle=f.col;
        ctx.beginPath(); ctx.moveTo(-f.w/2+2,0); ctx.lineTo(-f.w/2-14,-f.h/2-2); ctx.lineTo(-f.w/2-14,f.h/2+2); ctx.closePath(); ctx.fill();
        ctx.restore();
        // Dorsal fin
        ctx.fillStyle=f.col; ctx.globalAlpha=0.75;
        ctx.beginPath(); ctx.moveTo(-f.w/8,-f.h/2); ctx.lineTo(f.w/5,-f.h/2-10); ctx.lineTo(f.w/3,-f.h/2); ctx.closePath(); ctx.fill();
        ctx.globalAlpha=1;
        // Belly shimmer
        ctx.fillStyle='rgba(255,255,255,0.2)';
        ctx.beginPath(); ctx.ellipse(f.w/8,f.h/6,f.w/4,f.h/5,0,0,Math.PI*2); ctx.fill();
        // Eye
        ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(f.w/3,-f.h/7,f.h/3.8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#0f172a'; ctx.beginPath(); ctx.arc(f.w/3+1.5,-f.h/7,f.h/7.5,0,Math.PI*2); ctx.fill();
        // Eye gleam
        ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(f.w/3+2.5,-f.h/6.5,1.5,0,Math.PI*2); ctx.fill();
        ctx.restore();
    }

    function drawTrash(tr) {
        if (tr.done) return;
        let bob = Math.sin(t*0.045+tr.bob)*4;
        ctx.save();
        // Pulsing glow
        let gs = 28+Math.sin(t*0.04+tr.bob)*6;
        let gg = ctx.createRadialGradient(tr.x,tr.y+bob,3,tr.x,tr.y+bob,gs);
        gg.addColorStop(0,tr.glow+'88'); gg.addColorStop(1,tr.glow+'00');
        ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(tr.x,tr.y+bob,gs,0,Math.PI*2); ctx.fill();
        // Icon
        ctx.font='26px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.shadowColor=tr.glow; ctx.shadowBlur=16;
        ctx.fillText(tr.icon, tr.x, tr.y+bob);
        ctx.restore();
    }

    function drawBoat() {
        ctx.save(); ctx.translate(boat.x, SURF-2);
        // Hull shadow
        ctx.fillStyle='rgba(0,0,0,0.15)';
        ctx.beginPath(); ctx.ellipse(0,10,boat.w/2,8,0,0,Math.PI*2); ctx.fill();
        // Hull
        let hullG = ctx.createLinearGradient(0,-boat.h,0,boat.h/2);
        hullG.addColorStop(0,'#1e3a5f'); hullG.addColorStop(1,'#0f172a');
        ctx.fillStyle=hullG;
        ctx.beginPath(); ctx.moveTo(-boat.w/2,0); ctx.lineTo(boat.w/2,0); ctx.lineTo(boat.w/2-10,boat.h/2+6); ctx.lineTo(-boat.w/2+10,boat.h/2+6); ctx.closePath(); ctx.fill();
        // Hull stripe
        ctx.strokeStyle='#0ea5e9'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(-boat.w/2+12,boat.h/4); ctx.lineTo(boat.w/2-12,boat.h/4); ctx.stroke();
        // Deck
        let deckG = ctx.createLinearGradient(0,-boat.h,0,0);
        deckG.addColorStop(0,'#92400e'); deckG.addColorStop(1,'#78350f');
        ctx.fillStyle=deckG;
        ctx.beginPath(); ctx.roundRect(-boat.w/2+4,-boat.h/2-2,boat.w-8,boat.h/2+4,4); ctx.fill();
        // Deck planks
        ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=1.5;
        for (let i=-2;i<=2;i++) { ctx.beginPath(); ctx.moveTo(i*14,-boat.h/2-2); ctx.lineTo(i*14,2); ctx.stroke(); }
        // Cabin
        ctx.fillStyle='#1e3a5f';
        ctx.beginPath(); ctx.roundRect(-12,-boat.h-10,28,boat.h/2+8,5); ctx.fill();
        // Cabin window
        ctx.fillStyle='rgba(253,224,71,0.9)';
        ctx.beginPath(); ctx.roundRect(-6,-boat.h-5,10,8,3); ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(-1,-boat.h-5); ctx.lineTo(-1,-boat.h+3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-6,-boat.h-1); ctx.lineTo(4,-boat.h-1); ctx.stroke();
        // Mast
        ctx.strokeStyle='#92400e'; ctx.lineWidth=4; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(-4,-boat.h-10); ctx.lineTo(-4,-boat.h-46); ctx.stroke();
        // Flag
        boat.flagPhase += 0.08;
        ctx.fillStyle='#22c55e';
        ctx.save(); ctx.translate(-4,-boat.h-46);
        ctx.beginPath(); ctx.moveTo(0,0);
        for (let xi=0;xi<=20;xi++) {
            let fy = Math.sin((xi/20)*Math.PI + boat.flagPhase)*4;
            if(xi===0) ctx.moveTo(0,fy); else ctx.lineTo(xi,fy);
        }
        ctx.lineTo(20,10); ctx.lineTo(0,10); ctx.closePath(); ctx.fill();
        ctx.restore();
        // Fishing rod
        ctx.strokeStyle='#a16207'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(boat.w/2-8,-boat.h/2+2); ctx.lineTo(boat.w/2+20,-boat.h-12); ctx.stroke();
        ctx.restore();
    }

    function drawHookLine() {
        ctx.save();
        // Line from rod tip
        let rodTipX = boat.x + boat.w/2+20, rodTipY = SURF - boat.h/2 - 12 + 2;
        ctx.strokeStyle='rgba(226,232,240,0.6)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
        ctx.beginPath(); ctx.moveTo(rodTipX, rodTipY); ctx.lineTo(hook.x, hook.y); ctx.stroke();
        ctx.setLineDash([]);
        // Hook glint
        if (hook.hasCatch) {
            let hg = ctx.createRadialGradient(hook.x,hook.y,0,hook.x,hook.y,14);
            hg.addColorStop(0,'rgba(52,211,153,.5)'); hg.addColorStop(1,'rgba(52,211,153,0)');
            ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(hook.x,hook.y,14,0,Math.PI*2); ctx.fill();
            ctx.font='18px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(hook.catchIcon, hook.x, hook.y);
        } else {
            // Draw hook shape
            ctx.strokeStyle='#94a3b8'; ctx.lineWidth=2.5; ctx.lineCap='round';
            ctx.beginPath(); ctx.arc(hook.x,hook.y+4,6,Math.PI,0,true); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(hook.x-6,hook.y+4); ctx.lineTo(hook.x-6,hook.y); ctx.stroke();
            ctx.fillStyle='#cbd5e1'; ctx.beginPath(); ctx.arc(hook.x+1,hook.y+10,2.5,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
    }

    function drawParticles() {
        for (let p of particles) {
            ctx.save(); ctx.globalAlpha=p.a;
            let pg = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
            pg.addColorStop(0,p.col); pg.addColorStop(1,p.col+'00');
            ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
            ctx.restore();
        }
    }

    function drawFloats() {
        for (let f of floats) {
            ctx.save(); ctx.globalAlpha=f.a;
            ctx.font='bold 16px Nunito,sans-serif'; ctx.textAlign='center';
            ctx.shadowColor=f.col; ctx.shadowBlur=8; ctx.fillStyle=f.col;
            ctx.fillText(f.txt, f.x, f.y); ctx.restore();
        }
    }

    function spawnParticles(x,y,col) {
        for (let i=0;i<14;i++) { let a=Math.random()*Math.PI*2,s=Math.random()*4+1; particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2.5,col,a:1,r:Math.random()*6+2}); }
    }

    function startReturn() { state='retracting'; hook.returning=true; hook.active=false; }

    function updateHook() {
        if (state==='hooking') {
            hook.y += hook.speed;
            if (hook.y > H-56) { startReturn(); return; }
            for (let f of fishArr) {
                if (Math.abs(hook.x-f.x)<f.w/2+12 && Math.abs(hook.y-f.y)<f.h/2+12) {
                    spawnParticles(hook.x,hook.y,'#ef4444');
                    floats.push({x:hook.x,y:hook.y-20,txt:'🐟 -1 vida!',col:'#f87171',a:1});
                    flashFx={col:'#ef4444',a:0.35};
                    pLives--; updHUD();
                    if (pLives<=0) { state='gameOver'; setTimeout(()=>showPescadorEnd(false),500); }
                    else startReturn();
                    return;
                }
            }
            for (let tr of trashArr) {
                if (tr.done) continue;
                if (Math.abs(hook.x-tr.x)<24 && Math.abs(hook.y-tr.y)<28) {
                    tr.done=true; hook.hasCatch=true; hook.catchIcon=tr.icon; caught++; pScore+=10*pLevel; updHUD();
                    spawnParticles(tr.x,tr.y,'#34d399');
                    floats.push({x:tr.x,y:tr.y-30,txt:'+'+(10*pLevel)+' pts!',col:'#4ade80',a:1});
                    flashFx={col:'#34d399',a:0.15};
                    startReturn(); return;
                }
            }
        }
        if (state==='retracting') {
            hook.y -= hook.speed*1.8;
            if (hook.y <= SURF+10) {
                hook.hasCatch=false; hook.catchIcon=''; hook.returning=false; hook.active=false;
                hook.x=boat.x; hook.y=SURF+10;
                if (caught>=totalTrash) {
                    pLevel++;
                    if(pLevel>3) { setTimeout(()=>showPescadorEnd(true),500); }
                    else {
                        floats.push({x:W/2,y:H/2,txt:'Nível '+pLevel+'! 🌊',col:'#fbbf24',a:1});
                        setTimeout(initLevel,900);
                    }
                } else state='playing';
            }
        }
        if (flashFx) { flashFx.a*=.80; if(flashFx.a<.01)flashFx=null; }
    }

    function showPescadorEnd(win) {
        if (!isGameActive) return;
        isGameActive = false;
        if (gameInterval) cancelAnimationFrame(gameInterval);
        const xp = Math.floor(pScore/2);
        if (window.gamification) window.gamification.addXp(xp, '(Pescador)');
        document.getElementById('gameCanvas').innerHTML = `
        <div class="game-instructions">
            <h2>${win ? 'Oceano Limpo! 🌊' : 'Game Over! 🐟'}</h2>
            <p>Pontuação: <strong>${pScore}</strong> | XP: <strong>${xp}</strong></p>
            <button class="btn btn-primary" onclick="initPescadorGame()">Jogar Novamente</button>
        </div>`;
    }

    function loop(ts) {
        if (!isGameActive) return;
        t = ts || 0;
        ctx.clearRect(0,0,W,H);
        drawBG();
        for (let sw of seaweeds) drawSeaweed(sw);
        for (let co of corals) drawCoral(co);
        for (let b of bubbles) drawBubble(b);
        for (let tr of trashArr) drawTrash(tr);
        for (let f of fishArr) drawFish(f);
        drawHookLine(); drawBoat(); drawParticles(); drawFloats();

        if (state==='playing'||state==='hooking'||state==='retracting') {
            let tx=Math.max(boat.w/2+6,Math.min(W-boat.w/2-6,mouseX)); boat.x+=(tx-boat.x)*.12;
            if (state==='playing') { hook.x=boat.x; hook.y=SURF+10; }
            for (let f of fishArr) {
                f.x+=f.spd*f.dir;
                if(f.x>W+f.w)f.x=-f.w; if(f.x<-f.w)f.x=W+f.w;
            }
            updateHook();
            // Bubbles
            if (Math.random()<0.06) bubbles.push({x:20+Math.random()*(W-40),y:H-50,r:Math.random()*4+1,spd:0.4+Math.random()*0.6,a:0.5});
            for (let b of bubbles) { b.y-=b.spd; b.a-=0.005; }
            bubbles = bubbles.filter(b=>b.a>0&&b.y>SURF);
            for (let p of particles) { p.x+=p.vx; p.y+=p.vy; p.vy+=.05; p.a-=.022; p.r*=.96; }
            particles = particles.filter(p=>p.a>0);
            for (let f of floats) { f.y-=1.1; f.a-=.018; }
            floats = floats.filter(f=>f.a>0);
        }
        if (flashFx) { ctx.save(); ctx.globalAlpha=flashFx.a; ctx.fillStyle=flashFx.col; ctx.fillRect(0,0,W,H); ctx.restore(); }
        gameInterval = requestAnimationFrame(loop);
    }

    canvas.addEventListener('mousemove', e => { let r=canvas.getBoundingClientRect(); mouseX=(e.clientX-r.left)*(W/r.width); });
    canvas.addEventListener('click', () => { if(state==='playing'){state='hooking';hook.active=true;hook.x=boat.x+boat.w/2+20;hook.y=SURF+10;} });
    canvas.addEventListener('touchstart', e => { e.preventDefault(); let r=canvas.getBoundingClientRect(); mouseX=(e.touches[0].clientX-r.left)*(W/r.width); if(state==='playing'){state='hooking';hook.active=true;hook.x=boat.x+boat.w/2+20;hook.y=SURF+10;} });

    initLevel();
    gameInterval = requestAnimationFrame(loop);
}

// ═══════════════════════════════════════════════════════════════
//  2. SUPERMERCADO CONSCIENTE
// ═══════════════════════════════════════════════════════════════
function startSupermercadoGame() {
    openGameStage();
    document.getElementById('gameCanvas').innerHTML = `
    <div class="game-instructions game-splash-supermercado">
        <div class="splash-centered-header">
            <div class="splash-hero-icon">🛒</div>
            <h2 class="splash-title">Supermercado Consciente</h2>
            <p class="splash-subtitle">Compre de forma inteligente e sustentável!</p>
        </div>
        <div class="splash-content-split">
            <div class="splash-text-side">
                <ul class="game-tutorial-list">
                    <li><div><span>1</span> Um produto aparece com preço e descrição</div></li>
                    <li><div><span>2</span> Decida em 5 segundos: comprar ou descartar</div></li>
                    <li><div><span>3</span> Itens essenciais devem ser comprados</div></li>
                    <li><div><span>4</span> Não esvazie o orçamento de R$500!</div></li>
                </ul>
            </div>
        </div>
        <button class="btn splash-btn" style="background:linear-gradient(135deg,#a855f7,#7e22ce);color:white;border:none;" onclick="initSupermercadoGame()">
            <i class="fas fa-play"></i> Começar Jogo
        </button>
    </div>`;
}

function initSupermercadoGame() {
    const container = document.getElementById('gameCanvas');
    isGameActive = true;

    const products = [
        {icon:'💧',name:'Galão de Água',desc:'Essencial para hidratação.',price:15,isEssential:true},
        {icon:'🍚',name:'Arroz 5kg',desc:'Base da alimentação.',price:25,isEssential:true},
        {icon:'🎮',name:'Videogame Novo',desc:'O último lançamento. Muito caro!',price:300,isEssential:false},
        {icon:'👟',name:'Tênis de Grife',desc:'Você já tem um bom, mas este é da moda.',price:200,isEssential:false},
        {icon:'🍎',name:'Frutas Frescas',desc:'Nutritivas e sustentáveis.',price:12,isEssential:true},
        {icon:'📱',name:'Celular Novo',desc:'O seu antigo ainda funciona.',price:400,isEssential:false},
        {icon:'🧼',name:'Sabonete',desc:'Higiene básica. Essencial.',price:5,isEssential:true},
        {icon:'🥤',name:'Refrigerante 2L',desc:'Não é saudável nem essencial.',price:10,isEssential:false},
        {icon:'🥖',name:'Pão Integral',desc:'Café da manhã nutritivo.',price:8,isEssential:true},
        {icon:'🧴',name:'Detergente Bio',desc:'Limpeza sustentável.',price:7,isEssential:true},
        {icon:'🍬',name:'Caixa de Doces',desc:'Guloseima cara.',price:40,isEssential:false},
        {icon:'🥬',name:'Vegetais Orgânicos',desc:'Saudáveis e locais.',price:18,isEssential:true},
    ];

    let budget=500, itemsProcessed=0, goodChoices=0, currentItem=null, timeRemaining=5, timerInterval;
    const queue = [...products].sort(()=>Math.random()-.5);

    container.innerHTML = `
    <div style="position:relative;width:100%;height:100%;background:linear-gradient(135deg,#a855f7,#7e22ce);display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:18px;font-family:'Outfit',sans-serif;color:white;overflow:hidden;">
        <div style="position:absolute;top:0;left:0;width:100%;height:8px;background:rgba(0,0,0,0.2);">
            <div id="smTimerFill" style="height:100%;width:100%;background:#22c55e;transition:width 0.1s,background 0.2s;"></div>
        </div>
        <div id="smCard" style="background:white;color:#1e293b;width:90%;max-width:460px;border-radius:24px;padding:30px;box-shadow:0 20px 40px rgba(0,0,0,.3);text-align:center;transition:transform .3s,opacity .3s;">
            <div id="smIcon" style="font-size:5rem;margin-bottom:10px;">🍎</div>
            <div id="smName" style="font-size:1.8rem;font-weight:800;margin-bottom:5px;">Item</div>
            <div id="smDesc" style="font-size:1rem;color:#64748b;margin-bottom:15px;line-height:1.4;">Descrição</div>
            <div style="font-size:2rem;font-weight:800;color:#7e22ce;background:#f3e8ff;display:inline-block;padding:5px 20px;border-radius:16px;margin-bottom:20px;">R$ <span id="smPrice">0</span></div>
            <div style="display:flex;gap:15px;justify-content:center;">
                <button onclick="smChoice('discard')" style="flex:1;padding:18px;border:none;border-radius:14px;font-size:1.1rem;font-weight:800;cursor:pointer;background:#ef4444;color:white;box-shadow:0 6px 0 rgba(0,0,0,.2);">❌ Descartar</button>
                <button onclick="smChoice('buy')" style="flex:1;padding:18px;border:none;border-radius:14px;font-size:1.1rem;font-weight:800;cursor:pointer;background:#22c55e;color:white;box-shadow:0 6px 0 rgba(0,0,0,.2);">🛒 Comprar</button>
            </div>
        </div>
        <div style="margin-top:20px;font-size:1.2rem;font-weight:700;">Orçamento: R$ <span id="smBudget">500</span></div>
    </div>`;

    window.smChoice = function(action) {
        clearInterval(timerInterval);
        if (!isGameActive) return;
        let good = false;
        const card = document.getElementById('smCard');
        if (action === 'buy') {
            if (budget >= currentItem.price) {
                budget -= currentItem.price;
                if (currentItem.isEssential) good = true;
                card.style.transform = 'translateX(150%) rotate(15deg)'; card.style.opacity='0';
            } else { smEnd('Faliu!'); return; }
        } else {
            if (!currentItem.isEssential) good = true;
            card.style.transform = 'translateX(-150%) rotate(-15deg)'; card.style.opacity='0';
        }
        if (good) goodChoices++;
        itemsProcessed++;
        document.getElementById('smBudget').textContent = budget;
        if (window.__updateHUD) window.__updateHUD({type:'UPDATE_HUD', score:'R$'+budget, level:itemsProcessed+'/'+products.length, time:Math.ceil(timeRemaining)+'s', lives:''});
        setTimeout(smRound, 400);
    };

    function smRound() {
        if (!isGameActive) return;
        if (itemsProcessed >= queue.length) { smEnd(); return; }
        currentItem = queue[itemsProcessed];
        const card = document.getElementById('smCard');
        card.style.transform='none'; card.style.opacity='1';
        document.getElementById('smIcon').textContent = currentItem.icon;
        document.getElementById('smName').textContent = currentItem.name;
        document.getElementById('smDesc').textContent = currentItem.desc;
        document.getElementById('smPrice').textContent = currentItem.price;
        timeRemaining = 5;
        const fill = document.getElementById('smTimerFill');
        fill.style.width='100%'; fill.style.background='#22c55e';
        clearInterval(timerInterval);
        timerInterval = setInterval(()=>{
            timeRemaining -= 0.05;
            let pct=(timeRemaining/5)*100;
            fill.style.width=pct+'%';
            if(pct<30) fill.style.background='#ef4444';
            else if(pct<60) fill.style.background='#f59e0b';
            if(timeRemaining<=0){clearInterval(timerInterval);window.smChoice('discard');}
        }, 50);
    }

    function smEnd(reason) {
        isGameActive=false;
        clearInterval(timerInterval);
        let xp = goodChoices*10 + Math.floor(budget/10);
        if(reason==='Faliu!') xp=Math.floor(xp/2);
        if(window.gamification) window.gamification.addXp(xp,'(Supermercado)');
        document.getElementById('gameCanvas').innerHTML=`
        <div class="game-instructions">
            <h2>${reason==='Faliu!'?'Orçamento Estourado! 😬':'Compras Finalizadas! 🛒'}</h2>
            <p>Boas escolhas: <strong>${goodChoices}</strong> | XP: <strong>${xp}</strong></p>
            <button class="btn btn-primary" onclick="initSupermercadoGame()">Jogar Novamente</button>
        </div>`;
    }

    smRound();
}

// ═══════════════════════════════════════════════════════════════
//  3. IRRIGAÇÃO INTELIGENTE
// ═══════════════════════════════════════════════════════════════
function startIrrigacaoGame() {
    openGameStage();
    document.getElementById('gameCanvas').innerHTML = `
    <div class="game-instructions game-splash-irrigacao">
        <div class="splash-centered-header">
            <div class="splash-hero-icon">🌱</div>
            <h2 class="splash-title">Irrigação Inteligente</h2>
            <p class="splash-subtitle">Mantenha a umidade do solo no nível ideal!</p>
        </div>
        <div class="splash-content-split">
            <div class="splash-text-side">
                <ul class="game-tutorial-list">
                    <li><div><span>1</span> O reservatório vai esvaziando rapidamente</div></li>
                    <li><div><span>2</span> Clique em IRRIGAR para repor a água</div></li>
                    <li><div><span>3</span> Abaixo de 20%: A planta morre de seca instantaneamente!</div></li>
                    <li><div><span>4</span> Acima de 80%: A planta vira uma poça de água!</div></li>
                </ul>
            </div>
        </div>
        <button class="btn splash-btn" style="background:linear-gradient(135deg,#84cc16,#4d7c0f);color:white;border:none;" onclick="initIrrigacaoGame()">
            <i class="fas fa-play"></i> Começar Jogo
        </button>
    </div>`;
}

function initIrrigacaoGame() {
    const container = document.getElementById('gameCanvas');
    isGameActive = true;

    container.innerHTML = `
    <div style="position:relative;width:100%;height:100%;background:linear-gradient(180deg,#84cc16,#4d7c0f);display:flex;flex-direction:column;justify-content:space-between;align-items:center;border-radius:18px;font-family:'Outfit',sans-serif;color:white;overflow:hidden;">
        <div style="flex-grow:1;display:flex;align-items:flex-end;justify-content:center;position:relative;width:100%;">
            <div style="position:absolute;bottom:0;width:100%;height:150px;background:#78350f;border-top:10px solid #451a03;"></div>
            <div id="irrPlant" style="font-size:8rem;position:relative;z-index:5;transition:all .3s;">🌱</div>
        </div>
        <div style="padding:25px;width:100%;background:rgba(0,0,0,.5);border-top-left-radius:30px;border-top-right-radius:30px;display:flex;flex-direction:column;align-items:center;gap:15px;box-sizing:border-box;">
            <div style="font-size:1.1rem;font-weight:700;">Nível do Reservatório</div>
            <div style="width:300px;height:28px;background:#334155;border-radius:14px;overflow:hidden;border:3px solid #1e293b;position:relative;">
                <div id="irrFill" style="height:100%;width:50%;background:#3b82f6;transition:width .15s,background .3s;border-radius:14px;"></div>
                <div style="position:absolute;top:0;left:20%;height:100%;border-left:2px dashed rgba(255,255,255,.4);"></div>
                <div style="position:absolute;top:0;left:80%;height:100%;border-left:2px dashed rgba(255,255,255,.4);"></div>
            </div>
            <div id="irrWarn" style="color:#ef4444;font-weight:bold;font-size:1rem;opacity:0;transition:opacity .2s;">⚠️ Aviso!</div>
            <button id="irrBtn" onclick="irrIrrigate()" style="background:#0ea5e9;color:white;border:none;padding:18px 40px;font-size:1.4rem;font-weight:800;border-radius:99px;cursor:pointer;box-shadow:0 8px 0 #0284c7;transition:all .1s;">💧 IRRIGAR</button>
        </div>
    </div>`;

    let moisture=50, irrTimeLeft=30, lastTime=performance.now(), secondTimer=0;

    window.irrIrrigate = function() {
        if (!isGameActive) return;
        moisture = Math.min(100, moisture+18);
        updateIrrUI();
    };

    document.getElementById('irrBtn').onmousedown = ()=>{ let b=document.getElementById('irrBtn'); b.style.transform='translateY(8px)'; b.style.boxShadow='0 0px 0 #0284c7'; };
    document.getElementById('irrBtn').onmouseup = ()=>{ let b=document.getElementById('irrBtn'); b.style.transform='none'; b.style.boxShadow='0 8px 0 #0284c7'; };

    function updateIrrUI() {
        const fill = document.getElementById('irrFill');
        const warn = document.getElementById('irrWarn');
        const plant = document.getElementById('irrPlant');
        if (!fill) return;
        fill.style.width = moisture+'%';
        if (moisture < 20) { fill.style.background='#ef4444'; warn.textContent='💀 Reservatório seco!'; warn.style.opacity=1; }
        else if (moisture > 80) { fill.style.background='#ef4444'; warn.textContent='🌊 Transbordando!'; warn.style.opacity=1; }
        else { fill.style.background='#3b82f6'; warn.style.opacity=0; }
        if (irrTimeLeft>20) plant.textContent='🌱';
        else if (irrTimeLeft>10) plant.textContent='🌿';
        else plant.textContent='🌻';
    }

    function irrLoop(ts) {
        if (!isGameActive) return;
        let dt = Math.min(ts-lastTime, 80); lastTime=ts;
        moisture -= 0.035*dt; 
        if (moisture<0) moisture=0;
        
        if (moisture<=20) { 
            moisture=20; updateIrrUI(); 
            document.getElementById('irrPlant').textContent='🥀'; 
            irrEnd('seca'); return; 
        }
        if (moisture>=80) { 
            moisture=80; updateIrrUI(); 
            document.getElementById('irrPlant').textContent='💦'; 
            irrEnd('enchente'); return; 
        }

        secondTimer += dt;
        if (secondTimer>=1000) {
            secondTimer=0; irrTimeLeft--;
            if (window.__updateHUD) window.__updateHUD({type:'UPDATE_HUD',time:irrTimeLeft+'s',lives:'',score:'',level:''});
            if (irrTimeLeft<=0) { irrEnd('win'); return; }
        }
        updateIrrUI();
        gameInterval = requestAnimationFrame(irrLoop);
    }

    function irrEnd(reason) {
        isGameActive=false;
        let xp = 0;
        let msg = '', title = '';
        if (reason === 'win') { xp = 100; title = 'Colheita Feita! 🌻'; msg = 'Você manteve o reservatório estável!'; }
        else if (reason === 'seca') { xp = 0; title = 'A Planta Morreu de Seca! 🥀'; msg = 'Você deixou o reservatório esvaziar.'; }
        else if (reason === 'enchente') { xp = 0; title = 'A Planta Afogou! 💦'; msg = 'Você encharcou demais o reservatório e a planta virou uma poça!'; }
        
        if(window.gamification) window.gamification.addXp(xp,'(Irrigação)');
        document.getElementById('gameCanvas').innerHTML=`
        <div class="game-instructions">
            <h2>${title}</h2>
            <p>${msg}<br>XP ganho: <strong>${xp}</strong></p>
            <button class="btn btn-primary" onclick="initIrrigacaoGame()">Jogar Novamente</button>
        </div>`;
    }

    if (window.__updateHUD) window.__updateHUD({type:'UPDATE_HUD',time:'30s',lives:'',score:'',level:''});
    gameInterval = requestAnimationFrame(irrLoop);
}

// ═══════════════════════════════════════════════════════════════
//  4. PEGADA ECOLÓGICA
// ═══════════════════════════════════════════════════════════════
function startPegadaGame() {
    openGameStage();
    document.getElementById('gameCanvas').innerHTML = `
    <div class="game-instructions game-splash-pegada">
        <div class="splash-centered-header">
            <div class="splash-hero-icon">👣</div>
            <h2 class="splash-title">Pegada Ecológica</h2>
            <p class="splash-subtitle">Suas escolhas diárias moldam o futuro do planeta!</p>
        </div>
        <div class="splash-content-split">
            <div class="splash-text-side">
                <ul class="game-tutorial-list">
                    <li><div><span>1</span> Você vive um dia simulado com 5 escolhas</div></li>
                    <li><div><span>2</span> Cada opção tem um impacto de CO₂</div></li>
                    <li><div><span>3</span> Quanto menor a pegada, mais XP você ganha!</div></li>
                    <li><div><span>4</span> Tente chegar a menos de 3 kg de CO₂</div></li>
                </ul>
            </div>
        </div>
        <button class="btn splash-btn" style="background:linear-gradient(135deg,#ec4899,#be185d);color:white;border:none;" onclick="initPegadaGame()">
            <i class="fas fa-play"></i> Começar Jogo
        </button>
    </div>`;
}

function initPegadaGame() {
    isGameActive = true;
    const container = document.getElementById('gameCanvas');

    const scenarios = [
        {time:'Manhã',icon:'🚗',title:'Indo para o Trabalho',desc:'Como você vai se deslocar hoje?',options:[{text:'Ir sozinho de carro',co2:4.5},{text:'Pegar o ônibus ou metrô',co2:1.2},{text:'Ir de bicicleta ou a pé',co2:0.0}]},
        {time:'Almoço',icon:'🍔',title:'Hora da Fome',desc:'O que você vai comer no almoço?',options:[{text:'Bife de carne bovina',co2:6.8},{text:'Frango com salada',co2:1.5},{text:'Prato vegetariano',co2:0.5}]},
        {time:'Tarde',icon:'☕',title:'Pausa para o Café',desc:'Você vai pegar um café. Como?',options:[{text:'Copo plástico descartável',co2:0.4},{text:'Copo de papel',co2:0.2},{text:'Levar sua própria caneca',co2:0.0}]},
        {time:'Noite',icon:'💡',title:'Chegando em Casa',desc:'Está frio. O que você faz?',options:[{text:'Ligar o ar condicionado no máximo',co2:3.0},{text:'Ligar um aquecedor por 1 hora',co2:1.0},{text:'Vestir um casaco',co2:0.0}]},
        {time:'Fim da Noite',icon:'🚿',title:'Hora do Banho',desc:'Antes de dormir, você toma banho.',options:[{text:'Banho de banheira',co2:2.5},{text:'Banho de chuveiro longo (15 min)',co2:1.8},{text:'Banho rápido (5 min)',co2:0.6}]},
    ];

    let currentIdx=0, totalCO2=0;

    function renderScenario() {
        if (currentIdx >= scenarios.length) { pegadaEnd(); return; }
        const s = scenarios[currentIdx];
        if (window.__updateHUD) window.__updateHUD({type:'UPDATE_HUD',score:totalCO2.toFixed(1)+' kg CO₂',level:(currentIdx+1)+'/'+scenarios.length,time:s.time,lives:''});
        container.innerHTML = `
        <div style="position:relative;width:100%;height:100%;background:linear-gradient(135deg,#ec4899,#be185d);display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:18px;font-family:'Outfit',sans-serif;color:white;padding:20px;box-sizing:border-box;">
            <div style="background:white;color:#1e293b;width:100%;max-width:580px;border-radius:24px;padding:35px;box-shadow:0 20px 40px rgba(0,0,0,.3);text-align:center;">
                <div style="font-size:4rem;margin-bottom:15px;">${s.icon}</div>
                <div style="font-size:1.8rem;font-weight:800;margin-bottom:8px;color:#be185d;">${s.title}</div>
                <div style="font-size:1.1rem;color:#64748b;margin-bottom:25px;">${s.desc}</div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    ${s.options.map((o,i)=>`
                    <button onclick="pegadaChoose(${o.co2})" style="background:#fdf2f8;border:2px solid #fbcfe8;color:#be185d;padding:16px;border-radius:14px;font-size:1rem;font-weight:700;cursor:pointer;display:flex;justify-content:space-between;align-items:center;text-align:left;transition:all .2s;"
                        onmouseover="this.style.background='#fce7f3';this.style.transform='translateX(8px)'"
                        onmouseout="this.style.background='#fdf2f8';this.style.transform='none'">
                        <span>${o.text}</span>
                        <span style="background:#be185d;color:white;padding:4px 10px;border-radius:8px;font-size:.85rem;white-space:nowrap;">+${o.co2.toFixed(1)} kg</span>
                    </button>`).join('')}
                </div>
            </div>
        </div>`;
        window.pegadaChoose = function(co2) { totalCO2+=co2; currentIdx++; renderScenario(); };
    }

    function pegadaEnd() {
        isGameActive=false;
        const maxCO2=18, efficiency=Math.max(0,(maxCO2-totalCO2)/maxCO2), xp=Math.floor(efficiency*100);
        const title = totalCO2<3?'Excelente! 🌿':totalCO2<8?'Bom trabalho! 👍':'Atenção! 🌫️';
        if(window.gamification) window.gamification.addXp(xp,'(Pegada Ecológica)');
        container.innerHTML=`
        <div class="game-instructions">
            <h2>${title}</h2>
            <p>Sua pegada: <strong>${totalCO2.toFixed(1)} kg de CO₂</strong><br>XP ganho: <strong>${xp}</strong></p>
            <button class="btn btn-primary" onclick="initPegadaGame()">Jogar Novamente</button>
        </div>`;
    }

    renderScenario();
}

// ═══════════════════════════════════════════════════════════════
//  5–7. GARI, VAZAMENTO e INCÊNDIO — Splash + iframe nativo
//  Estes jogos são complexos demais para portar sem bugs;
//  usam iframe transparente que inicia automaticamente.
// ═══════════════════════════════════════════════════════════════
function startGariGame() {
    openGameStage();
    document.getElementById('gameCanvas').innerHTML = `
    <div class="game-instructions game-splash-gari">
        <div class="splash-centered-header">
            <div class="splash-hero-icon">🤿</div>
            <h2 class="splash-title">Gari Aquático</h2>
            <p class="splash-subtitle">Mergulhe e salve a vida marinha do lixo humano!</p>
        </div>
        <div class="splash-content-split">
            <div class="splash-text-side">
                <ul class="game-tutorial-list">
                    <li><div><span>1</span> Use WASD ou setas para nadar</div></li>
                    <li><div><span>2</span> Recolha todos os detritos no mar</div></li>
                    <li><div><span>3</span> Não encoste nos peixes!</div></li>
                    <li><div><span>4</span> Desvie do tubarão faminto!</div></li>
                </ul>
            </div>
        </div>
        <button class="btn splash-btn" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:white;border:none;" onclick="launchGameFile('gari.html')">
            <i class="fas fa-play"></i> Começar Jogo
        </button>
    </div>`;
}

function startVazamentoGame() {
    openGameStage();
    document.getElementById('gameCanvas').innerHTML = `
    <div class="game-instructions game-splash-vazamento">
        <div class="splash-centered-header">
            <div class="splash-hero-icon">🪴</div>
            <h2 class="splash-title">Caça ao Vazamento</h2>
            <p class="splash-subtitle">Colete a água dos vazamentos para regar sua planta!</p>
        </div>
        <div class="splash-content-split">
            <div class="splash-text-side">
                <ul class="game-tutorial-list">
                    <li><div><span>1</span> Mova o vaso usando WASD ou as Setas</div></li>
                    <li><div><span>2</span> Apare as gotas que caem dos canos</div></li>
                    <li><div><span>3</span> Leve o vaso cheio até a planta para regá-la</div></li>
                    <li><div><span>4</span> Não deixe muitas gotas caírem no chão!</div></li>
                </ul>
            </div>
        </div>
        <button class="btn splash-btn" style="background:linear-gradient(135deg,#0ea5e9,#0369a1);color:white;border:none;" onclick="launchGameFile('vazamento.html')">
            <i class="fas fa-play"></i> Começar Jogo
        </button>
    </div>`;
}

function startIncendioGame() {
    openGameStage();
    document.getElementById('gameCanvas').innerHTML = `
    <div class="game-instructions game-splash-incendio">
        <div class="splash-centered-header">
            <div class="splash-hero-icon">🔥</div>
            <h2 class="splash-title">Incêndio Zero</h2>
            <p class="splash-subtitle">Proteja a floresta! Cada segundo conta!</p>
        </div>
        <div class="splash-content-split">
            <div class="splash-text-side">
                <ul class="game-tutorial-list">
                    <li><div><span>1</span> Mova o mouse para pilotar o Helicóptero Bombeiro</div></li>
                    <li><div><span>2</span> Clique para soltar água nas árvores em chamas</div></li>
                    <li><div><span>3</span> Não deixe a fumaça chegar ao limite crítico!</div></li>
                    <li><div><span>4</span> O vento ajuda a limpar a fumaça aos poucos</div></li>
                </ul>
            </div>
        </div>
        <button class="btn splash-btn" style="background:linear-gradient(135deg,#f97316,#b91c1c);color:white;border:none;" onclick="launchGameFile('incendio.html')">
            <i class="fas fa-play"></i> Começar Jogo
        </button>
    </div>`;
}

// Lança um arquivo html dentro do gameCanvas como iframe autostart
function launchGameFile(src) {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:18px;background:#000;';
    iframe.onload = () => {
        try {
            const iwin = iframe.contentWindow;
            const idoc = iwin.document;
            const startBtn = idoc.getElementById('startBtn') || idoc.querySelector('.pbtn');
            if (startBtn) startBtn.click();
            idoc.querySelectorAll('a.blink').forEach(a => a.style.display='none');
        } catch(e) {}
    };
    canvas.appendChild(iframe);
}
