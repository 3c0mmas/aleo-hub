import { useEffect, useRef } from "react";

export default function BlockSnake() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const flashRef = useRef(0);
  const spawnFlashRef = useRef([]);
  const shardsRef = useRef([]);
  const statsRef = useRef({ slashed: 0 });
  const bombsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = {
      main: "#EEFFA8",
      glow: "#C4FFC2",
      bg: "#0b0b0b",
      enemy: "#FFE2FC",
      tx: "#C4FFC2",
      bomb: "#FF5C5C",
      grid: "rgba(255,255,255,0.12)",
      text: "rgba(255,255,255,0.7)",
      flash: "rgba(238,255,168,0.3)",
      shard: "rgba(255,226,252,0.8)",
    };

    const CELL = 24;
    let w = 0;
    let h = 0;
    let COLS = 0;
    let ROWS = 0;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(CELL * 4, rect.width);
      h = Math.max(CELL * 4, rect.height);
      canvas.width = w;
      canvas.height = h;
      COLS = Math.max(4, Math.floor(w / CELL));
      ROWS = Math.max(4, Math.floor(h / CELL));
    };

    updateDimensions();

    let tick = 0;
    let stepMs = 150;
    let last = 0;
    let running = false;
    let score = 0;
    let level = 1;

    const snake = [
      { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
      { x: Math.max(0, Math.floor(COLS / 2) - 1), y: Math.floor(ROWS / 2) },
    ];

    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };

    const enemies = [];
    let tx = null;
    let power = null;
    let powerTime = 0;

    const cellEquals = (a, b) => a && b && a.x === b.x && a.y === b.y;
    const inBounds = (c) => c.x >= 0 && c.y >= 0 && c.x < COLS && c.y < ROWS;

    function occupied(c) {
      return (
        snake.some((s) => cellEquals(s, c)) ||
        enemies.some((e) => e.alive && cellEquals(e, c)) ||
        (tx && cellEquals(tx, c)) ||
        (power && cellEquals(power, c)) ||
        bombsRef.current.some((b) => cellEquals(b, c))
      );
    }

    function spawnFree() {
      let c;
      let tries = 0;
      do {
        c = {
          x: Math.floor(Math.random() * COLS),
          y: Math.floor(Math.random() * ROWS),
        };
        tries++;
        if (tries > 100) break;
      } while (occupied(c));
      return c;
    }

    function spawnEnemy() {
      const e = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
        alive: true,
      };
      spawnFlashRef.current.push({ x: e.x, y: e.y, alpha: 1 });
      return e;
    }

    function addEnemiesForLevel() {
      const count = level <= 3 ? 2 : level <= 8 ? 3 : 5;
      for (let i = 0; i < count; i++) {
        enemies.push(spawnEnemy());
      }
    }

    tx = spawnFree();
    addEnemiesForLevel();

    const keyDir = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      KeyW: { x: 0, y: -1 },
      KeyS: { x: 0, y: 1 },
      KeyA: { x: -1, y: 0 },
      KeyD: { x: 1, y: 0 },
    };

    const onKey = (e) => {
      if (e.code === "Space") {
        if (!running && score > 0) resetGame();
        running = !running;
        return;
      }
      const nd = keyDir[e.code];
      if (!nd) return;
      if (snake.length > 1 && nd.x === -dir.x && nd.y === -dir.y) return;
      nextDir = nd;
    };

    window.addEventListener("keydown", onKey);

    const onCanvasClick = (e) => {
      if (!running) {
        running = true;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(((e.clientX ?? 0) - rect.left) / CELL);
      const y = Math.floor(((e.clientY ?? 0) - rect.top) / CELL);
      for (const enemy of enemies) {
        if (enemy.alive && cellEquals(enemy, { x, y })) {
          enemy.alive = false;
          score += 5;
          statsRef.current.slashed++;
          for (let i = 0; i < 8; i++) {
            shardsRef.current.push({
              x: x * CELL + CELL / 2,
              y: y * CELL + CELL / 2,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 1,
            });
          }
        }
      }
    };

    canvas.addEventListener("click", onCanvasClick);

    function resetGame() {
      updateDimensions();
      level = 1;
      score = 0;
      statsRef.current.slashed = 0;
      enemies.length = 0;
      bombsRef.current = [];
      spawnFlashRef.current = [];
      shardsRef.current = [];
      addEnemiesForLevel();
      const centerX = Math.floor(COLS / 2);
      const centerY = Math.floor(ROWS / 2);
      snake.length = 2;
      snake[0] = { x: centerX, y: centerY };
      snake[1] = { x: Math.max(0, centerX - 1), y: centerY };
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      tx = spawnFree();
      power = null;
      powerTime = 0;
      running = true;
      stepMs = 150;
      flashRef.current = 0;
    }

    function triggerBombs() {
      for (const e of enemies) {
        if (e.alive) {
          e.alive = false;
          statsRef.current.slashed++;
          score += 5;
          for (let i = 0; i < 6; i++) {
            shardsRef.current.push({
              x: e.x * CELL + CELL / 2,
              y: e.y * CELL + CELL / 2,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              life: 1,
            });
          }
        }
      }
      bombsRef.current = [];
    }

    function step() {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (!inBounds(head)) return gameOver();
      if (!power || powerTime <= 0) {
        for (let i = 0; i < snake.length; i++) {
          if (cellEquals(snake[i], head)) return gameOver();
        }
        if (enemies.some((e) => e.alive && cellEquals(e, head))) return gameOver();
      }

      snake.unshift(head);

      if (cellEquals(head, tx)) {
        score += 10;
        tx = spawnFree();
        level++;
        addEnemiesForLevel();

        if (level % 5 === 0) {
          stepMs = Math.max(60, stepMs - 10);
          const bombSpawn = spawnFree();
          bombsRef.current.push({ ...bombSpawn, timer: 300 });
        }

        if (!power && Math.random() < 0.3) power = spawnFree();
        flashRef.current = 1;
      } else {
        snake.pop();
      }

      for (const bomb of bombsRef.current) {
        bomb.timer--;
      }
      bombsRef.current = bombsRef.current.filter((b) => b.timer > 0);

      for (const bomb of bombsRef.current) {
        if (cellEquals(head, bomb)) {
          triggerBombs();
          break;
        }
      }

      if (power && cellEquals(head, power)) {
        power = null;
        powerTime = 30 + level * 10;
      }

      if (powerTime > 0) powerTime--;
    }

    function gameOver() {
      running = false;
    }

    function drawCell(c, color, glow = false, alpha = 1) {
      if (!c) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
      }
      ctx.fillStyle = color;
      ctx.fillRect(c.x * CELL + 3, c.y * CELL + 3, CELL - 6, CELL - 6);
      ctx.restore();
    }

    function renderShards() {
      for (const shard of shardsRef.current) {
        ctx.save();
        ctx.fillStyle = COLORS.shard;
        ctx.globalAlpha = shard.life;
        ctx.fillRect(shard.x, shard.y, 3, 3);
        ctx.restore();
        shard.x += shard.vx;
        shard.y += shard.vy;
        shard.life -= 0.03;
      }
      shardsRef.current = shardsRef.current.filter((s) => s.life > 0);
    }

    function renderSpawnFlashes() {
      for (const flash of spawnFlashRef.current) {
        if (flash.alpha <= 0) continue;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = COLORS.enemy;
        ctx.globalAlpha = flash.alpha * 0.5;
        const px = flash.x * CELL + CELL / 2;
        const py = flash.y * CELL + CELL / 2;
        const radius = (1 - flash.alpha) * 40 + 8;
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        flash.alpha -= 0.05;
      }
      spawnFlashRef.current = spawnFlashRef.current.filter((f) => f.alpha > 0);
    }

    function render() {
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL + 0.5, 0);
        ctx.lineTo(x * CELL + 0.5, h);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL + 0.5);
        ctx.lineTo(w, y * CELL + 0.5);
        ctx.stroke();
      }

      renderSpawnFlashes();
      renderShards();

      if (flashRef.current > 0) {
        ctx.save();
        ctx.fillStyle = COLORS.flash;
        ctx.globalAlpha = flashRef.current * 0.5;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        flashRef.current *= 0.9;
      }

      drawCell(tx, COLORS.tx, true);
      if (power) drawCell(power, COLORS.glow, true, 0.8);
      for (const e of enemies) {
        if (e.alive) drawCell(e, COLORS.enemy, false, 0.9);
      }
      for (const b of bombsRef.current) {
        drawCell(b, COLORS.bomb, true, 0.9);
      }
      for (let i = snake.length - 1; i >= 0; i--) {
        const a = 0.45 + 0.55 * (i === 0 ? 1 : i / snake.length);
        drawCell(snake[i], COLORS.main, true, a);
      }

      ctx.save();
      ctx.fillStyle = COLORS.text;
      ctx.font = "14px monospace";
      const messageY = h - 16;
      if (!running && score > 0) {
        ctx.fillText(
          `GAME OVER — Level ${level}, Slashed ${statsRef.current.slashed} nodes`,
          12,
          messageY - 16,
        );
        ctx.fillText(`Tap / Space to Restart`, 12, messageY + 8);
      } else {
        const status = running ? "" : "Tap / Space to Start";
        ctx.fillText(
          `Score: ${score}  Level: ${level}  Slashed: ${statsRef.current.slashed}  ${status}`,
          12,
          messageY,
        );
      }
      ctx.restore();
    }

    function loop(ts) {
      if (!last) last = ts;
      const dt = ts - last;
      if (running) tick += dt;
      if (tick >= stepMs) {
        step();
        tick = 0;
      }
      render();
      last = ts;
      rafRef.current = requestAnimationFrame(loop);
    }

    const handleResize = () => {
      const prevRunning = running;
      updateDimensions();
      if (!inBounds(snake[0])) {
        resetGame();
      } else if (!prevRunning) {
        running = false;
      }
    };

    window.addEventListener("resize", handleResize);

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", onCanvasClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full block" />;
}
