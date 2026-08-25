const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const originalImages=[
"https://avatars.mds.yandex.net/get-altay/14185024/2a000001941925734eb98261248330c551d2/XXXL",
"https://avatars.mds.yandex.net/get-altay/19876101/2a0000019b6140feb2f1da048375cad4f29b/XXXL",
"https://avatars.mds.yandex.net/get-altay/15285359/2a00000193fd7f74f0211baaa065ed0f89fa/XXXL",
"https://avatars.mds.yandex.net/get-altay/6550540/2a00000190033b7467aa842830aa42f1ffc9/XXXL"
];

function escapeHtml(v){
  return String(v??'').replace(
    /[&<>"']/g,
    m=>({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#039;'
    }[m])
  )
}

function renderCategories(){

  const nav=$('#categoryNav');

  nav.innerHTML=
    '<button class="cat-btn active" data-cat="ALL">ВСЁ</button>'+
    menuData.map((c,i)=>
      `<button class="cat-btn" data-cat="${i}">
        ${escapeHtml(c.title.trim())}
      </button>`
    ).join('');

  $$('.cat-btn').forEach(b=>{

    b.onclick=()=>{

      $$('.cat-btn').forEach(x=>
        x.classList.remove('active')
      );

      b.classList.add('active');

      renderMenu(
        $('#searchInput').value,
        b.dataset.cat
      );

    }

  });

}

function renderMenu(q='',cat='ALL'){

  const grid=$('#menuGrid');

  let cats=menuData;

  if(cat!=='ALL'){
    cats=[menuData[+cat]];
  }

  const query=q.trim().toLowerCase();

  let html='';

  cats.forEach((c,ci)=>
    c.items.forEach(item=>{

      if(
        query &&
        !`${item.name} ${item.composition} ${c.title}`
          .toLowerCase()
          .includes(query)
      ){
        return;
      }

      html+=`
        <article
          class="menu-card"
          data-name="${escapeHtml(item.name)}"
          data-cat="${escapeHtml(c.title)}"
        >

          <img
            src="${c.img}"
            alt="${escapeHtml(item.name)}"
            loading="lazy"
          >

          <div class="menu-info">

            <div class="menu-cat">
              ${escapeHtml(c.title.trim())}
            </div>

            <div class="menu-name">
              ${escapeHtml(item.name)}
            </div>

            <div class="menu-composition">
              ${escapeHtml(item.composition)}
            </div>

          </div>

          <div class="menu-price">
            ${item.price} ₽
          </div>

        </article>
      `;

    })
  );

  grid.innerHTML=
    html ||
    '<div style="grid-column:1/-1;padding:50px;text-align:center;color:#777">Ничего не найдено.</div>';

  $$('.menu-card').forEach(card=>{

    card.onclick=()=>
      openItem(
        card.dataset.name,
        card.dataset.cat
      );

  });

}

function openItem(name,cat){

  let found=null;

  for(const c of menuData){

    if(c.title.trim()===cat){

      found=c.items.find(
        x=>x.name===name
      );

      break;

    }

  }

  if(!found)return;

  $('#modalCategory').textContent=cat;
  $('#modalItemName').textContent=found.name;
  $('#modalItemPrice').textContent=`${found.price} ₽`;

  $('#modalItemComposition').textContent=
    found.composition;

  $('#modalItemDesc').textContent=
    found.desc||'';

  $('#itemModal').classList.add('active');

  document.body.style.overflow='hidden';

}

function closeItem(){

  $('#itemModal').classList.remove('active');

  document.body.style.overflow='';

}

$('#itemClose').onclick=closeItem;

$('#itemModal').onclick=e=>{
  if(e.target.id==='itemModal'){
    closeItem();
  }
};

$('#searchInput').oninput=e=>
  renderMenu(
    e.target.value,
    $('.cat-btn.active')?.dataset.cat||'ALL'
  );

function renderReviews(){

  const data=
    window.reviewsData||
    reviewsData;

  $('#reviewsContainer').innerHTML=
    data.map(r=>`

      <article class="review-card">

        <div class="review-head">

          <div>

            <div class="review-name">
              ${escapeHtml(r.name)}
            </div>

            <div class="review-stars">
              ${'★'.repeat(r.rating)}
              ${'☆'.repeat(5-r.rating)}
            </div>

          </div>

          <div class="review-date">
            ${escapeHtml(r.date)}
          </div>

        </div>

        <div class="review-text">
          “${escapeHtml(r.text)}”
        </div>

      </article>

    `).join('');

}

let captchaA=5;
let captchaB=3;

function initBookingDate(){

  const input=$('#bookDate');

  if(!input)return;

  const today=new Date();

  const pad=n=>
    String(n).padStart(2,'0');

  const iso=
    `${today.getFullYear()}-`+
    `${pad(today.getMonth()+1)}-`+
    `${pad(today.getDate())}`;

  input.min=iso;

  if(!input.value){
    input.value=iso;
  }

}

function captcha(){

  captchaA=
    Math.floor(Math.random()*8)+2;

  captchaB=
    Math.floor(Math.random()*8)+1;

  $('#captchaQuestion').textContent=
    `${captchaA} + ${captchaB} = ?`;

}

$('#refreshCaptcha').onclick=captcha;

captcha();

function validTime(v){

  const m=
    v.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);

  return m && +m[1]>=17;

}

$('#sendToTelegramBtn').onclick=()=>{

  const date=$('#bookDate').value;

  const time=
    $('#bookTime').value.trim();

  const guests=
    +$('#bookGuests').value;

  const msg=
    $('#bookingMessage');

  if(!date||!time||!guests){

    msg.textContent=
      'Заполни дату, время и количество гостей.';

    return;

  }

  if(!validTime(time)){

    msg.textContent=
      'Время брони — с 17:00 до 00:00.';

    return;

  }

  if(guests<1||guests>20){

    msg.textContent=
      'Количество гостей — от 1 до 20.';

    return;

  }

  if(!$('#agreeCheckbox').checked){

    msg.textContent=
      'Подтверди согласие на обработку данных.';

    return;

  }

  if(
    +document.querySelector('#captchaInput').value
    !==captchaA+captchaB
  ){

    msg.textContent=
      'Неверная капча.';

    captcha();

    return;

  }

  const d=
    new Date(date).toLocaleDateString(
      'ru-RU',
      {
        day:'numeric',
        month:'long'
      }
    );

  const text=
    `НОВАЯ БРОНЬ В ДИП%0A%0A`+
    `📅 Дата: ${d}%0A`+
    `⏰ Время: ${encodeURIComponent(time)}%0A`+
    `👥 Гостей: ${guests}%0A%0A`+
    `📍 г. Кропоткин, Красная ул., 168/1`;

  window.open(
    `https://t.me/deep_hookah?text=${text}`,
    '_blank'
  );

  msg.textContent=
    'Открываем Telegram — останется только отправить сообщение менеджеру.';

};

function initAge(){

  const modal=$('#ageModal');

  const yes=$('#ageYesBtn');

  const no=$('#ageNoBtn');

  const remember=
    $('#dontAskAgainCheckbox');

  if(localStorage.getItem('dip18')==='yes'){

    modal.classList.remove('active');

    return;

  }

  modal.classList.add('active');

  document.body.style.overflow='hidden';

  yes.onclick=()=>{

    if(remember.checked){
      localStorage.setItem('dip18','yes');
    }

    modal.classList.remove('active');

    document.body.style.overflow='';

  };

  no.onclick=()=>{

    document.body.innerHTML=`
      <div style="
        background:#080807;
        color:#eee;
        height:100vh;
        display:grid;
        place-items:center;
        font:18px Inter
      ">
        Доступ только для гостей 18+.
      </div>
    `;

  };

}

function initMotion(){

  const isTouch=
    matchMedia('(pointer: coarse)').matches ||
    innerWidth<768;

  const cursor=$('.cursor');

  if(!isTouch){

    let cx=innerWidth/2;
    let cy=innerHeight/2;

    let tx=cx;
    let ty=cy;

    let raf=0;

    addEventListener(
      'pointermove',
      e=>{
        tx=e.clientX;
        ty=e.clientY;
      },
      {passive:true}
    );

    function loop(){

      cx+=(tx-cx)*.18;
      cy+=(ty-cy)*.18;

      if(cursor){

        cursor.style.transform=
          `translate3d(${cx}px,${cy}px,0) `+
          `translate(-50%,-50%)`;

      }

      raf=
        requestAnimationFrame(loop);

    }

    loop();

    $$('[data-magnetic]').forEach(el=>{

      el.addEventListener(
        'pointermove',
        e=>{

          const r=
            el.getBoundingClientRect();

          el.style.transform=
            `translate3d(`+
            `${(e.clientX-r.left-r.width/2)*.08}px,`+
            `${(e.clientY-r.top-r.height/2)*.08}px,0)`;

        },
        {passive:true}
      );

      el.addEventListener(
        'pointerleave',
        ()=>el.style.transform=''
      );

    });

    $$('.tilt').forEach(el=>{

      el.addEventListener(
        'pointermove',
        e=>{

          const r=
            el.getBoundingClientRect();

          const x=
            (e.clientX-r.left)/r.width-.5;

          const y=
            (e.clientY-r.top)/r.height-.5;

          el.style.transform=
            `perspective(900px) `+
            `rotateY(${x*3}deg) `+
            `rotateX(${-y*3}deg)`;

        },
        {passive:true}
      );

      el.addEventListener(
        'pointerleave',
        ()=>el.style.transform=''
      );

    });

  }

  const io=
    new IntersectionObserver(
      entries=>
        entries.forEach(en=>{

          if(en.isIntersecting){

            en.target.classList.add(
              'is-visible'
            );

            io.unobserve(en.target);

          }

        }),
      {
        threshold:.06,
        rootMargin:'0px 0px -8% 0px'
      }
    );

  $$('.reveal').forEach(
    x=>io.observe(x)
  );

}

function smoke(){

  const c=$('#smoke');

  if(!c)return;

  const isTouch=
    matchMedia('(pointer: coarse)').matches ||
    innerWidth<768;

  if(isTouch){

    c.remove();

    return;

  }

  const ctx=
    c.getContext('2d',{alpha:true});

  let w=0;
  let h=0;

  let pts=[];

  const DPR=
    Math.min(
      devicePixelRatio||1,
      1.5
    );

  function resize(){

    w=innerWidth;
    h=innerHeight;

    c.width=
      Math.floor(w*DPR);

    c.height=
      Math.floor(h*DPR);

    c.style.width=w+'px';
    c.style.height=h+'px';

    ctx.setTransform(
      DPR,
      0,
      0,
      DPR,
      0,
      0
    );

  }

  resize();

  addEventListener(
    'resize',
    resize,
    {passive:true}
  );

  for(let i=0;i<18;i++){

    pts.push({

      x:Math.random()*w,

      y:h+Math.random()*240,

      r:18+Math.random()*36,

      v:.12+Math.random()*.22,

      a:.012+Math.random()*.022,

      s:(Math.random()-.5)*.25,

      phase:Math.random()*6.28

    });

  }

  let last=0;

  function draw(t){

    if(t-last<32){

      requestAnimationFrame(draw);

      return;

    }

    last=t;

    ctx.clearRect(
      0,
      0,
      w,
      h
    );

    for(const p of pts){

      p.y-=p.v;

      p.x+=
        p.s+
        Math.sin(
          p.y*.006+p.phase
        )*.08;

      if(p.y<-80){

        p.y=h+80;

        p.x=
          Math.random()*w;

      }

      ctx.beginPath();

      ctx.fillStyle=
        `rgba(220,212,200,${p.a})`;

      ctx.arc(
        p.x,
        p.y,
        p.r,
        0,
        Math.PI*2
      );

      ctx.fill();

    }

    requestAnimationFrame(draw);

  }

  requestAnimationFrame(draw);

}

window.addEventListener(
  'load',
  ()=>{

    renderCategories();

    renderMenu();

    renderReviews();

    initMotion();

    smoke();

    initAge();

    initBookingDate();

    setTimeout(()=>{

      const p=$('#preloader');

      p.querySelector('span')
        .style.width='100%';

      setTimeout(()=>{

        p.style.transition=
          'opacity .8s';

        p.style.opacity='0';

        setTimeout(
          ()=>p.remove(),
          850
        );

      },500);

    },500);

  }
);
