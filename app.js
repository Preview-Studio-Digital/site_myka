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

  // Insere um div de desfoque de fundo (blur) em cada seção de forma dinâmica para legibilidade do texto
  const textSections = document.querySelectorAll('.scrolly-section');
  textSections.forEach(sec => {
    const blurBg = document.createElement('div');
    blurBg.className = 'text-blur-bg';
    sec.insertBefore(blurBg, sec.firstChild);
  });

  // Inicialização do Canvas para animação de scroll (Scrollytelling com Frames)
  const scrollCanvas = document.getElementById('scroll-canvas');
  const frameCount = 120; // Total de frames extraídos (limitado a 120)
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

    // Loop de renderização suave (só redesenha quando o frame muda)
    let lastDrawnFrame = -1;
    function renderScrollCanvas() {
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.15;
      
      const roundedIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrameIndex)));
      if (roundedIndex !== lastDrawnFrame && images[roundedIndex] && images[roundedIndex].complete) {
        ctx.drawImage(images[roundedIndex], 0, 0, scrollCanvas.width, scrollCanvas.height);
        lastDrawnFrame = roundedIndex;
      }
      requestAnimationFrame(renderScrollCanvas);
    }
    requestAnimationFrame(renderScrollCanvas);
  }

  // Lógica da Tela de Introdução (Intro/Splash Screen)
  const introScreen = document.getElementById('intro-screen');
  const introCounter = document.getElementById('intro-counter');
  if (introScreen) {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Contador progressivo rápido de 1 a 7 (concluído em 1.2 segundos)
    if (introCounter) {
      let count = 1;
      introCounter.classList.add('pulse-number');
      
      const interval = setInterval(() => {
        count++;
        if (count <= 7) {
          introCounter.textContent = count;
          introCounter.classList.remove('pulse-number');
          void introCounter.offsetWidth; // Força reflow para reiniciar animação
          introCounter.classList.add('pulse-number');
        } else {
          clearInterval(interval);
        }
      }, 200); // Incrementa a cada 200ms
    }
    
    setTimeout(() => {
      introScreen.classList.add('fade-out');
      // Desbloqueia scroll e remove interação imediatamente (sem esperar a transição CSS de 0.8s)
      introScreen.style.pointerEvents = 'none';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      // Remove o overlay do DOM após a transição visual completar
      setTimeout(() => {
        introScreen.remove();
      }, 1000);
    }, 3000);
  }

  // 1. INICIALIZAÇÃO DE ELEMENTOS DE INTERFACE
  const canvas = document.getElementById('bg-canvas');
  const sections = document.querySelectorAll('.scrolly-section');
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

  // Separar os títulos das seções em blocos de palavras/linhas para efeito em cascata
  const titleElements = document.querySelectorAll('.garrafal-title');
  titleElements.forEach(title => {
    // Guarda o HTML original como referência para reprocessamento responsivo
    title.setAttribute('data-original-html', title.innerHTML);
  });

  function formatTitles() {
    const isMobile = window.innerWidth < 768;
    titleElements.forEach(title => {
      let htmlContent = title.getAttribute('data-original-html');
      if (title.closest('#inicio') || title.closest('#hero')) {
        if (isMobile) {
          htmlContent = 'A MYKA NO<br>PULMÃO DA SUA<br>INDÚSTRIA.';
        } else {
          htmlContent = 'A MYKA NO PULMÃO<br>DA SUA INDÚSTRIA.';
        }
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
  const resizeMediaQuery = window.matchMedia('(max-width: 767px)');
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
        
        let scrollDelay = 0;
        
        // Fecha o menu mobile se estiver aberto e define o delay
        if (menuToggleBtn && hudNavigation && hudNavigation.classList.contains('open')) {
          menuToggleBtn.classList.remove('open');
          hudNavigation.classList.remove('open');
          document.body.classList.remove('menu-active');
          scrollDelay = 150; // Somente aguarda o delay se o menu de fato estiver aberto
        }

        setTimeout(() => {
          const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }, scrollDelay);
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

  let lastDirection = null;
  let lastActiveStep = -1;

  function onScroll() {
    const currentScrollY = window.scrollY;
    
    // Detecta a direção do scroll (só muda classList quando a direção de fato inverte)
    const newDirection = currentScrollY > lastScrollY ? 'down' : (currentScrollY < lastScrollY ? 'up' : lastDirection);
    if (newDirection && newDirection !== lastDirection) {
      if (newDirection === 'down') {
        document.body.classList.remove('scroll-up');
        document.body.classList.add('scroll-down');
      } else {
        document.body.classList.remove('scroll-down');
        document.body.classList.add('scroll-up');
      }
      lastDirection = newDirection;
    }
    lastScrollY = currentScrollY;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    currentScrollFraction = totalHeight <= 0 ? 0 : currentScrollY / totalHeight;

    // Lógica de controle de frame por scroll
    if (typeof scrollCanvas !== 'undefined' && scrollCanvas) {
      let progress = 0;
      if (currentScrollFraction <= 0.5) {
        progress = currentScrollFraction / 0.5;
      } else {
        progress = 1 - ((currentScrollFraction - 0.5) / 0.5);
      }
      progress = Math.min(1, Math.max(0, progress));
      targetFrameIndex = progress * (frameCount - 1);
    }

    // Atualiza barra de progresso HUD
    if (scrollProgress) {
      scrollProgress.style.setProperty('--scroll-height', `${Math.min(100, currentScrollFraction * 100)}%`);
    }

    // Identifica seção ativa e calcula visibilidade
    let currentStep = 0;
    let maxSectionVisibility = 0;
    const windowH = window.innerHeight;

    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= windowH * 0.7 && rect.bottom >= windowH * 0.1) {
        currentStep = idx;
      }
      const visibleHeight = Math.max(0, Math.min(rect.bottom, windowH) - Math.max(rect.top, 0));
      const visibility = visibleHeight / windowH;
      if (visibility > maxSectionVisibility) {
        maxSectionVisibility = visibility;
      }
    });

    // Controla Fade In e Fade Out do esfumacado lateral
    if (bgGradientOverlay) {
      bgGradientOverlay.style.opacity = Math.min(1, Math.max(0, maxSectionVisibility * 1.3));
    }

    // Só atualiza DOM das seções quando a seção ativa realmente muda
    if (currentStep !== lastActiveStep) {
      if (stepIndicator) {
        stepIndicator.textContent = `0${currentStep + 1} / 07`;
      }

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

      lastActiveStep = currentStep;
    }

    // Animação dos contadores da seção EMPRESA
    animateCompanyStats();

    // ANIMAÇÃO 3D CONTROLADA POR SCROLL (SCENARIOS & CAMERAS)
    animate3DSceneByScroll(currentScrollFraction);
  }

  // LÓGICA DE ANIMAÇÃO DOS NÚMEROS DA SEÇÃO EMPRESA
  let statsAnimated = false;
  function animateCompanyStats() {
    if (!empresaSection) return;

    const isActive = empresaSection.classList.contains('active');

    if (isActive && !statsAnimated) {
      statsAnimated = true;

      statNumbers.forEach(stat => {
        let target = parseInt(stat.getAttribute('data-target'), 10);
        const startYear = parseInt(stat.getAttribute('data-start-year'), 10);
        const isMonthlyGrowth = stat.hasAttribute('data-monthly-growth');

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0 = Jan, 6 = Jul, etc.

        const isWeeklyGrowth = stat.hasAttribute('data-weekly-growth');

        if (isWeeklyGrowth && !isNaN(startYear)) {
          // 4 novos contratos a cada semana decorrida desde o ano inicial (startYear)
          const weeklyRate = parseInt(stat.getAttribute('data-weekly-growth'), 10) || 4;
          const startDate = new Date(startYear, 0, 1);
          const diffInDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
          const elapsedWeeks = Math.floor(diffInDays / 7);
          target = elapsedWeeks * weeklyRate;
        } else if (isMonthlyGrowth && !isNaN(startYear)) {
          // Calcula com base no ritmo mensal customizado (ex: 2 clientes/mês)
          const monthlyRate = parseInt(stat.getAttribute('data-monthly-growth'), 10) || 1;
          const elapsedMonths = (currentYear - startYear) * 12 + (currentMonth + 1);
          target = elapsedMonths * monthlyRate;
        } else if (!isNaN(startYear)) {
          // Anos de experiência (incrementa a cada virada de ano)
          target = Math.max(1, currentYear - startYear);
        }

        if (isNaN(target)) return;

        const duration = 1600; // Duração de 1.6 segundos
        const startTime = performance.now();

        function updateNumber(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Easing cubic out para desaceleraçã̃o suave no final
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
    } else if (!isActive && statsAnimated) {
      // Reseta os números ao sair da seção para poder reanimar quando retornar
      statsAnimated = false;
      statNumbers.forEach(stat => {
        stat.textContent = '0';
      });
    }
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

        // Animação fade out da palavra (começa em 1.5s, leva 0.8s)
        setTimeout(() => {
          loaderWordText.classList.remove('fade-in');
          loaderWordText.classList.add('fade-out');
        }, 1500);

        // Tempo mínimo de exibição do loader (2.3 segundos)
        setTimeout(() => {
          animationDone = true;
          checkAndStart();
        }, 2300);

        function checkAndStart() {
          if (videoLoaded && animationDone) {
            // Inicia a execução correspondente primeiro, tornando-a visível por baixo do overlay
            if (videoKey === 'hero' || videoKey === 'quem-somos' || videoKey === 'servicos' || videoKey === 'manutencao' || videoKey === 'locacao' || videoKey === 'venda' || videoKey === 'contato') {
              if (robotSimulation) robotSimulation.style.display = 'none';
              if (modalVideo) {
                modalVideo.classList.remove('hidden');
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

            // Agora removemos a classe 'active' para fazer o fade out do overlay diretamente por cima do conteúdo ativo
            loaderOverlay.classList.remove('active');
            setTimeout(() => {
              loaderOverlay.classList.add('hidden');
            }, 500);
          }
        }
      } else {
        // Fallback caso os elementos do loader não existam
        modal.classList.remove('hidden');
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
          textSpan.innerHTML = `<strong style="color: var(--accent-cyan); font-weight: 600;">${titleText}:</strong> ${infoText}`;
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



  // INICIALIZAÇÃO
  // init3D(); // Desativado temporariamente para remover o fundo 3D
  // render();
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Executa para o estado inicial
});
