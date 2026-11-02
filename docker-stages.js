// 교육용 모델: 실제 Docker 명령이나 네트워크를 변경하지 않습니다.
(function () {
  const stages = window.NETQUEST_STAGES;
  const definitions = [
    [11, '브리지와 서비스 발견', 'app과 db를 사용자 정의 브리지에 참여시키고, 서비스 이름과 컨테이너 포트로 DB에 연결하세요.', '<b>브리지(bridge)</b>는 한 Docker 호스트 안에서 컨테이너를 연결하는 가상 네트워크입니다. backend는 드라이버 이름이 아니라 네트워크 이름입니다. host 모드는 호스트 네트워크를 공유하며 사용자 정의 backend 브리지를 만들지 않습니다. 사용자 정의 브리지에서는 서비스 이름을 DNS로 찾을 수 있습니다. app의 localhost는 app 자신이며, 컨테이너끼리는 호스트 공개 포트가 아니라 DB 컨테이너 포트를 사용합니다.'],
    [12, '호스트 포트와 수신 주소', '웹 앱의 브리지 연결과 수신 주소, 호스트 포트와 컨테이너 포트를 맞춰 접속을 복구하세요.', '<b>포트 공개</b>는 호스트의 포트를 컨테이너 포트로 전달합니다. 호스트 포트와 컨테이너 포트는 다를 수 있습니다. TCP/UDP도 맞아야 하고 앱이 컨테이너 외부 인터페이스에서 수신해야 합니다. 이 단계는 방문자가 호스트에 도달할 수 있다고 가정합니다.'],
    [13, '공유기와 Docker 이중 전달', '외부 포트, 공유기 내부 목적지, Docker 포트 공개를 각각 맞춰 외부에서 앱까지 연결하세요.', '공유기 포트 포워딩과 Docker 포트 공개는 서로 다른 규칙입니다. 외부 포트 → 호스트 IP:호스트 포트 → 컨테이너 포트를 차례로 추적합니다. 공인 IPv4 도달성과 방화벽 허용은 이 시나리오의 전제입니다.'],
    [14, '웹 공개와 DB 격리', '웹 앱은 외부에 공개하고, DB는 내부 브리지를 통해 앱에서만 접근하도록 구성하세요.', 'app은 frontend와 backend라는 두 사용자 정의 브리지에 참여합니다. DB는 backend에만 참여하며 호스트 포트를 공개하지 않습니다. backend의 internal 설정은 외부 연결을 제한하지만, 다른 네트워크에도 참여한 app은 그 경로로 나갈 수 있습니다. 이 모델은 호스트에서 DB로 별도 직접 라우팅하지 않는다고 가정합니다. 네트워크 격리는 인증과 권한을 대신하지 않습니다.']
  ];
  const newStages = definitions.map(([id, name, story, concept]) => ({
    id, kind: 'docker', chapter: 'CHAPTER 3. 컨테이너 네트워크', shortName: name,
    title: name, story, conceptHtml: `<p>${concept}</p><p>이 미션은 실제 Docker를 변경하지 않는 교육용 시뮬레이션입니다.</p>`,
    hintHtml: '', learnedSummary: concept,
    zones: [{ title: '외부 네트워크', type: 'zone-wan', x: 2, y: 13, w: 20, h: 74 }, { title: '호스트와 Docker 네트워크', type: 'zone-vpc', x: 25, y: 8, w: 72, h: 84 }],
    nodes: [
      {id:'visitor', name:'외부 사용자', type:'pc', icon:'user', x:12,y:50,ip:'인터넷',editable:[]},
      {id:'router', name:'공유기', type:'router', icon:'router', x:35,y:50,ip:'공유기',editable:[]},
      {id:'app', name:'app 컨테이너', type:'server', icon:'box', x:61,y:35,ip:'app',editable:[]},
      {id:'db', name:'db 컨테이너', type:'server', icon:'database', x:82,y:68,ip:'db',editable:[]}
    ],
    links:[['visitor','router'],['router','app'],['app','db']], checklist:[], autoSolve() {}
  }));
  for (const stage of newStages) {
    stage.conceptHtml += (stage.id === 11 || stage.id === 14)
      ? '<p>컨테이너와 backend 사이의 선은 각 컨테이너의 브리지 참여 상태만 표시합니다. 두 선이 모두 실선이어도 DB 이름과 포트가 맞아야 접속이 성공합니다.</p>'
      : '<p>점선은 포트 전달 설정이 필요한 상태이고, 실선은 이 미션의 전달 설정이 준비된 상태입니다. Docker에는 랜선을 연결하지 않습니다.</p>';

    if (stage.id === 14) stage.conceptHtml += '<p>외부 사용자와 app 사이의 선은 웹 포트 전달 설정 상태를 표시합니다.</p>';
    if (stage.id === 11 || stage.id === 14) {
      stage.nodes = stage.nodes.filter(n => n.id === 'app' || n.id === 'db' || (stage.id === 14 && n.id === 'visitor'));
      Object.assign(stage.nodes.find(n => n.id === 'app'), {x: stage.id === 14 ? 48 : 30, y: 61});
      Object.assign(stage.nodes.find(n => n.id === 'db'), {x: stage.id === 14 ? 82 : 70, y: 61});
      stage.nodes.push({id:'backendNet', name:'backend 네트워크', type:'switch', icon:'network', role:'Docker 브리지 설정 및 경로 연결 지점', x: stage.id === 14 ? 68 : 50, y:25, ip:'네트워크 설정', editable:[]});
      stage.zones = stage.id === 11 ? [{title:'Docker 호스트 · 사용자 정의 네트워크', type:'zone-vpc', x:5, y:12, w:90, h:76}] : stage.zones;
      stage.requiredLinks = stage.id === 14 ? [['visitor','app'],['app','backendNet'],['db','backendNet']] : [['app','backendNet'],['db','backendNet']];
    } else if (stage.id === 12) {
      stage.nodes = stage.nodes.filter(n => n.id === 'visitor' || n.id === 'app');
      Object.assign(stage.nodes.find(n => n.id === 'app'), {x: 72, y: 50});
      stage.requiredLinks = [['visitor','app']];
    } else {
      stage.nodes = stage.nodes.filter(n => n.id !== 'db');
      Object.assign(stage.nodes.find(n => n.id === 'app'), {x: 72, y: 50});
      stage.requiredLinks = [['visitor','router'],['router','app']];
    }
  }
  for (const stage of newStages) {
    stage.links = [];
    stage.story += ' 연결 도구로 필요한 경로를 직접 연결하고 장비 설정을 완성하세요.';
    stage.conceptHtml += '<p>Docker 단계에서 직접 그리는 선은 통신 경로를 나타내는 학습용 표시입니다. 실제 Docker에서 물리 랜선을 연결하는 과정은 아닙니다.</p>';
  }
  stages.splice(6, 0, ...newStages);
  window.NETQUEST_GLOSSARY.push({term:'Docker 브리지와 포트 공개',desc:'같은 사용자 정의 네트워크의 컨테이너는 서비스 이름과 컨테이너 포트로 통신합니다. 호스트 포트 공개는 호스트에 도착한 요청을 컨테이너 포트로 전달합니다.'});
  window.NETQUEST_QUIZZES.push({q:'Docker Compose에서 같은 네트워크의 app이 db에 연결할 때 사용하는 주소는?',options:['localhost와 호스트 포트','db와 컨테이너 포트','공유기의 공인 IP','외부 DNS 서버'],answer:1});
})();
