/**
 * G-TECH 3D story world (vanilla three.js).
 * A red G-TECH training car drives a winding road through five chapters as the
 * visitor scrolls: start gate → dual-control halo → road signs → town traffic → finish arch.
 * Palette: paper-white world, red accents (kerbs, car, gates, signs).
 */
import * as THREE from "three";

const RED = 0xd2090f;
const RED_DEEP = 0xac0403;
const WHITE = 0xffffff;
const PAPER = 0xfbf6f6;
const ASPHALT = 0x3a3335;

export type WorldOptions = { canvas: HTMLCanvasElement; mobile: boolean; reduced: boolean };

type CamKey = { p: number; off: [number, number, number]; look: [number, number, number]; fov: number };

// Camera choreography, relative to the car (car faces local +z).
const CAM_KEYS: CamKey[] = [
  { p: 0.0, off: [6.5, 2.6, 8.5], look: [0, 0.9, 0], fov: 38 },
  { p: 0.1, off: [-4.5, 2.6, -9], look: [0, 1, 4], fov: 42 },
  { p: 0.2, off: [4.2, 1.7, 0.6], look: [0, 1.0, 1], fov: 40 },
  { p: 0.32, off: [-3.5, 3.2, -8.5], look: [0, 1, 5], fov: 44 },
  { p: 0.4, off: [0.01, 10, -5], look: [0, 0, 1.5], fov: 42 },
  { p: 0.5, off: [-4, 2.4, -9], look: [0, 1, 6], fov: 46 },
  { p: 0.6, off: [-6.5, 2.2, 6], look: [0, 1.2, -1], fov: 42 },
  { p: 0.7, off: [5, 4, -10], look: [0, 1, 6], fov: 46 },
  { p: 0.78, off: [12, 16, -2], look: [0, 0, 3], fov: 42 },
  { p: 0.88, off: [-4, 2.4, -9], look: [0, 1, 6], fov: 46 },
  { p: 0.95, off: [-4.5, 3, -11], look: [0, 2.6, 9], fov: 44 },
  { p: 1.0, off: [-4.5, 3, -11], look: [0, 2.6, 9], fov: 44 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const near = (p: number, at: number, w: number) => clamp01(1 - Math.abs(p - at) / w);

function textTexture(text: string, opts: { bg: string; fg: string; w?: number; h?: number; font?: string; border?: string }) {
  const c = document.createElement("canvas");
  c.width = opts.w ?? 1024;
  c.height = opts.h ?? 256;
  const g = c.getContext("2d")!;
  g.fillStyle = opts.bg;
  g.fillRect(0, 0, c.width, c.height);
  if (opts.border) {
    g.strokeStyle = opts.border;
    g.lineWidth = c.height * 0.06;
    g.strokeRect(g.lineWidth / 2, g.lineWidth / 2, c.width - g.lineWidth, c.height - g.lineWidth);
  }
  g.fillStyle = opts.fg;
  g.font = opts.font ?? `800 ${Math.round(c.height * 0.52)}px Sora, Manrope, Arial, sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, c.width / 2, c.height / 2 + c.height * 0.03);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function signTexture(kind: "stop" | "speed" | "ped") {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 512, 512);
  if (kind === "stop") {
    g.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = Math.PI / 8 + (i * Math.PI) / 4;
      g.lineTo(256 + 240 * Math.cos(a), 256 + 240 * Math.sin(a));
    }
    g.closePath();
    g.fillStyle = "#D2090F"; g.fill();
    g.lineWidth = 18; g.strokeStyle = "#fff"; g.stroke();
    g.fillStyle = "#fff"; g.font = "800 130px Sora, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("STOP", 256, 266);
  } else if (kind === "speed") {
    g.beginPath(); g.arc(256, 256, 236, 0, Math.PI * 2); g.fillStyle = "#fff"; g.fill();
    g.lineWidth = 46; g.strokeStyle = "#D2090F"; g.beginPath(); g.arc(256, 256, 212, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#1E1516"; g.font = "800 190px Sora, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("50", 256, 268);
  } else {
    g.beginPath(); g.moveTo(256, 20); g.lineTo(496, 470); g.lineTo(16, 470); g.closePath();
    g.fillStyle = "#fff"; g.fill(); g.lineJoin = "round"; g.lineWidth = 40; g.strokeStyle = "#D2090F"; g.stroke();
    g.fillStyle = "#1E1516";
    g.beginPath(); g.arc(262, 210, 26, 0, Math.PI * 2); g.fill();
    g.lineWidth = 22; g.lineCap = "round"; g.strokeStyle = "#1E1516";
    g.beginPath(); g.moveTo(258, 245); g.lineTo(240, 320); g.lineTo(212, 400); g.stroke();
    g.beginPath(); g.moveTo(240, 320); g.lineTo(290, 400); g.stroke();
    g.beginPath(); g.moveTo(250, 270); g.lineTo(300, 310); g.stroke();
    g.beginPath(); g.moveTo(250, 270); g.lineTo(205, 300); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class StoryWorld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 600);
  private curve: THREE.CatmullRomCurve3;
  private car = new THREE.Group();
  private wheels: THREE.Object3D[] = [];
  private brakeLights: THREE.MeshStandardMaterial;
  private oncoming = new THREE.Group();
  private halo: THREE.Mesh;
  private haloLabel: THREE.Sprite;
  private signs: { group: THREE.Group; at: number }[] = [];
  private lights: THREE.MeshStandardMaterial[] = [];
  private licence: THREE.Mesh;
  private sun: THREE.DirectionalLight;
  private disposables: { dispose: () => void }[] = [];
  private target = 0;
  private shown = 0;
  private time = 0;
  private distance = 0;
  private lastU = 0;
  private camPos = new THREE.Vector3();
  private camLook = new THREE.Vector3();
  private first = true;
  private roadLength = 1;

  constructor(private opts: WorldOptions) {
    const { canvas, mobile } = opts;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = !mobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene.background = new THREE.Color(PAPER);
    this.scene.fog = new THREE.Fog(PAPER, 45, mobile ? 140 : 190);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xf2dede, 1.6);
    this.scene.add(hemi);
    this.sun = new THREE.DirectionalLight(0xffffff, 2.4);
    this.sun.castShadow = !mobile;
    this.sun.shadow.mapSize.set(1024, 1024);
    const sc = this.sun.shadow.camera as THREE.OrthographicCamera;
    sc.left = -28; sc.right = 28; sc.top = 28; sc.bottom = -28; sc.near = 1; sc.far = 140;
    this.sun.shadow.bias = -0.0006;
    this.scene.add(this.sun, this.sun.target);

    this.curve = new THREE.CatmullRomCurve3(
      [
        [0, 24], [0, 0], [2, -30], [18, -70], [40, -110], [32, -160], [-6, -200], [-40, -245],
        [-32, -295], [4, -335], [30, -380], [26, -430], [20, -470],
      ].map(([x, z]) => new THREE.Vector3(x, 0, z)),
      false, "catmullrom", 0.5,
    );
    this.roadLength = this.curve.getLength();

    this.buildGround();
    this.buildRoad(mobile);
    this.buildScenery(mobile);
    this.buildGates();
    this.buildSigns();
    this.buildTown();
    this.buildCar(this.car, RED, true);
    this.scene.add(this.car);
    this.buildCar(this.oncoming, WHITE, false);
    this.oncoming.visible = false;
    this.scene.add(this.oncoming);

    // Chapter 2: dual-control halo under the car
    const haloMat = new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    this.halo = new THREE.Mesh(new THREE.RingGeometry(2.9, 3.4, 64), haloMat);
    this.halo.rotation.x = -Math.PI / 2;
    this.halo.position.y = 0.04;
    this.car.add(this.halo);
    const labelTex = textTexture("INSTRUCTOR BRAKE READY", { bg: "#D2090F", fg: "#ffffff", w: 1024, h: 160, font: "800 74px Sora, Arial, sans-serif" });
    this.haloLabel = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true, opacity: 0, depthWrite: false }));
    this.haloLabel.scale.set(4.2, 0.66, 1);
    this.haloLabel.position.set(0, 2.6, 0);
    this.car.add(this.haloLabel);
    this.brakeLights = (this.car.getObjectByName("brake") as THREE.Mesh).material as THREE.MeshStandardMaterial;

    // Chapter 5: floating "ready" card above the finish
    const lic = textTexture("READY FOR THE ROAD", { bg: "#ffffff", fg: "#D2090F", w: 1024, h: 300, border: "#D2090F", font: "800 92px Sora, Arial, sans-serif" });
    this.licence = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.6, 0.12), [
      new THREE.MeshStandardMaterial({ color: RED }), new THREE.MeshStandardMaterial({ color: RED }),
      new THREE.MeshStandardMaterial({ color: RED }), new THREE.MeshStandardMaterial({ color: RED }),
      new THREE.MeshStandardMaterial({ map: lic }), new THREE.MeshStandardMaterial({ map: lic }),
    ]);
    const fin = this.frameAt(0.985);
    this.licence.position.copy(fin.pos).add(new THREE.Vector3(0, 6.2, 0));
    this.scene.add(this.licence);

    this.place(0);
  }

  /* ---------------------------------------------------------------- builders */
  private frameAt(u: number) {
    const pos = this.curve.getPointAt(clamp01(u));
    const tan = this.curve.getTangentAt(clamp01(u)).normalize();
    const side = new THREE.Vector3(tan.z, 0, -tan.x).normalize();
    return { pos, tan, side, angle: Math.atan2(tan.x, tan.z) };
  }

  private buildGround() {
    const g = new THREE.PlaneGeometry(1400, 1400);
    const m = new THREE.MeshStandardMaterial({ color: PAPER, roughness: 1 });
    const ground = new THREE.Mesh(g, m);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.02, -240);
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.disposables.push(g, m);
  }

  private buildRoad(mobile: boolean) {
    const N = 900, W = 8.4;
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    for (let i = 0; i <= N; i++) {
      const { pos: p, side } = this.frameAt(i / N);
      const l = p.clone().addScaledVector(side, W / 2), r = p.clone().addScaledVector(side, -W / 2);
      pos.push(l.x, 0.01, l.z, r.x, 0.01, r.z);
      uv.push(0, i / 10, 1, i / 10);
      if (i < N) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: ASPHALT, roughness: 0.92 });
    const road = new THREE.Mesh(geo, mat);
    road.receiveShadow = true;
    this.scene.add(road);
    this.disposables.push(geo, mat);

    // Red & white kerbs on both edges
    const kerbLen = 1.3;
    const count = Math.floor(this.roadLength / kerbLen);
    const kGeo = new THREE.BoxGeometry(0.55, 0.16, kerbLen * 0.98);
    const kMat = new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.6 });
    const kerbs = new THREE.InstancedMesh(kGeo, kMat, count * 2);
    const dummy = new THREE.Object3D();
    const red = new THREE.Color(RED), white = new THREE.Color(WHITE);
    let k = 0;
    for (let i = 0; i < count; i++) {
      const f = this.frameAt(i / count);
      for (const s of [1, -1]) {
        dummy.position.copy(f.pos).addScaledVector(f.side, s * (W / 2 + 0.28));
        dummy.position.y = 0.08;
        dummy.rotation.set(0, f.angle, 0);
        dummy.updateMatrix();
        kerbs.setMatrixAt(k, dummy.matrix);
        kerbs.setColorAt(k, i % 2 ? red : white);
        k++;
      }
    }
    kerbs.receiveShadow = true;
    this.scene.add(kerbs);
    this.disposables.push(kGeo, kMat, kerbs);

    // Centre dashes
    const dashEvery = 5;
    const dCount = Math.floor(this.roadLength / dashEvery);
    const dGeo = new THREE.BoxGeometry(0.16, 0.02, 2.3);
    const dMat = new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.5, emissive: 0x222222 });
    const dashes = new THREE.InstancedMesh(dGeo, dMat, dCount);
    for (let i = 0; i < dCount; i++) {
      const f = this.frameAt(i / dCount);
      dummy.position.copy(f.pos); dummy.position.y = 0.03;
      dummy.rotation.set(0, f.angle, 0);
      dummy.updateMatrix();
      dashes.setMatrixAt(i, dummy.matrix);
    }
    this.scene.add(dashes);
    this.disposables.push(dGeo, dMat, dashes);
    void mobile;
  }

  private buildScenery(mobile: boolean) {
    // Paper-style low-poly trees: white canopies, a few red ones as accents.
    const n = mobile ? 90 : 220;
    const cone = new THREE.ConeGeometry(1.6, 4.2, 7);
    const trunk = new THREE.CylinderGeometry(0.18, 0.24, 1.2, 6);
    const mWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, flatShading: true });
    const mRed = new THREE.MeshStandardMaterial({ color: RED, roughness: 0.6, flatShading: true });
    const mTrunk = new THREE.MeshStandardMaterial({ color: 0xd9c9c9, roughness: 1 });
    const whites = new THREE.InstancedMesh(cone, mWhite, n);
    const reds = new THREE.InstancedMesh(cone, mRed, Math.ceil(n / 9));
    const trunks = new THREE.InstancedMesh(trunk, mTrunk, n + Math.ceil(n / 9));
    const dummy = new THREE.Object3D();
    let rng = 7;
    const rand = () => ((rng = (rng * 16807) % 2147483647) / 2147483647);
    let w = 0, r = 0, t = 0;
    for (let i = 0; i < n + Math.ceil(n / 9); i++) {
      const u = rand();
      if (u > 0.64 && u < 0.84) continue; // town segment keeps its own props
      const f = this.frameAt(u);
      const dist = 9 + rand() * 38;
      const s = rand() > 0.5 ? 1 : -1;
      const scale = 0.7 + rand() * 0.9;
      dummy.position.copy(f.pos).addScaledVector(f.side, s * dist);
      dummy.position.y = 2.1 * scale + 1.1 * scale;
      dummy.scale.setScalar(scale);
      dummy.rotation.set(0, rand() * Math.PI, 0);
      dummy.updateMatrix();
      const isRed = i % 9 === 0 && r < reds.count;
      if (isRed) reds.setMatrixAt(r++, dummy.matrix); else if (w < whites.count) whites.setMatrixAt(w++, dummy.matrix); else continue;
      dummy.position.y = 0.6 * scale;
      dummy.updateMatrix();
      trunks.setMatrixAt(t++, dummy.matrix);
    }
    whites.count = w; reds.count = r; trunks.count = t;
    for (const m of [whites, reds]) { m.castShadow = true; m.receiveShadow = true; }
    this.scene.add(whites, reds, trunks);
    this.disposables.push(cone, trunk, mWhite, mRed, mTrunk, whites, reds, trunks);
  }

  private gate(u: number, label: string, colors: { pillar: number; bg: string; fg: string }) {
    const f = this.frameAt(u);
    const g = new THREE.Group();
    const pGeo = new THREE.BoxGeometry(0.8, 6.4, 0.8);
    const pMat = new THREE.MeshStandardMaterial({ color: colors.pillar, roughness: 0.45 });
    for (const s of [1, -1]) {
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set(s * 6.2, 3.2, 0);
      p.castShadow = true;
      g.add(p);
    }
    const tex = textTexture(label, { bg: colors.bg, fg: colors.fg, w: 1536, h: 256 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(13.6, 1.8, 0.6), [
      new THREE.MeshStandardMaterial({ color: colors.pillar }), new THREE.MeshStandardMaterial({ color: colors.pillar }),
      new THREE.MeshStandardMaterial({ color: colors.pillar }), new THREE.MeshStandardMaterial({ color: colors.pillar }),
      new THREE.MeshStandardMaterial({ map: tex }), new THREE.MeshStandardMaterial({ map: tex }),
    ]);
    beam.position.y = 6.6;
    beam.castShadow = true;
    g.add(beam);
    g.position.copy(f.pos);
    g.rotation.y = f.angle;
    this.scene.add(g);
  }

  private buildGates() {
    this.gate(0.012, "G-TECH  ·  START", { pillar: RED, bg: "#D2090F", fg: "#ffffff" });
    this.gate(0.985, "#DriveWithGtech", { pillar: WHITE, bg: "#ffffff", fg: "#D2090F" });
    // Chequered start line
    const f = this.frameAt(0.02);
    const c = document.createElement("canvas"); c.width = 512; c.height = 64;
    const g2 = c.getContext("2d")!;
    for (let x = 0; x < 16; x++) for (let y = 0; y < 2; y++) { g2.fillStyle = (x + y) % 2 ? "#D2090F" : "#ffffff"; g2.fillRect(x * 32, y * 32, 32, 32); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const line = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 1.0), new THREE.MeshStandardMaterial({ map: t }));
    line.rotation.set(-Math.PI / 2, 0, 0);
    const holder = new THREE.Group(); holder.add(line);
    holder.position.copy(f.pos); holder.position.y = 0.025; holder.rotation.y = f.angle;
    this.scene.add(holder);
  }

  private buildSigns() {
    const defs: { kind: "stop" | "speed" | "ped"; at: number; side: number }[] = [
      { kind: "speed", at: 0.53, side: 1 }, { kind: "ped", at: 0.57, side: -1 }, { kind: "stop", at: 0.615, side: 1 },
    ];
    const postGeo = new THREE.CylinderGeometry(0.09, 0.09, 3.2, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xbfb3b3, metalness: 0.6, roughness: 0.3 });
    for (const d of defs) {
      const f = this.frameAt(d.at);
      const g = new THREE.Group();
      const post = new THREE.Mesh(postGeo, postMat); post.position.y = 1.6; post.castShadow = true; g.add(post);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9),
        new THREE.MeshStandardMaterial({ map: signTexture(d.kind), transparent: true, side: THREE.DoubleSide, alphaTest: 0.05 }));
      face.position.y = 3.6;
      g.add(face);
      g.position.copy(f.pos).addScaledVector(f.side, d.side * 6.4);
      // face oncoming traffic (towards the start of the road)
      g.rotation.y = f.angle + Math.PI;
      g.scale.setScalar(0.001);
      this.scene.add(g);
      this.signs.push({ group: g, at: d.at });
    }
  }

  private buildTown() {
    // Simple white blocks with red roofs between u 0.66–0.84, plus a traffic light.
    const box = new THREE.BoxGeometry(1, 1, 1);
    const wall = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    const roof = new THREE.MeshStandardMaterial({ color: RED_DEEP, roughness: 0.6 });
    let rng = 3;
    const rand = () => ((rng = (rng * 48271) % 2147483647) / 2147483647);
    for (let i = 0; i < 34; i++) {
      const u = 0.665 + (i / 34) * 0.17;
      const f = this.frameAt(u);
      const s = i % 2 ? 1 : -1;
      const w = 4 + rand() * 5, d = 4 + rand() * 4, h = 3 + rand() * 9;
      const b = new THREE.Mesh(box, wall);
      b.scale.set(w, h, d);
      b.position.copy(f.pos).addScaledVector(f.side, s * (11 + rand() * 6));
      b.position.y = h / 2;
      b.rotation.y = f.angle;
      b.castShadow = true; b.receiveShadow = true;
      const r = new THREE.Mesh(box, roof);
      r.scale.set(w + 0.3, 0.5, d + 0.3);
      r.position.copy(b.position); r.position.y = h + 0.25; r.rotation.y = f.angle;
      this.scene.add(b, r);
    }
    // Traffic light
    const f = this.frameAt(0.72);
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.6, 8), new THREE.MeshStandardMaterial({ color: 0x2a2224 }));
    pole.position.y = 2.3; g.add(pole);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.9, 0.5), new THREE.MeshStandardMaterial({ color: 0x1e1516 }));
    head.position.y = 5.2; g.add(head);
    [0xff2020, 0xffb020, 0x20d060].forEach((c, i) => {
      const m = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: c, emissiveIntensity: 0.05 });
      const l = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), m);
      l.position.set(0, 5.75 - i * 0.55, -0.27);
      g.add(l); this.lights.push(m);
    });
    g.position.copy(f.pos).addScaledVector(f.side, 6.2);
    g.rotation.y = f.angle;
    this.scene.add(g);
    this.disposables.push(box, wall, roof);
  }

  private buildCar(root: THREE.Group, bodyColor: number, hero: boolean) {
    const body = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.35, roughness: 0.32 });
    const accent = new THREE.MeshStandardMaterial({ color: bodyColor === RED ? WHITE : RED, roughness: 0.4 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1b1517, roughness: 0.7 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x241c22, metalness: 0.6, roughness: 0.15 });
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, name?: string) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
      if (name) m.name = name;
      root.add(m);
      return m;
    };
    add(new THREE.BoxGeometry(2.05, 0.2, 4.3), dark, 0, 0.36, 0); // skirt
    add(new THREE.BoxGeometry(2.0, 0.55, 4.2), body, 0, 0.72, 0); // body
    add(new THREE.BoxGeometry(1.96, 0.25, 1.5), body, 0, 1.06, 1.25).rotation.x = -0.12; // bonnet slope
    add(new THREE.BoxGeometry(1.72, 0.55, 2.1), glass, 0, 1.25, -0.35); // cabin glass
    add(new THREE.BoxGeometry(1.76, 0.1, 1.9), body, 0, 1.56, -0.4); // roof
    add(new THREE.BoxGeometry(0.34, 0.02, 4.0), accent, 0, 1.62, -0.2); // stripe roof
    add(new THREE.BoxGeometry(0.34, 0.02, 1.2), accent, 0, 1.21, 1.32).rotation.x = -0.12; // stripe bonnet
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4e0, emissiveIntensity: 1.2 });
    add(new THREE.BoxGeometry(0.42, 0.14, 0.05), lightMat, 0.66, 0.82, 2.11);
    add(new THREE.BoxGeometry(0.42, 0.14, 0.05), lightMat, -0.66, 0.82, 2.11);
    const brake = new THREE.MeshStandardMaterial({ color: 0x550000, emissive: 0xff1010, emissiveIntensity: 0.4 });
    const b1 = add(new THREE.BoxGeometry(1.7, 0.12, 0.05), brake, 0, 0.86, -2.11, "brake");
    void b1;
    if (hero) {
      // L-board on the roof and G-TECH door decals
      const lTex = textTexture("L", { bg: "#ffffff", fg: "#D2090F", w: 256, h: 256, border: "#D2090F", font: "800 190px Sora, Arial, sans-serif" });
      const lMat = new THREE.MeshStandardMaterial({ map: lTex });
      const lb = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.04), [lMat, lMat, lMat, lMat, lMat, lMat]);
      lb.position.set(0, 1.98, 0.35); lb.castShadow = true;
      root.add(lb);
      const post = add(new THREE.BoxGeometry(0.06, 0.32, 0.06), dark, 0, 1.72, 0.35); void post;
      const decal = textTexture("G-TECH", { bg: "#D2090F", fg: "#ffffff", w: 512, h: 128, font: "800 86px Sora, Arial, sans-serif" });
      for (const s of [1, -1]) {
        const d = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.37), new THREE.MeshStandardMaterial({ map: decal, transparent: true }));
        d.position.set(s * 1.011, 0.74, -0.1);
        d.rotation.y = (s * Math.PI) / 2;
        root.add(d);
      }
    }
    const wGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.34, 28);
    wGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.36, 18);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe9e3e3, metalness: 0.8, roughness: 0.25 });
    const spokeGeo = new THREE.BoxGeometry(0.37, 0.07, 0.62);
    for (const [x, z] of [[1.0, 1.35], [-1.0, 1.35], [1.0, -1.35], [-1.0, -1.35]]) {
      const w = new THREE.Group();
      const tyre = new THREE.Mesh(wGeo, dark); tyre.castShadow = true;
      const rim = new THREE.Mesh(rimGeo, rimMat);
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      w.add(tyre, rim, spoke);
      w.position.set(x, 0.43, z);
      root.add(w);
      if (hero) this.wheels.push(w);
    }
  }

  /* ---------------------------------------------------------------- runtime */
  private place(u: number) {
    const f = this.frameAt(u);
    this.car.position.copy(f.pos);
    const ahead = this.curve.getPointAt(Math.min(1, u + 0.002));
    if (u < 0.998) this.car.lookAt(ahead.x, 0, ahead.z);
  }

  setProgress(p: number) {
    this.target = clamp01(p);
  }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  }

  private camKey(p: number) {
    let i = 0;
    while (i < CAM_KEYS.length - 2 && p > CAM_KEYS[i + 1].p) i++;
    const a = CAM_KEYS[i], b = CAM_KEYS[i + 1];
    const t = smooth(clamp01((p - a.p) / Math.max(1e-6, b.p - a.p)));
    const lerp = (x: number, y: number) => x + (y - x) * t;
    return {
      off: new THREE.Vector3(lerp(a.off[0], b.off[0]), lerp(a.off[1], b.off[1]), lerp(a.off[2], b.off[2])),
      look: new THREE.Vector3(lerp(a.look[0], b.look[0]), lerp(a.look[1], b.look[1]), lerp(a.look[2], b.look[2])),
      fov: lerp(a.fov, b.fov),
    };
  }

  frame(dt: number) {
    const reduced = this.opts.reduced;
    this.time += dt;
    const k = reduced ? 1 : 1 - Math.exp(-dt * 4.5);
    const prevShown = this.shown;
    this.shown += (this.target - this.shown) * k;
    if (Math.abs(this.target - this.shown) < 1e-5) this.shown = this.target;
    const p = this.shown;
    const u = 0.03 + p * 0.94;

    // Car
    this.place(u);
    const moved = (u - this.lastU) * this.roadLength;
    this.lastU = u;
    this.distance += moved;
    for (const w of this.wheels) w.rotation.x = this.distance / 0.43;
    const braking = this.shown < prevShown - 1e-5 || (p > 0.36 && p < 0.44);
    this.brakeLights.emissiveIntensity = braking ? 2.6 : 0.4;

    // Chapter 2 halo
    const h = near(p, 0.4, 0.07);
    const pulse = reduced ? 1 : 0.75 + 0.25 * Math.sin(this.time * 4);
    (this.halo.material as THREE.MeshBasicMaterial).opacity = 0.55 * h * pulse;
    this.halo.scale.setScalar(0.9 + 0.15 * (reduced ? 1 : Math.sin(this.time * 2) * 0.5 + 0.5));
    (this.haloLabel.material as THREE.SpriteMaterial).opacity = h;

    // Chapter 3 signs pop up as the car approaches
    for (const s of this.signs) {
      const show = clamp01((u - (s.at - 0.09)) / 0.04);
      const e = show === 0 ? 0.001 : 1 - Math.pow(1 - show, 3) + (reduced ? 0 : Math.sin(show * Math.PI) * 0.15);
      s.group.scale.setScalar(Math.max(0.001, e));
    }

    // Chapter 4 traffic light & oncoming car
    const phase = reduced ? 2 : Math.floor(this.time / 1.6) % 3;
    this.lights.forEach((m, i) => (m.emissiveIntensity = i === phase ? 2.2 : 0.05));
    const town = clamp01((p - 0.66) / 0.22);
    this.oncoming.visible = town > 0 && town < 1;
    if (this.oncoming.visible) {
      const ou = 0.86 - town * 0.2;
      const f = this.frameAt(ou);
      this.oncoming.position.copy(f.pos).addScaledVector(f.side, -2.1);
      const back = this.curve.getPointAt(Math.max(0, ou - 0.002));
      this.oncoming.lookAt(back.x + f.side.x * -2.1, 0, back.z + f.side.z * -2.1);
    }

    // Chapter 5 floating card
    const fin = near(p, 1, 0.12);
    this.licence.visible = fin > 0.01;
    this.licence.scale.setScalar(Math.max(0.001, fin));
    this.licence.rotation.y = this.car.rotation.y + (reduced ? 0 : Math.sin(this.time * 0.8) * 0.35);
    this.licence.position.y = 6.2 + (reduced ? 0 : Math.sin(this.time * 1.5) * 0.25);

    // Sun follows the car for crisp shadows
    this.sun.position.copy(this.car.position).add(new THREE.Vector3(24, 40, 18));
    this.sun.target.position.copy(this.car.position);

    // Camera choreography
    const key = this.camKey(p);
    if (!reduced && p < 0.06) {
      // gentle idle orbit in the hero
      const a = Math.sin(this.time * 0.25) * 0.35 * (1 - p / 0.06);
      key.off.applyAxisAngle(new THREE.Vector3(0, 1, 0), a);
    }
    const wantPos = this.car.localToWorld(key.off.clone());
    const wantLook = this.car.localToWorld(key.look.clone());
    if (this.first || reduced) { this.camPos.copy(wantPos); this.camLook.copy(wantLook); this.first = false; }
    else {
      const ck = 1 - Math.exp(-dt * 3.2);
      this.camPos.lerp(wantPos, ck);
      this.camLook.lerp(wantLook, ck);
    }
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);
    if (Math.abs(this.camera.fov - key.fov) > 0.01) {
      this.camera.fov += (key.fov - this.camera.fov) * (reduced ? 1 : 0.08);
      this.camera.updateProjectionMatrix();
    }
    this.renderer.render(this.scene, this.camera);
  }

  /** True while the camera is still easing toward the scroll target (keep rendering). */
  get settling() {
    return Math.abs(this.target - this.shown) > 1e-4;
  }

  dispose() {
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => { (x as THREE.MeshStandardMaterial).map?.dispose(); x.dispose(); });
      else if (mat) { (mat as THREE.MeshStandardMaterial).map?.dispose(); mat.dispose(); }
    });
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}
