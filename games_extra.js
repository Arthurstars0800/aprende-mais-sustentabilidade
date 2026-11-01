// ============================================================
//  EXTRA GAMES — Implementações nativas dos 7 minigames
//  Cada função startXGame() mostra o splash dentro da janelinha
//  e o botão "Começar" chama initXGame() que inicia o jogo
// ============================================================

// ── Utilitário compartilhado ──────────────────────────────────
function openGameStage() {
    if (typeof openStage === 'function') {
        openStage(true);
    } else {
        const stage = document.getElementById('gameStage');
        stage.style.display = 'flex';
        stage.scrollIntoView({ behavior: 'smooth' });
    }
}

// ═══════════════════════════════════════════════════════════════
//  1. PESCADOR ECOLÓGICO
// ═══════════════════════════════════════════════════════════════
function startPescadorGame() {
    showModernSplash({
        badge: 'Preservação Marinha',
        heroIcon: '🎣',
        title: 'Pescador Ecológico',
        subtitle: 'Limpe os oceanos resgatando o lixo submarino sem machucar os peixes!',
        rules: [
            { icon: '🚢', title: 'Navegação', desc: 'Mova o barco com o mouse para mirar com precisão.' },
            { icon: '🪝', title: 'Lançar Anzol', desc: 'Clique para lançar a linha no fundo do mar.' },
            { icon: '🐠', title: 'Proteger Vidas', desc: 'Cuidado redobrado: pescar peixes custa vidas!' }
        ],
        chipsLabel: 'Mecânicas da Pesca',
        chips: [
            { icon: '🚢', label: 'Barco', colorClass: 'chip-cyan' },
            { icon: '🪝', label: 'Anzol', colorClass: 'chip-blue' },
            { icon: '🗑️', label: 'Pesque Lixo', colorClass: 'chip-green' },
            { icon: '🐠', label: 'Evite Peixes!', colorClass: 'chip-red' }
        ],
        onStart: 'initPescadorGame()'
    });
}

function initPescadorGame() {
    if (window.configureGameHUD) window.configureGameHUD({ showLevel: true, showScore: true, showLives: true, showTime: true });
    const container = document.getElementById('gameCanvas');
    container.innerHTML = '<canvas id="pescCanvas" width="820" height="560" style="display:block;margin:0 auto;border-radius:24px;box-shadow:0 0 80px rgba(14,165,233,.4);cursor:crosshair;"></canvas>';
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

        // Caustics (Underwater light refraction on sand)
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 9; i++) {
            let cx = ((i * 105 + Math.sin(t * 0.003 + i) * 22) % W);
            ctx.beginPath();
            ctx.ellipse(cx, H - 24, 28 + Math.sin(t * 0.004 + i) * 8, 8, 0.1, 0, Math.PI * 2);
            ctx.stroke();
        }
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
        // Water wake foam bubbles
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.ellipse(-boat.w/2 - 6, boat.h/4, 8 + Math.sin(t*0.01)*3, 4, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // Cabin
        ctx.fillStyle='#1e3a5f';
        ctx.beginPath(); ctx.roundRect(-12,-boat.h-10,28,boat.h/2+8,5); ctx.fill();

        // Friendly Fisherman Avatar
        ctx.save();
        ctx.fillStyle = '#059669'; // Eco-green vest
        ctx.beginPath(); ctx.roundRect(14, -boat.h/2 - 14, 11, 14, 3); ctx.fill();
        ctx.fillStyle = '#fde047'; // Head
        ctx.beginPath(); ctx.arc(19, -boat.h/2 - 18, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#047857'; // Cap
        ctx.beginPath(); ctx.arc(19, -boat.h/2 - 21, 6.5, Math.PI, 0); ctx.lineTo(27, -boat.h/2 - 20); ctx.closePath(); ctx.fill();
        ctx.restore();
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
        // Underwater exploration glow around hook
        let hGlow = ctx.createRadialGradient(hook.x, hook.y, 4, hook.x, hook.y, 36);
        hGlow.addColorStop(0, 'rgba(253, 224, 71, 0.35)');
        hGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
        hGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = hGlow;
        ctx.beginPath(); ctx.arc(hook.x, hook.y, 36, 0, Math.PI * 2); ctx.fill();
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
        const xp = Math.max(15, Math.floor((pScore + (win ? 200 : 0)) / 6));
        if (window.gamification) window.gamification.addXp(xp, '(Pescador Ecológico)');
        if (window.showModernResult) {
            window.showModernResult({
                type: win ? 'win' : 'lose',
                badge: win ? 'Oceano Despoluído' : 'Rede Perdida',
                heroIcon: win ? '🌊' : '🐟',
                title: win ? 'Oceano Salvo!' : 'Cuidado com os Peixes!',
                subtitle: win 
                    ? 'Você retirou o lixo das profundezas marítimas sem ferir a vida silvestre!' 
                    : 'Peixes foram fisgados por engano. Mantenha os olhos atentos ao lançar o anzol.',
                stats: [
                    { label: 'Pontos', value: pScore, icon: '⭐' },
                    { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
                    { label: 'Lixo Retirado', value: `${caught}/${totalTrash}`, icon: '🗑️' }
                ],
                onRestart: 'initPescadorGame()',
                restartLabel: 'Pescar Novamente'
            });
        }
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
    canvas.addEventListener('click', () => { if(state==='playing'){state='hooking';hook.active=true;hook.x=Math.max(20,Math.min(W-20,mouseX));hook.y=SURF+10;} });
    canvas.addEventListener('touchstart', e => { e.preventDefault(); let r=canvas.getBoundingClientRect(); mouseX=(e.touches[0].clientX-r.left)*(W/r.width); if(state==='playing'){state='hooking';hook.active=true;hook.x=Math.max(20,Math.min(W-20,mouseX));hook.y=SURF+10;} });

    initLevel();
    gameInterval = requestAnimationFrame(loop);
}

// ═══════════════════════════════════════════════════════════════
//  2. SUPERMERCADO CONSCIENTE
// ═══════════════════════════════════════════════════════════════
function startSupermercadoGame() {
    showModernSplash({
        badge: 'Consumo Consciente',
        heroIcon: '🛒',
        title: 'Supermercado Consciente',
        subtitle: 'Planeje suas compras com equilíbrio financeiro e impacto ambiental reduzido!',
        rules: [
            { icon: '🏷️', title: 'Avaliar Itens', desc: 'Observe a utilidade, pegada ecológica e o valor do produto.' },
            { icon: '⚖️', title: 'Classificar', desc: 'Decida rápido: é item Essencial, Desejo ou Supérfluo?' },
            { icon: '🪙', title: 'Poupança', desc: 'Gerencie seu saldo de 500 moedas sem zerar o orçamento.' }
        ],
        chipsLabel: 'Categorias de Compra',
        chips: [
            { icon: '✅', label: 'Essencial', colorClass: 'chip-green' },
            { icon: '💛', label: 'Desejo', colorClass: 'chip-yellow' },
            { icon: '❌', label: 'Desnecessário', colorClass: 'chip-red' },
            { icon: '🪙', label: 'Orçamento', colorClass: 'chip-purple' }
        ],
        onStart: 'initSupermercadoGame()'
    });
}

function initSupermercadoGame() {
    if (window.configureGameHUD) window.configureGameHUD({ showLevel: true, showScore: true, showLives: false, showTime: true });
    const container = document.getElementById('gameCanvas');
    isGameActive = true;

    const products = [
        {icon:'💧',name:'Galão de Água',desc:'Essencial para hidratação e saúde da família.',price:15,isEssential:true},
        {icon:'🍚',name:'Arroz 5kg',desc:'Alimento base, nutritivo e econômico.',price:25,isEssential:true},
        {icon:'🎮',name:'Videogame Novo',desc:'Lançamento caro e de alto consumo de energia.',price:300,isEssential:false},
        {icon:'👟',name:'Tênis de Grife',desc:'Você já possui tênis confortáveis.',price:200,isEssential:false},
        {icon:'🍎',name:'Frutas Frescas',desc:'Nutritivas, saudáveis e de produção local.',price:12,isEssential:true},
        {icon:'📱',name:'Celular Novo',desc:'Seu smartphone atual funciona perfeitamente.',price:400,isEssential:false},
        {icon:'🧼',name:'Sabonete Vegetal',desc:'Higiene básica essencial e biodegradável.',price:5,isEssential:true},
        {icon:'🥤',name:'Refrigerante 2L',desc:'Bebida ultraprocessada e garrafa plástica.',price:10,isEssential:false},
        {icon:'🥖',name:'Pão Integral',desc:'Café da manhã saudável e nutritivo.',price:8,isEssential:true},
        {icon:'🧴',name:'Detergente Bio',desc:'Fórmula biodegradável que não polui os rios.',price:7,isEssential:true},
        {icon:'🍬',name:'Caixa de Doces',desc:'Açúcar em excesso e muitas embalagens plásticas.',price:40,isEssential:false},
        {icon:'🥬',name:'Vegetais Orgânicos',desc:'Produção sustentável sem pesticidas.',price:18,isEssential:true},
    ];

    let budget = 500, itemsProcessed = 0, goodChoices = 0, currentItem = null, timeRemaining = 5, timerInterval;
    const queue = [...products].sort(() => Math.random() - 0.5);

    container.innerHTML = `
    <div class="sm-game-container">
        <div class="sm-progress-track">
            <div id="smTimerFill" class="sm-progress-fill"></div>
        </div>
        <div class="sm-header-stats">
            <div class="sm-stat-pill">
                <span class="sm-stat-pill-label">Orçamento</span>
                <span class="sm-stat-pill-val">R$ <strong id="smBudget">500</strong></span>
            </div>
            <div class="sm-stat-pill">
                <span class="sm-stat-pill-label">Item</span>
                <span class="sm-stat-pill-val"><strong id="smCounter">1</strong> / ${queue.length}</span>
            </div>
        </div>
        <div id="smCard" class="sm-product-card">
            <div id="smIcon" class="sm-product-icon">🍎</div>
            <div id="smName" class="sm-product-name">Item</div>
            <div id="smDesc" class="sm-product-desc">Descrição</div>
            <div class="sm-price-badge">
                <span>R$</span>
                <span id="smPrice">0</span>
            </div>
            <div class="sm-buttons-row">
                <button onclick="smChoice('discard')" class="sm-btn sm-btn-discard">
                    <i class="fas fa-times"></i> Descartar
                </button>
                <button onclick="smChoice('buy')" class="sm-btn sm-btn-buy">
                    <i class="fas fa-cart-shopping"></i> Comprar
                </button>
            </div>
        </div>
    </div>`;


    function spawnSMFloater(text, color) {
        const container = document.querySelector(".sm-game-container");
        if (!container) return;
        const fl = document.createElement("div");
        fl.style.cssText = "position:absolute;top:45%;left:50%;transform:translate(-50%,0);background:" + color + ";color:white;font-weight:800;font-size:1.1rem;padding:8px 18px;border-radius:999px;box-shadow:0 8px 20px rgba(0,0,0,0.3);pointer-events:none;z-index:100;transition:all 0.6s cubic-bezier(0.16,1,0.3,1);";
        fl.textContent = text;
        container.appendChild(fl);
        requestAnimationFrame(() => {
            fl.style.transform = "translate(-50%, -65px) scale(1.15)";
            fl.style.opacity = "0";
        });
        setTimeout(() => fl.remove(), 650);
    }
    window.smChoice = function(action) {
        clearInterval(timerInterval);
        if (!isGameActive) return;
        let good = false;
        const card = document.getElementById('smCard');
        if (action === 'buy') {
            if (budget >= currentItem.price) {
                budget -= currentItem.price;
                if (currentItem.isEssential) {
                    good = true;
                    spawnSMFloater("✅ Essencial! +XP", "#10b981");
                } else {
                    spawnSMFloater("⚠️ Supérfluo! -R$ " + currentItem.price, "#f59e0b");
                }
                if (card) { card.style.transform = 'translateX(140%) rotate(14deg)'; card.style.opacity = '0'; }
            } else { smEnd('Faliu!'); return; }
        } else {
            if (!currentItem.isEssential) {
                good = true;
                spawnSMFloater("👏 Economizou R$ " + currentItem.price, "#3b82f6");
            } else {
                spawnSMFloater("❌ Era Essencial!", "#ef4444");
            }
            if (card) { card.style.transform = 'translateX(-140%) rotate(-14deg)'; card.style.opacity = '0'; }
        }
        if (good) goodChoices++;
        itemsProcessed++;
        const budgetEl = document.getElementById('smBudget');
        if (budgetEl) budgetEl.textContent = budget;
        if (window.__updateHUD) window.__updateHUD({type:'UPDATE_HUD', score:'R$ '+budget, level:itemsProcessed+'/'+products.length, time:Math.ceil(timeRemaining)+'s', lives:''});
        setTimeout(smRound, 320);
    };

    function smRound() {
        if (!isGameActive) return;
        if (itemsProcessed >= queue.length) { smEnd(); return; }
        currentItem = queue[itemsProcessed];
        const card = document.getElementById('smCard');
        if (card) { card.style.transform = 'none'; card.style.opacity = '1'; }
        const iconEl = document.getElementById('smIcon');
        const nameEl = document.getElementById('smName');
        const descEl = document.getElementById('smDesc');
        const priceEl = document.getElementById('smPrice');
        const counterEl = document.getElementById('smCounter');
        if (iconEl) iconEl.textContent = currentItem.icon;
        if (nameEl) nameEl.textContent = currentItem.name;
        if (descEl) descEl.textContent = currentItem.desc;
        if (priceEl) priceEl.textContent = currentItem.price;
        if (counterEl) counterEl.textContent = (itemsProcessed + 1);
        
        timeRemaining = 5;
        const fill = document.getElementById('smTimerFill');
        if (fill) { fill.style.width = '100%'; fill.style.background = 'linear-gradient(90deg, #10b981, #059669)'; }
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeRemaining -= 0.05;
            let pct = (timeRemaining / 5) * 100;
            if (fill) {
                fill.style.width = pct + '%';
                if (pct < 30) fill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
                else if (pct < 60) fill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
            }
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                window.smChoice('discard');
            }
        }, 50);
    }

    function smEnd(reason) {
        isGameActive = false;
        clearInterval(timerInterval);
        const successRatio = goodChoices / Math.max(1, itemsProcessed);
        const isWin = reason !== 'Faliu!' && successRatio >= 0.65;
        let xp = goodChoices * 12 + Math.floor(budget / 10);
        if (reason === 'Faliu!') xp = Math.floor(xp / 2);
        if (window.gamification) window.gamification.addXp(xp, '(Supermercado Consciente)');
        if (window.showModernResult) {
            window.showModernResult({
                type: isWin ? 'win' : 'lose',
                badge: isWin ? 'Consumidor Consciente' : (reason === 'Faliu!' ? 'Orçamento Estourado' : 'Consumo Excessivo'),
                heroIcon: isWin ? '🛒' : (reason === 'Faliu!' ? '💸' : '📦'),
                title: isWin ? 'Compras Exemplares!' : (reason === 'Faliu!' ? 'O Dinheiro Acabou!' : 'Atenção aos Excessos!'),
                subtitle: isWin 
                    ? 'Você priorizou o essencial, evitou o consumismo e poupou seu orçamento.' 
                    : (reason === 'Faliu!' ? 'Você comprou itens acima do seu saldo. Planeje melhor os gastos.' : 'Muitos produtos supérfluos foram adquiridos. Prefira o que é realmente vital.'),
                stats: [
                    { label: 'Saldo Restante', value: `R$ ${budget}`, icon: '🪙' },
                    { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
                    { label: 'Escolhas Certas', value: `${goodChoices}/${itemsProcessed}`, icon: '🎯' }
                ],
                onRestart: 'initSupermercadoGame()',
                restartLabel: 'Nova Compra'
            });
        }
    }

    smRound();
}

// ═══════════════════════════════════════════════════════════════
//  3. IRRIGAÇÃO INTELIGENTE (GERENCIAR TANQUE E PLANTA)
// ═══════════════════════════════════════════════════════════════
function startIrrigacaoGame() {
    showModernSplash({
        badge: 'Agricultura Sustentável',
        heroIcon: '🪴',
        title: 'Irrigação Inteligente',
        subtitle: 'Administre a água do tanque e a sede da planta: nem deixe secar, nem afogue!',
        rules: [
            { icon: '🚰', title: 'Abastecer o Tanque', desc: 'Se a água do tanque acabar, você não tem como regar e a planta morre!' },
            { icon: '💧', title: 'Regar na Medida', desc: 'Regue a planta para não secar, mas cuidado para não regar demais.' },
            { icon: '⚖️', title: 'Equilíbrio Total', desc: 'Mantenha a umidade entre 20% e 80% durante os 30 segundos!' }
        ],
        chipsLabel: 'Cuidados Vitais',
        chips: [
            { icon: '🥀', label: 'Seca (<15%)', colorClass: 'chip-yellow' },
            { icon: '🌻', label: 'Zona Ideal', colorClass: 'chip-green' },
            { icon: '💦', label: 'Afogada (>90%)', colorClass: 'chip-red' }
        ],
        onStart: 'initIrrigacaoGame()'
    });
}

function initIrrigacaoGame() {
    const container = document.getElementById('gameCanvas');
    isGameActive = true;

    container.innerHTML = `
    <div style="position:relative;width:100%;height:100%;background:linear-gradient(180deg,#38bdf8 0%,#7dd3fc 45%,#65a30d 45%,#3f6212 100%);display:flex;flex-direction:column;justify-content:space-between;align-items:center;border-radius:18px;font-family:'Nunito',sans-serif;color:white;overflow:hidden;user-select:none;">
        
        <!-- Topo: HUD de Status e Tempo -->
        <div style="width:100%;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;background:rgba(15,23,42,.65);backdrop-filter:blur(6px);box-sizing:border-box;z-index:10;">
            <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:1.5rem;">⏱️</span>
                <div>
                    <div style="font-size:0.75rem;text-transform:uppercase;color:#94a3b8;font-weight:800;">Tempo Restante</div>
                    <div id="irrTimerText" style="font-size:1.4rem;font-weight:900;color:#facc15;">30s</div>
                </div>
            </div>
            <div id="irrStatusBadge" style="padding:6px 16px;border-radius:999px;background:rgba(34,197,94,.25);border:1px solid #4ade80;font-weight:800;font-size:0.95rem;color:#86efac;transition:all .2s;">
                🌿 Planta Saudável
            </div>
        </div>

        <!-- Centro: Tanque na Esquerda, Planta na Direita -->
        <div style="flex-grow:1;width:100%;max-width:720px;display:flex;justify-content:space-around;align-items:flex-end;padding-bottom:20px;box-sizing:border-box;position:relative;z-index:5;">
            
            <!-- COLUNA TANQUE DE ÁGUA -->
            <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
                <div style="font-weight:800;font-size:1.05rem;color:#f8fafc;text-shadow:0 2px 4px rgba(0,0,0,.6);display:flex;align-items:center;gap:6px;">
                    🚰 Tanque de Água
                </div>
                <!-- Vidro/Reservatório do Tanque -->
                <div style="width:110px;height:160px;background:rgba(15,23,42,.7);border:4px solid #94a3b8;border-radius:20px;position:relative;overflow:hidden;box-shadow:0 12px 25px rgba(0,0,0,.4);display:flex;align-items:flex-end;">
                    <div id="irrTankFill" style="width:100%;height:60%;background:linear-gradient(180deg,#38bdf8,#0284c7);transition:height .2s cubic-bezier(0.16,1,0.3,1);box-shadow:inset 0 4px 8px rgba(255,255,255,.4);"></div>
                    <div id="irrTankNum" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;color:white;text-shadow:0 2px 6px rgba(0,0,0,.8);">
                        60L / 100L
                    </div>
                </div>
                <button id="irrPumpBtn" onclick="irrPumpWater()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:white;border:none;padding:12px 20px;font-size:1rem;font-weight:800;border-radius:14px;cursor:pointer;box-shadow:0 6px 0 #075985;transition:all .1s;display:flex;align-items:center;gap:6px;font-family:inherit;">
                    🚰 Encher Tanque (+15L)
                </button>
            </div>

            <!-- ANIMAÇÃO DE CHUVA/GOTAS AO REGAR -->
            <div id="irrWaterStream" style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:2.8rem;opacity:0;pointer-events:none;transition:opacity .2s, transform .2s;z-index:20;">
                💦
            </div>

            <!-- COLUNA PLANTA E UMIDADE DO SOLO -->
            <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
                <div style="font-weight:800;font-size:1.05rem;color:#f8fafc;text-shadow:0 2px 4px rgba(0,0,0,.6);display:flex;align-items:center;gap:6px;">
                    🪴 Umidade do Solo
                </div>
                
                <!-- Planta Animada -->
                <div style="height:160px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;">
                    <div id="irrPlantVisual" style="font-size:6.5rem;line-height:1;transition:transform .3s cubic-bezier(0.34,1.56,0.64,1);filter:drop-shadow(0 10px 15px rgba(0,0,0,.35));">
                        🌱
                    </div>
                    <!-- Barra de Umidade do Solo -->
                    <div style="width:160px;height:22px;background:#1e293b;border:3px solid #334155;border-radius:12px;overflow:hidden;position:relative;margin-top:6px;box-shadow:0 6px 12px rgba(0,0,0,.3);">
                        <div id="irrMoistFill" style="height:100%;width:50%;background:#22c55e;transition:width .15s ease, background-color .25s ease;"></div>
                        <!-- Marcadores de perigo (min 15% e max 85%) -->
                        <div style="position:absolute;top:0;left:15%;height:100%;border-left:2px dashed rgba(255,255,255,.5);"></div>
                        <div style="position:absolute;top:0;left:85%;height:100%;border-left:2px dashed rgba(255,255,255,.5);"></div>
                    </div>
                    <div id="irrMoistNum" style="font-size:0.9rem;font-weight:900;color:#f8fafc;margin-top:4px;text-shadow:0 1px 3px rgba(0,0,0,.7);">
                        Umidade: 50%
                    </div>
                </div>

                <button id="irrWaterBtn" onclick="irrWaterPlant()" style="background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;padding:12px 24px;font-size:1.05rem;font-weight:800;border-radius:14px;cursor:pointer;box-shadow:0 6px 0 #047857;transition:all .1s;display:flex;align-items:center;gap:6px;font-family:inherit;">
                    💧 Regar Planta (-10L)
                </button>
            </div>

        </div>

        <!-- Rodapé explicativo discreto -->
        <div style="width:100%;background:rgba(0,0,0,.5);padding:10px 16px;text-align:center;font-size:0.88rem;color:#cbd5e1;font-weight:600;box-sizing:border-box;">
            Mantenha o solo entre <strong>15%</strong> e <strong>85%</strong>. Se faltar água no tanque, você não consegue regar!
        </div>
    </div>`;

    // Efeitos de clique nos botões
    const pumpBtn = document.getElementById('irrPumpBtn');
    const waterBtn = document.getElementById('irrWaterBtn');
    if (pumpBtn) {
        pumpBtn.onmousedown = () => { pumpBtn.style.transform = 'translateY(5px)'; pumpBtn.style.boxShadow = '0 1px 0 #075985'; };
        pumpBtn.onmouseup = () => { pumpBtn.style.transform = 'none'; pumpBtn.style.boxShadow = '0 6px 0 #075985'; };
    }
    if (waterBtn) {
        waterBtn.onmousedown = () => { waterBtn.style.transform = 'translateY(5px)'; waterBtn.style.boxShadow = '0 1px 0 #047857'; };
        waterBtn.onmouseup = () => { waterBtn.style.transform = 'none'; waterBtn.style.boxShadow = '0 6px 0 #047857'; };
    }

    // Variáveis de estado
    let tankWater = 60;     // 0 a 100 Litros
    let plantMoist = 50;    // 0 a 100% de umidade
    let irrTimeLeft = 30;   // 30 segundos
    let lastTime = performance.now();
    let secondAcc = 0;

    // Ação: Reabastecer o tanque de água
    window.irrPumpWater = function() {
        if (!isGameActive) return;
        tankWater = Math.min(100, tankWater + 15);
        renderIrrUI();
    };

    // Ação: Regar a planta
    window.irrWaterPlant = function() {
        if (!isGameActive) return;

        // Se o tanque acabou: não rega!
        if (tankWater < 10) {
            const badge = document.getElementById('irrStatusBadge');
            if (badge) {
                badge.textContent = '🚫 Tanque Vazio! Encha o tanque!';
                badge.style.background = 'rgba(239,68,68,.35)';
                badge.style.borderColor = '#ef4444';
                badge.style.color = '#fca5a5';
            }
            if (waterBtn) {
                waterBtn.style.transform = 'translateX(-6px)';
                setTimeout(() => waterBtn.style.transform = 'translateX(6px)', 80);
                setTimeout(() => waterBtn.style.transform = 'none', 160);
            }
            return;
        }

        // Transfere água do tanque para a planta
        tankWater = Math.max(0, tankWater - 10);
        plantMoist = Math.min(100, plantMoist + 15);

        // Animação de respingo
        const stream = document.getElementById('irrWaterStream');
        if (stream) {
            stream.style.opacity = '1';
            stream.style.transform = 'translate(-50%, -30px) scale(1.2)';
            setTimeout(() => {
                stream.style.opacity = '0';
                stream.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 300);
        }

        renderIrrUI();
    };

    function renderIrrUI() {
        const tankFill = document.getElementById('irrTankFill');
        const tankNum = document.getElementById('irrTankNum');
        const moistFill = document.getElementById('irrMoistFill');
        const moistNum = document.getElementById('irrMoistNum');
        const plantVisual = document.getElementById('irrPlantVisual');
        const statusBadge = document.getElementById('irrStatusBadge');
        const timerText = document.getElementById('irrTimerText');

        if (!tankFill || !moistFill) return;

        // Atualiza Tanque
        tankFill.style.height = tankWater + '%';
        if (tankWater < 15) {
            tankFill.style.background = 'linear-gradient(180deg,#ef4444,#b91c1c)';
        } else {
            tankFill.style.background = 'linear-gradient(180deg,#38bdf8,#0284c7)';
        }
        tankNum.textContent = `${Math.round(tankWater)}L / 100L`;

        // Atualiza Umidade
        moistFill.style.width = plantMoist + '%';
        moistNum.textContent = `Umidade: ${Math.round(plantMoist)}%`;

        if (plantMoist <= 20) {
            moistFill.style.backgroundColor = '#ef4444';
            statusBadge.textContent = '🥀 Solo Perigosamente Seco!';
            statusBadge.style.background = 'rgba(239,68,68,.3)';
            statusBadge.style.borderColor = '#ef4444';
            statusBadge.style.color = '#fca5a5';
        } else if (plantMoist >= 80) {
            moistFill.style.backgroundColor = '#3b82f6';
            statusBadge.textContent = '🌊 Cuidado: Risco de Encharcar!';
            statusBadge.style.background = 'rgba(59,130,246,.3)';
            statusBadge.style.borderColor = '#3b82f6';
            statusBadge.style.color = '#93c5fd';
        } else {
            moistFill.style.backgroundColor = '#22c55e';
            statusBadge.textContent = tankWater < 15 ? '⚠️ Tanque Quase Vazio!' : '🌿 Planta Saudável';
            statusBadge.style.background = 'rgba(34,197,94,.25)';
            statusBadge.style.borderColor = '#4ade80';
            statusBadge.style.color = '#86efac';
        }

        // Evolução da planta por tempo e saúde
        if (plantVisual) {
            if (irrTimeLeft > 20) plantVisual.textContent = '🌱';
            else if (irrTimeLeft > 10) plantVisual.textContent = '🌿';
            else plantVisual.textContent = '🌻';
        }

        if (timerText) timerText.textContent = `${irrTimeLeft}s`;
    }

    function irrLoop(ts) {
        if (!isGameActive) return;
        let dt = Math.min(ts - lastTime, 80);
        lastTime = ts;

        // O solo vai secando continuamente com o tempo (~2.6% por segundo)
        plantMoist -= 0.0026 * dt * 10;
        if (plantMoist < 0) plantMoist = 0;

        // Condições de Derrota Imediata
        if (plantMoist <= 5) {
            plantMoist = 0;
            renderIrrUI();
            const plantEl = document.getElementById('irrPlantVisual');
            if (plantEl) plantEl.textContent = '🥀';
            irrEnd('seca');
            return;
        }

        if (plantMoist >= 95) {
            plantMoist = 100;
            renderIrrUI();
            const plantEl = document.getElementById('irrPlantVisual');
            if (plantEl) plantEl.textContent = '💦';
            irrEnd('afogada');
            return;
        }

        // Contador de Segundos
        secondAcc += dt;
        if (secondAcc >= 1000) {
            secondAcc = 0;
            irrTimeLeft--;
            if (window.__updateHUD) {
                window.__updateHUD({
                    type: 'UPDATE_HUD',
                    time: irrTimeLeft + 's',
                    lives: '',
                    score: Math.round(plantMoist) + '% Umid',
                    level: Math.round(tankWater) + 'L Água'
                });
            }
            if (irrTimeLeft <= 0) {
                irrEnd('win');
                return;
            }
        }

        renderIrrUI();
        gameInterval = requestAnimationFrame(irrLoop);
    }

    function irrEnd(reason) {
        isGameActive = false;
        let xp = 0;
        let title = '', msg = '', icon = '🌻';

        if (reason === 'win') {
            xp = 120;
            icon = '🌻';
            title = 'Colheita Perfeita!';
            msg = 'Parabéns! Você administrou a água do tanque e a umidade do solo com maestria.';
        } else if (reason === 'seca') {
            xp = 15;
            icon = '🥀';
            title = 'A Planta Morreu de Seca!';
            msg = tankWater < 10 
                ? 'A água do tanque acabou e você não teve como regar a planta a tempo!' 
                : 'O solo ficou seco demais e a planta ressecou. Regue com mais frequência!';
        } else if (reason === 'afogada') {
            xp = 15;
            icon = '💦';
            title = 'A Planta Afogou!';
            msg = 'Você regou em excesso e encharcou as raízes. Água demais também mata a planta!';
        }

        if (window.gamification) window.gamification.addXp(xp, '(Irrigação Inteligente)');

        if (window.showModernResult) {
            window.showModernResult({
                type: reason === 'win' ? 'win' : 'lose',
                badge: reason === 'win' ? 'Cultivo Sustentável' : 'Ciclo Interrompido',
                heroIcon: icon,
                title: title,
                subtitle: msg,
                stats: [
                    { label: 'Resultado', value: reason === 'win' ? '100% Florada' : 'Perdida', icon: '🌱' },
                    { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
                    { label: 'Água no Tanque', value: `${Math.round(tankWater)}L`, icon: '🚰' }
                ],
                onRestart: 'initIrrigacaoGame()',
                restartLabel: 'Tentar Novamente'
            });
        } else {
            document.getElementById('gameCanvas').innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:white;text-align:center;padding:24px;">
                <div style="font-size:4rem;margin-bottom:12px;">${icon}</div>
                <h2>${title}</h2>
                <p style="max-width:400px;margin-bottom:18px;color:#94a3b8;">${msg}</p>
                <button class="btn btn-primary" onclick="initIrrigacaoGame()">Jogar Novamente</button>
            </div>`;
        }
    }

    if (window.__updateHUD) {
        window.__updateHUD({ type: 'UPDATE_HUD', time: '30s', lives: '', score: '50% Umid', level: '60L Água' });
    }
    gameInterval = requestAnimationFrame(irrLoop);
}

// ═══════════════════════════════════════════════════════════════
//  4. PEGADA ECOLÓGICA
// ═══════════════════════════════════════════════════════════════
function startPegadaGame() {
    showModernSplash({
        badge: 'Impacto & Clima',
        heroIcon: '👣',
        title: 'Pegada Ecológica',
        subtitle: 'Tome decisões cotidianas sustentáveis para manter suas emissões no menor nível!',
        rules: [
            { icon: '☀️', title: 'Dia Simulado', desc: 'Enfrente 5 escolhas cotidianas de alimentação e transporte.' },
            { icon: '📉', title: 'Reduzir CO₂', desc: 'Opções sustentáveis mantêm a pegada de carbono baixa.' },
            { icon: '🌿', title: 'Conservar XP', desc: 'Tente terminar com menos de 3 kg de CO₂ para ganhar mais XP!' }
        ],
        chipsLabel: 'Áreas de Impacto',
        chips: [
            { icon: '🚗', label: 'Transporte', colorClass: 'chip-cyan' },
            { icon: '🍔', label: 'Dieta', colorClass: 'chip-yellow' },
            { icon: '💡', label: 'Energia', colorClass: 'chip-lime' },
            { icon: '🛍️', label: 'Consumo', colorClass: 'chip-purple' }
        ],
        onStart: 'initPegadaGame()'
    });
}

function initPegadaGame() {
    if (window.configureGameHUD) window.configureGameHUD({ showLevel: true, showScore: true, showLives: false, showTime: false });
    isGameActive = true;
    const container = document.getElementById('gameCanvas');

    const scenarios = [
        {time:'Manhã',icon:'🚗',title:'Indo para o Trabalho',desc:'Como você vai se deslocar na sua rotina hoje?',options:[{text:'Ir sozinho de carro a combustão',co2:4.5},{text:'Pegar o ônibus elétrico ou metrô',co2:1.2},{text:'Ir de bicicleta ou caminhando',co2:0.0}]},
        {time:'Almoço',icon:'🍽️',title:'Hora da Refeição',desc:'Qual será o seu prato principal hoje?',options:[{text:'Carne bovina de corte tradicional',co2:6.8},{text:'Frango com salada e grãos',co2:1.5},{text:'Prato 100% vegetariano e orgânico',co2:0.4}]},
        {time:'Tarde',icon:'☕',title:'Pausa para o Café',desc:'Você vai tomar um café na cafeteria. Como faz?',options:[{text:'Copo plástico descartável com tampa',co2:0.4},{text:'Copo de papel descartável',co2:0.2},{text:'Utilizar sua caneca reutilizável',co2:0.0}]},
        {time:'Noite',icon:'💡',title:'Chegando em Casa',desc:'A temperatura caiu e está frio. Qual a sua escolha?',options:[{text:'Ligar ar condicionado no quente o tempo todo',co2:3.2},{text:'Ligar um aquecedor elétrico por 1 hora',co2:1.2},{text:'Vestir um agasalho quente e fechar cortinas',co2:0.0}]},
        {time:'Fim da Noite',icon:'🚿',title:'Hora do Banho',desc:'Antes de relaxar e dormir, como será o banho?',options:[{text:'Banho longo de banheira',co2:2.8},{text:'Chuveiro quente longo (15 minutos)',co2:1.8},{text:'Banho consciente e rápido (5 minutos)',co2:0.5}]},
    ];

    let currentIdx = 0, totalCO2 = 0;

    function renderScenario() {
        if (currentIdx >= scenarios.length) { pegadaEnd(); return; }
        const s = scenarios[currentIdx];
        if (window.__updateHUD) window.__updateHUD({type:'UPDATE_HUD', score:totalCO2.toFixed(1)+' kg CO₂', level:(currentIdx+1)+'/'+scenarios.length, time:'', lives:''});
        
        container.innerHTML = `
        <div class="peg-game-container">
            <div class="peg-scenario-card">
                <div class="peg-time-pill">
                    <span id="pegTimeIcon">${s.icon}</span>
                    <span id="pegTimeLabel">${s.time}</span>
                    <span class="peg-step-badge">Etapa ${currentIdx + 1} de ${scenarios.length}</span>
                </div>
                <div class="peg-hero-icon">${s.icon}</div>
                <h3 class="peg-scenario-title">${s.title}</h3>
                <p class="peg-scenario-desc">${s.desc}</p>
                <div class="peg-options-list">
                    ${s.options.map(o => {
                        let pillClass = o.co2 === 0 ? 'green' : (o.co2 < 2 ? 'yellow' : 'red');
                        return `
                        <button onclick="pegadaChoose(${o.co2})" class="peg-option-btn">
                            <span>${o.text}</span>
                            <span class="peg-impact-pill ${pillClass}">+${o.co2.toFixed(1)} kg CO₂</span>
                        </button>`;
                    }).join('')}
                </div>
                <div class="peg-live-footer">
                    <span>Emissão Acumulada: <strong>${totalCO2.toFixed(1)} kg</strong> de CO₂</span>
                </div>
            </div>
        </div>`;
        
        window.pegadaChoose = function(co2) {
            totalCO2 += co2;
            currentIdx++;
            renderScenario();
        };
    }

    function pegadaEnd() {
        isGameActive = false;
        const maxCO2 = 18;
        const efficiency = Math.max(0, (maxCO2 - totalCO2) / maxCO2);
        const isWin = totalCO2 < 8;
        const xp = Math.max(20, Math.floor(efficiency * 140));
        if (window.gamification) window.gamification.addXp(xp, '(Pegada Ecológica)');
        if (window.showModernResult) {
            window.showModernResult({
                type: isWin ? 'win' : 'lose',
                badge: totalCO2 < 3 ? 'Emissões Mínimas' : (totalCO2 < 8 ? 'Pegada Moderada' : 'Alerta de Emissões'),
                heroIcon: totalCO2 < 3 ? '🌱' : (totalCO2 < 8 ? '🌿' : '🌫️'),
                title: totalCO2 < 3 ? 'Herói do Clima!' : (totalCO2 < 8 ? 'Bom Equilíbrio!' : 'Pegada Elevada!'),
                subtitle: totalCO2 < 3 
                    ? 'Suas escolhas cotidianas preservam a atmosfera e reduzem drasticamente o aquecimento global.' 
                    : (totalCO2 < 8 ? 'Você manteve bons hábitos sustentáveis, com pequenos pontos de melhoria.' : 'Muitas emissões foram acumuladas no dia. Prefira transporte ativo e consumo sustentável.'),
                stats: [
                    { label: 'Total CO₂', value: `${totalCO2.toFixed(1)} kg`, icon: '👣' },
                    { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
                    { label: 'Eficiência Verde', value: `${Math.round(efficiency * 100)}%`, icon: '🌍' }
                ],
                onRestart: 'initPegadaGame()',
                restartLabel: 'Simular Novo Dia'
            });
        }
    }

    renderScenario();
}

// ═══════════════════════════════════════════════════════════════
//  5–7. GARI, VAZAMENTO e INCÊNDIO — Splash + iframe nativo
//  Estes jogos são complexos demais para portar sem bugs;
//  usam iframe transparente que inicia automaticamente.
// ═══════════════════════════════════════════════════════════════
function startGariGame() {
    if (window.configureGameHUD) window.configureGameHUD({ showLevel: true, showScore: true, showLives: true, showTime: false });
    showModernSplash({
        badge: 'Mergulho & Limpeza',
        heroIcon: '🤿',
        title: 'Gari Aquático',
        subtitle: 'Mergulhe fundo e salve os recifes recolhendo o lixo humano!',
        rules: [
            { icon: '🏊', title: 'Natação', desc: 'Use WASD ou setas do teclado para nadar no oceano.' },
            { icon: '🗑️', title: 'Coletar Detritos', desc: 'Recolha plástico e latas flutuando na água.' },
            { icon: '🦈', title: 'Perigo!', desc: 'Desvie do tubarão e não encoste nos peixes!' }
        ],
        chipsLabel: 'Elementos do Mergulho',
        chips: [
            { icon: '🏊', label: 'Nadar', colorClass: 'chip-blue' },
            { icon: '🗑️', label: 'Coletar', colorClass: 'chip-green' },
            { icon: '🐟', label: 'Preservar', colorClass: 'chip-yellow' },
            { icon: '🦈', label: 'Cuidado!', colorClass: 'chip-red' }
        ],
        onStart: "launchGameFile('gari.html')"
    });
}

function startVazamentoGame() {
    if (window.configureGameHUD) window.configureGameHUD({ showLevel: true, showScore: true, showLives: true, showTime: false });
    showModernSplash({
        badge: 'Recursos Hídricos',
        heroIcon: '🪴',
        title: 'Caça ao Vazamento',
        subtitle: 'Colete a água dos vazamentos para regar sua planta sem desperdício!',
        rules: [
            { icon: '🪴', title: 'Movimentar', desc: 'Mova o vaso com WASD ou Setas pelo cenário.' },
            { icon: '💧', title: 'Aparar Gotas', desc: 'Posicione o vaso sob os canos que estão pingando.' },
            { icon: '🌿', title: 'Regar Planta', desc: 'Leve o vaso cheio até a planta para mantê-la viva!' }
        ],
        chipsLabel: 'Objetivos',
        chips: [
            { icon: '💧', label: 'Água Potável', colorClass: 'chip-cyan' },
            { icon: '🪴', label: 'Vaso Coletor', colorClass: 'chip-yellow' },
            { icon: '🌿', label: 'Regar Planta', colorClass: 'chip-green' }
        ],
        onStart: "launchGameFile('vazamento.html')"
    });
}

function startIncendioGame() {
    if (window.configureGameHUD) window.configureGameHUD({ showLevel: false, showScore: true, showLives: true, showTime: true });
    showModernSplash({
        badge: 'Proteção Florestal',
        heroIcon: '🔥',
        title: 'Incêndio Zero',
        subtitle: 'Pilote o helicóptero bombeiro e apague as chamas na floresta!',
        rules: [
            { icon: '🚁', title: 'Pilotar', desc: 'Mova o mouse para pilotar o helicóptero bombeiro.' },
            { icon: '💦', title: 'Lançar Água', desc: 'Clique para despejar água sobre árvores em chamas.' },
            { icon: '🌫️', title: 'Fumaça', desc: 'Não deixe o nível de fumaça atingir o limite crítico!' }
        ],
        chipsLabel: 'Combate ao Fogo',
        chips: [
            { icon: '🚁', label: 'Helicóptero', colorClass: 'chip-blue' },
            { icon: '💦', label: 'Água', colorClass: 'chip-cyan' },
            { icon: '🌳', label: 'Proteger Mata', colorClass: 'chip-green' },
            { icon: '🔥', label: 'Chamas', colorClass: 'chip-red' }
        ],
        onStart: "launchGameFile('incendio.html')"
    });
}

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
