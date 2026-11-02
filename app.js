// NetQuest Engine — focused single-stage view with hover tooltips & floating config popover
(function () {
  const stages = window.NETQUEST_STAGES;
  const $ = (id) => document.getElementById(id);

  // ---------- Lucide icon helper (SVG 문자열 생성) ----------
  const iconCache = {};
  const toPascal = (n) => (n || "circle").split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  function icon(name = "circle", size = 16, cls = "") {
    name = name || "circle";
    const key = `${name}|${size}|${cls}`;
    if (iconCache[key]) return iconCache[key];
    const lib = window.lucide && window.lucide.icons;
    const node = (lib && (lib[toPascal(name)] || lib.Circle)) || null;
    if (!node) return "";
    const [, baseAttrs, children] = node;
    const attrs = { ...baseAttrs, width: size, height: size, class: `lc ${cls}`.trim() };
    const attrStr = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(" ");
    const inner = children.map(([tag, a]) => `<${tag} ${attrStr(a)}/>`).join("");
    return (iconCache[key] = `<svg ${attrStr(attrs)}>${inner}</svg>`);
  }
  const ZONE_ICON = { "zone-lan": "house", "zone-wan": "globe", "zone-vpc": "cloud", "zone-public": "lock-open", "zone-private": "lock" };
  const LOG_ICON = { info: "info", success: "circle-check", error: "circle-x", warn: "triangle-alert" };

  // ---------- Tooltip dictionaries (짧은 화면 + 마우스 오버 상세) ----------
  const TYPE_DESC = {
    pc: "<b>호스트(PC)</b><br/>데이터를 보내고 받는 끝단 장비입니다. IP·서브넷·게이트웨이·DNS 설정이 필요합니다.",
    switch: "<b>L2 스위치</b><br/>같은 LAN 안에서 MAC 주소를 보고 프레임을 목적지 포트로만 전달합니다. IP가 필요 없습니다.",
    router: "<b>라우터 / 게이트웨이</b><br/>서로 다른 네트워크를 이어주는 출입문입니다. NAT·라우팅·방화벽 역할을 합니다.",
    server: "<b>서버</b><br/>서비스(웹·DB·파일)를 제공하는 장비입니다. 고정 IP와 열린 포트가 중요합니다.",
    cloud: "<b>외부 인터넷 서버</b><br/>공인 IP를 가진 인터넷 상의 목적지입니다."
  };

  const ZONE_DESC = {
    "zone-lan": "<b>LAN (근거리 통신망)</b><br/>집·사무실 내부 네트워크. 사설 IP(192.168.x.x 등)를 사용합니다.",
    "zone-wan": "<b>WAN / 인터넷</b><br/>공인 IP로만 통신하는 바깥 세상입니다. 사설 IP는 여기서 라우팅되지 않습니다.",
    "zone-vpc": "<b>VPC (가상 사설 클라우드)</b><br/>클라우드 안의 나만의 격리된 네트워크(예: 10.0.0.0/16).",
    "zone-public": "<b>퍼블릭 서브넷</b><br/>라우팅 테이블에 0.0.0.0/0 → IGW 경로가 있어 인터넷과 직접 통신합니다.",
    "zone-private": "<b>프라이빗 서브넷 / 격리 구역</b><br/>외부에서 직접 들어올 수 없는 안전 구역입니다."
  };

  const FIELD_HELP = {
    ip: "장비의 네트워크 주소. 같은 LAN이라면 앞자리(네트워크 부분)는 같고 끝자리는 달라야 합니다.",
    mask: "어디까지가 네트워크 부분인지 정합니다. 255.255.255.0 = 앞 3칸이 같으면 같은 동네(/24).",
    gateway: "다른 네트워크(인터넷)로 나갈 때 거치는 공유기의 내부 IP입니다.",
    dns: "도메인 이름을 IP로 바꿔주는 서버 주소입니다. (예: 8.8.8.8)",
    dhcp: "DHCP: Discover → Offer → Request → Ack (DORA) 과정으로 IP를 자동 임대합니다.",
    ipMode: "Static = 직접 입력, DHCP = 서버에게 자동으로 받기",
    vlan: "같은 VLAN 번호끼리만 통신합니다. 스위치 1대를 논리적으로 쪼갭니다.",
    nat: "사설 IP를 공유기의 공인 IP로 바꿔 인터넷에 내보냅니다. (SNAT)",
    pf: "외부 포트로 들어온 요청을 내부 서버 IP:포트로 전달합니다. (DNAT)",
    route: "0.0.0.0/0 = '그 외 모든 목적지'. 어느 게이트웨이로 보낼지 정합니다.",
    sgPort: "보안 그룹 인바운드 규칙. 필요한 포트만 열어야 합니다(최소 권한).",
    sgSrc: "누가(어떤 IP 대역이) 이 포트에 접근할 수 있는지 정합니다.",
    hc: "주기적으로 서버 상태를 검사해 죽은 서버로는 트래픽을 보내지 않습니다.",
    lb: "여러 가용영역(AZ)에 트래픽을 나눠 장애 시 자동 우회합니다.",
    waf: "SQL Injection·XSS 같은 L7 웹 공격을 엣지에서 차단합니다.",
    vpn: "본사 대역을 VPN 터널 경로로 허용해 사설망끼리 암호화 통신합니다."
  };

  const MISSION_SHORT = {
    c_link: "랜선 연결", c_ip: "IP 설정", c_mask: "서브넷 마스크",
    c_conflict: "IP 충돌 해결", c_nas_link: "NAS 연결", c_nas_subnet: "NAS 대역",
    c_dhcp_on: "DHCP 서버 ON", c_clients_dhcp: "클라이언트 DHCP",
    c_vlan10: "VLAN 10", c_vlan20: "VLAN 20",
    c_gw: "게이트웨이", c_nat: "NAT ON",
    c_dns: "DNS", c_pf_port: "포트포워딩",
    c_igw_link: "IGW 연결", c_pub_rt: "퍼블릭 라우팅", c_priv_rt: "프라이빗 격리",
    c_websg: "Web SG", c_dbsg: "DB SG", c_natgw: "NAT GW",
    c_alb_link: "AZ-c 연결", c_hc: "헬스체크", c_lbmode: "Multi-AZ",
    docker_links: "경로 연결", docker_bridge: "브리지", docker_app: "앱 설정", docker_db: "DB 참여", docker_listen: "DB 수신", docker_public: "포트 공개", docker_router: "공유기 전달", docker_internal: "내부망",
    c_waf: "WAF", c_vpn_link: "VPN 터널", c_vgw_route: "VGW 경로"
  };

  // ---------- State ----------
  let roundMap = [];
  const lastRoundValues = new Map();
  function freshRandom(key, min, max) {
    let value = min + Math.floor(Math.random() * (max - min + 1));
    if (value === lastRoundValues.get(key)) value = value === max ? min : value + 1;
    lastRoundValues.set(key, value);
    return value;
  }
  const translate = (value, reverse = false) => {
    if (typeof value !== "string") return value;
    return roundMap.reduce((text, [a, b]) => text.split(reverse ? b : a).join(reverse ? a : b), value);
  };
  const translateObject = (obj, reverse = false) => JSON.parse(translate(JSON.stringify(obj), reverse));
  let idx = 0;
  let state = null;
  let selectedId = null;
  let tool = "select";
  let cableSrc = null;
  let simulating = false;
  let sound = true;
  let audioCtx = null;
  let guideMode = localStorage.getItem("netquest_guide_mode") !== "false";
  const completed = new Set(JSON.parse(localStorage.getItem("netquest_completed_v2") || "[]"));

  // ---------- DOM ----------
  const canvas = $("canvasContainer");
  const nodesLayer = $("nodesLayer");
  const linksGroup = $("linksGroup");
  const packetsGroup = $("packetsGroup");
  const zoneLayer = $("zoneLayer");
  const banner = $("canvasBanner");
  const cfgPop = $("nodeConfigPopover");
  const inspector = $("inspectorBody");
  const tooltip = $("floatingTooltip");
  const logList = $("packetLogList");
  const xray = $("xrayContainer");
  const cliOut = $("cliOutput");

  // ---------- Sound ----------
  function tone(f = 440, d = 0.08, type = "sine") {
    if (!sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(0.07, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d);
      o.connect(g).connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + d);
    } catch (_) {}
  }
  const fanfare = () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.14, "triangle"), i * 110));
  const buzz = () => { tone(220, 0.15, "sawtooth"); setTimeout(() => tone(165, 0.2, "sawtooth"), 140); };

  // ---------- Global hover tooltip ----------
  function showTip(html, x, y) {
    tooltip.innerHTML = html;
    tooltip.classList.remove("hidden");
    moveTip(x, y);
  }
  function moveTip(x, y) {
    const w = tooltip.offsetWidth;
    const h = tooltip.offsetHeight;
    let left = x + 14;
    let top = y + 16;
    if (left + w > window.innerWidth - 8) left = x - w - 14;
    if (top + h > window.innerHeight - 8) top = y - h - 12;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
  function hideTip() {
    tooltip.classList.add("hidden");
  }

  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest("[data-tooltip]");
    if (!t) return;
    showTip(t.dataset.tooltip, e.clientX, e.clientY);
  });
  document.addEventListener("mousemove", (e) => {
    if (!tooltip.classList.contains("hidden")) {
      if (!e.target.closest("[data-tooltip]")) hideTip();
      else moveTip(e.clientX, e.clientY);
    }
  });
  document.addEventListener("mousedown", hideTip);

  const esc = (s) => String(s).replace(/"/g, "&quot;");

  // ---------- Rank ----------
  function updateRank() {
    const c = completed.size;
    let t = ["graduation-cap", "Lv.1 입문자"];
    if (c >= stages.length) t = ["trophy", "클라우드 아키텍트"];
    else if (c >= 7) t = ["cloud", "VPC 엔지니어"];
    else if (c >= 5) t = ["router", "라우팅 전문가"];
    else if (c >= 3) t = ["network", "LAN 관리자"];
    else if (c >= 1) t = ["cable", "패킷 탐험가"];
    $("userRankBadge").innerHTML = `${icon(t[0], 12)} ${t[1]}`;
    $("userRankBadge").dataset.tooltip = `클리어한 단계: <b>${c} / ${stages.length}</b>`;
    localStorage.setItem("netquest_completed_v2", JSON.stringify([...completed]));
  }

  function initDockerRound(st) {
    const rand = (key, min, max) => freshRandom(`${st.id}:${key}`, min, max);
    const hostPort = String(rand('hostPort', 10000, 29999));
    const containerPort = String(rand('containerPort', 3000, 8999));
    const dbPort = String(rand('dbPort', 15432, 15999));
    const externalPort = String(rand('externalPort', 30000, 49999));
    const hostIp = `192.168.${rand('hostSubnet', 30, 209)}.${rand('hostAddress', 10, 200)}`;
    st.round = {hostPort, containerPort, dbPort, externalPort, hostIp};
    const app = st.nodes.find(n => n.id === 'app');
    const db = st.nodes.find(n => n.id === 'db');
    const router = st.nodes.find(n => n.id === 'router');
    const visitor = st.nodes.find(n => n.id === 'visitor');
    const bridge = st.nodes.find(n => n.id === 'backendNet');
    const field = (key, label, correct, choices = []) => ({key, label, suggestions:[correct, ...choices]});
    const choice = (key, label, options) => ({key, label, options:options.map(([value,label]) => ({value,label}))});
    const network = () => choice('network', 'Docker 브리지 네트워크 참여', [['none','참여 안 함'],['backend','backend 브리지'],['frontend','frontend 브리지'],['both','frontend + backend 브리지']]);
    const bind = () => field('bind', '컨테이너 수신 IP 주소', '0.0.0.0');
    const protocol = () => choice('protocol', '공개 포트 프로토콜', [['UDP','UDP'],['TCP','TCP']]);
    app.network = 'none'; app.bind = '127.0.0.1'; app.protocol = 'UDP'; app.fields = [];
    if (visitor) visitor.role = `접속할 ${st.id === 13 ? '공유기 외부' : '호스트'} 포트 ${st.id === 13 ? externalPort : hostPort}/TCP`;
    if (db) { db.network = 'none'; db.bind = '127.0.0.1'; db.fields = []; db.role = `DB 컨테이너 수신 포트 ${dbPort}/TCP`; }
    if (router) router.fields = [];
    if (bridge) {
      bridge.driver = 'host'; bridge.fields = [choice('driver','네트워크 방식', [['host','host 모드 (사용자 정의 브리지 없음)'],['bridge','bridge (사용자 정의 브리지)']])];
      if (st.id === 14) {
        bridge.internal = 'no';
        bridge.fields.push(choice('internal','backend 외부 경로', [['no','일반 브리지'],['yes','internal: true (외부 경로 제한)']]));
      }
    }
    const publicFields = () => [bind(), protocol(), field('hostPort','호스트 공개 포트',hostPort), field('targetPort','앱 컨테이너 포트',containerPort)];
    if (st.id === 11 || st.id === 14) {
      app.fields.push(network(), field('dbHost','DB 서비스 이름','db',['localhost']), field('dbPort','DB 컨테이너 포트',dbPort));
      db.fields.push(network(), bind());
      app.role = `DB에 연결할 앱${st.id === 14 ? ` · 웹 수신 ${containerPort}/TCP` : ''}`;
      if (st.id === 14) {
        app.fields.push(...publicFields());
        db.fields.push(choice('published','DB 호스트 포트 공개', [['yes','공개'],['no','공개하지 않음']]));
        db.published = 'yes';
        st.hintHtml = `backend 네트워크 드라이버를 <code>bridge</code>, 외부 경로를 <code>internal: true</code>로 설정하세요.<br>app은 frontend + backend, db는 backend에 참여시키고 DB 주소는 <code>db:${dbPort}</code>로 설정하세요. DB 수신 주소는 <code>0.0.0.0</code>, DB 호스트 포트는 미공개로 설정하세요.<br>웹 앱의 수신 주소를 <code>0.0.0.0</code>, TCP 공개 포트를 <code>${hostPort}:${containerPort}</code>로 설정하세요.`;
      } else {
        st.hintHtml = `backend 네트워크의 드라이버를 <code>bridge</code>로 설정하고 app과 db를 backend 브리지에 참여시키세요.<br>app의 DB 주소를 <code>db:${dbPort}</code>, DB 수신 주소를 <code>0.0.0.0</code>으로 설정하세요.`;
      }
      st.checklist = [{id:'docker_bridge',text:'backend 네트워크의 브리지 드라이버 설정'}, {id:'docker_app',text:'앱 네트워크와 DB 서비스 이름·컨테이너 포트 설정'}, {id:'docker_db',text:st.id === 14 ? 'DB를 backend에만 연결하고 호스트 포트 공개 제거' : 'DB를 backend 브리지에 참여'}, {id:'docker_listen',text:'DB가 컨테이너 외부 인터페이스에서 TCP 연결을 수신'}];
      if (st.id === 14) st.checklist.push({id:'docker_public',text:'앱만 TCP 호스트 포트로 공개'}, {id:'docker_internal',text:'backend의 외부 경로를 internal로 제한'});
    } else {
      app.role = `웹 앱 수신 포트 ${containerPort}/TCP`;
      app.fields.push(network(), ...publicFields());
      st.checklist = [{id:'docker_app',text:'앱을 frontend 브리지에 연결하고 외부 인터페이스에서 수신'}, {id:'docker_public',text:'TCP 호스트 포트와 컨테이너 포트를 정확히 공개'}];
      st.hintHtml = `app을 frontend 브리지에 참여시키고 수신 주소를 <code>0.0.0.0</code>으로 설정하세요.<br>TCP 호스트 <code>${hostPort}</code> → 컨테이너 <code>${containerPort}</code>를 공개하세요.`;
      if (st.id === 13) {
        router.role = `내부 호스트 ${hostIp} · Docker 공개 포트 ${hostPort}/TCP`;
        router.fields.push(field('externalPort','공유기 외부 포트',externalPort),field('targetIp','내부 호스트 IP',hostIp),field('forwardPort','호스트 대상 포트',hostPort),protocol());
        router.protocol = 'UDP';
        st.hintHtml += `<br>공유기에서 TCP 외부 <code>${externalPort}</code> → <code>${hostIp}:${hostPort}</code>로 전달하세요.`;
        st.checklist.push({id:'docker_router',text:'공유기 TCP 외부 포트를 호스트 IP와 호스트 포트로 전달'});
      }
    }
    const linkText = st.requiredLinks.map(([a, b]) => `${st.nodes.find(n => n.id === a).name} ↔ ${st.nodes.find(n => n.id === b).name}`).join(', ');
    st.checklist.unshift({id:'docker_links', text:`연결 도구로 경로 연결: ${linkText}`});
    st.hintHtml = `상단의 <b>[경로 연결]</b>을 누른 뒤 각 장비를 차례로 클릭해 연결하세요: ${linkText}.<br>${st.hintHtml}`;
  }

  function evaluateDocker(st) {
    const app = st.nodes.find(n => n.id === 'app');
    const db = st.nodes.find(n => n.id === 'db');
    const router = st.nodes.find(n => n.id === 'router');
    const bridge = st.nodes.find(n => n.id === 'backendNet');
    const {hostPort, containerPort, dbPort, externalPort, hostIp} = st.round;
    const publicOk = app.bind === '0.0.0.0' && app.protocol === 'TCP' && app.hostPort === hostPort && app.targetPort === containerPort;
    if (st.id === 11 || st.id === 14) {
      const result = {
        docker_links: st.requiredLinks.every(([a,b]) => hasLink(a,b)),
        docker_bridge: bridge.driver === 'bridge',
        docker_app: (st.id === 11 ? app.network === 'backend' : app.network === 'both') && app.dbHost === 'db' && app.dbPort === dbPort && hasLink('app','backendNet'),
        docker_db: db.network === 'backend' && hasLink('db','backendNet') && (st.id !== 14 || db.published === 'no'),
        docker_listen: db.bind === '0.0.0.0'
      };
      if (st.id === 14) { result.docker_public = publicOk && hasLink('visitor','app'); result.docker_internal = bridge.internal === 'yes'; }
      return result;
    }
    const result = {docker_links: st.requiredLinks.every(([a,b]) => hasLink(a,b)), docker_app: app.network === 'frontend' && app.bind === '0.0.0.0', docker_public: publicOk && (st.id === 12 ? hasLink('visitor','app') : hasLink('router','app') && hasLink('visitor','router'))};
    if (st.id === 13) result.docker_router = router.protocol === 'TCP' && router.externalPort === externalPort && router.targetIp === hostIp && router.forwardPort === hostPort;
    return result;
  }

  function solveDocker(st) {
    const app = st.nodes.find(n => n.id === 'app');
    const db = st.nodes.find(n => n.id === 'db');
    const router = st.nodes.find(n => n.id === 'router');
    const bridge = st.nodes.find(n => n.id === 'backendNet');
    const {hostPort, containerPort, dbPort, externalPort, hostIp} = st.round;
    if (st.id === 11 || st.id === 14) {
      Object.assign(app,{network:st.id === 11 ? 'backend' : 'both', dbHost:'db', dbPort});
      Object.assign(db,{network:'backend', bind:'0.0.0.0', published:'no'});
      Object.assign(bridge,{driver:'bridge',internal:'yes'});
    } else app.network = 'frontend';
    if (st.id !== 11) Object.assign(app,{bind:'0.0.0.0', protocol:'TCP', hostPort, targetPort:containerPort});
    if (router) Object.assign(router,{externalPort,targetIp:hostIp,forwardPort:hostPort,protocol:'TCP'});
    st.links = st.requiredLinks.map(link => [...link]);
  }

  async function runDocker(st, checks) {
    const {hostPort, containerPort, dbPort, externalPort, hostIp} = st.round;
    if (!checks.docker_links) return fail(null, '연결 도구로 필요한 통신 경로를 먼저 연결하세요.');
    if (st.id === 11 || st.id === 14) {
      if (!checks.docker_bridge) return fail('backendNet','backend에 사용자 정의 bridge 드라이버를 설정하세요.');
      if (!checks.docker_app) return fail('app','앱의 브리지 참여, DB 서비스 이름 또는 컨테이너 포트를 확인하세요.');
      if (!checks.docker_db) return fail('db','DB의 브리지 참여 또는 호스트 포트 공개 설정을 확인하세요.');
      if (!checks.docker_listen) return fail('db','DB가 127.0.0.1에서만 수신하면 다른 컨테이너에서 연결할 수 없습니다.');
      if (st.id === 14 && !checks.docker_internal) return fail('backendNet','backend의 외부 경로 제한을 확인하세요.');
      if (st.id === 14 && !checks.docker_public) return fail('app','웹 앱의 수신 주소, TCP 프로토콜과 호스트·컨테이너 포트를 확인하세요.');
      if (st.id === 14) { xr('외부 → app','frontend bridge',`호스트 → app`,`TCP ${hostPort} → ${containerPort}`,'HTTP 요청'); await packet('visitor','app',`${hostPort} → ${containerPort}`); }
      xr('app → db','backend bridge','app → db (서비스 이름)',`TCP → ${dbPort}`,'DB 연결');
      await packet('app','backendNet',`db:${dbPort}`); await packet('backendNet','db',`TCP ${dbPort}`);
      await packet('db','backendNet','DB 응답','#10b981'); await packet('backendNet','app','DB 응답','#10b981');
      if (st.id === 14) { xr('외부 → DB','backend internal','외부 → DB',`TCP ${dbPort}`,'DB 호스트 포트 미공개: 직접 접근 차단'); addLog('success','웹 접속과 앱의 DB 연결 성공. 외부의 DB 직접 접근은 차단됨.'); }
      else addLog('success','사용자 정의 브리지에서 서비스 이름으로 DB 연결 성공!');
    } else {
      if (st.id === 13 && !checks.docker_router) return fail('router','공유기의 TCP 프로토콜, 외부 포트와 호스트 목적지를 확인하세요.');
      if (st.id === 13) await packet('visitor','router',`TCP ${externalPort}`);
      if (!checks.docker_app) return fail('app','앱의 frontend 브리지 참여와 수신 주소를 확인하세요.');
      if (!checks.docker_public) return fail('app','TCP 프로토콜과 Docker 호스트·컨테이너 포트를 확인하세요.');
      if (st.id === 13) xr('공유기 포워딩','공유기 → 호스트',`공인 IP → ${hostIp}`,`TCP ${externalPort} → ${hostPort}`,'DNAT');
      xr('Docker 포트 공개','호스트 → 컨테이너',`${hostIp} → app`,`TCP ${hostPort} → ${containerPort}`,'HTTP GET');
      await packet(st.id === 13 ? 'router' : 'visitor','app',`${hostPort} → ${containerPort}`);
      await packet('app',st.id === 13 ? 'router' : 'visitor','200 OK','#10b981');
      if (st.id === 13) await packet('router','visitor','200 OK','#10b981');
      xr('app → 외부','frontend bridge','app → 외부 서버','TCP 443','컨테이너에서 시작한 외부 연결');
      await packet('app',st.id === 13 ? 'router' : 'visitor','HTTPS 요청','#a855f7');
      if (st.id === 13) await packet('router','visitor','외부로 전송','#a855f7');
      addLog('success','외부에서 앱 접속 성공. 앱의 외부 연결도 가능합니다.');
    }
    return finish(true);
  }

  // ---------- Stage loading ----------
  function loadStage(i) {
    idx = Math.max(0, Math.min(stages.length - 1, i));
    const subnet = freshRandom(`${stages[idx].id}:subnet`, 30, 209);
    const port = freshRandom(`${stages[idx].id}:port`, 10000, 49999);
    roundMap = [["192.168.1.", `192.168.${subnet}.`], ["192.168.2.", `192.168.${subnet === 209 ? 210 : subnet + 1}.`]];
    const cloudSubnet = freshRandom(`${stages[idx].id}:cloud`, 20, 199);
    roundMap.push(["192.168.10.", `192.168.${subnet + 2}.`], ["192.168.20.", `192.168.${subnet + 3}.`], ["10.0.1.", `10.0.${cloudSubnet}.`], ["10.0.2.", `10.0.${cloudSubnet + 1}.`]);
    if (stages[idx].id === 6) roundMap.push(["8080", String(port)]);
    state = translateObject(stages[idx]);
    if (state.kind === "docker") initDockerRound(state);
    selectedId = null;
    cableSrc = null;
    simulating = false;
    closeConfig();
    setTool("select");
    $("toolCable").disabled = false;
    $("toolCable").innerHTML = `${icon("cable", 14)}${state.kind === "docker" ? "경로 연결" : "랜선 연결"}`;
    $("toolCable").dataset.tooltip = state.kind === "docker" ? "두 장비를 차례로 선택해 논리적 통신 경로를 그립니다. 실제 Docker 랜선은 아닙니다." : "두 장비를 차례로 클릭해 랜선을 연결하거나, 연결된 선을 클릭해 끊습니다.";

    $("stageNumberPill").textContent = `STAGE ${idx + 1} / ${stages.length}`;
    $("stageTitle").textContent = state.shortName.replace(/^\d+\.\s*/, "");
    $("popoverChapter").textContent = `${state.chapter} · ${state.title}`;
    $("stageStory").innerHTML = state.story;
    $("stageConcept").innerHTML = state.conceptHtml;
    $("stageHint").innerHTML = state.hintHtml;
    $("btnPrevStage").disabled = idx === 0;
    $("btnNextStageTop").disabled = idx === stages.length - 1;

    renderDropdown();
    renderZones();
    renderNodes();
    renderLinks();
    updateGuideModeUI();
    requestAnimationFrame(() => renderLinks());
    setTimeout(() => renderLinks(), 60);

    logList.innerHTML = "";
    xray.innerHTML = `<div class="xray-empty">상단의 <b>[패킷 전송]</b>을 누르면 구간별 패킷 헤더 변환 과정이 표시됩니다.</div>`;
    setStatus("info", `STAGE ${idx + 1} · 핵심개념에 마우스를 올려 목표를 확인하고, 장비를 클릭해 설정하세요.`);
  }

  function renderDropdown() {
    $("stageDropdown").innerHTML = stages
      .map(
        (s, i) => `<button class="stage-drop-item ${i === idx ? "active" : ""}" data-idx="${i}">
          <span>${i + 1}. ${s.shortName.replace(/^\d+\.\s*/, "")}</span><span>${completed.has(s.id) ? icon("circle-check", 14, "lc-ok") : ""}</span></button>`
      )
      .join("");
    $("stageDropdown").querySelectorAll(".stage-drop-item").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        $("stageSelectorTrigger").classList.remove("open");
        $("stageSelectorTrigger").setAttribute("aria-expanded", "false");
        loadStage(parseInt(b.dataset.idx, 10));
      })
    );
  }

  function renderZones() {
    zoneLayer.innerHTML = (state.zones || [])
      .map((z) => {
        const desc = guideMode ? (ZONE_DESC[z.type] || "") : `<b>${z.title}</b><br/>네트워크 인프라 영역`;
        return `<div class="network-zone ${z.type}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%;">
          <div class="network-zone-title" data-tooltip="${esc(desc)}">${icon(ZONE_ICON[z.type] || "square", 13)}${z.title}</div></div>`;
      })
      .join("");
  }

  function renderMissions() {
    if (!state || !state.checklist) return;
    const res = evaluate();
    $("missionChecklist").innerHTML = state.checklist
      .map((m) => {
        const ok = !!res[m.id];
        if (guideMode) {
          return `<span class="mission-chip ${ok ? "done" : ""}" data-tooltip="${esc(`<b>${ok ? "완료" : "미완료"}</b><br/>${m.text}`)}">
            ${icon(ok ? "circle-check" : "circle", 13)}${MISSION_SHORT[m.id] || m.id}</span>`;
        } else {
          return `<span class="mission-chip blind" data-tooltip="${esc(`<b>실전 검증 필요</b><br/>항목: ${MISSION_SHORT[m.id] || m.id}<br/><span style="color:#fbbf24">상단의 [패킷 전송]을 실행하여 실제 통신 성공 여부를 파악하세요.</span>`)}">
            ${icon("circle-dot", 13)}${MISSION_SHORT[m.id] || m.id}</span>`;
        }
      })
      .join("");
  }

  function updateGuideModeUI() {
    const btn = $("btnGuideToggle");
    if (btn) {
      btn.classList.toggle("challenge", !guideMode);
      btn.innerHTML = guideMode
        ? `${icon("compass", 13)}<span id="guideModeText">가이드 ON</span>`
        : `${icon("zap", 13)}<span id="guideModeText">실전 모드</span>`;
      btn.dataset.tooltip = guideMode
        ? "가이드 모드 (활성): 실시간 미션 검증 및 힌트 제공. 클릭 시 실전 모드로 전환"
        : "실전 모드 (활성): 힌트/자동체크/정답 툴팁 비활성. 패킷을 직접 전송해봐야 파악 가능. 클릭 시 가이드 모드로 전환";
    }

    const autoBtn = $("btnAutoSolve");
    if (autoBtn) {
      autoBtn.disabled = !guideMode;
      autoBtn.dataset.tooltip = guideMode
        ? "현재 단계의 정답 설정을 자동으로 배치해 패킷 흐름을 바로 확인합니다."
        : "실전 모드에서는 자동완성을 사용할 수 없습니다.";
    }

    const hintPill = document.querySelector(".hint-pill");
    if (hintPill) {
      hintPill.style.display = guideMode ? "inline-flex" : "none";
    }

    if (state) {
      if (guideMode) {
        $("popoverChapter").textContent = `${state.chapter} · ${state.title}`;
        $("stageStory").innerHTML = state.story;
        $("stageConcept").innerHTML = state.conceptHtml;
      } else {
        $("popoverChapter").textContent = `실전 모드 (챌린지) · ${state.title}`;
        $("stageStory").innerHTML = `<b>실전 미션 목표:</b> ${state.title}<br/><span style="color:#94a3b8">실전 모드에서는 세부 정답 설정 팁이 숨겨집니다. 장비 토폴로지와 CLI 도구를 사용해 문제를 직접 분석하고 연결을 완성하세요.</span>`;
        $("stageConcept").innerHTML = `<ul><li><b>인프라 엔지니어링:</b> 케이블 연결, L3 IP 및 서브넷 마스크, 게이트웨이 및 방화벽/보안그룹 설정을 직접 판단하여 구성하세요.</li><li>상단의 <b>[패킷 전송]</b> 버튼이나 하단의 <b>[터미널 / 패킷 해부기]</b>로 통신 결과를 확인해야 합니다.</li></ul>`;
      }
    }

    renderZones();
    renderNodes();
    renderMissions();
    if (!cfgPop.classList.contains("hidden")) {
      openConfig();
    }
  }

  function toggleGuideMode() {
    guideMode = !guideMode;
    localStorage.setItem("netquest_guide_mode", guideMode ? "true" : "false");
    tone(guideMode ? 620 : 420, 0.08);
    updateGuideModeUI();
    addLog(
      guideMode ? "info" : "warn",
      guideMode
        ? "가이드 모드 활성화: 실시간 미션 체크리스트와 힌트가 제공됩니다."
        : "실전 챌린지 모드 활성화: 힌트와 자동 체크가 숨겨졌습니다. 직접 장비를 구성한 뒤 [패킷 전송]을 실행해 연결 성공 여부를 확인하세요!"
    );
  }

  // ---------- Nodes & links ----------
  const getNode = (id) => state.nodes.find((n) => n.id === id);
  const hasLink = (a, b) => state.links.some((l) => (l[0] === a && l[1] === b) || (l[0] === b && l[1] === a));

  function nodeBadge(n) {
    if (state.kind === "docker" && n.id === "backendNet") return `방식: ${n.driver}${n.internal === undefined ? "" : ` · internal: ${n.internal === "yes" ? "ON" : "OFF"}`}`;
    if (state.kind === "docker" && n.network) {
      const network = n.network === "none" ? "미참여" : n.network === "both" ? "frontend + backend" : n.network;
      return n.published === undefined ? `네트워크: ${network}` : `네트워크: ${network} · DB 포트 ${n.published === "yes" ? "공개" : "미공개"}`;
    }
    if (n.vlan) return `VLAN ${n.vlan}`;
    if (n.ipMode) return n.ipMode;
    if (n.dhcpEnabled !== undefined) return `DHCP ${n.dhcpEnabled ? "ON" : "OFF"}`;
    if (n.pfExtPort) return `:${n.pfExtPort}→${n.pfIntIp}:${n.pfIntPort}`;
    if (n.natEnabled !== undefined) return `NAT ${n.natEnabled ? "ON" : "OFF"}`;
    if (n.gateway) return `GW ${n.gateway}`;
    if (n.sgInboundPort) return `SG ${n.sgInboundPort}`;
    if (n.routeDefault) return `→ ${n.routeDefault}`;
    if (n.healthCheck !== undefined) return `HC ${n.healthCheck ? "ON" : "OFF"}`;
    if (n.wafEnabled !== undefined) return `WAF ${n.wafEnabled ? "ON" : "OFF"}`;
    if (n.vpnRouteAllowed !== undefined) return `VPN ${n.vpnRouteAllowed ? "ON" : "OFF"}`;
    return "";
  }

  function nodeTip(n) {
    const rows = [];
    if (n.ip && !(state.kind === "docker" && n.id === "backendNet")) rows.push(`${state.kind === "docker" && (n.id === "app" || n.id === "db") ? "서비스 이름" : "IP"}: <code>${n.ip}</code>`);
    if (n.mask) rows.push(`Mask: <code>${n.mask}</code>`);
    if (n.gateway) rows.push(`GW: <code>${n.gateway}</code>`);
    if (n.dns) rows.push(`DNS: <code>${n.dns}</code>`);
    if (n.mac) rows.push(`MAC: <code>${n.mac}</code>`);
    const editable = (n.editable || []).length > 0 || (n.fields || []).length > 0;

    let roleText = n.role || "";
    let descText = state.kind === "docker" && n.id === "backendNet"
      ? "<b>Docker 네트워크</b><br/>사용자 정의 bridge는 컨테이너를 연결하고 서비스 이름으로 찾을 수 있게 합니다."
      : TYPE_DESC[n.type] || "";
    if (!guideMode) {
      // 실전 모드: 힌트성 괄호 문구 및 가이드 지침 제거
      roleText = roleText.replace(/\([^)]*(?:충돌|위험|노출|전용|접속|설정|고정|시도|요청|정상|장애)[^)]*\)/g, "").trim();
      descText = `<b>${n.name}</b><br/>장비 유형: ${n.type.toUpperCase()}`;
    }

    return `<b class="tip-head">${icon(n.icon, 14)} ${n.name}</b><br/><span style="color:#94a3b8">${roleText}</span><hr style="border:0;border-top:1px solid #334155;margin:6px 0"/>
      ${descText}${rows.length ? "<br/><br/>" + rows.join("<br/>") : ""}
      <br/><br/><span style="color:${editable ? "#34d399" : "#94a3b8"}">${editable ? icon("mouse-pointer-click", 12) + " 클릭해서 설정하기" : icon("lock", 12) + " 설정 불필요 (고정 장비)"}</span>`;
  }

  function renderNodes() {
    nodesLayer.innerHTML = state.nodes
      .map((n) => {
        const b = nodeBadge(n);
        const cls = [
          "net-node",
          n.id === selectedId && tool === "select" ? "selected" : "",
          n.id === cableSrc ? "cable-source" : ""
        ].join(" ");
        return `<div class="${cls}" id="node-${n.id}" data-id="${n.id}" data-tooltip="${esc(nodeTip(n))}" style="left:${n.x}%;top:${n.y}%;">
          <div class="node-icon">${icon(n.icon, 26)}</div>
          <div class="node-name">${n.name}</div>
          <div class="node-ip">${n.ip || "IP 미설정"}</div>
          ${b ? `<span class="node-badge">${b}</span>` : ""}
        </div>`;
      })
      .join("");

    nodesLayer.querySelectorAll(".net-node").forEach((el) => {
      const id = el.dataset.id;
      let dragged = false;

      el.addEventListener("mousedown", (e) => {
        if (tool === "cable") return;
        const sx = e.clientX;
        const sy = e.clientY;
        dragged = false;
        const node = getNode(id);
        const rect = canvas.getBoundingClientRect();
        const move = (ev) => {
          if (Math.abs(ev.clientX - sx) > 4 || Math.abs(ev.clientY - sy) > 4) dragged = true;
          if (!dragged) return;
          hideTip();
          node.x = Math.max(6, Math.min(94, ((ev.clientX - rect.left) / rect.width) * 100));
          node.y = Math.max(8, Math.min(92, ((ev.clientY - rect.top) / rect.height) * 100));
          el.style.left = `${node.x}%`;
          el.style.top = `${node.y}%`;
          renderLinks();
          if (selectedId === id) positionConfig();
        };
        const up = () => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
      });

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dragged) return;
        tone(480, 0.04);
        if (tool === "cable") return cableClick(id);
        selectedId = id;
        renderNodes();
        openConfig();
      });
    });
  }

  function refreshNode(id) {
    // 설정 변경 시 노드 카드만 부드럽게 갱신 (팝오버 유지)
    const n = getNode(id);
    const el = $(`node-${id}`);
    if (!n || !el) return;
    el.querySelector(".node-ip").textContent = n.ip || "IP 미설정";
    const b = nodeBadge(n);
    let badge = el.querySelector(".node-badge");
    if (b) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "node-badge";
        el.appendChild(badge);
      }
      badge.textContent = b;
    } else if (badge) badge.remove();
    el.dataset.tooltip = nodeTip(n);
  }

  function appHasFrontend(st) {
    return ['frontend', 'both'].includes(st.nodes.find(n => n.id === 'app').network);
  }

  function dockerLinkStatus(st, a, b) {
    if (a === "backendNet" || b === "backendNet") {
      const member = st.nodes.find(n => n.id === (a === "backendNet" ? b : a));
      const bridge = st.nodes.find(n => n.id === "backendNet");
      const active = bridge.driver === "bridge" && (member.network === "backend" || member.network === "both");
      return {active, label: active ? "backend 참여" : "backend 참여 필요"};
    }
    if ((a === "visitor" && b === "router") || (a === "router" && b === "visitor")) return {active: true, label: ""};
    const checks = evaluateDocker(st);
    const active = checks.docker_public && (st.id === 14 ? appHasFrontend(st) : checks.docker_app) && (st.id !== 13 || checks.docker_router);
    return {active, label: active ? "포트 전달 준비됨" : "포트 전달 설정 필요"};
  }

  function renderLinks() {
    if (!state || !state.links) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    linksGroup.innerHTML = "";
    state.links.forEach(([a, b]) => {
      const A = getNode(a);
      const B = getNode(b);
      if (!A || !B) return;
      const coords = {
        x1: (A.x / 100) * r.width, y1: (A.y / 100) * r.height,
        x2: (B.x / 100) * r.width, y2: (B.y / 100) * r.height
      };
      if (state.kind === "docker") {
        const status = dockerLinkStatus(state, a, b);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        Object.entries(coords).forEach(([k, v]) => line.setAttribute(k, v));
        line.setAttribute("class", `docker-link ${status.active ? "is-active" : "is-pending"}`);
        line.dataset.from = a;
        line.dataset.to = b;
        line.dataset.status = status.active ? "active" : "pending";
        line.dataset.tooltip = "학습용 논리 경로입니다. 클릭하면 연결을 끊습니다.";
        line.addEventListener("click", (e) => { e.stopPropagation(); toggleLink(a, b); });
        linksGroup.appendChild(line);
        if (status.label) {
          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", (coords.x1 + coords.x2) / 2);
          label.setAttribute("y", (coords.y1 + coords.y2) / 2 - 10);
          label.setAttribute("class", `docker-link-label ${a === "backendNet" || b === "backendNet" ? "docker-link-network-label" : ""}`);
          label.textContent = status.label;
          linksGroup.appendChild(label);
        }
        return;
      }
      ["cable-line active-link", "cable-flow"].forEach((cls) => {
        const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        Object.entries(coords).forEach(([k, v]) => l.setAttribute(k, v));
        l.setAttribute("class", cls);
        if (cls.startsWith("cable-line")) {
          l.dataset.tooltip = `<b>${A.name}</b> ↔ <b>${B.name}</b><br/>선은 장비 간 연결만 나타냅니다. IP, VLAN, 라우팅과 보안 설정은 별도로 확인하세요.<br/>클릭하면 연결을 끊습니다.`;
          l.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleLink(a, b);
          });
        }
        linksGroup.appendChild(l);
      });
    });
  }

  function toggleLink(a, b) {
    if (a === b) return;
    if (state.kind === "docker" && !state.requiredLinks.some(([x, y]) => (a === x && b === y) || (a === y && b === x))) {
      addLog("warn", "이 단계에서 설정할 수 없는 경로입니다. 미션 목표를 확인하세요.");
      return;
    }
    const i = state.links.findIndex((l) => (l[0] === a && l[1] === b) || (l[0] === b && l[1] === a));
    const A = getNode(a).name;
    const B = getNode(b).name;
    if (i >= 0) {
      state.links.splice(i, 1);
      tone(300, 0.08);
      addLog("warn", `${A} ↔ ${B} 연결 해제`);
    } else {
      state.links.push([a, b]);
      tone(580, 0.08);
      addLog("info", `${A} ↔ ${B} 연결됨`);
    }
    hideTip();
    renderLinks();
    renderMissions();
  }

  function setTool(t) {
    tool = t;
    cableSrc = null;
    $("toolSelect").classList.toggle("active", t === "select");
    $("toolCable").classList.toggle("active", t === "cable");
    if (t === "cable") {
      closeConfig();
      showBanner("연결할 첫 번째 장비를 클릭하세요 (ESC: 취소)");
    } else banner.classList.add("hidden");
    if (state) renderNodes();
  }

  function showBanner(t) {
    banner.innerHTML = `${icon("cable", 14)} ${t}`;
    banner.classList.remove("hidden");
  }

  function cableClick(id) {
    if (!cableSrc) {
      cableSrc = id;
      showBanner(`${getNode(id).name} → 반대편 장비를 클릭하세요`);
      renderNodes();
    } else if (cableSrc === id) {
      cableSrc = null;
      showBanner("연결할 첫 번째 장비를 클릭하세요 (ESC: 취소)");
      renderNodes();
    } else {
      toggleLink(cableSrc, id);
      setTool("select");
    }
  }

  // ---------- Floating config popover ----------
  function closeConfig() {
    cfgPop.classList.add("hidden");
  }

  function positionConfig() {
    const n = getNode(selectedId);
    if (!n) return;
    const r = canvas.getBoundingClientRect();
    const nx = (n.x / 100) * r.width;
    const ny = (n.y / 100) * r.height;
    const w = cfgPop.offsetWidth || 290;
    const h = cfgPop.offsetHeight || 260;
    let left = nx + 80;
    if (left + w > r.width - 10) left = nx - 80 - w;
    left = Math.max(10, left);
    let top = Math.max(10, Math.min(r.height - h - 10, ny - h / 2));
    cfgPop.style.left = `${left}px`;
    cfgPop.style.top = `${top}px`;
  }

  const label = (text, helpKey, right = "") => {
    const helpDot = guideMode && helpKey ? `<span class="help-dot" data-tooltip="${esc(FIELD_HELP[helpKey])}">?</span>` : "";
    return `<label class="form-label"><span>${text} ${helpDot}</span><span>${right}</span></label>`;
  };

  const textField = (n, field, title, helpKey, ph) => {
    const ed = (n.editable || []).includes(field);
    const safePh = guideMode ? translate(ph) : (field === "mask" ? "255.x.x.x" : field.includes("Port") ? "포트번호" : "0.0.0.0");
    return `<div class="form-group">${label(title, helpKey, ed ? "" : icon("lock", 12))}
      <input class="form-input" data-field="${field}" value="${n[field] || ""}" placeholder="${safePh}" ${ed ? "" : "disabled"} />
      </div>`;
  };

  const toggle = (id, title, helpKey, on) =>
    `<div class="toggle-row"><span style="font-size:12px;font-weight:600;">${title} ${guideMode && helpKey ? `<span class="help-dot" data-tooltip="${esc(FIELD_HELP[helpKey])}">?</span>` : ""}</span>
      <input type="checkbox" class="toggle-switch" id="${id}" ${on ? "checked" : ""} /></div>`;

  const select = (n, field, title, helpKey, options) => {
    const safeOptions = options.map((o) => {
      let lbl = o.label;
      if (!guideMode) {
        lbl = lbl.replace(/[✅⚠️🚫]\s*/g, "").replace(/\([^)]*(?:위험|해킹|불가|전용|허용|접속|통신|우회|게이트웨이)[^)]*\)/g, "").trim();
      }
      return `<option value="${o.value}" ${n[field] === o.value ? "selected" : ""}>${lbl}</option>`;
    });
    return `<div class="form-group">${label(title, helpKey)}<select class="form-select" data-field="${field}">
      ${safeOptions.join("")}
    </select></div>`;
  };

  function openConfig() {
    const n = getNode(selectedId);
    if (!n) return;
    const can = (f) => (n.editable || []).includes(f);
    $("cfgIcon").innerHTML = icon(n.icon, 22);
    $("cfgName").textContent = n.name;
    $("cfgRole").textContent = guideMode ? (n.role || "") : (n.role || "").replace(/\([^)]*(?:충돌|위험|노출|전용|접속|설정|고정|시도|요청|정상|장애)[^)]*\)/g, "").trim();

    let h = "";
    if (state.kind !== "docker" && n.type !== "switch" && !n.lanIp && n.ip !== undefined && !n.ipMode) h += textField(n, "ip", "IP 주소", "ip", "192.168.1.20");
    if (n.mask !== undefined) h += textField(n, "mask", "서브넷 마스크", "mask", "255.255.255.0");
    if (n.gateway !== undefined) h += textField(n, "gateway", "기본 게이트웨이", "gateway", "192.168.1.1");
    if (n.dns !== undefined) h += textField(n, "dns", "DNS 서버", "dns", "8.8.8.8");

    if (can("dhcpEnabled")) {
      h += toggle("tgDhcp", "DHCP 서버", "dhcp", n.dhcpEnabled);
      h += `<div class="form-group">${label("할당 시작 IP", "dhcp")}
        <input class="form-input" data-field="dhcpPoolStart" value="${n.dhcpPoolStart || ""}" placeholder="${guideMode ? translate("192.168.1.100") : "0.0.0.0"}" />
        </div>`;
    }
    if (can("ipMode"))
      h += select(n, "ipMode", "IP 할당 방식", "ipMode", [
        { value: "STATIC", label: "수동 (Static)" },
        { value: "DHCP", label: "자동 (DHCP)" }
      ]);
    if (can("vlan"))
      h += select(n, "vlan", "VLAN 태그", "vlan", [
        { value: "10", label: "VLAN 10 · 개발팀" },
        { value: "20", label: "VLAN 20 · 인사팀" }
      ]);
    if (can("natEnabled")) h += toggle("tgNat", `NAT (→ ${n.wanIp})`, "nat", n.natEnabled);
    if (can("portForward")) {
      h += `<div class="form-group">${label("포트 포워딩 규칙", "pf")}</div>`;
      h += `<div class="form-group"><label class="form-label">외부 포트</label><input class="form-input" data-field="pfExtPort" value="${n.pfExtPort || ""}" placeholder="${guideMode ? translate("8080") : "포트번호"}" /></div>`;
      h += `<div class="form-group"><label class="form-label">내부 IP</label><input class="form-input" data-field="pfIntIp" value="${n.pfIntIp || ""}" placeholder="${guideMode ? translate("192.168.1.50") : "내부 IP"}" /></div>`;
      h += `<div class="form-group"><label class="form-label">내부 포트</label><input class="form-input" data-field="pfIntPort" value="${n.pfIntPort || ""}" placeholder="${guideMode ? "80" : "포트번호"}" /></div>`;
    }
    if (n.fields) n.fields.forEach((f) => {
      if (f.options) h += select(n, f.key, f.label, null, f.options);
      else h += `<div class="form-group">${label(f.label, null)}<input class="form-input" data-field="${f.key}" value="${esc(n[f.key] || "")}" /></div>`;
    });
    if (can("routeDefault") && n.routeOptions) h += select(n, "routeDefault", "라우팅 0.0.0.0/0", "route", n.routeOptions);
    if (can("sgInboundPort")) h += textField(n, "sgInboundPort", "SG 인바운드 포트 (쉼표로 구분)", "sgPort", "포트 번호");
    if (can("sgAllowedSource")) h += textField(n, "sgAllowedSource", "SG 3306 허용 출발지 (CIDR)", "sgSrc", "IP/CIDR");
    if (can("healthCheck")) h += toggle("tgHc", "헬스 체크", "hc", n.healthCheck);
    if (can("lbMode"))
      h += select(n, "lbMode", "분산 모드", "lb", [
        { value: "SINGLE", label: "단일 AZ (AZ-a만)" },
        { value: "MULTI_AZ", label: "Multi-AZ 분산" }
      ]);
    if (can("wafEnabled")) h += toggle("tgWaf", "WAF 웹공격 차단", "waf", n.wafEnabled);
    if (can("vpnRouteAllowed")) h += toggle("tgVpn", "본사 대역 VPN 경로", "vpn", n.vpnRouteAllowed);

    if (!(n.editable || []).length && !(n.fields || []).length)
      h += `<div style="font-size:12px;color:#94a3b8;display:flex;gap:6px;align-items:center;">${icon("lock", 13)} 설정할 항목이 없는 장비입니다.</div>`;

    inspector.innerHTML = h;
    bindConfig(n);
    cfgPop.classList.remove("hidden");
    positionConfig();
  }

  function onChanged(n) {
    refreshNode(n.id);
    if (state.kind === "docker") renderLinks();
    renderMissions();
  }

  function bindConfig(n) {
    inspector.querySelectorAll("[data-field]").forEach((el) => {
      const ev = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, () => {
        const f = el.dataset.field;
        n[f] = el.value.trim();
        if (f === "ipMode") n.ip = n.ipMode === "DHCP" ? translate(n.id === "laptop" ? "192.168.1.101 (DHCP)" : "192.168.1.102 (DHCP)") : "미할당 (0.0.0.0)";
        onChanged(n);
      });
    });
    [["tgDhcp", "dhcpEnabled"], ["tgNat", "natEnabled"], ["tgHc", "healthCheck"], ["tgWaf", "wafEnabled"], ["tgVpn", "vpnRouteAllowed"]].forEach(
      ([id, prop]) => {
        const el = $(id);
        if (el)
          el.addEventListener("change", () => {
            n[prop] = el.checked;
            tone(520, 0.05);
            onChanged(n);
          });
      }
    );
  }

  // ---------- Mission evaluation ----------
  function validIp(ip, prefix) {
    if (!ip || !ip.startsWith(prefix)) return false;
    const rest = ip.slice(prefix.length);
    const last = parseInt(rest, 10);
    return String(last) === rest && last >= 1 && last <= 254;
  }

  function evaluate() {
    if (!state) return {};
    const r = {};
    const g = (id) => {
      const node = getNode(id);
      return node && new Proxy(node, { get: (target, key) => {
        const value = target[key];
        if (typeof value === "string" && roundMap.some(([original, current]) => original !== current && value.includes(original))) return value + " (이전 라운드 값)";
        return translate(value, true);
      } });
    };
    if (state.kind === "docker") return evaluateDocker(state);
    switch (state.id) {
      case 1: {
        const a = g("pc1"), b = g("pc2");
        r.c_link = hasLink("pc1", "pc2");
        r.c_ip = validIp(a.ip, "192.168.1.") && validIp(b.ip, "192.168.1.") && a.ip !== b.ip;
        r.c_mask = a.mask === "255.255.255.0" && b.mask === "255.255.255.0";
        break;
      }
      case 2: {
        const a = g("pc1"), b = g("pc2"), nas = g("nas");
        r.c_conflict = validIp(a.ip, "192.168.1.") && validIp(b.ip, "192.168.1.") && a.ip !== b.ip && b.ip !== nas.ip;
        r.c_nas_link = hasLink("pc1", "sw1") && hasLink("pc2", "sw1") && hasLink("sw1", "nas");
        r.c_nas_subnet = validIp(nas.ip, "192.168.1.") && nas.mask === "255.255.255.0" && nas.ip !== a.ip && nas.ip !== b.ip;
        break;
      }
      case 3:
        r.c_dhcp_on = g("dhcpSrv").dhcpEnabled === true && g("dhcpSrv").dhcpPoolStart === "192.168.1.100";
        r.c_clients_dhcp = g("laptop").ipMode === "DHCP" && g("phone").ipMode === "DHCP";
        break;
      case 4:
        r.c_vlan10 = g("devPc").vlan === "10" && g("devSrv").vlan === "10";
        r.c_vlan20 = g("hrPc").vlan === "20" && g("hrSrv").vlan === "20";
        break;
      case 5:
        r.c_gw = g("pc1").gateway === "192.168.1.1" && hasLink("pc1", "router1");
        r.c_nat = g("router1").natEnabled === true && hasLink("router1", "googleDns");
        break;
      case 6: {
        const rt = g("router1");
        r.c_dns = g("pc1").dns === "8.8.8.8";
        r.c_pf_port = rt.pfExtPort === "8080" && rt.pfIntIp === "192.168.1.50" && rt.pfIntPort === "80" && hasLink("homeWeb", "router1");
        break;
      }
      case 7:
        r.c_igw_link = hasLink("igw", "webEc2") && hasLink("client", "igw");
        r.c_pub_rt = g("webEc2").routeDefault === "igw-main";
        r.c_priv_rt = g("dbRds").routeDefault === "none" && !hasLink("igw", "dbRds");
        break;
      case 8:
        r.c_websg = /^\s*(?:80\s*,\s*443|443\s*,\s*80)\s*$/.test(g("webEc2").sgInboundPort);
        r.c_dbsg = g("dbRds").sgAllowedSource === "10.0.1.0/24";
        r.c_natgw = g("privateApp").routeDefault === "nat-gw" && hasLink("privateApp", "natGw") && hasLink("natGw", "igw");
        break;
      case 9:
        r.c_alb_link = hasLink("alb", "webAzB") && hasLink("users", "alb");
        r.c_hc = g("alb").healthCheck === true;
        r.c_lbmode = g("alb").lbMode === "MULTI_AZ";
        break;
      case 10:
        r.c_waf = g("cdnWaf").wafEnabled === true;
        r.c_vpn_link = hasLink("hqVpn", "vgw");
        r.c_vgw_route = g("vgw").vpnRouteAllowed === true;
        break;
    }
    return r;
  }

  // ---------- Logs, status bar, X-Ray ----------
  function setStatus(type, html) {
    $("latestLogText").innerHTML = html;
    $("latestLogBanner").querySelector(".status-dot").className = `status-dot ${type}`;
  }

  function addLog(type, html) {
    const d = document.createElement("div");
    d.className = `log-entry ${type}`;
    d.innerHTML = `${icon(LOG_ICON[type] || "info", 13)}<span>${translate(html)}</span>`;
    logList.appendChild(d);
    logList.scrollTop = logList.scrollHeight;
    setStatus(type, translate(html));
  }

  function xr(title, l2, l3, l4, l7) {
    if (xray.querySelector(".xray-empty")) xray.innerHTML = "";
    const c = document.createElement("div");
    c.className = "xray-card";
    [title, l2, l3, l4, l7] = [title, l2, l3, l4, l7].map((v) => translate(v));
    c.innerHTML = `<div class="xray-hop-title">${icon("activity", 12)} ${title}</div>
      <div class="xray-layer xray-l2" data-tooltip="<b>L2 데이터링크</b><br/>MAC 주소로 같은 LAN 안의 다음 장비를 찾습니다."><b>L2</b> ${l2}</div>
      <div class="xray-layer xray-l3" data-tooltip="<b>L3 네트워크</b><br/>출발지·목적지 IP. NAT를 지나면 여기가 바뀝니다!"><b>L3</b> ${l3}</div>
      <div class="xray-layer xray-l4" data-tooltip="<b>L4 전송</b><br/>TCP/UDP 포트 번호로 어떤 서비스인지 구분합니다."><b>L4</b> ${l4}</div>
      <div class="xray-layer xray-l7" data-tooltip="<b>L7 애플리케이션</b><br/>실제 전달되는 데이터(HTTP, DNS, SQL 등)."><b>L7</b> ${l7}</div>`;
    xray.appendChild(c);
  }

  function packet(from, to, text, color = "#38bdf8", dur = 560) {
    return new Promise((resolve) => {
      const A = getNode(from), B = getNode(to);
      if (!A || !B) return resolve();
      tone(540, 0.04);
      const r = canvas.getBoundingClientRect();
      const x1 = (A.x / 100) * r.width, y1 = (A.y / 100) * r.height;
      const x2 = (B.x / 100) * r.width, y2 = (B.y / 100) * r.height;
      const ns = "http://www.w3.org/2000/svg";
      const g = document.createElementNS(ns, "g");
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("r", "9");
      c.setAttribute("fill", color);
      c.setAttribute("stroke", "#fff");
      c.setAttribute("stroke-width", "2");
      const t = document.createElementNS(ns, "text");
      t.setAttribute("y", "-14");
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("fill", "#f8fafc");
      t.setAttribute("font-size", "11");
      t.setAttribute("font-weight", "700");
      t.textContent = translate(text);
      g.append(c, t);
      packetsGroup.appendChild(g);
      const st = performance.now();
      (function step(now) {
        const k = Math.min(1, (now - st) / dur);
        g.setAttribute("transform", `translate(${x1 + (x2 - x1) * k},${y1 + (y2 - y1) * k})`);
        if (k < 1) requestAnimationFrame(step);
        else {
          g.remove();
          resolve();
        }
      })(st);
    });
  }

  function fail(nodeId, msg) {
    buzz();
    const el = $(`node-${nodeId}`);
    if (el) {
      el.classList.add("error-node");
      setTimeout(() => el.classList.remove("error-node"), 600);
    }
    const displayMsg = guideMode
      ? translate(msg)
      : (nodeId ? `통신 실패: [${getNode(nodeId).name}] 구간에서 패킷이 폐기(Drop)되었습니다. 터미널의 traceroute 및 패킷 해부기 헤더를 분석하세요.` : msg);
    addLog("error", displayMsg);
    return finish(false);
  }

  // ---------- Simulation per stage ----------
  async function runSim() {
    if (simulating) return;
    simulating = true;
    $("btnRunSim").disabled = true;
    closeConfig();
    xray.innerHTML = "";
    const c = evaluate();
    const g = getNode;
    if (state.kind === "docker") return runDocker(state, c);

    switch (state.id) {
      case 1: {
        const a = g("pc1"), b = g("pc2");
        if (!c.c_link) return fail("pc1", "L1 오류: PC 1과 PC 2 사이에 랜선이 없습니다.");
        xr("PC1 → PC2", "AA:01 → BB:02", `${a.ip} → ${b.ip || "?"}`, "ICMP Echo", "Ping 32B");
        await packet("pc1", "pc2", `Ping → ${b.ip || "?"}`);
        if (!c.c_ip || !c.c_mask) return fail("pc2", "L3 오류: PC 2의 IP/서브넷 마스크가 같은 대역이 아닙니다.");
        xr("PC2 → PC1", "BB:02 → AA:01", `${b.ip} → ${a.ip}`, "ICMP Reply", "Pong TTL=64");
        await packet("pc2", "pc1", "Reply", "#10b981");
        addLog("success", `PC 2(${b.ip})에서 응답 수신!`);
        return finish(true);
      }
      case 2: {
        const nas = g("nas");
        if (!c.c_conflict) return fail("pc2", "IP 충돌: PC 1과 PC 2가 같은 IP를 사용 중입니다.");
        if (!c.c_nas_link) return fail("sw1", "스위치와 NAS 사이에 랜선이 없습니다.");
        xr("PC1 → NAS", "MAC:01 → MAC:99", `${g("pc1").ip} → ${nas.ip}`, "TCP 445 (SMB)", "File Request");
        await packet("pc1", "sw1", "Frame");
        await packet("sw1", "nas", `→ ${nas.ip}`);
        if (!c.c_nas_subnet) return fail("nas", `NAS(${nas.ip})가 192.168.1.x 대역이 아닙니다.`);
        await packet("nas", "sw1", "Reply", "#10b981");
        await packet("sw1", "pc2", "OK", "#10b981");
        addLog("success", "스위치 LAN 구성 완료!");
        return finish(true);
      }
      case 3:
        if (!c.c_dhcp_on) return fail("dhcpSrv", "DHCP 서버가 꺼져 있거나 IP 풀이 없습니다.");
        if (!c.c_clients_dhcp) return fail("laptop", "클라이언트가 아직 수동(Static) 모드입니다.");
        xr("Discover", "→ FF:FF:FF:FF:FF:FF", "0.0.0.0 → 255.255.255.255", "UDP 68→67", "DHCP Discover");
        await packet("laptop", "sw1", "Discover", "#f59e0b");
        await packet("sw1", "dhcpSrv", "Discover", "#f59e0b");
        xr("Offer / Ack", "DHCP → Laptop", "192.168.1.2 → 192.168.1.101", "UDP 67→68", "Lease .101");
        await packet("dhcpSrv", "sw1", "Offer/Ack", "#10b981");
        await packet("sw1", "laptop", ".101 할당", "#10b981");
        await packet("sw1", "phone", ".102 할당", "#10b981");
        addLog("success", "DHCP로 IP 자동 할당 완료!");
        return finish(true);
      case 4:
        if (!c.c_vlan10 || !c.c_vlan20) return fail("swVlan", "부서별 VLAN 번호가 일치하지 않습니다.");
        xr("VLAN 10", "802.1Q Tag 10", "192.168.10.11 → .10.100", "TCP 22", "git push");
        await packet("devPc", "swVlan", "[VLAN10]");
        await packet("swVlan", "devSrv", "[VLAN10]", "#10b981");
        xr("VLAN 20", "802.1Q Tag 20", "192.168.20.11 → .20.100", "TCP 443", "HR Data");
        await packet("hrPc", "swVlan", "[VLAN20]", "#a855f7");
        await packet("swVlan", "hrSrv", "[VLAN20]", "#10b981");
        addLog("success", "VLAN 망 분리 완료!");
        return finish(true);
      case 5: {
        const pc = g("pc1"), rt = g("router1");
        if (!c.c_gw) return fail("pc1", "기본 게이트웨이가 없어 외부로 나갈 문을 모릅니다.");
        xr("NAT 전", "PC → Router", `${pc.ip}(사설) → 8.8.8.8`, "ICMP", "Ping");
        await packet("pc1", "router1", `${pc.ip} → 8.8.8.8`);
        if (!c.c_nat) return fail("router1", "NAT가 꺼져 사설 IP 패킷이 인터넷에서 버려졌습니다.");
        xr("NAT 후", "Router → ISP", `${rt.wanIp}(공인) → 8.8.8.8`, "ICMP", "SNAT 변환");
        await packet("router1", "googleDns", `${rt.wanIp} → 8.8.8.8`, "#a855f7");
        await packet("googleDns", "router1", "Reply", "#10b981");
        await packet("router1", "pc1", "역변환", "#10b981");
        addLog("success", "인터넷 연결 성공! (패킷 해부기에서 IP 변환 확인)");
        return finish(true);
      }
      case 6:
        if (!c.c_dns) return fail("pc1", "DNS 서버가 설정되지 않았습니다.");
        xr("DNS Query", "PC → Router", "192.168.1.10 → 8.8.8.8", "UDP 53", "myblog.com?");
        await packet("pc1", "router1", "DNS?");
        await packet("router1", "dnsServer", "UDP:53");
        await packet("dnsServer", "router1", "A 203.0.113.5", "#10b981");
        await packet("extUser", "router1", "GET :8080", "#f59e0b");
        if (!c.c_pf_port) return fail("router1", "포트 포워딩 규칙이 없어 8080 요청이 차단됐습니다.");
        xr("DNAT", "Router → Web", "198.51.100.77 → 192.168.1.50", "TCP 8080 → 80", "GET /");
        await packet("router1", "homeWeb", "→ .50:80", "#10b981");
        await packet("homeWeb", "router1", "200 OK", "#10b981");
        await packet("router1", "extUser", "200 OK", "#10b981");
        addLog("success", "DNS + 포트 포워딩 성공!");
        return finish(true);
      case 7:
        if (!c.c_igw_link || !c.c_pub_rt) return fail("webEc2", "웹 서버가 IGW와 연결/라우팅되지 않았습니다.");
        if (!c.c_priv_rt) return fail("dbRds", "DB가 인터넷에 노출되어 있습니다!");
        xr("IGW → Public", "VPC Router", "198.51.100.12 → 10.0.1.10", "TCP 443", "HTTPS");
        await packet("client", "igw", "HTTPS");
        await packet("igw", "webEc2", "Public");
        xr("Public → Private", "local route", "10.0.1.10 → 10.0.2.50", "TCP 3306", "SELECT");
        await packet("webEc2", "dbRds", "local", "#a855f7");
        await packet("dbRds", "webEc2", "Rows", "#10b981");
        await packet("webEc2", "igw", "200", "#10b981");
        await packet("igw", "client", "200 OK", "#10b981");
        addLog("success", "VPC 서브넷 설계 완료!");
        return finish(true);
      case 8:
        await packet("hacker", "igw", "SSH:22", "#ef4444");
        await packet("igw", "webEc2", "22", "#ef4444");
        if (!c.c_websg) return fail("webEc2", "웹 서버 SG가 22번 포트를 허용하고 있습니다.");
        addLog("success", "SG-Web이 22번 공격 차단");
        await packet("user", "igw", "443");
        await packet("igw", "webEc2", "Allow 443", "#10b981");
        await packet("webEc2", "dbRds", "3306");
        if (!c.c_dbsg) return fail("dbRds", "DB SG가 0.0.0.0/0에 열려 있습니다.");
        if (!c.c_natgw) return fail("privateApp", "프라이빗 서버의 아웃바운드 경로가 NAT GW가 아닙니다.");
        xr("EC2 → NAT GW", "VPC", "10.0.2.25 → nat-gw", "TCP 443 out", "apt update");
        await packet("privateApp", "natGw", "Outbound", "#a855f7");
        await packet("natGw", "igw", "SNAT", "#10b981");
        addLog("success", "보안 그룹 + NAT GW 완성!");
        return finish(true);
      case 9:
        await packet("users", "alb", "Traffic");
        if (!c.c_alb_link || !c.c_hc || !c.c_lbmode) {
          await packet("alb", "webAzA", "→ 장애 서버", "#ef4444");
          return fail("webAzA", "502 Bad Gateway — 죽은 서버로 트래픽이 갔습니다.");
        }
        xr("Failover", "ALB → AZ-c", "ALB → 10.0.2.12", "HTTP 80", "Healthy");
        await packet("alb", "webAzB", "Failover", "#10b981");
        await packet("webAzB", "alb", "200", "#10b981");
        await packet("alb", "users", "200 OK", "#10b981");
        addLog("success", "Multi-AZ 무중단 장애 조치 완료!");
        return finish(true);
      case 10:
        await packet("globalUser", "cdnWaf", "' OR 1=1--", "#ef4444");
        if (!c.c_waf) return fail("cdnWaf", "WAF가 꺼져 SQL Injection이 통과했습니다.");
        await packet("cdnWaf", "cloudAlb", "Clean", "#10b981");
        if (!c.c_vpn_link || !c.c_vgw_route) return fail("vgw", "본사 ↔ VPC VPN 터널이 개통되지 않았습니다.");
        xr("IPSec Tunnel", "ESP", "192.168.10.5 → 10.0.2.99", "ESP / TCP 5432", "Encrypted");
        await packet("hqAdmin", "hqVpn", "Admin");
        await packet("hqVpn", "vgw", "IPSec 터널", "#a855f7");
        await packet("vgw", "coreDb", "DB 접속", "#10b981");
        addLog("success", "하이브리드 클라우드 완성!");
        return finish(true);
    }
  }

  function finish(ok) {
    simulating = false;
    $("btnRunSim").disabled = false;
    renderMissions();
    if (!ok) return;
    completed.add(state.id);
    updateRank();
    renderDropdown();
    fanfare();
    const last = idx === stages.length - 1;
    $("modalTitle").textContent = last ? "전 단계 클리어!" : `STAGE ${idx + 1} 클리어!`;
    $("modalIcon").innerHTML = icon(last ? "trophy" : "party-popper", 44);
    $("modalMessage").textContent = state.title;
    $("modalLearned").innerHTML = `<b class="tip-head">${icon("graduation-cap", 14)} 배운 것</b><br/>${state.learnedSummary}`;
    $("btnNextStage").style.display = last ? "none" : "inline-flex";
    $("successModal").classList.remove("hidden");
  }

  // ---------- Bottom drawer ----------
  const DRAWERS = { xray: ["panelXray", "패킷 해부기 (OSI 계층별 헤더)"], cli: ["panelCli", "미니 터미널"], log: ["panelLog", "전체 로그"] };
  let openDrawer = null;

  function toggleDrawer(key) {
    if (openDrawer === key) key = null;
    openDrawer = key;
    $("bottomDrawer").classList.toggle("hidden", !key);
    document.querySelectorAll(".drawer-btn").forEach((b) => b.classList.toggle("active", b.dataset.drawer === key));
    Object.entries(DRAWERS).forEach(([k, [panel]]) => $(panel).classList.toggle("hidden", k !== key));
    if (key) $("drawerTitle").textContent = DRAWERS[key][1];
    if (key === "cli") $("cliInput").focus();
    requestAnimationFrame(() => {
      renderLinks();
      if (!cfgPop.classList.contains("hidden")) positionConfig();
    });
  }

  // ---------- CLI ----------
  function cli(text, cls = "") {
    const d = document.createElement("div");
    d.className = `cli-line ${cls}`;
    d.textContent = text;
    cliOut.appendChild(d);
    cliOut.scrollTop = cliOut.scrollHeight;
  }

  function runCli(raw) {
    cli(`user@pc1:~$ ${raw}`, "cmd");
    const [cmdRaw, arg = ""] = raw.split(/\s+/);
    const cmd = cmdRaw.toLowerCase();
    const pc = state.nodes[0];
    const ok = Object.values(evaluate()).every(Boolean);

    if (cmd === "help") {
      ["ipconfig", "ping [IP]", "traceroute [IP]", "nslookup [도메인]", "arp -a", "curl [IP:포트]", "clear"].forEach((c) => cli("  " + c));
    } else if (cmd === "clear") {
      cliOut.innerHTML = "";
    } else if (cmd === "ipconfig" || cmd === "ifconfig") {
      cli(`[${pc.name}]`, "ok");
      cli(`  IPv4 ...... ${pc.ip || "(미설정)"}`);
      cli(`  Mask ...... ${pc.mask || "-"}`);
      cli(`  Gateway ... ${pc.gateway || "(미설정)"}`);
      cli(`  DNS ....... ${pc.dns || "(미설정)"}`);
    } else if (cmd === "arp") {
      state.nodes.filter((n) => n.mac).forEach((n) => cli(`  ${n.ip.padEnd(18)} ${n.mac}  dynamic`));
      if (!state.nodes.some((n) => n.mac)) cli("  (ARP 캐시 비어 있음)", "muted");
    } else if (cmd === "traceroute" || cmd === "tracert") {
      if (!ok) return cli("  * * * Request timed out (미션을 먼저 완료하세요)", "err");
      state.nodes.forEach((n, i) => cli(`  ${i + 1}  ${n.name} (${n.ip || "-"})  ${(i + 1) * 1.3} ms`, "ok"));
    } else if (cmd === "ping") {
      if (!arg) return cli("사용법: ping [IP]", "err");
      if (ok) {
        cli(`Reply from ${arg}: bytes=32 time=1ms TTL=64`, "ok");
        cli(`Reply from ${arg}: bytes=32 time=1ms TTL=64`, "ok");
      } else cli("Request timed out.", "err");
    } else if (cmd === "nslookup") {
      if (!arg) return cli("사용법: nslookup [도메인]", "err");
      if (pc.dns === "8.8.8.8") cli(`Name: ${arg}\nAddress: 203.0.113.5`, "ok");
      else cli(";; connection timed out; no servers could be reached", "err");
    } else if (cmd === "curl") {
      cli(ok ? "HTTP/1.1 200 OK" : "curl: (7) Failed to connect", ok ? "ok" : "err");
    } else cli(`알 수 없는 명령어: ${cmd} ('help' 입력)`, "err");
  }

  // ---------- Events ----------
  function bind() {
    const stageTrigger = $("stageSelectorTrigger");
    const toggleStages = () => {
      const open = stageTrigger.classList.toggle("open");
      stageTrigger.setAttribute("aria-expanded", String(open));
    };
    stageTrigger.addEventListener("click", toggleStages);
    stageTrigger.addEventListener("keydown", (e) => {
      if (e.target !== stageTrigger) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleStages(); }
      if (e.key === "Escape") { stageTrigger.classList.remove("open"); stageTrigger.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("click", (e) => {
      if (!stageTrigger.contains(e.target)) { stageTrigger.classList.remove("open"); stageTrigger.setAttribute("aria-expanded", "false"); }
    });
    $("btnPrevStage").addEventListener("click", () => loadStage(idx - 1));
    $("btnNextStageTop").addEventListener("click", () => loadStage(idx + 1));
    $("toolSelect").addEventListener("click", () => setTool("select"));
    $("toolCable").addEventListener("click", () => setTool("cable"));
    $("btnRunSim").addEventListener("click", runSim);
    $("btnResetStage").addEventListener("click", () => loadStage(idx));
    $("btnSoundToggle").addEventListener("click", () => {
      sound = !sound;
      $("btnSoundToggle").innerHTML = icon(sound ? "volume-2" : "volume-x", 15);
    });
    $("btnGuideToggle").addEventListener("click", toggleGuideMode);
    $("btnAutoSolve").addEventListener("click", () => {
      const fn = stages[idx].autoSolve;
      if (typeof fn !== "function") return;
      if (state.kind === "docker") solveDocker(state);
      else {
        const canonical = translateObject(state, true);
        fn(canonical);
        state = translateObject(canonical);
      }
      closeConfig();
      renderNodes();
      renderLinks();
      renderMissions();
      tone(660, 0.1);
      addLog("info", "정답 설정 완료 — <b>패킷 전송</b>으로 흐름을 확인하세요.");
    });
    $("btnCloseConfig").addEventListener("click", () => {
      closeConfig();
      selectedId = null;
      renderNodes();
    });
    cfgPop.addEventListener("click", (e) => e.stopPropagation());
    cfgPop.addEventListener("mousedown", (e) => e.stopPropagation());
    canvas.addEventListener("click", () => {
      if (tool === "select" && selectedId) {
        selectedId = null;
        closeConfig();
        renderNodes();
      }
    });
    document.querySelectorAll(".drawer-btn").forEach((b) => b.addEventListener("click", () => toggleDrawer(b.dataset.drawer)));
    $("btnCloseDrawer").addEventListener("click", () => toggleDrawer(null));
    $("cliForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = $("cliInput").value.trim();
      if (v) runCli(v);
      $("cliInput").value = "";
    });
    $("btnStayStage").addEventListener("click", () => $("successModal").classList.add("hidden"));
    $("btnNextStage").addEventListener("click", () => {
      $("successModal").classList.add("hidden");
      loadStage(idx + 1);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (tool === "cable") setTool("select");
        else closeConfig();
      }
    });
    window.addEventListener("resize", () => {
      renderLinks();
      if (!cfgPop.classList.contains("hidden")) positionConfig();
    });
  }

  if (window.lucide) window.lucide.createIcons();
  bind();
  updateRank();
  loadStage(0);
})();
