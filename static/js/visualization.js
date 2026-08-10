function initVisualization() {
  const canvas = document.getElementById("visualCanvas");
  if (!canvas) {
    console.error("visualCanvas element not found");
    return;
  }
  canvas.style.background = "#07101d";
  console.log("visualization.js loaded. THREE:", typeof THREE);

  try {
    if (typeof THREE === "undefined" || typeof THREE.Scene !== "function") {
      console.log("Using fallback 2D visualization");
      const ctx = canvas.getContext("2d");
      let activeFallback = "solar";
      let angle = 0;
      let zoom = 1;
      let dragStart = null;
      const labels = [];

      function fitFallback() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * window.devicePixelRatio);
        canvas.height = Math.floor(rect.height * window.devicePixelRatio);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      }

      function setText(title, info) {
        document.getElementById("modelTitle").textContent = title;
        document.getElementById("modelInfo").textContent = info;
        document.getElementById("objectLabel").textContent = "No object selected";
      }

      function drawBall(x, y, r, color, name, label) {
        const gradient = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.2, color);
        gradient.addColorStop(1, "#162033");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        labels.push({ x, y, r, name, label });
      }

      function hitTest(item, x, y) {
        if (item.w && item.h) {
          return x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h;
        }
        return Math.hypot(item.x - x, item.y - y) <= item.r + 8;
      }

      function invertTransform(x, y, width, height) {
        const cx = width / 2;
        const cy = height / 2;
        const dx = (x - cx) / zoom;
        const dy = (y - cy) / zoom;
        const cosA = Math.cos(-angle);
        const sinA = Math.sin(-angle);
        return {
          x: dx * cosA - dy * sinA + cx,
          y: dx * sinA + dy * cosA + cy,
        };
      }

      function drawPeriodicTable() {
        setText("Periodic Table", "Offline periodic table. Click elements to learn their symbols and atomic numbers.");
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const margin = 24;
        const cols = 18;
        const blockW = Math.min(60, (width - margin * 2 - (cols - 1) * 10) / cols);
        const blockH = 70;
        const elements = periodicElements || [];
        labels.length = 0;
        elements.forEach((element) => {
          const x = margin + (element.group - 1) * (blockW + 10);
          const y = margin + (element.period - 1) * (blockH + 10);
          ctx.fillStyle = "#0e1f33";
          ctx.fillRect(x, y, blockW, blockH);
          ctx.strokeStyle = "#4276a6";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, blockW, blockH);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText(element.symbol, x + 8, y + 24);
          ctx.font = "12px sans-serif";
          ctx.fillText(`#${element.number}`, x + 8, y + 42);
          ctx.fillText(element.name, x + 8, y + 58);
          labels.push({ x, y, w: blockW, h: blockH, name: element.symbol, label: `${element.name}, atomic number ${element.number}.` });
        });
      }

      function drawFallback() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const cx = width / 2;
        const cy = height / 2;
        labels.length = 0;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#07101d";
        ctx.fillRect(0, 0, width, height);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(zoom, zoom);
        if (activeFallback !== "periodic") ctx.rotate(angle);
        ctx.translate(-cx, -cy);

        if (activeFallback === "solar") {
          setText("Solar System Model", "Offline interactive model. Click planets to inspect labels.");
          drawBall(cx, cy, 46, "#ffc857", "Sun", "The Sun is the star at the center of the solar system.");
          [["Mercury", 90, 12, "#aaa7a0"], ["Venus", 135, 17, "#d9a65f"], ["Earth", 190, 19, "#2d8cff"], ["Mars", 245, 16, "#d96145"], ["Jupiter", 325, 31, "#d7b58c"]].forEach(([name, distance, radius, color], index) => {
            ctx.strokeStyle = "rgba(111, 182, 255, 0.28)";
            ctx.beginPath();
            ctx.arc(cx, cy, distance, 0, Math.PI * 2);
            ctx.stroke();
            drawBall(cx + Math.cos(angle * (index + 1) + index) * distance, cy + Math.sin(angle * (index + 1) + index) * distance, radius, color, name, `${name} orbits the Sun and demonstrates gravity, motion, and scale.`);
          });
        } else if (activeFallback === "atom") {
          setText("Atom Structure Model", "Offline interactive model. Click the nucleus or electrons.");
          drawBall(cx, cy, 44, "#e96f5a", "Nucleus", "The nucleus contains protons and neutrons.");
          for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((Math.PI / 3) * i);
            ctx.strokeStyle = "rgba(89, 215, 197, 0.7)";
            ctx.beginPath();
            ctx.ellipse(0, 0, 190, 58, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
            drawBall(cx + Math.cos(angle * 2 + i * 2) * 190, cy + Math.sin(angle * 2 + i * 2) * 58, 13, "#6fb6ff", `Electron ${i + 1}`, "Electrons occupy regions around the nucleus and help form bonds.");
          }
        } else if (activeFallback === "periodic") {
          drawPeriodicTable();
        } else {
          setText("Human Cell Model", "Offline interactive model. Click organelles to learn their function.");
          ctx.fillStyle = "rgba(110, 199, 178, 0.24)";
          ctx.strokeStyle = "#6ec7b2";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 260, 185, angle * 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          drawBall(cx - 60, cy, 48, "#8b6fe8", "Nucleus", "The nucleus stores DNA and controls many cell activities.");
          drawBall(cx + 105, cy - 58, 28, "#f4b942", "Mitochondrion", "Mitochondria release energy from food for cell work.");
          drawBall(cx - 145, cy + 70, 27, "#6fb6ff", "Vacuole", "Vacuoles store water, nutrients, and waste materials.");
          drawBall(cx + 160, cy + 78, 18, "#e96f5a", "Ribosome", "Ribosomes help build proteins.");
        }
        ctx.restore();
        angle += activeFallback === "periodic" ? 0 : 0.006;
        requestAnimationFrame(drawFallback);
      }

      canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        const { x, y } = invertTransform(clickX, clickY, canvas.clientWidth, canvas.clientHeight);
        const hit = labels.find((item) => hitTest(item, x, y));
        if (hit) document.getElementById("objectLabel").textContent = `${hit.name}: ${hit.label}`;
      });
      canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        zoom = Math.min(1.6, Math.max(0.65, zoom + (event.deltaY > 0 ? -0.06 : 0.06)));
      });
      canvas.addEventListener("pointerdown", (event) => { dragStart = event.clientX; });
      canvas.addEventListener("pointermove", (event) => {
        if (dragStart !== null) {
          angle += (event.clientX - dragStart) * 0.003;
          dragStart = event.clientX;
        }
      });
      canvas.addEventListener("pointerup", () => { dragStart = null; });

      document.querySelectorAll(".model-btn").forEach((button) => {
        button.addEventListener("click", () => {
          document.querySelectorAll(".model-btn").forEach((item) => {
            item.classList.toggle("btn-primary", item === button);
            item.classList.toggle("btn-outline-primary", item !== button);
          });
          activeFallback = button.dataset.model;
        });
      });

      window.addEventListener("resize", fitFallback);
      fitFallback();
      drawFallback();
    } else {
      if (typeof THREE.OrbitControls !== "function") {
        throw new Error("THREE.OrbitControls is not loaded. Check the vendor script reference.");
      }
      console.log("Using Three.js 3D visualization");
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x07101d);
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
      camera.position.set(0, 7, 15);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const clickable = [];
      let activeGroup = new THREE.Group();
      let model = "solar";
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const light = new THREE.PointLight(0xffffff, 1.2);
      light.position.set(6, 10, 8);
      scene.add(light);

      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height, false);
      }

      function material(color, emissive = 0x000000) {
        return new THREE.MeshStandardMaterial({ color, emissive, roughness: 0.45, metalness: 0.05 });
      }

      function sphere(name, radius, color, x, label, emissive) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), material(color, emissive));
        mesh.position.x = x;
        mesh.userData = { name, label };
        clickable.push(mesh);
        activeGroup.add(mesh);
        return mesh;
      }

      function ring(radius, color) {
        const curve = new THREE.RingGeometry(radius - 0.015, radius + 0.015, 96);
        const mesh = new THREE.Mesh(curve, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
        mesh.rotation.x = Math.PI / 2;
        activeGroup.add(mesh);
      }

      function clearScene() {
        clickable.length = 0;
        scene.remove(activeGroup);
        activeGroup = new THREE.Group();
        scene.add(activeGroup);
      }

      function buildSolar() {
        clearScene();
        document.getElementById("modelTitle").textContent = "Solar System Model";
        document.getElementById("modelInfo").textContent = "Click planets to inspect their role. Drag to rotate and scroll to zoom.";
        sphere("Sun", 1.3, 0xffc857, 0, "The Sun is the star at the center of the solar system.", 0xff8c00);
        [["Mercury", 2.3, 0xaaa7a0], ["Venus", 3.3, 0xd9a65f], ["Earth", 4.5, 0x2d8cff], ["Mars", 5.8, 0xd96145], ["Jupiter", 7.6, 0xd7b58c]].forEach(([name, dist, color]) => {
          sphere(name, name === "Jupiter" ? 0.75 : 0.38, color, dist, `${name} orbits the Sun and demonstrates gravity, motion, and scale.`);
          ring(dist, 0x2c557a);
        });
      }

      function buildAtom() {
        clearScene();
        document.getElementById("modelTitle").textContent = "Atom Structure Model";
        document.getElementById("modelInfo").textContent = "Click the nucleus or electrons to view atomic labels.";
        sphere("Nucleus", 1.1, 0xe96f5a, 0, "The nucleus contains protons and neutrons and holds most atomic mass.");
        [0, Math.PI / 3, -Math.PI / 3].forEach((angleValue) => {
          const orbit = new THREE.Mesh(new THREE.TorusGeometry(4, 0.02, 8, 128), new THREE.MeshBasicMaterial({ color: 0x59d7c5 }));
          orbit.rotation.set(angleValue, Math.PI / 2, 0);
          activeGroup.add(orbit);
        });
        [[4, 0, 0], [-2, 3.4, 0], [-2, -3.4, 0]].forEach((pos, index) => {
          const electron = sphere(`Electron ${index + 1}`, 0.28, 0x6fb6ff, pos[0], "Electrons occupy regions around the nucleus and are involved in bonding.");
          electron.position.y = pos[1];
        });
      }

      function buildCell() {
        clearScene();
        document.getElementById("modelTitle").textContent = "Human Cell Model";
        document.getElementById("modelInfo").textContent = "Click organelles to learn their function.";
        const cell = sphere("Cell membrane", 4.2, 0x6ec7b2, 0, "The cell membrane controls movement of substances in and out.");
        cell.material.transparent = true;
        cell.material.opacity = 0.28;
        sphere("Nucleus", 1.1, 0x8b6fe8, -0.8, "The nucleus stores DNA and controls many cell activities.");
        sphere("Mitochondrion", 0.6, 0xf4b942, 1.8, "Mitochondria release energy from food for cell work.");
        sphere("Vacuole", 0.55, 0x6fb6ff, -2.4, "Vacuoles store water, nutrients, and waste materials.");
        const ribosome = sphere("Ribosome", 0.35, 0xe96f5a, 2.8, "Ribosomes help build proteins.");
        ribosome.position.y = -1.4;
      }

      function getElementColor(group) {
        if (group <= 2) return 0xffb27f;
        if (group <= 12) return 0x6aa5d8;
        return 0x6bcfb3;
      }

      function createTextLabel(text, color = "#ffffff") {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(6, 16, 26, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const lines = text.split("\n");
        const lineHeight = 26;
        const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, idx) => {
          ctx.fillText(line, canvas.width / 2, startY + idx * lineHeight);
        });
        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.needsUpdate = true;
        const materialSprite = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(materialSprite);
        sprite.scale.set(1.0, 0.5, 1);
        return sprite;
      }

      function buildPeriodicTable() {
        clearScene();
        document.getElementById("modelTitle").textContent = "Periodic Table";
        document.getElementById("modelInfo").textContent = "Click an element block to learn its name and atomic number.";
        const spacingX = 1.25;
        const spacingY = 1.0;
        periodicElements.forEach((element) => {
          const x = (element.group - 9.5) * spacingX;
          let y = 3.8 - (element.period - 1) * spacingY;
          const z = element.period > 7 ? 0.3 : 0;
          if (element.period > 7) {
            y = 3.8 - 7 * spacingY - 1.4 - (element.period - 8) * spacingY;
          }
          const block = new THREE.Mesh(
            new THREE.BoxGeometry(1.15, 0.7, 0.45),
            material(getElementColor(element.group))
          );
          block.position.set(x, y, z);
          block.userData = {
            name: `${element.symbol} (${element.name})`,
            label: `Atomic number ${element.number}.`,
          };
          clickable.push(block);
          activeGroup.add(block);

          const label = createTextLabel(`${element.symbol}\n${element.number}`);
          label.position.set(x, y + 0.55, z + 0.2);
          activeGroup.add(label);
        });
        activeGroup.rotation.set(-0.32, 0.42, 0);
        camera.position.set(0, 10, 22);
        controls.target.set(0, 0, 0);
        controls.update();
      }

      function setModel(nextModel) {
        model = nextModel;
        if (model === "solar") {
          buildSolar();
          camera.position.set(0, 7, 15);
        }
        if (model === "atom") {
          buildAtom();
          camera.position.set(0, 6.5, 12);
        }
        if (model === "cell") {
          buildCell();
          camera.position.set(0, 7, 15);
        }
        if (model === "periodic") {
          buildPeriodicTable();
        }
        controls.target.set(0, 0, 0);
        controls.update();
        document.getElementById("objectLabel").textContent = "No object selected";
      }

      document.querySelectorAll(".model-btn").forEach((button) => {
        button.addEventListener("click", () => {
          document.querySelectorAll(".model-btn").forEach((item) => {
            item.classList.toggle("btn-primary", item === button);
            item.classList.toggle("btn-outline-primary", item !== button);
          });
          setModel(button.dataset.model);
        });
      });

      canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(clickable)[0];
        if (hit) document.getElementById("objectLabel").textContent = `${hit.object.userData.name}: ${hit.object.userData.label}`;
      });

      function animate() {
        requestAnimationFrame(animate);
        activeGroup.rotation.y += model === "solar" ? 0.0025 : 0.0015;
        controls.update();
        renderer.render(scene, camera);
      }

      window.addEventListener("resize", resize);
      setModel("solar");
      resize();
      animate();
    }
  } catch (error) {
    console.error("visualization init error", error);
    const errorPanel = document.createElement('div');
    errorPanel.style.position = 'absolute';
    errorPanel.style.top = '20px';
    errorPanel.style.left = '20px';
    errorPanel.style.padding = '16px';
    errorPanel.style.background = 'rgba(255, 0, 0, 0.85)';
    errorPanel.style.color = '#fff';
    errorPanel.style.zIndex = '999';
    errorPanel.textContent = `Visualization error: ${error.message}`;
    if (canvas.parentElement) {
      canvas.parentElement.appendChild(errorPanel);
    }
  }
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initVisualization);
} else {
  initVisualization();
}
