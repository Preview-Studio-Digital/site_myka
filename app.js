/* ==========================================================================
   MYKA COMPRESSORES - SCROLLYTELLING 3D & INTERACTIVITY SCRIPT (MOBILE-FIRST)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Força o carregamento e reprodução imediata do vídeo de fundo para carregar nos 2 segundos de intro
  const bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    bgVideo.load();
    bgVideo.play().catch(err => console.log("Video playback initiated:", err));
  }



  // Inicialização do Canvas para animação de scroll (Scrollytelling com Frames)
  const scrollCanvas = document.getElementById('scroll-canvas');
  const frameCount = 288; // Total de frames extraídos a 24 FPS (288 frames em 12s)
  const images = [];
  let currentFrameIndex = 0;
  let targetFrameIndex = 0;

  if (scrollCanvas) {
    const ctx = scrollCanvas.getContext('2d');
    
    // Pré-carrega as imagens do diretório scroll-frames
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedNumber = String(i).padStart(4, '0');
      img.src = `scroll-frames/frame_${paddedNumber}.jpg`;
      images.push(img);
    }
    
    // Quando a primeira imagem carregar, configura o canvas
    images[0].onload = () => {
      scrollCanvas.width = 1280;
      scrollCanvas.height = 720;
      ctx.drawImage(images[0], 0, 0, scrollCanvas.width, scrollCanvas.height);
    };

    // Loop de renderização suave
    function renderScrollCanvas() {
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.15;
      
      const roundedIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrameIndex)));
      if (images[roundedIndex] && images[roundedIndex].complete) {
        ctx.drawImage(images[roundedIndex], 0, 0, scrollCanvas.width, scrollCanvas.height);
      }
      requestAnimationFrame(renderScrollCanvas);
    }
    requestAnimationFrame(renderScrollCanvas);
  }

  // 1. INICIALIZAÇÃO DE ELEMENTOS DE INTERFACE
  const canvas = document.getElementById('bg-canvas');
  const sections = document.querySelectorAll('.scrolly-section');

  // Restruturar dinamicamente os botões de ação e ícones para mobile/desktop
  sections.forEach(section => {
    const bottomGroup = section.querySelector('.bottom-group');
    if (!bottomGroup) return;

    // Criar o container da linha de cabeçalho do bottom group
    const headerRow = document.createElement('div');
    headerRow.className = 'bottom-header-row';

    // 1. Elemento da esquerda (Ícone/Stat ou placeholder)
    const companyStats = bottomGroup.querySelector('.company-stats');
    if (companyStats) {
      headerRow.appendChild(companyStats);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'stats-placeholder';
      headerRow.appendChild(placeholder);
    }

    // 2. Elemento do meio (Botão de Play / Watch)
    const watchBtn = section.querySelector('.watch-btn');
    if (watchBtn) {
      const sectionKeywords = {
        'inicio': 'ATUAÇÃO',
        'hero': 'ATUAÇÃO',
        'empresa': 'EMPRESA',
        'quem-somos': 'EMPRESA',
        'atividades': 'ATIVIDADES',
        'servicos': 'ATIVIDADES',
        'manutencao': 'MANUTENÇÃO',
        'locacao': 'LOCAÇÃO',
        'venda': 'VENDA',
        'vendas': 'VENDA',
        'contato': 'CONTATO'
      };
      const sectionKey = section.id;
      const word = sectionKeywords[sectionKey] || 'MYKA';
      
      let btnText = watchBtn.querySelector('.watch-btn-text');
      if (!btnText) {
        btnText = document.createElement('span');
        btnText.className = 'watch-btn-text';
        watchBtn.appendChild(btnText);
      }
      // Divide em duas linhas: ASSISTIR na linha 1 e o nome da seção na linha 2
      btnText.innerHTML = `ASSISTIR<br><span class="watch-btn-sub">${word}</span>`;
      
      headerRow.appendChild(watchBtn);
    }

    // 3. Elemento da direita (Botão de WhatsApp local)
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = "https://api.whatsapp.com/send?phone=5515991899160&text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20falar%20com%20um%20atendente!";
    whatsappBtn.target = "_blank";
    whatsappBtn.className = "btn-whatsapp-local";
    whatsappBtn.setAttribute("aria-label", "Fale conosco no WhatsApp");
    whatsappBtn.innerHTML = `
      <svg class="whatsapp-btn-icon" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-11.2-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
      </svg>
      <span class="whatsapp-btn-text">CONVERSAR<br><span class="whatsapp-btn-sub">WHATSAPP</span></span>
    `;
    headerRow.appendChild(whatsappBtn);

    // Inserir imediatamente antes do texto explicativo (section-desc) para manter a mesma posição em todos os slides
    const sectionDesc = bottomGroup.querySelector('.section-desc');
    if (sectionDesc) {
      bottomGroup.insertBefore(headerRow, sectionDesc);
    } else {
      bottomGroup.appendChild(headerRow);
    }
  });

  const scrollProgress = document.getElementById('scroll-progress');
  const stepIndicator = document.getElementById('step-indicator');
  const modal = document.getElementById('video-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const robotSpeechText = document.getElementById('robot-speech-text');
  const watchButtons = document.querySelectorAll('.watch-btn');

  // Lógica do Menu Hambúrguer (Mobile)
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const hudNavigation = document.getElementById('hud-navigation');
  const navLinks = document.querySelectorAll('#hud-navigation a');

  // Cache de elementos do DOM para melhorar a performance de rolagem
  const bgGradientOverlay = document.getElementById('bg-gradient-overlay');
  const empresaSection = document.getElementById('empresa') || document.getElementById('quem-somos');
  const statNumbers = empresaSection ? empresaSection.querySelectorAll('.stat-number') : [];
  const sectionLinks = {};
  sections.forEach(sec => {
    sectionLinks[sec.id] = document.querySelector(`#hud-navigation a[href="#${sec.id}"]`);
  });

  let slideIdHudTimer = null;
  function updateSlideIdentifier(newText, activeSection) {
    const slideIdHud = document.getElementById('slide-identifier-hud');
    if (!slideIdHud) return;

    if (slideIdHudTimer) {
      clearTimeout(slideIdHudTimer);
    }

    // 1. Inicia a animação de saída (fade out e deslocamento para baixo)
    slideIdHud.classList.remove('active');

    // 2. Anexa ao container da linha de ícones (.bottom-header-row) da seção ativa
    slideIdHudTimer = setTimeout(() => {
      if (activeSection) {
        const headerRow = activeSection.querySelector('.bottom-header-row');
        if (headerRow && slideIdHud.parentElement !== headerRow) {
          headerRow.appendChild(slideIdHud);
        }
      }
      slideIdHud.textContent = newText;
      // Força o navegador a processar o reflow no estado inativo (opacity: 0, translateY: 12px) antes da entrada
      void slideIdHud.offsetWidth;
      slideIdHud.classList.add('active');
    }, 200);
  }

  // Separar os títulos das seções em blocos de palavras/linhas para efeito em cascata
  const titleElements = document.querySelectorAll('.garrafal-title');
  titleElements.forEach(title => {
    // Guarda o HTML original como referência para reprocessamento responsivo
    title.setAttribute('data-original-html', title.innerHTML);
  });

  function formatTitles() {
    const isMobile = window.innerWidth < 1024 || (window.innerWidth / window.innerHeight) <= 1.3;
    titleElements.forEach(title => {
      let htmlContent = title.getAttribute('data-original-html');
      if (title.closest('#inicio') || title.closest('#hero')) {
        htmlContent = 'A MYKA NO<br>PULMÃO DA SUA<br>INDÚSTRIA.';
      }
      
      const lines = htmlContent.split(/<br\s*\/?>/i);
      title.innerHTML = ''; // Limpa anterior
      
      let wordIndex = 0;
      lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'title-line';
        
        // Limpa tags HTML internas sobressalentes e divide em palavras
        const cleanLine = line.replace(/<[^>]*>/g, '').trim();
        if (!cleanLine) return;
        const words = cleanLine.split(/\s+/);
        
        // Agrupa "COM" e "A" para evitar quebras de linha entre elas
        const groupedWords = [];
        for (let i = 0; i < words.length; i++) {
          if (words[i].toUpperCase() === 'COM' && words[i+1] && words[i+1].toUpperCase() === 'A') {
            groupedWords.push(words[i] + '\u00A0' + words[i+1]); // Usa espaço não quebrável (nbsp)
            i++;
          } else {
            groupedWords.push(words[i]);
          }
        }
        
        groupedWords.forEach(word => {
          const span = document.createElement('span');
          span.className = 'title-word';
          
          // Destaca a palavra MYKA se encontrada no título
          const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
          if (cleanWord.toUpperCase() === 'MYKA') {
            // Se houver pontuação anexada, isola-a para manter a cor branca original
            const hasPunctuation = word.length > cleanWord.length;
            if (hasPunctuation) {
              const punctuation = word.substring(cleanWord.length);
              
              const brandSpan = document.createElement('span');
              brandSpan.className = 'brand-highlight';
              brandSpan.textContent = cleanWord;
              span.appendChild(brandSpan);
              
              const punctSpan = document.createElement('span');
              punctSpan.className = 'brand-punctuation';
              punctSpan.textContent = punctuation + ' ';
              span.appendChild(punctSpan);
            } else {
              span.classList.add('brand-highlight');
              span.textContent = word + ' ';
            }
          } else {
            if (cleanWord.toUpperCase() === 'PULMÃO' || cleanWord.toUpperCase() === 'PULMAO' || cleanWord.toUpperCase() === 'CORAÇÃO' || cleanWord.toUpperCase() === 'CORACAO' || cleanWord.toUpperCase() === 'PROTEJA') {
              span.classList.add('heart-highlight');
            } else if (cleanWord.toUpperCase() === 'INDÚSTRIA' || cleanWord.toUpperCase() === 'INDUSTRIA') {
              span.classList.add('industry-highlight');
            } else if (cleanWord.toUpperCase() === 'PRODUÇÃO' || cleanWord.toUpperCase() === 'PRODUCAO') {
              span.classList.add('warning-highlight');
            }
            span.textContent = word + ' ';
          }
          span.style.setProperty('--word-index', wordIndex);
          lineDiv.appendChild(span);
          wordIndex++;
        });
        
        title.appendChild(lineDiv);
      });
    });
  }

  // Executa formatação inicial
  formatTitles();

  // Escuta alteração do tamanho de tela e formata dinamicamente sem necessidade de recarregar F12
  const resizeMediaQuery = window.matchMedia('(max-width: 1023px), (max-aspect-ratio: 13/10)');
  try {
    resizeMediaQuery.addEventListener('change', formatTitles);
  } catch (e) {
    // Fallback para navegadores legados
    resizeMediaQuery.addListener(formatTitles);
  }

  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hudNavigation.classList.toggle('open');
    menuToggleBtn.classList.toggle('open');
    document.body.classList.toggle('menu-active', isOpen);
  });

  // Rolagem suave para todos os links internos (ancoragem) e fechamento do menu mobile
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Se o modal de vídeo estiver aberto, fecha o vídeo e para o áudio
        if (modal && !modal.classList.contains('hidden')) {
          stopAudio();
          unlockScroll();
          modal.classList.add('hidden');
        }
        
        // Descobre o índice da seção destino
        const sectionArray = Array.from(sections);
        const targetIndex = sectionArray.indexOf(targetElement);
        if (targetIndex !== -1) {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          // Posição de scroll correspondente ao centro da fatia da seção
          const stepSize = totalHeight / (sectionArray.length - 1);
          const targetTop = targetIndex * stepSize;
          
          let scrollDelay = 0;
          if (menuToggleBtn && hudNavigation && hudNavigation.classList.contains('open')) {
            menuToggleBtn.classList.remove('open');
            hudNavigation.classList.remove('open');
            document.body.classList.remove('menu-active');
            scrollDelay = 150;
          }

          setTimeout(() => {
            window.scrollTo({
              top: targetTop,
              behavior: 'smooth'
            });
          }, scrollDelay);
        }
      }
    });
  });

  // Fechar ao clicar fora do menu
  document.addEventListener('click', (e) => {
    if (hudNavigation.classList.contains('open')) {
      if (!hudNavigation.contains(e.target) && e.target !== menuToggleBtn && !menuToggleBtn.contains(e.target)) {
        menuToggleBtn.classList.remove('open');
        hudNavigation.classList.remove('open');
        document.body.classList.remove('menu-active');
      }
    }
  });

  // Textos explicativos para o Modal do Robô Mascote em cada seção (Aprox. 45 segundos de narração em linguagem natural)
  const videoTransmissions = {
    'hero': {
      title: 'A MYKA NO PULMÃO DA SUA INDÚSTRIA.',
      speech: '"Olá! Eu sou o MIKRON, especialista da MYKA COMPRESSORES. Estou muito feliz em te receber aqui e se está aqui é por que você já percebeu como os compressores são importantes na sua indústria! A boa notícia é que você está em boas mãos! O compressor de ar é o verdadeiro pulmão da sua indústria, dando fôlego a toda a sua produção — e se ele parar, tudo para. Por isso, a minha missão diária é garantir que esse pulmão vital nunca pare de soprar com pressão e constância, trazendo a força estável e segura que a sua indústria precisa para crescer. Vamos juntos manter esse ritmo sempre forte?"'
    },
    'quem-somos': {
      title: 'RESPONSABILIDADE. PROFISSIONALISMO. EXPERIÊNCIA.',
      speech: '"Aqui na Myka Compressores, nós encaramos o seu negócio com total responsabilidade. Sabemos que cada minuto da sua produção é valioso, e é por isso que agimos com o máximo profissionalismo em cada atendimento. Nossa história é construída com mais de 40 anos de experiência no mercado de ar comprimido, entregando confiança e segurança para indústrias de todo o país. Não somos apenas fornecedores, somos parceiros que entendem o ritmo da sua indústria. Vem com a gente!"'
    },
    'servicos': {
      title: 'MANUTENÇÃO. LOCAÇÃO. VENDA.',
      speech: '"A MYKA COMPRESSORES oferece um serviço completo que une manutenção para evitar falhas ou corrigir defeitos nos equipamentos compressores, locação flexível para atender suas emergências ou picos de produção, e venda de equipamentos modernos de alta durabilidade. Seja qual for a sua necessidade atual, temos a solução certa, do tamanho exato da sua empresa. Em qual desses serviços podemos ser úteis?"'
    },
    'manutencao': {
      title: 'PREVENÇÃO. PREDIÇÃO. CORREÇÃO.',
      speech: '"Para que sua indústria nunca pare, nossa equipe atua em três frentes essenciais. Com a manutenção preventiva ajustamos tudo no tempo certo. Com a manutenção preditiva, usamos tecnologia avançada para antecipar problemas antes que eles aconteçam. Na manutenção corretiva agimos imediatamente para reestabelecer o seu ar comprimido. É segurança máxima para proteger o seu investimento e manter a produtividade lá no alto. Como está a saúde dos seus compressores? "'
    },
    'locacao': {
      title: 'DISPONIBILIDADE. FLEXIBILIDADE. AGILIDADE.',
      speech: '"Precisa de ar comprimido agora mesmo, sem burocracia ou altos investimentos? Nossa solução de locação oferece total disponibilidade de equipamentos modernos de prontidão para você. Trabalhamos com a flexibilidade de contratos que se adaptam perfeitamente ao seu ritmo e demanda, seja por dias ou meses. E claro, com a agilidade que a sua produção exige, entregamos e instalamos tudo muito rápido com assistência técnica inclusa. Alugue facilidade e garanta a continuidade do seu trabalho sem preocupações!"'
    },
    'venda': {
      title: 'PROCEDÊNCIA. VARIEDADE. PREÇO.',
      speech: '"Se o seu objetivo é comprar um compressor novo, a Myka é o seu lugar certo! Oferecemos equipamentos com total garantia de procedência, assegurando que você receba um maquinário original e de altíssima qualidade. Contamos com uma grande variedade de modelos para atender desde pequenas oficinas até grandes indústrias. E o melhor de tudo: garantimos um preço justo e condições de pagamento facilitadas para o seu bolso. Invista no futuro da sua produção com quem é referência no mercado!"'
    },
    'contato': {
      title: 'CREDIBILIDADE. CONFIANÇA. PROTEÇÃO.',
      speech: '"Se a sua indústria não pode parar, o seu momento é agora! A credibilidade e a confiança que você procura estão a um clique de distância. Nós da Myka oferecemos a proteção absoluta para a sua linha de produção, com suporte imediato e os melhores especialistas do mercado. Não perca tempo nem arrisque seu faturamento com paradas desnecessárias! Clique agora no botão do WhatsApp, faça uma ligação direta ou mande um e-mail. Nossa equipe está de prontidão para desenhar a solução perfeita para você. Fale conosco agora mesmo e garanta a segurança da sua empresa hoje!"'
    }
  };

  // 2. CONFIGURAÇÃO DO CANVAS 3D (THREE.JS)
  let scene, camera, renderer;
  let compressorGroup, robotGroup, factoryParticles;
  let currentScrollFraction = 0;
  let lastScrollY = window.scrollY;
  let lastStep = -1;

  function init3D() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a11, 0.035);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Otimizado para mobile

    // ILUMINAÇÃO FUTURISTA
    const ambientLight = new THREE.AmbientLight(0x0e1421, 1.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00E5FF, 3, 50);
    cyanPointLight.position.set(5, 5, 5);
    scene.add(cyanPointLight);

    const bluePointLight = new THREE.PointLight(0x0B72FF, 2, 50);
    bluePointLight.position.set(-5, -5, 5);
    scene.add(bluePointLight);

    // CRIAÇÃO DOS MODELOS GEOMÉTRICOS SIMULADOS (COMPRESSOR & ROBÔ)
    buildCompressorModel();
    buildRobotModel();
    buildParticleEnvironment();

    // Redimensionamento de tela
    window.addEventListener('resize', onWindowResize);
  }

  // MODELO 3D: COMPRESSOR INDUSTRIAL
  function buildCompressorModel() {
    compressorGroup = new THREE.Group();

    // Corpos do Compressor (Bloco Principal e Cilindros)
    const bodyGeo = new THREE.BoxGeometry(4, 3, 3);
    const mainMat = new THREE.MeshStandardMaterial({ color: 0x1a2638, metalness: 0.8, roughness: 0.2 });
    const bodyMesh = new THREE.Mesh(bodyGeo, mainMat);
    compressorGroup.add(bodyMesh);

    // Detalhes Neon do Compressor
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, wireframe: true });
    const wireMesh = new THREE.Mesh(bodyGeo, wireMat);
    wireMesh.scale.set(1.02, 1.02, 1.02);
    compressorGroup.add(wireMesh);

    // Peças explodíveis para desconstrução
    compressorGroup.explodedParts = [];
    for (let i = 0; i < 12; i++) {
      const partGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
      const partMat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, metalness: 0.9 });
      const part = new THREE.Mesh(partGeo, partMat);
      part.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
      part.initialPos = part.position.clone();
      part.targetPos = part.position.clone().multiplyScalar(3.5); // Posição de explosão
      compressorGroup.add(part);
      compressorGroup.explodedParts.push(part);
    }

    scene.add(compressorGroup);
  }

  // MODELO 3D: ROBÔ MASCOTE
  function buildRobotModel() {
    robotGroup = new THREE.Group();

    // Cabeça do Robô
    const headGeo = new THREE.BoxGeometry(1.5, 1.2, 1.2);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x07111e, metalness: 0.9, roughness: 0.1 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.5;

    // Olhos Neon Cyan
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.4, 2.6, 0.6);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.4, 2.6, 0.6);

    // Corpo do Robô
    const bodyGeo = new THREE.CylinderGeometry(1.2, 0.8, 2.2, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0B72FF, metalness: 0.7 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;

    robotGroup.add(head, leftEye, rightEye, body);
    robotGroup.position.set(0, -20, 0); // Inicialmente escondido
    scene.add(robotGroup);
  }

  // PARTICULAS DA FÁBRICA / AMBIENTE CINEMATOGRÁFICO
  function buildParticleEnvironment() {
    const pCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 60;
      positions[i + 2] = (Math.random() - 0.5) * 40;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.15, color: 0x00E5FF, transparent: true, opacity: 0.4 });
    factoryParticles = new THREE.Points(pGeo, pMat);
    scene.add(factoryParticles);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 3. ANIMAÇÃO DE SCROLL CONTÍNUA (SCROLLYTELLING)

  function onScroll() {
    const currentScrollY = window.scrollY;
    
    // Detecta a direção do scroll
    if (currentScrollY > lastScrollY) {
      document.body.classList.remove('scroll-up');
      document.body.classList.add('scroll-down');
    } else if (currentScrollY < lastScrollY) {
      document.body.classList.remove('scroll-down');
      document.body.classList.add('scroll-up');
    }
    lastScrollY = currentScrollY;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    currentScrollFraction = totalHeight <= 0 ? 0 : currentScrollY / totalHeight;

    // Lógica de controle de frame por scroll: rodar inteiramente do 1º slide ao último slide
    if (typeof scrollCanvas !== 'undefined' && scrollCanvas) {
      let progress = Math.min(1, Math.max(0, currentScrollFraction));
      targetFrameIndex = progress * (frameCount - 1);
    }

    // Atualiza barra de progresso HUD
    if (scrollProgress) {
      scrollProgress.style.setProperty('--scroll-height', `${Math.min(100, currentScrollFraction * 100)}%`);
    }

    // Identifica seção ativa e calcula visibilidade continua para Fade In/Out do esfumacado baseado no scroll fraction
    const totalSteps = sections.length;
    let currentStep = Math.min(totalSteps - 1, Math.floor(currentScrollFraction * totalSteps));
    
    // Fallback de segurança se der NaN ou valor fora do limite
    if (isNaN(currentStep) || currentStep < 0) {
      currentStep = 0;
    }
    
    let maxSectionVisibility = 1;

    // Controla Fade In e Fade Out contínuo e ultra suave do esfumacado lateral
    if (bgGradientOverlay) {
      bgGradientOverlay.style.opacity = Math.min(1, Math.max(0, maxSectionVisibility * 1.3));
    }

    if (stepIndicator) {
      stepIndicator.textContent = `0${currentStep + 1} / 07`;
    }

    if (currentStep !== lastStep) {
      lastStep = currentStep;
      const sectionNames = ["ATUAÇÃO", "EMPRESA", "ATIVIDADES", "MANUTENÇÃO", "LOCAÇÃO", "VENDA", "CONTATO"];
      updateSlideIdentifier(sectionNames[currentStep] || "MYKA", sections[currentStep]);

      sections.forEach((sec, idx) => {
        const link = sectionLinks[sec.id];
        if (idx === currentStep) {
          sec.classList.add('active');
          if (link) link.classList.add('active');
        } else {
          sec.classList.remove('active');
          if (link) link.classList.remove('active');
        }
      });
    }

    // Animação dos contadores da seção EMPRESA
    animateCompanyStats();

    // ANIMAÇÃO 3D CONTROLADA POR SCROLL (SCENARIOS & CAMERAS)
    animate3DSceneByScroll(currentScrollFraction);
  }

  // LÓGICA DE ANIMAÇÃO DOS NÚMEROS DA SEÇÃO EMPRESA
  // LÓGICA DE ANIMAÇÃO DOS NÚMEROS DAS SEÇÕES (EMPRESA, ATIVIDADES, MANUTENÇÃO, LOCAÇÃO, VENDA)
  const animatedStatsMap = new Set();
  function animateCompanyStats() {
    sections.forEach(sec => {
      const isActive = sec.classList.contains('active');
      const stats = sec.querySelectorAll('.stat-number');
      if (!stats.length) return;

      if (isActive) {
        if (!animatedStatsMap.has(sec.id)) {
          animatedStatsMap.add(sec.id);
          stats.forEach(stat => {
            let target = parseInt(stat.getAttribute('data-target'), 10);
            const startYear = parseInt(stat.getAttribute('data-start-year'), 10);
            const isMonthlyGrowth = stat.hasAttribute('data-monthly-growth');
            const isWeeklyGrowth = stat.hasAttribute('data-weekly-growth');
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();

            if (isWeeklyGrowth && !isNaN(startYear)) {
              const weeklyRate = parseInt(stat.getAttribute('data-weekly-growth'), 10) || 4;
              const startDate = new Date(startYear, 0, 1);
              const diffInDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
              const elapsedWeeks = Math.floor(diffInDays / 7);
              target = elapsedWeeks * weeklyRate;
            } else if (isMonthlyGrowth && !isNaN(startYear)) {
              const monthlyRate = parseInt(stat.getAttribute('data-monthly-growth'), 10) || 1;
              const elapsedMonths = (currentYear - startYear) * 12 + (currentMonth + 1);
              target = elapsedMonths * monthlyRate;
            } else if (!isNaN(startYear)) {
              target = Math.max(1, currentYear - startYear);
            }

            if (isNaN(target)) return;

            const duration = 1600;
            const startTime = performance.now();

            function updateNumber(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeProgress * target);

              stat.textContent = currentVal.toLocaleString('pt-BR');

              if (progress < 1) {
                requestAnimationFrame(updateNumber);
              } else {
                stat.textContent = target.toLocaleString('pt-BR');
              }
            }
            requestAnimationFrame(updateNumber);
          });
        }
      } else {
        if (animatedStatsMap.has(sec.id)) {
          animatedStatsMap.delete(sec.id);
          stats.forEach(stat => {
            stat.textContent = '0';
          });
        }
      }
    });
  }

  function animate3DSceneByScroll(progress) {
    // Cláusula de salvaguarda: se o motor 3D estiver desativado ou indefinido, aborta imediatamente para evitar travamentos
    if (typeof compressorGroup === 'undefined' || !compressorGroup || typeof robotGroup === 'undefined' || !robotGroup) {
      return;
    }

    // ESTÁGIO 1: HERO (0 - 0.14) -> Compressor Montado Rodando
    if (progress < 0.15) {
      const subProg = progress / 0.15;
      compressorGroup.position.set(0, 0, 0);
      compressorGroup.rotation.y = subProg * Math.PI * 2;
      compressorGroup.explodedParts.forEach(p => p.position.lerp(p.initialPos, 0.1));
      robotGroup.position.set(0, -20, 0);
      camera.position.set(0, 0, 12);
    }
    // ESTÁGIO 2: QUEM SOMOS (0.15 - 0.30) -> Explosão / Desconstrução do Compressor
    else if (progress >= 0.15 && progress < 0.30) {
      const subProg = (progress - 0.15) / 0.15;
      compressorGroup.rotation.y = subProg * Math.PI;
      compressorGroup.explodedParts.forEach(p => {
        p.position.lerpVectors(p.initialPos, p.targetPos, subProg);
      });
      robotGroup.position.set(0, -20, 0);
    }
    // ESTÁGIO 3: SERVIÇOS (0.30 - 0.45) -> Peças se reúnem e formam o ROBÔ MASCOTE
    else if (progress >= 0.30 && progress < 0.45) {
      const subProg = (progress - 0.30) / 0.15;
      compressorGroup.position.set(0, 20, 0); // Move compressor para fora
      robotGroup.position.set(0, 0, 0);
      robotGroup.rotation.y = subProg * Math.PI * 2;
      robotGroup.scale.setScalar(subProg);
    }
    // ESTÁGIO 4: MANUTENÇÃO / FÁBRICA AUTOMOBILÍSTICA (0.45 - 0.60)
    else if (progress >= 0.45 && progress < 0.60) {
      const subProg = (progress - 0.45) / 0.15;
      robotGroup.position.set(-2, 0, 2);
      robotGroup.rotation.y = 0.5 + subProg * 0.5;
      camera.position.set(0, subProg * 2, 10 - subProg * 3); // Voo da câmera
    }
    // ESTÁGIO 5: VENDA / SIDERURGIA (0.60 - 0.75)
    else if (progress >= 0.60 && progress < 0.75) {
      const subProg = (progress - 0.60) / 0.15;
      robotGroup.position.set(2, 0, 1);
      robotGroup.rotation.y = -0.8;
      camera.position.set(-subProg * 3, 0, 8);
    }
    // ESTÁGIO 6: LOCAÇÃO / LOGÍSTICA (0.75 - 0.90)
    else if (progress >= 0.75 && progress < 0.90) {
      robotGroup.position.set(0, -1, 3);
      robotGroup.rotation.y = Math.sin(progress * 10) * 0.3;
      camera.position.set(0, 0, 10);
    }
    // ESTÁGIO 7: CONTATO (0.90 - 1.0) -> Central de Comando
    else {
      robotGroup.position.set(0, 0, 0);
      robotGroup.rotation.y = 0;
      camera.position.set(0, 0, 9);
    }
  }

  // LOOP DE RENDERIZAÇÃO
  function render() {
    requestAnimationFrame(render);
    if (factoryParticles) {
      factoryParticles.rotation.y += 0.001;
    }
    renderer.render(scene, camera);
  }

  // 4. LÓGICA DO MODAL DE VÍDEO FUTURISTA COM REPRODUÇÃO DE ÁUDIO E TRAVA DE SCROLL
  let currentAudio = null;
  const playPauseBtn = document.getElementById('play-pause-btn');
  const modalVideo = document.getElementById('modal-video');
  const videoVignette = document.getElementById('video-vignette');
  const robotSimulation = document.getElementById('robot-simulation');

  function stopAudio() {
    const loaderOverlay = document.getElementById('video-loader-overlay');
    if (loaderOverlay) {
      loaderOverlay.classList.remove('active');
      loaderOverlay.classList.add('hidden');
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute('src'); // Libera o decodificador de vídeo no mobile instantaneamente
      modalVideo.load();
    }
    if (videoVignette) {
      videoVignette.classList.add('hidden');
    }
    // Retoma o vídeo de fundo ao fechar o modal
    const bgVideoElement = document.getElementById('bg-video');
    if (bgVideoElement) {
      bgVideoElement.play().catch(err => console.log("Background video play error on resume:", err));
    }
    if (playPauseBtn) {
      playPauseBtn.classList.remove('playing');
      const iconSpan = playPauseBtn.querySelector('.icon');
      if (iconSpan) iconSpan.textContent = '▶';
    }
    const waves = document.querySelectorAll('.audio-wave');
    waves.forEach(w => w.classList.add('paused'));
  }

  function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.classList.remove('modal-active');
    document.body.classList.remove('video-playing');
  }

  watchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      let videoKey = btn.getAttribute('data-video');
      
      // Normaliza as chaves do HTML para as chaves correspondentes aos vídeos/transmissões
      if (videoKey === 'inicio') videoKey = 'hero';
      if (videoKey === 'empresa') videoKey = 'quem-somos';
      if (videoKey === 'atividades') videoKey = 'servicos';

      const info = videoTransmissions[videoKey] || videoTransmissions['hero'];
      
      stopAudio();

      // Oculta imediatamente os elementos do modal para não piscarem durante o carregamento
      if (robotSimulation) robotSimulation.style.display = 'none';
      if (modalVideo) modalVideo.classList.add('hidden');

      if (modalTitle) modalTitle.textContent = info.title;
      robotSpeechText.textContent = info.speech;

      // Trava scroll da página ao abrir modal
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('modal-active');

      // Pausa o vídeo de fundo para economizar recursos (CPU/GPU) e evitar lentidão
      const bgVideoElement = document.getElementById('bg-video');
      if (bgVideoElement) {
        bgVideoElement.pause();
      }

      const waves = document.querySelectorAll('.audio-wave');

      // TELA DE CARREGAMENTO COM PALAVRA DO TITULO DO SLIDE
      const loaderOverlay = document.getElementById('video-loader-overlay');
      const loaderWordText = document.getElementById('loader-word-text');
      
      const titleKeywords = {
        'inicio': 'ATUAÇÃO',
        'hero': 'ATUAÇÃO',
        'empresa': 'EMPRESA',
        'quem-somos': 'EMPRESA',
        'atividades': 'ATIVIDADES',
        'servicos': 'ATIVIDADES',
        'manutencao': 'MANUTENÇÃO',
        'locacao': 'LOCAÇÃO',
        'venda': 'VENDA',
        'vendas': 'VENDA',
        'contato': 'CONTATO'
      };

      if (loaderOverlay && loaderWordText) {
        // Reset loader classes and text
        loaderOverlay.classList.remove('hidden', 'active');
        loaderWordText.className = 'loader-word';
        loaderWordText.textContent = titleKeywords[videoKey] || 'MYKA';
        
        // Show modal and loader overlay
        modal.classList.remove('hidden');
        modal.classList.add('loading'); // Adiciona fundo sólido durante o carregamento
        loaderOverlay.classList.remove('hidden');
        
        // Trigger reflow
        loaderOverlay.offsetHeight;
        loaderOverlay.classList.add('active');
        
        // Animação fade in da palavra
        setTimeout(() => {
          loaderWordText.classList.add('fade-in');
        }, 50);

        let videoLoaded = false;
        let animationDone = false;

        const onVideoReady = () => {
          videoLoaded = true;
          checkAndStart();
        };

        // Inicia carregamento do vídeo em paralelo
        if (videoKey === 'hero' || videoKey === 'quem-somos' || videoKey === 'servicos' || videoKey === 'manutencao' || videoKey === 'locacao' || videoKey === 'venda' || videoKey === 'contato') {
          if (modalVideo) {
            modalVideo.classList.add('hidden');
            let videoSrc = 'video-slide1.webm';
            if (videoKey === 'quem-somos') {
              videoSrc = 'video-slide2.webm';
            } else if (videoKey === 'servicos') {
              videoSrc = 'video-slide3.webm';
            } else if (videoKey === 'manutencao') {
              videoSrc = 'video-slide4.webm';
            } else if (videoKey === 'locacao') {
              videoSrc = 'video-slide5.webm';
            } else if (videoKey === 'venda') {
              videoSrc = 'video-slide6.webm';
            } else if (videoKey === 'contato') {
              videoSrc = 'video-slide7.webm';
            }
            modalVideo.src = videoSrc + '?t=' + Date.now();
            modalVideo.load();
            
            // Eventos de carregamento do vídeo
            modalVideo.addEventListener('canplaythrough', onVideoReady, { once: true });
            modalVideo.addEventListener('loadeddata', onVideoReady, { once: true });
            
            // Backup timeout para o carregamento do vídeo (evita travamento em conexões ruins)
            setTimeout(() => {
              if (!videoLoaded) {
                console.log("Video loading timeout, proceeding anyway");
                onVideoReady();
              }
            }, 3000);
          } else {
            videoLoaded = true;
          }
        } else {
          // A simulação do robô não possui arquivo de vídeo real para carregar
          videoLoaded = true;
        }

        // A palavra permanece visível até o loader inteiro sumir (fade junto com a tela)

        // Tempo mínimo de exibição do loader (1.5 segundos)
        setTimeout(() => {
          animationDone = true;
          checkAndStart();
        }, 1500);

        function checkAndStart() {
          if (videoLoaded && animationDone) {
            // Vídeo já carregou suficientemente — começa a tocar agora (ainda oculto atrás do loader)
            if (videoKey === 'hero' || videoKey === 'quem-somos' || videoKey === 'servicos' || videoKey === 'manutencao' || videoKey === 'locacao' || videoKey === 'venda' || videoKey === 'contato') {
              if (robotSimulation) robotSimulation.style.display = 'none';
              if (modalVideo) {
                modalVideo.classList.remove('hidden');
                modalVideo.play().catch(err => console.log("Video playback initiated with error:", err));
              }
              if (videoVignette) videoVignette.classList.remove('hidden');
              if (modalCloseBtn) modalCloseBtn.classList.remove('hidden');
              if (playPauseBtn) playPauseBtn.style.display = 'none';
              waves.forEach(w => w.style.display = 'none');
            } else {
              if (modalVideo) { modalVideo.classList.add('hidden'); modalVideo.src = ''; }
              if (videoVignette) videoVignette.classList.add('hidden');
              if (modalCloseBtn) modalCloseBtn.classList.add('hidden');
              if (robotSimulation) robotSimulation.style.display = 'flex';
              if (playPauseBtn) playPauseBtn.style.display = 'none';
              waves.forEach(w => w.style.display = 'none');
            }

            modal.classList.remove('loading');
            document.body.classList.add('video-playing');

            // Assim que o vídeo estiver pronto, fade-out da tela e da palavra juntos em 1s
            loaderOverlay.classList.remove('active');
            setTimeout(() => {
              loaderOverlay.classList.add('hidden');
            }, 1000);
          }
        }
      } else {
        // Fallback caso os elementos do loader não existam
        modal.classList.remove('hidden');
        modal.classList.remove('loading');
        if (videoKey === 'hero' || videoKey === 'quem-somos' || videoKey === 'servicos' || videoKey === 'manutencao' || videoKey === 'locacao' || videoKey === 'venda' || videoKey === 'contato') {
          if (robotSimulation) robotSimulation.style.display = 'none';
          if (modalVideo) {
            modalVideo.classList.remove('hidden');
            let videoSrc = 'video-slide1.webm';
            if (videoKey === 'quem-somos') {
              videoSrc = 'video-slide2.webm';
            } else if (videoKey === 'servicos') {
              videoSrc = 'video-slide3.webm';
            } else if (videoKey === 'manutencao') {
              videoSrc = 'video-slide4.webm';
            } else if (videoKey === 'locacao') {
              videoSrc = 'video-slide5.webm';
            } else if (videoKey === 'venda') {
              videoSrc = 'video-slide6.webm';
            } else if (videoKey === 'contato') {
              videoSrc = 'video-slide7.webm';
            }
            modalVideo.src = videoSrc + '?t=' + Date.now();
            modalVideo.play().catch(err => console.log("Video playback initiated with error:", err));
          }
          if (videoVignette) {
            videoVignette.classList.remove('hidden');
          }
          if (modalCloseBtn) {
            modalCloseBtn.classList.remove('hidden');
          }
          if (playPauseBtn) playPauseBtn.style.display = 'none';
          waves.forEach(w => w.style.display = 'none');
        } else {
          if (modalVideo) {
            modalVideo.classList.add('hidden');
            modalVideo.src = '';
          }
          if (videoVignette) {
            videoVignette.classList.add('hidden');
          }
          if (modalCloseBtn) {
            modalCloseBtn.classList.add('hidden');
          }
          if (robotSimulation) robotSimulation.style.display = 'flex';
          if (playPauseBtn) playPauseBtn.style.display = 'none';
          waves.forEach(w => w.style.display = 'none');
        }
      }
    });
  });

  // Controle de Play/Pause de áudio (Símbolo apenas)
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (currentAudio) {
        const iconSpan = playPauseBtn.querySelector('.icon');
        const waves = document.querySelectorAll('.audio-wave');

        if (currentAudio.paused) {
          currentAudio.play();
          playPauseBtn.classList.add('playing');
          if (iconSpan) iconSpan.textContent = '⏸';
          waves.forEach(w => w.classList.remove('paused'));
        } else {
          currentAudio.pause();
          playPauseBtn.classList.remove('playing');
          if (iconSpan) iconSpan.textContent = '▶';
          waves.forEach(w => w.classList.add('paused'));
        }
      }
    });
  }

  if (modalVideo) {
    modalVideo.addEventListener('click', () => {
      if (modalVideo.paused) {
        modalVideo.play().catch(err => console.log("Video play error on click:", err));
      } else {
        modalVideo.pause();
      }
    });

    modalVideo.addEventListener('ended', () => {
      stopAudio();
      unlockScroll();
      modal.classList.add('hidden');
    });

    document.addEventListener('keydown', (e) => {
      // Verifica se o modal e o vídeo estão visíveis e a tecla pressionada é espaço
      if (e.code === 'Space' && !modal.classList.contains('hidden') && !modalVideo.classList.contains('hidden')) {
        e.preventDefault(); // Impede rolagem da página com barra de espaço
        if (modalVideo.paused) {
          modalVideo.play().catch(err => console.log("Spacebar play error:", err));
        } else {
          modalVideo.pause();
        }
      }
    });
  }

  const modalCloseBtnAction = document.getElementById('modal-close-btn-action');
  if (modalCloseBtnAction) {
    modalCloseBtnAction.addEventListener('click', () => {
      stopAudio();
      unlockScroll();
      modal.classList.add('hidden');
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      stopAudio();
      unlockScroll();
      modal.classList.add('hidden');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      stopAudio();
      unlockScroll();
      modal.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      stopAudio();
      unlockScroll();
      modal.classList.add('hidden');
    }
  });

  // LÓGICA DE EXIBIÇÃO DE INFORMAÇÕES DOS ÍCONES DE CONTATO (VERTICAL)
  const allIconBtns = document.querySelectorAll('.contact-icon-btn.tooltip-trigger');

  function closeAllBanners() {
    allIconBtns.forEach(icon => {
      icon.classList.remove('active-banner-icon');
      const banner = icon.nextElementSibling;
      if (banner && banner.classList.contains('inline-info-banner')) {
        banner.classList.remove('active');
      }
    });
  }

  allIconBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const infoText = btn.getAttribute('data-info');
      const titleText = btn.getAttribute('data-title');
      const banner = btn.nextElementSibling;
      
      // Se clicar no botão que já está ativo, fecha.
      if (btn.classList.contains('active-banner-icon')) {
        closeAllBanners();
        return;
      }
      
      // Fecha todos antes de abrir o novo
      closeAllBanners();
      
      if (banner && banner.classList.contains('inline-info-banner')) {
        const textSpan = banner.querySelector('.inline-info-text');
        if (textSpan) {
          textSpan.innerHTML = infoText;
        }
        
        btn.classList.add('active-banner-icon');
        // Usa requestAnimationFrame para garantir a transição fluida
        requestAnimationFrame(() => {
          banner.classList.add('active');
        });
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.contact-item-row')) {
      closeAllBanners();
    }
  });



  // LÓGICA DE SCROLL SNAP PERSONALIZADA
  let snapTimer = null;
  let isSnapping = false;

  function stopSnap() {
    isSnapping = false;
    if (snapTimer) {
      clearTimeout(snapTimer);
      snapTimer = null;
    }
  }

  // Cancela o snap se o usuário interagir ativamente durante o processo
  window.addEventListener('wheel', stopSnap, { passive: true });
  window.addEventListener('touchstart', stopSnap, { passive: true });
  window.addEventListener('touchmove', stopSnap, { passive: true });
  window.addEventListener('keydown', stopSnap, { passive: true });

  window.addEventListener('scroll', () => {
    // Se o modal de vídeo estiver aberto, não faz snap
    if (modal && !modal.classList.contains('hidden')) return;
    if (isSnapping) return;

    if (snapTimer) {
      clearTimeout(snapTimer);
    }

    snapTimer = setTimeout(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const stepSize = totalHeight / (sections.length - 1);
      const currentScroll = window.scrollY;
      const targetIndex = Math.round(currentScroll / stepSize);
      const targetTop = targetIndex * stepSize;

      // Só executa o snap se o usuário não estiver já posicionado no slide exato
      if (Math.abs(currentScroll - targetTop) > 5) {
        isSnapping = true;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // Libera a trava do snap após a animação de scroll terminar (média de 600ms)
        setTimeout(() => {
          isSnapping = false;
        }, 600);
      }
    }, 250); // 250ms após parar de rolar
  }, { passive: true });

  // INICIALIZAÇÃO
  // init3D(); // Desativado temporariamente para remover o fundo 3D
  // render();
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Executa para o estado inicial
});
