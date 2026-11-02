// NetQuest Pro: 10 Progressive Stages (Local LAN ->Enterprise Office ->Cloud VPC & Hybrid Cloud)

window.NETQUEST_GLOSSARY = [{
    term: "IP 주소 (IPv4) & 서브넷 마스크",
    desc: "IP 주소는 컴퓨터의 '집 주소(예: 192.168.1.10)'이고, 서브넷 마스크(255.255.255.0)는 어디까지가 같은 동네(네트워크 대역: 192.168.1)이고 어디가 집 번호(.10)인지 구분하는 기준선입니다."},
  {
    term: "L2 스위치 (Switch) & MAC 주소",
    desc: "같은 사무실이나 집(LAN) 안의 여러 컴퓨터를 연결하는 장비입니다. 랜카드 고유 번호인 MAC 주소를 보고 목적지 포트로만 정확히 프레임을 전달합니다."},
  {
    term: "DHCP (동적 호스트 구성 프로토콜)",
    desc: "카페 와이파이나 공유기에 연결했을 때 내가 직접 IP를 입력하지 않아도 자동으로 남는 IP, 서브넷 마스크, 게이트웨이, DNS를 빌려주는(Lease) 자동 할당 프로토콜입니다."},
  {
    term: "VLAN (가상 랜, Virtual LAN)",
    desc: "물리적인 스위치 1대를 논리적으로 쪼개어 부서별로 완전히 다른 네트워크처럼 격리하는 기술입니다. 예: 개발팀(VLAN 10)과 인사팀(VLAN 20)은 같은 스위치에 꽂혀 있어도 서로 접근할 수 없습니다."},
  {
    term: "라우터(공유기) & 기본 게이트웨이(Gateway)",
    desc: "내 컴퓨터와 다른 네트워크(외부 인터넷 등)로 데이터를 보낼 때 무조건 먼저 거쳐야 하는 '출입문'입니다. 보통 공유기의 내부 IP(192.168.1.1)를 기본 게이트웨이로 지정합니다."},
  {
    term: "사설 IP vs 공인 IP & NAT",
    desc: "192.168.x.x나 10.x.x.x는 내부망에서만 쓰는 '사설 IP'입니다. 인터넷으로 나갈 때 공유기가 전 세계에서 유일한 '공인 IP'로 출발지 주소를 바꿔주는데 이를 NAT(Network Address Translation)라고 합니다."},
  {
    term: "DNS & 포트 포워딩 (Port Forwarding)",
    desc: "DNS는 도메인(google.com)을 IP(8.8.8.8)로 바꿔주는 전화번호부입니다. 포트 포워딩은 외부에서 공유기 공인 IP의 특정 포트(예: 8080)로 들어온 요청을 집 안의 특정 서버(192.168.1.50:80)로 연결해 주는 규칙입니다."},
  {
    term: "클라우드 VPC & 퍼블릭/프라이빗 서브넷",
    desc: "VPC는 AWS/GCP 클라우드 안에 만드는 '나만의 가상 데이터센터(10.0.0.0/16)'입니다. 인터넷 게이트웨이(IGW)와 연결된 곳은 퍼블릭 서브넷(웹서버용), 인터넷 게이트웨이 직접 경로가 없는 곳은 프라이빗 서브넷(DB용)입니다."},
  {
    term: "보안 그룹 (Security Group) & NAT 게이트웨이",
    desc: "보안 그룹은 클라우드 인스턴스를 감싸는 상태 저장(Stateful) 가상 방화벽입니다. NAT 게이트웨이는 프라이빗 서브넷의 서버가 인터넷 연결을 시작할 때 사용할 수 있는 아웃바운드 경로입니다. 관리형 DB에 일반 서버처럼 OS 패치를 직접 설치하지는 않습니다."},
  {
    term: "ALB (로드밸런서), CDN/WAF & Site-to-Site VPN",
    desc: "ALB는 여러 대의 웹 서버로 트래픽을 골고루 분산하고 죽은 서버를 제외(Health Check)합니다. WAF는 해커의 웹 공격(SQL Injection)을 막고, VPN은 회사 사내망과 클라우드 VPC를 암호화 터널로 연결합니다."}
];

window.NETQUEST_QUIZZES = [{
    q: "Q1. 내 컴퓨터의 IP가 192.168.1.10이고 서브넷 마스크가 255.255.255.0일 때, 라우터 없이 스위치만으로 직접 통신할 수 있는 같은 대역의 IP는?",
    options: ["192.168.2.10", "192.168.1.55", "10.0.1.10", "172.16.1.10"],
    answer: 1
  },
  {
    q: "Q2. 집 안의 사설 IP(192.168.1.10)를 가진 PC가 외부 인터넷(8.8.8.8)과 통신할 때, 공유기가 출발지 주소를 공유기의 '공인 IP'로 변환해 주는 기술은?",
    options: ["VLAN", "ARP", "NAT (Network Address Translation)", "DHCP"],
    answer: 2
  },
  {
    q: "Q3. 클라우드 VPC에서 고객의 개인정보가 담긴 데이터베이스(RDS)를 안전하게 배치하기에 가장 알맞은 곳은?",
    options: ["인터넷 게이트웨이(IGW)가 직접 연결된 퍼블릭 서브넷",
      "모든 포트(0~65535)를 0.0.0.0/0에 개방한 서브넷",
      "외부 인터넷 직접 라우팅이 차단된 프라이빗 서브넷 (Private Subnet)",
      "DMZ 외부 공인 구간"],
    answer: 2
  },
  {
    q: "Q4. 프라이빗 서브넷에 있는 EC2 서버가 외부에서 시작한 접속을 막으면서 인터넷에서 보안 패치를 다운로드받아야 할 때 퍼블릭 서브넷에 두는 장비는?",
    options: ["L2 스위치", "NAT 게이트웨이 (NAT Gateway)", "DHCP 서버", "VLAN 트렁크"],
    answer: 1
  }
];

window.NETQUEST_STAGES = [// =========================================================================
  // STAGE 1: Direct Connection & IP Addressing
  // =========================================================================
  {
    id: 1,
    chapter: "CHAPTER 1. 로컬 네트워크(LAN)의 시작",
    shortName: "1. IP와 1:1 연결",
    title: "두 대의 컴퓨터를 랜선으로 연결하고 IP 주소를 부여하자!",
    story: "네트워크의 가장 첫걸음입니다! 컴퓨터 두 대(PC 1, PC 2)가 놓여 있지만 랜선도 연결되어 있지 않고 PC 2에는 주소(IP)도 없습니다. 두 컴퓨터가 서로 Ping 패킷을 주고받을 수 있게 만들어 주세요.",
    conceptHtml: `<ul><li><b>물리 계층(L1 랜선):</b> 컴퓨터끼리 전기를 주고받을 물리적 케이블입니다.</li><li><b>IP 주소와 서브넷 마스크(L3):</b> 서브넷 마스크가 <code>255.255.255.0</code> 일 때 앞 세 자리(<code>192.168.1.x</code>)는 '동네 이름', 마지막 숫자는 '집 번호'입니다. 동네 이름은 같고 집 번호는 달라야 통신할 수 있습니다!</li></ul>`,
    hintHtml: `1. 상단 <b>[랜선 연결 / 끊기]</b> 버튼을 누른 뒤 <b>내 컴퓨터(PC 1)</b>와 <b>친구 컴퓨터(PC 2)</b>를 차례로 클릭해 연결하세요.<br/>2. <b>[장비 선택]</b> 모드에서 <b>PC 2</b>를 클릭하고 오른쪽 설정 창에 IP <code>192.168.1.20</code>과 서브넷 마스크 <code>255.255.255.0</code>을 직접 입력하세요!
    `,
    zones: [{ title: "1:1 로컬 네트워크 (192.168.1.0/24)", type: "zone-lan", x: 10, y: 15, w: 80, h: 70 }
    ],
    nodes: [{
        id: "pc1",
        name: "내 컴퓨터 (PC 1)",
        type: "pc",
        icon: "laptop",
        role: "출발지 호스트 (MAC: AA:01)",
        mac: "00:1A:2B:AA:01",
        x: 28,
        y: 50,
        ip: "192.168.1.10",
        mask: "255.255.255.0",
        editable: ["ip", "mask"]
      },
      {
        id: "pc2",
        name: "친구 컴퓨터 (PC 2)",
        type: "pc",
        icon: "monitor",
        role: "목적지 호스트 (MAC: BB:02)",
        mac: "00:1A:2B:BB:02",
        x: 72,
        y: 50,
        ip: "",
        mask: "",
        editable: ["ip", "mask"],
        suggestions: {
          ip: ["192.168.1.20", "192.168.1.10", "10.0.0.2"],
          mask: ["255.255.255.0", "255.255.0.0"]
        }
      }
    ],
    links: [],
    checklist: [{ id: "c_link", text: "PC 1과 PC 2 사이에 랜선(케이블) 연결하기"},
      { id: "c_ip", text: "PC 2에 192.168.1.x 대역의 고유 IP 설정하기"},
      { id: "c_mask", text: "두 PC의 서브넷 마스크를 255.255.255.0으로 맞추기"}
    ],
    autoSolve: function (st) {
      st.links = [["pc1", "pc2"]];
      const pc2 = st.nodes.find((n) =>n.id === "pc2");
      pc2.ip = "192.168.1.20";
      pc2.mask = "255.255.255.0";
    },
    learnedSummary: "IP 주소의 네트워크 대역(192.168.1)과 호스트 번호(.10, .20), 그리고 서브넷 마스크(255.255.255.0)의 역할을 마스터했습니다!"},

  // =========================================================================
  // STAGE 2: Switch & Local Area Network (LAN) + IP Conflict
  // =========================================================================
  {
    id: 2,
    chapter: "CHAPTER 1. 로컬 네트워크(LAN)의 시작",
    shortName: "2. 스위치와 IP 충돌",
    title: "스위치(Switch)로 여러 장비를 묶고 IP 충돌을 해결하자!",
    story: "컴퓨터가 여러 대일 때는 중앙에 'L2 스위치'를 놓고 별 모양(Star Topology)으로 연결합니다. 그런데 현재 PC 2가 실수로 PC 1과 똑같은 IP(192.168.1.10)를 써서 IP 충돌이 났고, 파일 서버(NAS)는 대역이 엉뚱하게 설정되어 있네요!",
    conceptHtml: `<ul><li><b>L2 스위치(Switch):</b> 같은 로컬 네트워크(LAN) 안에서 장비들의 <b>MAC 주소</b>를 학습해 원하는 장비로만 패킷을 배달해 주는 분배기입니다.</li><li><b>IP 충돌(Conflict):</b> 한 동네에 똑같은 집 주소가 두 개 있으면 우체부가 혼란에 빠져 통신이 마비됩니다!</li></ul>`,
    hintHtml: `1. <b>PC 2</b>를 클릭해 IP를 <code>192.168.1.20</code>으로 바꿔 충돌을 해결하세요.<br/>2. <b>[랜선 연결]</b>도구로 <b>L2 스위치</b>와 <b>공유 파일서버(NAS)</b>를 연결하세요.<br/>3. <b>공유 파일서버(NAS)</b>를 클릭해 IP를 같은 동네 대역인 <code>192.168.1.100</code>으로 수정하세요!
    `,
    zones: [{ title: "소규모 사무실 LAN (192.168.1.0/24)", type: "zone-lan", x: 8, y: 12, w: 84, h: 76 }
    ],
    nodes: [{
        id: "pc1",
        name: "개발 PC 1",
        type: "pc",
        icon: "laptop",
        role: "클라이언트 1",
        mac: "AA:BB:CC:00:01",
        x: 22,
        y: 28,
        ip: "192.168.1.10",
        mask: "255.255.255.0",
        editable: ["ip", "mask"]
      },
      {
        id: "pc2",
        name: "디자인 PC 2",
        type: "pc",
        icon: "monitor",
        role: "클라이언트 2 (IP 충돌!)",
        mac: "AA:BB:CC:00:02",
        x: 22,
        y: 72,
        ip: "192.168.1.10",
        mask: "255.255.255.0",
        editable: ["ip", "mask"],
        suggestions: { ip: ["192.168.1.20", "192.168.1.10"] }
      },
      {
        id: "sw1",
        name: "L2 스위치",
        type: "switch",
        icon: "network",
        role: "MAC 주소 기반 스위칭",
        x: 50,
        y: 50,
        ip: "L2 Switch",
        editable: []
      },
      {
        id: "nas",
        name: "공유 파일서버 (NAS)",
        type: "server",
        icon: "hard-drive",
        role: "내부 스토리지 서버",
        mac: "AA:BB:CC:00:99",
        x: 78,
        y: 50,
        ip: "192.168.2.100",
        mask: "255.255.255.0",
        editable: ["ip", "mask"],
        suggestions: { ip: ["192.168.1.100", "192.168.2.100"] }
      }
    ],
    links: [["pc1", "sw1"],
      ["pc2", "sw1"]
    ],
    checklist: [{ id: "c_conflict", text: "PC 2의 IP를 변경해 PC 1과의 IP 주소 충돌 해결하기"},
      { id: "c_nas_link", text: "L2 스위치와 공유 파일서버(NAS)를 랜선으로 연결하기"},
      { id: "c_nas_subnet", text: "파일서버(NAS)의 IP를 같은 대역(192.168.1.100)으로 맞추기"}
    ],
    autoSolve: function (st) {
      st.links = [["pc1", "sw1"], ["pc2", "sw1"], ["sw1", "nas"]];
      st.nodes.find((n) =>n.id === "pc2").ip = "192.168.1.20";
      st.nodes.find((n) =>n.id === "nas").ip = "192.168.1.100";
    },
    learnedSummary: "스위치를 중심으로 스타형(Star) LAN을 구성하는 법과, IP 충돌 및 서브넷 대역 불일치 트러블슈팅을 마스터했습니다!"},

  // =========================================================================
  // STAGE 3: DHCP Server (Automatic IP Assignment)
  // =========================================================================
  {
    id: 3,
    chapter: "CHAPTER 1. 로컬 네트워크(LAN)의 시작",
    shortName: "3. DHCP 자동할당",
    title: "컴퓨터가 100대라면? DHCP 서버로 IP를 자동 배급하자!",
    story: "카페에서 와이파이를 잡을 때 우리가 직접 IP를 입력하지 않죠? 바로 'DHCP 서버'가 남는 IP 주소를 자동으로 나눠주기 때문입니다! DHCP 서버를 켜고 노트북과 스마트폰이 자동으로 IP를 받아가게 설정하세요.",
    conceptHtml: `<ul><li><b>DHCP 동작 4단계 (DORA):</b> 클라이언트가 <code>Discover(찾기)</code> → 서버가 <code>Offer(제안)</code> → 클라이언트가 <code>Request(요청)</code> → 서버가 <code>Ack(승인)</code> 하여 IP를 빌려줍니다.</li><li><b>DHCP IP 풀(Pool):</b> 서버가 나눠줄 IP 범위(예: <code>192.168.1.100 ~ 200</code>)를 지정해야 합니다.</li></ul>`,
    hintHtml: `1. <b>DHCP 서버</b>를 클릭하고 <b>[DHCP 서비스 활성화]</b> 스위치를 켜고, 시작 IP 풀을 <code>192.168.1.100</code>으로 지정하세요.<br/>2. <b>노트북</b>과 <b>스마트폰</b>을 각각 클릭해 IP 할당 방식을 <code>DHCP (자동 할당 받기)</code>로 변경하세요!
    `,
    zones: [{ title: "스마트 오피스 LAN (DHCP 192.168.1.0/24)", type: "zone-lan", x: 8, y: 12, w: 84, h: 76 }
    ],
    nodes: [{
        id: "dhcpSrv",
        name: "사내 DHCP 서버",
        type: "server",
        icon: "zap",
        role: "IP 자동 할당 서버",
        x: 22,
        y: 50,
        ip: "192.168.1.2",
        dhcpEnabled: false,
        dhcpPoolStart: "",
        editable: ["dhcpEnabled", "dhcpPoolStart"],
        suggestions: { dhcpPoolStart: ["192.168.1.100"] }
      },
      {
        id: "sw1",
        name: "오피스 스위치",
        type: "switch",
        icon: "network",
        role: "브로드캐스트 전달",
        x: 50,
        y: 50,
        ip: "L2 Switch",
        editable: []
      },
      {
        id: "laptop",
        name: "신입사원 노트북",
        type: "pc",
        icon: "laptop",
        role: "클라이언트 1",
        x: 78,
        y: 28,
        ip: "미할당 (0.0.0.0)",
        ipMode: "STATIC",
        editable: ["ipMode"]
      },
      {
        id: "phone",
        name: "업무용 스마트폰",
        type: "pc",
        icon: "smartphone",
        role: "클라이언트 2",
        x: 78,
        y: 72,
        ip: "미할당 (0.0.0.0)",
        ipMode: "STATIC",
        editable: ["ipMode"]
      }
    ],
    links: [["dhcpSrv", "sw1"],
      ["sw1", "laptop"],
      ["sw1", "phone"]
    ],
    checklist: [{ id: "c_dhcp_on", text: "DHCP 서버 기능을 켜고(ON) 시작 IP 풀을 192.168.1.100으로 설정"},
      { id: "c_clients_dhcp", text: "노트북과 스마트폰의 IP 모드를 'DHCP (자동 할당)'으로 변경"}
    ],
    autoSolve: function (st) {
      const srv = st.nodes.find((n) =>n.id === "dhcpSrv");
      srv.dhcpEnabled = true;
      srv.dhcpPoolStart = "192.168.1.100";
      const lap = st.nodes.find((n) =>n.id === "laptop");
      const ph = st.nodes.find((n) =>n.id === "phone");
      lap.ipMode = "DHCP";
      lap.ip = "192.168.1.101 (DHCP)";
      ph.ipMode = "DHCP";
      ph.ip = "192.168.1.102 (DHCP)";
    },
    learnedSummary: "일일이 수동(Static)으로 IP를 입력하지 않아도 DHCP(DORA 과정)를 통해 IP, 서브넷 마스크, 게이트웨이를 자동으로 받아오는 원리를 배웠습니다!"},

  // =========================================================================
  // STAGE 4: VLAN (Virtual LAN Segmentation)
  // =========================================================================
  {
    id: 4,
    chapter: "CHAPTER 2. 사내망 분리와 인터넷 연결",
    shortName: "4. VLAN 망 분리",
    title: "스위치 하나로 개발팀(VLAN 10)과 인사팀(VLAN 20)을 격리하라!",
    story: "회사 보안 감사 지적 사항입니다! 현재 개발팀 PC와 인사팀 기밀 서버가 같은 스위치에 아무 구분 없이 연결되어 있어 개발팀에서 인사팀 급여 서버로 접근이 가능합니다. VLAN(가상 랜) 번호를 나누어 부서 간 보안을 격리하세요!",
    conceptHtml: `<ul><li><b>VLAN (Virtual LAN):</b> 물리적 스위치 하나를 소프트웨어적으로 여러 개의 독립된 스위치처럼 쪼개는 기술입니다.</li><li>같은 스위치에 꽂혀 있어도 <b>VLAN ID가 같아야만(예: 10번끼리, 20번끼리)</b> 통신이 되며, 다른 VLAN 번호끼리는 브로드캐스트조차 넘어가지 않습니다!</li></ul>`,
    hintHtml: `1. <b>개발자 PC</b>와 <b>개발 코드 서버</b>는 둘 다 <code>VLAN 10 (개발망)</code>으로 맞춰주세요.<br/>2. <b>인사팀 PC</b>와 <b>인사 급여 서버</b>는 둘 다 <code>VLAN 20 (인사기밀망)</code>으로 변경해 두 부서를 완벽히 분리하세요!
    `,
    zones: [{ title: "본사 통합 스위치 네트워크 (VLAN 분리 전/후)", type: "zone-lan", x: 6, y: 10, w: 88, h: 80 }
    ],
    nodes: [{
        id: "devPc",
        name: "개발자 PC",
        type: "pc",
        icon: "laptop",
        role: "개발팀 (192.168.10.11)",
        x: 20,
        y: 26,
        ip: "192.168.10.11",
        vlan: "10",
        editable: ["vlan"]
      },
      {
        id: "hrPc",
        name: "인사팀 PC",
        type: "pc",
        icon: "user-round",
        role: "인사팀 (192.168.20.11)",
        x: 20,
        y: 74,
        ip: "192.168.20.11",
        vlan: "10",
        editable: ["vlan"]
      },
      {
        id: "swVlan",
        name: "L2 매니지드 스위치",
        type: "switch",
        icon: "network",
        role: "802.1Q VLAN 태그 스위치",
        x: 50,
        y: 50,
        ip: "VLAN Switch",
        editable: []
      },
      {
        id: "devSrv",
        name: "개발 Git 서버",
        type: "server",
        icon: "monitor",
        role: "개발팀 전용 서버",
        x: 80,
        y: 26,
        ip: "192.168.10.100",
        vlan: "20",
        editable: ["vlan"]
      },
      {
        id: "hrSrv",
        name: "인사 급여 서버",
        type: "server",
        icon: "lock",
        role: "인사팀 기밀 서버",
        x: 80,
        y: 74,
        ip: "192.168.20.100",
        vlan: "20",
        editable: ["vlan"]
      }
    ],
    links: [["devPc", "swVlan"],
      ["hrPc", "swVlan"],
      ["swVlan", "devSrv"],
      ["swVlan", "hrSrv"]
    ],
    checklist: [{ id: "c_vlan10", text: "개발자 PC와 개발 Git 서버를 모두 VLAN 10으로 설정하기"},
      { id: "c_vlan20", text: "인사팀 PC와 인사 급여 서버를 모두 VLAN 20으로 격리하기"}
    ],
    autoSolve: function (st) {
      st.nodes.find((n) =>n.id === "devPc").vlan = "10";
      st.nodes.find((n) =>n.id === "devSrv").vlan = "10";
      st.nodes.find((n) =>n.id === "hrPc").vlan = "20";
      st.nodes.find((n) =>n.id === "hrSrv").vlan = "20";
    },
    learnedSummary: "스위치 장비를 여러 대 사지 않고도 VLAN(가상 랜) ID 설정만으로 부서별 네트워크를 안전하게 쪼개는 실무 기법을 익혔습니다!"},

  // =========================================================================
  // STAGE 5: Router, Default Gateway & NAT
  // =========================================================================
  {
    id: 5,
    chapter: "CHAPTER 2. 사내망 분리와 인터넷 연결",
    shortName: "5. 게이트웨이와 NAT",
    title: "사설 네트워크에서 외부 인터넷 세상으로 나가보자!",
    story: "내부망(192.168.1.x)을 넘어 외부 인터넷 서버(8.8.8.8)로 나갈 시간입니다! 내 컴퓨터에 '기본 게이트웨이(공유기 주소)'를 알려주고, 공유기에서 사설 IP를 공인 IP로 바꿔주는 'NAT'를 켜주세요.",
    conceptHtml: `<ul><li><b>기본 게이트웨이 (Default Gateway):</b> 내 동네(192.168.1.x)가 아닌 외부 인터넷 주소로 패킷을 보낼 때 무조건 찾아가는 공유기의 내부 IP(<code>192.168.1.1</code>)입니다.</li><li><b>NAT (Network Address Translation):</b> 사설 IP(<code>192.168.1.10</code>)는 인터넷에서 라우팅되지 않습니다. 공유기가 밖으로 나갈 때 자신의 공인 IP(<code>203.0.113.5</code>)로 출발지 주소를 바꿔줍니다!</li></ul>`,
    hintHtml: `1. <b>내 컴퓨터(PC 1)</b>를 클릭하고 기본 게이트웨이에 <code>192.168.1.1</code>을 입력하세요.<br/>2. <b>홈 공유기(Router)</b>를 클릭하고 <b>[NAT 활성화]</b> 스위치를 켜세요(ON)!
    `,
    zones: [{ title: "우리 집 사설망 (192.168.1.0/24)", type: "zone-lan", x: 5, y: 15, w: 52, h: 70 },
      { title: "외부 공인 인터넷 (Public WAN)", type: "zone-wan", x: 62, y: 15, w: 33, h: 70 }
    ],
    nodes: [{
        id: "pc1",
        name: "내 컴퓨터 (PC 1)",
        type: "pc",
        icon: "laptop",
        role: "사설 IP 호스트",
        x: 18,
        y: 50,
        ip: "192.168.1.10",
        mask: "255.255.255.0",
        gateway: "",
        editable: ["ip", "mask", "gateway"],
        suggestions: { gateway: ["192.168.1.1", "203.0.113.5", "8.8.8.8"] }
      },
      {
        id: "router1",
        name: "홈 공유기 (Router)",
        type: "router",
        icon: "router",
        role: "게이트웨이 & NAT 라우터",
        x: 47,
        y: 50,
        ip: "LAN:192.168.1.1 / WAN:203.0.113.5",
        lanIp: "192.168.1.1",
        wanIp: "203.0.113.5",
        natEnabled: false,
        editable: ["natEnabled"]
      },
      {
        id: "googleDns",
        name: "외부 인터넷 서버",
        type: "cloud",
        icon: "globe",
        role: "공인 인터넷 목적지",
        x: 79,
        y: 50,
        ip: "8.8.8.8",
        editable: []
      }
    ],
    links: [["pc1", "router1"],
      ["router1", "googleDns"]
    ],
    checklist: [{ id: "c_gw", text: "PC 1의 기본 게이트웨이(Gateway)를 공유기 LAN IP(192.168.1.1)로 설정"},
      { id: "c_nat", text: "홈 공유기(Router)의 NAT(사설→공인 IP 변환) 기능 켜기"}
    ],
    autoSolve: function (st) {
      st.nodes.find((n) =>n.id === "pc1").gateway = "192.168.1.1";
      st.nodes.find((n) =>n.id === "router1").natEnabled = true;
    },
    learnedSummary: "기본 게이트웨이의 개념과, 공유기가 사설 IP를 공인 IP로 변환(NAT)하여 인터넷 통신을 가능하게 하는 핵심 원리를 마스터했습니다!"},

  // =========================================================================
  // STAGE 6: DNS & Port Forwarding
  // =========================================================================
  {
    id: 6,
    chapter: "CHAPTER 2. 사내망 분리와 인터넷 연결",
    shortName: "6. DNS와 포트포워딩",
    title: "DNS로 도메인을 찾고, 포트 포워딩으로 집 안의 웹 서버를 공개하자!",
    story: "내 PC에서 도메인 이름으로 접속할 수 있도록 DNS 서버(8.8.8.8)를 등록하고, 외부 친구가 우리 집 공유기 공인 IP의 8080 포트로 접속했을 때 집 안의 홈 웹서버(192.168.1.50:80)로 연결되도록 포트 포워딩 규칙을 설정하세요! 내부 PC의 DNS 조회와 외부 방문자의 접속은 각각 별도의 통신입니다.",
    conceptHtml: `<ul><li><b>DNS (Domain Name System):</b> 도메인 주소(<code>myblog.com</code>)를 IP 주소로 변환해 주는 전화번호부 서버입니다.</li><li><b>포트 포워딩 (Port Forwarding):</b> 외부에서는 사설 IP(<code>192.168.1.50</code>)를 직접 부를 수 없습니다. 공유기의 <code>8080</code> 포트로 들어온 손님을 내부 웹 서버(<code>192.168.1.50</code>)의 <code>80</code> 포트로 토스해 주는 안내판입니다!</li></ul>`,
    hintHtml: `1. <b>내 컴퓨터(PC 1)</b>의 DNS 서버 주소를 <code>8.8.8.8</code>로 설정하세요.<br/>2. <b>홈 공유기(Router)</b>를 클릭하고 포트 포워딩 규칙에 외부 포트 <code>8080</code> → 내부 IP <code>192.168.1.50</code>, 내부 포트 <code>80</code>을 입력하세요!
    `,
    zones: [{ title: "우리 집 사설망 (192.168.1.0/24)", type: "zone-lan", x: 4, y: 12, w: 52, h: 76 },
      { title: "외부 인터넷 (Public Internet)", type: "zone-wan", x: 60, y: 12, w: 36, h: 76 }
    ],
    nodes: [{
        id: "pc1",
        name: "내 컴퓨터 (PC 1)",
        type: "pc",
        icon: "laptop",
        role: "내부 클라이언트",
        x: 18,
        y: 28,
        ip: "192.168.1.10",
        mask: "255.255.255.0",
        gateway: "192.168.1.1",
        dns: "",
        editable: ["dns"],
        suggestions: { dns: ["8.8.8.8"] }
      },
      {
        id: "homeWeb",
        name: "홈 웹서버 (Nginx)",
        type: "server",
        icon: "monitor",
        role: "내부 웹서버 (Port 80)",
        x: 18,
        y: 72,
        ip: "192.168.1.50",
        mask: "255.255.255.0",
        gateway: "192.168.1.1",
        editable: []
      },
      {
        id: "router1",
        name: "홈 공유기 (Router)",
        type: "router",
        icon: "router",
        role: "공인 IP: 203.0.113.5",
        x: 45,
        y: 50,
        ip: "WAN: 203.0.113.5",
        lanIp: "192.168.1.1",
        wanIp: "203.0.113.5",
        natEnabled: true,
        pfExtPort: "",
        pfIntIp: "",
        pfIntPort: "",
        editable: ["portForward"]
      },
      {
        id: "dnsServer",
        name: "공인 DNS 서버",
        type: "cloud",
        icon: "book-open",
        role: "도메인 주소록 서버",
        x: 78,
        y: 28,
        ip: "8.8.8.8",
        editable: []
      },
      {
        id: "extUser",
        name: "외부 방문자",
        type: "pc",
        icon: "user",
        role: "203.0.113.5:8080 접속",
        x: 78,
        y: 72,
        ip: "198.51.100.77",
        editable: []
      }
    ],
    links: [["pc1", "router1"],
      ["homeWeb", "router1"],
      ["router1", "dnsServer"],
      ["router1", "extUser"]
    ],
    checklist: [{ id: "c_dns", text: "내 컴퓨터(PC 1)에 DNS 서버 주소(8.8.8.8) 설정하기"},
      { id: "c_pf_port", text: "공유기에 외부 포트 8080 → 내부 192.168.1.50:80 포트 포워딩 설정하기"}
    ],
    autoSolve: function (st) {
      st.nodes.find((n) =>n.id === "pc1").dns = "8.8.8.8";
      const r = st.nodes.find((n) =>n.id === "router1");
      r.pfExtPort = "8080";
      r.pfIntIp = "192.168.1.50";
      r.pfIntPort = "80";
    },
    learnedSummary: "DNS 도메인 질의 과정과 DNAT(포트 포워딩)를 이용해 사설망 내부의 서버를 외부에 노출하는 방법을 완전히 익혔습니다!"},

  // =========================================================================
  // STAGE 7: Cloud VPC, Public vs Private Subnet & Internet Gateway
  // =========================================================================
  {
    id: 7,
    chapter: "CHAPTER 3. 클라우드 네트워크(VPC) 아키텍처",
    shortName: "7. 클라우드 VPC·서브넷",
    title: "클라우드 입문! VPC 안에 퍼블릭 서브넷과 프라이빗 서브넷 설계하기",
    story: "이제 AWS/GCP 같은 클라우드 데이터센터에 서비스를 구축합니다! 가상 네트워크인 VPC(10.0.0.0/16) 안에서 고객이 접속하는 웹 서버는 '퍼블릭 서브넷'에 두고 인터넷 게이트웨이(IGW)와 연결하고, 고객 DB는 '프라이빗 서브넷'에 두어 외부 직접 접근을 원천 차단하세요!",
    conceptHtml: `<ul><li><b>VPC (Virtual Private Cloud):</b> 클라우드 안에 만드는 나만의 격리된 가상 네트워크(<code>10.0.0.0/16</code>)입니다.</li><li><b>퍼블릭 서브넷 (<code>10.0.1.0/24</code>):</b> 라우팅 테이블에 <code>0.0.0.0/0 → igw-main</code> 경로가 있는 구역입니다. 서버의 인터넷 통신에는 공인 주소와 접근 허용 규칙도 필요합니다.</li><li><b>프라이빗 서브넷 (<code>10.0.2.0/24</code>):</b> IGW 경로가 없어 인터넷 게이트웨이 직접 경로가 없는 내부 구역 (다른 연결과 접근 정책은 별도 확인 필요)입니다.</li></ul>`,
    hintHtml: `1. <b>[랜선 연결]</b>도구로 <b>인터넷 게이트웨이(IGW)</b>와 <b>웹 서버(EC2 Web)</b>를 연결하세요.<br/>2. <b>웹 서버(EC2 Web)</b>를 클릭해 외부 인터넷 경로를 <code>0.0.0.0/0 → igw-main</code>으로 설정하세요.<br/>3. <b>고객 DB(RDS)</b>를 클릭해 외부 인터넷 경로를 <code>외부 경로 없음 (내부 통신만 허용)</code>으로 변경하세요!
    `,
    zones: [{ title: "외부 인터넷", type: "zone-wan", x: 3, y: 20, w: 20, h: 60 },
      { title: "클라우드 VPC (10.0.0.0/16)", type: "zone-vpc", x: 27, y: 8, w: 69, h: 84 },
      { title: "퍼블릭 서브넷 (10.0.1.0/24)", type: "zone-public", x: 52, y: 15, w: 40, h: 33 },
      { title: "프라이빗 서브넷 (10.0.2.0/24)", type: "zone-private", x: 52, y: 54, w: 40, h: 33 }
    ],
    nodes: [{
        id: "client",
        name: "인터넷 고객",
        type: "pc",
        icon: "user",
        role: "외부 클라이언트",
        x: 13,
        y: 50,
        ip: "198.51.100.12",
        editable: []
      },
      {
        id: "igw",
        name: "인터넷 게이트웨이",
        type: "router",
        icon: "door-open",
        role: "VPC 정문 (igw-main)",
        x: 38,
        y: 32,
        ip: "igw-main",
        editable: []
      },
      {
        id: "webEc2",
        name: "웹 서버 (EC2 Web)",
        type: "server",
        icon: "globe",
        role: "퍼블릭 서브넷 인스턴스",
        x: 72,
        y: 32,
        ip: "10.0.1.10",
        routeDefault: "none",
        editable: ["routeDefault"],
        routeOptions: [{ value: "none", label: "없음 (인터넷 통신 불가)"},
          { value: "igw-main", label: "0.0.0.0/0 → igw-main (인터넷 게이트웨이)"}
        ]
      },
      {
        id: "dbRds",
        name: "고객 DB (RDS)",
        type: "server",
        icon: "database",
        role: "프라이빗 서브넷 DB",
        x: 72,
        y: 70,
        ip: "10.0.2.50",
        routeDefault: "igw-main",
        editable: ["routeDefault"],
        routeOptions: [{ value: "igw-main", label: "0.0.0.0/0 → igw-main (위험: 외부 노출!)"},
          { value: "none", label: "외부 경로 없음 (10.0.0.0/16 내부 통신만 허용)"}
        ]
      }
    ],
    links: [["client", "igw"],
      ["webEc2", "dbRds"]
    ],
    checklist: [{ id: "c_igw_link", text: "인터넷 게이트웨이(IGW)와 웹 서버(EC2 Web)를 랜선으로 연결"},
      { id: "c_pub_rt", text: "퍼블릭 서브넷(웹 서버) 라우팅 테이블에 0.0.0.0/0 → igw-main 설정"},
      { id: "c_priv_rt", text: "프라이빗 서브넷(고객 DB)은 외부 인터넷 경로를 차단하여 보호하기"}
    ],
    autoSolve: function (st) {
      st.links = [["client", "igw"], ["igw", "webEc2"], ["webEc2", "dbRds"]];
      st.nodes.find((n) =>n.id === "webEc2").routeDefault = "igw-main";
      st.nodes.find((n) =>n.id === "dbRds").routeDefault = "none";
    },
    learnedSummary: "클라우드 인프라의 핵심인 VPC 서브넷 분리(Public vs Private)와 라우팅 테이블, 인터넷 게이트웨이(IGW)의 원리를 완벽히 체득했습니다!"},

  // =========================================================================
  // STAGE 8: Cloud Security Group & NAT Gateway
  // =========================================================================
  {
    id: 8,
    chapter: "CHAPTER 3. 클라우드 네트워크(VPC) 아키텍처",
    shortName: "8. 보안그룹과 NAT GW",
    title: "보안 그룹(Security Group)으로 해커를 막고 NAT 게이트웨이를 개통하라!",
    story: "웹 서버에 모든 포트가 열려 있어 해커가 22번(SSH) 포트로 침입을 시도하고 있습니다! 웹 서버 보안 그룹은 80/443만 허용하고, DB 보안 그룹은 오직 웹 서버 대역(10.0.1.0/24)의 3306 접속만 허용하세요. 그리고 프라이빗 EC2 서버가 보안 패치를 다운로드할 수 있도록 NAT 게이트웨이로 아웃바운드 길을 열어주세요!",
    conceptHtml: `<ul><li><b>보안 그룹 (Security Group):</b> 인스턴스 단위의 가상 방화벽입니다. 최소 권한 원칙에 따라 필요한 포트와 출발지 IP만 허용해야 합니다.</li><li><b>NAT 게이트웨이:</b> 프라이빗 서브넷의 EC2 서버가 외부로부터의 접속은 차단한 채, 자신이 인터넷으로 보안 업데이트를 받으러 나갈 때(Outbound)만 사용하는 일방통행 게이트웨이입니다.</li></ul>`,
    hintHtml: `1. <b>웹 서버(EC2)</b>의 보안 그룹 허용 포트를 <code>80, 443 포트만 허용</code>으로 설정하세요.<br/>2. <b>프로덕션 DB(RDS)</b>를 클릭해 3306 허용 출발지를 <code>10.0.1.0/24 (웹 서브넷만)</code>으로 설정하세요.<br/>3. <b>프라이빗 앱 서버</b>의 외부 경로를 <code>0.0.0.0/0 → nat-gw</code>로 설정하세요!
    `,
    zones: [{ title: "외부 인터넷", type: "zone-wan", x: 2, y: 12, w: 21, h: 76 },
      { title: "클라우드 VPC (10.0.0.0/16)", type: "zone-vpc", x: 26, y: 6, w: 71, h: 88 },
      { title: "퍼블릭 서브넷 (10.0.1.0/24)", type: "zone-public", x: 48, y: 13, w: 46, h: 36 },
      { title: "프라이빗 서브넷 (10.0.2.0/24)", type: "zone-private", x: 48, y: 53, w: 46, h: 36 }
    ],
    nodes: [{
        id: "user",
        name: "정상 고객 (443)",
        type: "pc",
        icon: "user-round",
        role: "HTTPS 웹 접속",
        x: 12,
        y: 30,
        ip: "198.51.100.10",
        editable: []
      },
      {
        id: "hacker",
        name: "해커 (SSH:22 공격)",
        type: "pc",
        icon: "skull",
        role: "22번 포트 해킹 시도",
        x: 12,
        y: 70,
        ip: "203.0.113.99",
        editable: []
      },
      {
        id: "igw",
        name: "인터넷 게이트웨이",
        type: "router",
        icon: "door-open",
        role: "igw-prod",
        x: 36,
        y: 30,
        ip: "igw-prod",
        editable: []
      },
      {
        id: "webEc2",
        name: "웹 서버 (SG-Web)",
        type: "server",
        icon: "shield",
        role: "퍼블릭 (10.0.1.10)",
        x: 62,
        y: 30,
        ip: "10.0.1.10",
        sgInboundPort: "0-65535",
        editable: ["sgInboundPort"],
        sgPortOptions: [{ value: "ALL", label: "0~65535 전체 열림 (22번 해킹 위험!)"},
          { value: "80_443", label: "80, 443 포트만 허용 (HTTP/HTTPS 전용)"},
          { value: "NONE", label: "모든 포트 차단"}
        ]
      },
      {
        id: "natGw",
        name: "NAT 게이트웨이",
        type: "router",
        icon: "repeat",
        role: "프라이빗 아웃바운드 전용",
        x: 84,
        y: 30,
        ip: "10.0.1.254 (nat-gw)",
        editable: []
      },
      {
        id: "dbRds",
        name: "프로덕션 DB (SG-DB)",
        type: "server",
        icon: "database",
        role: "프라이빗 (10.0.2.50:3306)",
        x: 72,
        y: 72,
        ip: "10.0.2.50",
        sgAllowedSource: "0.0.0.0/0",
        editable: ["sgAllowedSource"],
        sgSourceOptions: [{ value: "0.0.0.0/0", label: "0.0.0.0/0 (아무나 DB 접근 가능)"},
          { value: "10.0.1.0/24", label: "10.0.1.0/24 (웹 서버 서브넷만 허용)"}
        ]
      },
      {
        id: "privateApp", name: "프라이빗 앱 서버 (EC2)", type: "server", icon: "server", role: "프라이빗 서버 업데이트", x: 52, y: 72, ip: "10.0.2.25", routeDefault: "none", editable: ["routeDefault"],
        routeOptions: [{ value: "none", label: "외부 경로 없음 (패치 다운로드 불가)"},
          { value: "nat-gw", label: "0.0.0.0/0 → nat-gw (NAT 게이트웨이 경유)"}
        ]
      }
    ],
    links: [["user", "igw"],
      ["hacker", "igw"],
      ["igw", "webEc2"],
      ["igw", "natGw"],
      ["webEc2", "dbRds"],
      ["privateApp", "natGw"]
    ],
    checklist: [{ id: "c_websg", text: "웹 서버 보안 그룹(SG-Web)에서 80, 443 포트만 허용해 22번 공격 차단"},
      { id: "c_dbsg", text: "DB 보안 그룹(SG-DB)에서 웹 서버 서브넷(10.0.1.0/24)만 허용"},
      { id: "c_natgw", text: "프라이빗 앱 서버의 외부 업데이트 경로를 NAT 게이트웨이(nat-gw)로 설정"}
    ],
    autoSolve: function (st) {
      st.nodes.find((n) =>n.id === "webEc2").sgInboundPort = "80,443";
      const db = st.nodes.find((n) =>n.id === "dbRds");
      db.sgAllowedSource = "10.0.1.0/24";
      st.nodes.find((n) =>n.id === "privateApp").routeDefault = "nat-gw";
    },
    learnedSummary: "클라우드 보안의 핵심인 계층형 보안 그룹(Web SG → DB SG 체이닝)과 프라이빗 서브넷 전용 NAT 게이트웨이 설계를 완벽히 마스터했습니다!"},

  // =========================================================================
  // STAGE 9: Cloud High Availability - Load Balancer (ALB) & Multi-AZ Failover
  // =========================================================================
  {
    id: 9,
    chapter: "CHAPTER 4. 고가용성(HA)과 하이브리드 클라우드",
    shortName: "9. 로드밸런서·멀티AZ",
    title: "서버 한 대가 불타도 멈추지 않는 서비스! ALB와 멀티 가용영역(Multi-AZ)",
    story: "갑자기 이벤트로 접속자가 폭주하고 가용영역 A(AZ-a)의 웹 서버 1대가 과부하로 다운(Unhealthy)되었습니다! 앞단에 애플리케이션 로드밸런서(ALB)를 배치하고 '헬스 체크(Health Check)'를 켜서 살아있는 가용영역 B(AZ-b)의 웹 서버로 트래픽을 자동 우회시키세요!",
    conceptHtml: `<ul><li><b>가용 영역 (Availability Zone, AZ):</b> 클라우드 리전 안에 있는 물리적으로 분리된 데이터센터들입니다. 한 데이터센터에 정전이 나도 다른 AZ가 살아있으면 서비스가 유지됩니다.</li><li><b>로드밸런서 (ALB) & 헬스 체크:</b> 여러 서버로 트래픽을 나누어 주고, 주기적으로 서버 상태를 확인(Health Check)하여 고장 난 서버로는 패킷을 보내지 않습니다!</li></ul>`,
    hintHtml: `1. <b>[랜선 연결]</b>로 <b>로드밸런서(ALB)</b>와 <b>웹 서버 2 (AZ-b 정상)</b>를 연결하세요.<br/>2. <b>로드밸런서(ALB)</b>를 클릭하고 <b>[헬스 체크(장애 서버 자동 제외)]</b> 기능을 켜고(ON), 분산 모드를 <code>Multi-AZ Round Robin</code>으로 설정하세요!
    `,
    zones: [{ title: "외부 인터넷", type: "zone-wan", x: 3, y: 20, w: 18, h: 60 },
      { title: "클라우드 VPC (Multi-AZ 고가용성 아키텍처)", type: "zone-vpc", x: 24, y: 6, w: 73, h: 88 },
      { title: "가용영역 A (ap-northeast-2a)", type: "zone-private", x: 54, y: 14, w: 39, h: 34 },
      { title: "가용영역 B (ap-northeast-2c)", type: "zone-public", x: 54, y: 54, w: 39, h: 34 }
    ],
    nodes: [{
        id: "users",
        name: "대규모 접속 고객들",
        type: "pc",
        icon: "users",
        role: "초당 1만 건 요청",
        x: 12,
        y: 50,
        ip: "Public Traffic",
        editable: []
      },
      {
        id: "alb",
        name: "로드밸런서 (ALB)",
        type: "router",
        icon: "scale",
        role: "L7 트래픽 분산 & 헬스체크",
        x: 38,
        y: 50,
        ip: "alb-prod.aws.com",
        healthCheck: false,
        lbMode: "SINGLE",
        editable: ["healthCheck", "lbMode"]
      },
      {
        id: "webAzA",
        name: "웹 서버 1 (AZ-a 장애!)",
        type: "server",
        icon: "flame",
        role: "상태: 502 Bad Gateway (다운됨)",
        x: 74,
        y: 30,
        ip: "10.0.1.11 (Unhealthy)",
        editable: []
      },
      {
        id: "webAzB",
        name: "웹 서버 2 (AZ-c 정상)",
        type: "server",
        icon: "server",
        role: "상태: 200 OK (정상 가동중)",
        x: 74,
        y: 70,
        ip: "10.0.2.12 (Healthy)",
        editable: []
      }
    ],
    links: [["users", "alb"],
      ["alb", "webAzA"]
    ],
    checklist: [{ id: "c_alb_link", text: "로드밸런서(ALB)와 정상 가동 중인 웹 서버 2(AZ-c)를 랜선으로 연결"},
      { id: "c_hc", text: "로드밸런서(ALB)의 헬스 체크(장애 서버 자동 제외) 스위치 켜기"},
      { id: "c_lbmode", text: "ALB 분산 정책을 'Multi-AZ 활성 분산'으로 설정하기"}
    ],
    autoSolve: function (st) {
      st.links = [["users", "alb"], ["alb", "webAzA"], ["alb", "webAzB"]];
      const alb = st.nodes.find((n) =>n.id === "alb");
      alb.healthCheck = true;
      alb.lbMode = "MULTI_AZ";
    },
    learnedSummary: "클라우드에서 왜 서버를 단일 가용영역에 두면 안 되는지, 그리고 로드밸런서(ALB)의 헬스 체크가 어떻게 무중단 서비스(Failover)를 보장하는지 완벽히 배웠습니다!"},

  // =========================================================================
  // STAGE 10: Global Cloud Edge (CDN + WAF) & Hybrid On-Premise VPN
  // =========================================================================
  {
    id: 10,
    chapter: "CHAPTER 4. 고가용성(HA)과 하이브리드 클라우드",
    shortName: "10. CDN·WAF·하이브리드VPN",
    title: "최종 보스! 글로벌 CDN/WAF 방어망과 본사-클라우드 하이브리드 VPN 개통",
    story: "드디어 마지막 스테이지입니다! 글로벌 고객에게는 CDN(CloudFront)과 웹 방화벽(WAF)을 통해 SQL Injection 해킹을 막고 빠르게 웹을 제공하며, 동시에 서울 본사 사내망(192.168.10.0/24)의 관리자가 인터넷에 노출되지 않는 안전한 암호화 터널(Site-to-Site VPN)로 클라우드 내부 DB에 접속할 수 있도록 하이브리드 아키텍처를 완성하세요!",
    conceptHtml: `<ul><li><b>CDN & WAF (웹 방화벽):</b> 전 세계 엣지 서버에서 정적 콘텐츠를 빠르게 응답(CDN)하고, <code>SQL Injection</code>이나 <code>XSS</code> 같은 L7 웹 해킹 공격을 초입에서 차단(WAF)합니다.</li><li><b>Site-to-Site VPN & 가상 프라이빗 게이트웨이(VGW):</b> 회사 사무실(On-Premise) 네트워크와 클라우드 VPC를 인터넷 구간에서 <b>IPSec 암호화 터널</b>로 묶어 마치 한 사무실의 내부망처럼 안전하게 연결합니다!</li></ul>`,
    hintHtml: `1. <b>[랜선 연결]</b>로 <b>본사 VPN 라우터</b>와 <b>클라우드 가상 게이트웨이(VGW)</b>를 연결해 하이브리드 터널을 만드세요.<br/>2. <b>CDN & WAF 엣지</b>를 클릭해 <b>[WAF SQL Injection 방어]</b> 스위치를 켜세요.<br/>3. <b>클라우드 가상 게이트웨이(VGW)</b>를 클릭해 본사 사내망 대역(<code>192.168.10.0/24</code>) 암호화 라우팅을 허용하세요!
    `,
    zones: [{ title: "외부 인터넷 & 글로벌 엣지", type: "zone-wan", x: 2, y: 8, w: 42, h: 42 },
      { title: "서울 본사 사내망 (On-Premise 192.168.10.0/24)", type: "zone-lan", x: 2, y: 54, w: 42, h: 38 },
      { title: "엔터프라이즈 클라우드 VPC (10.0.0.0/16)", type: "zone-vpc", x: 48, y: 8, w: 49, h: 84 }
    ],
    nodes: [{
        id: "globalUser",
        name: "글로벌 고객 & 해커",
        type: "pc",
        icon: "globe",
        role: "웹 요청 + SQLi 공격",
        x: 13,
        y: 28,
        ip: "Global Edge",
        editable: []
      },
      {
        id: "cdnWaf",
        name: "CDN + WAF 웹방화벽",
        type: "router",
        icon: "shield",
        role: "CloudFront & L7 WAF",
        x: 34,
        y: 28,
        ip: "Edge Security",
        wafEnabled: false,
        editable: ["wafEnabled"]
      },
      {
        id: "hqAdmin",
        name: "본사 DB 관리자 PC",
        type: "pc",
        icon: "user-cog",
        role: "사내망 (192.168.10.5)",
        x: 13,
        y: 74,
        ip: "192.168.10.5",
        editable: []
      },
      {
        id: "hqVpn",
        name: "본사 VPN 라우터",
        type: "router",
        icon: "lock-keyhole",
        role: "Customer Gateway (CGW)",
        x: 34,
        y: 74,
        ip: "IPSec Tunnel",
        editable: []
      },
      {
        id: "cloudAlb",
        name: "클라우드 웹 클러스터",
        type: "server",
        icon: "globe",
        role: "VPC 퍼블릭/웹 계층",
        x: 68,
        y: 28,
        ip: "10.0.1.0/24",
        editable: []
      },
      {
        id: "vgw",
        name: "가상 프라이빗 게이트웨이",
        type: "router",
        icon: "waypoints",
        role: "VPC VPN 출입구 (VGW)",
        x: 60,
        y: 74,
        ip: "vgw-hybrid",
        vpnRouteAllowed: false,
        editable: ["vpnRouteAllowed"]
      },
      {
        id: "coreDb",
        name: "프라이빗 코어 DB",
        type: "server",
        icon: "database-zap",
        role: "VPC 프라이빗 (10.0.2.99)",
        x: 84,
        y: 56,
        ip: "10.0.2.99",
        editable: []
      }
    ],
    links: [["globalUser", "cdnWaf"],
      ["cdnWaf", "cloudAlb"],
      ["cloudAlb", "coreDb"],
      ["hqAdmin", "hqVpn"],
      ["vgw", "coreDb"]
    ],
    checklist: [{ id: "c_waf", text: "CDN + WAF에서 'WAF SQL Injection 방어' 기능을 켜서 웹 해킹 차단"},
      { id: "c_vpn_link", text: "본사 VPN 라우터와 클라우드 가상 게이트웨이(VGW)를 연결해 IPSec 터널 개통"},
      { id: "c_vgw_route", text: "가상 게이트웨이(VGW)에서 본사 사내망(192.168.10.0/24) 경로 전파 허용"}
    ],
    autoSolve: function (st) {
      st.links = [["globalUser", "cdnWaf"],
        ["cdnWaf", "cloudAlb"],
        ["cloudAlb", "coreDb"],
        ["hqAdmin", "hqVpn"],
        ["hqVpn", "vgw"],
        ["vgw", "coreDb"]
      ];
      st.nodes.find((n) =>n.id === "cdnWaf").wafEnabled = true;
      st.nodes.find((n) =>n.id === "vgw").vpnRouteAllowed = true;
    },
    learnedSummary: "축하합니다!! 로컬 1:1 랜선 연결부터 시작해 L2 스위치, DHCP, VLAN, 공유기 NAT, DNS/포트포워딩, 그리고 클라우드 VPC, 보안그룹, ALB 멀티-AZ, 글로벌 WAF와 하이브리드 VPN까지 모든 단계를 정복한 진정한 '클라우드 네트워크 아키텍트'가 되셨습니다! "}
];
