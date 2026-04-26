/**
 * The Simulation - Frontend JavaScript
 */
(function(){
    'use strict';
    const mobileMenuToggle=document.querySelector('.mobile-menu-toggle');
    const nav=document.querySelector('.nav');
    const newsletterForm=document.getElementById('newsletter-form');
    const newsletterMessage=document.getElementById('newsletter-message');
    if(mobileMenuToggle){
        mobileMenuToggle.addEventListener('click',()=>{
            const isExpanded=mobileMenuToggle.getAttribute('aria-expanded')==='true';
            mobileMenuToggle.setAttribute('aria-expanded',!isExpanded);
            nav.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-link').forEach(link=>{
        link.addEventListener('click',()=>{
            nav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded','false');
        });
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
        anchor.addEventListener('click',function(e){
            e.preventDefault();
            const targetId=this.getAttribute('href');
            if(targetId==='#')return;
            const target=document.querySelector(targetId);
            if(target){target.scrollIntoView({behavior:'smooth',block:'start'});}
        });
    });
    const animateStats=()=>{
        const statNumbers=document.querySelectorAll('.stat-number');
        const observer=new IntersectionObserver((entries)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    const el=entry.target;
                    const target=parseFloat(el.dataset.target);
                    const suffix=el.dataset.suffix||'';
                    const isDecimal=target%1!==0;
                    const duration=2000;
                    const start=performance.now();
                    const update=(currentTime)=>{
                        const elapsed=currentTime-start;
                        const progress=Math.min(elapsed/duration,1);
                        const easeOut=1-Math.pow(1-progress,3);
                        const current=target*easeOut;
                        el.textContent=(isDecimal?current.toFixed(1):Math.floor(current))+suffix;
                        if(progress<1){requestAnimationFrame(update);}
                    };
                    requestAnimationFrame(update);
                    observer.unobserve(el);
                }
            });
        },{threshold:0.5});
        statNumbers.forEach(stat=>observer.observe(stat));
    };
    const initScrollReveal=()=>{
        const revealElements=document.querySelectorAll('.level,.path-item,.blog-card');
        const observer=new IntersectionObserver((entries)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    entry.target.style.opacity='1';
                    entry.target.style.transform='translateY(0)';
                }
            });
        },{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
        revealElements.forEach(el=>{
            el.style.opacity='0';
            el.style.transform='translateY(40px)';
            el.style.transition='opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    };
    if(newsletterForm){
        newsletterForm.addEventListener('submit',async(e)=>{
            e.preventDefault();
            const email=newsletterForm.querySelector('input[name="email"]').value;
            const submitBtn=newsletterForm.querySelector('button[type="submit"]');
            submitBtn.disabled=true;
            submitBtn.textContent='Subscribing...';
            try{
                const response=await fetch('/api/subscribe',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({email})
                });
                const data=await response.json();
                if(data.success){
                    newsletterMessage.textContent=data.message;
                    newsletterMessage.className='message success';
                    newsletterForm.reset();
                }else{throw new Error(data.message||'Subscription failed');}
            }catch(error){
                newsletterMessage.textContent=error.message||'Something went wrong. Please try again.';
                newsletterMessage.className='message error';
            }finally{
                submitBtn.disabled=false;
                submitBtn.textContent='Subscribe';
            }
        });
    }
    window.shareExperience=function(){
        const shareData={title:'The Simulation | Crypto Scam Awareness',text:'Enter the simulation. Discover the truth behind crypto recovery scams.',url:window.location.href};
        if(navigator.share){navigator.share(shareData).catch(()=>{});}else{copyLink();}
    };
    window.copyLink=function(){
        navigator.clipboard.writeText(window.location.href).then(()=>{showToast('Link copied! Share the awakening.');}).catch(()=>{showToast('Could not copy link.');});
    };
    function showToast(message){
        const existingToast=document.querySelector('.toast');
        if(existingToast)existingToast.remove();
        const toast=document.createElement('div');
        toast.className='toast';
        toast.textContent=message;
        toast.setAttribute('role','alert');
        Object.assign(toast.style,{position:'fixed',bottom:'20px',left:'50%',transform:'translateX(-50%)',background:'var(--neon-blue)',color:'var(--dark-bg)',padding:'12px 24px',borderRadius:'8px',fontWeight:'700',zIndex:'10000'});
        document.body.appendChild(toast);
        setTimeout(()=>{toast.remove();},3000);
    }
    const initParallax=()=>{
        const glows=document.querySelectorAll('.bg-glow');
        window.addEventListener('scroll',()=>{
            const scrolled=window.pageYOffset;
            glows[0].style.transform=`translateY(${scrolled*0.3}px)`;
            glows[1].style.transform=`translateY(${scrolled*-0.2}px)`;
        });
    };
    const initHeaderScroll=()=>{
        const header=document.querySelector('.header');
        window.addEventListener('scroll',()=>{
            if(window.scrollY>50){header.style.background='rgba(10,10,15,0.95)';header.style.boxShadow='0 2px 20px rgba(0,0,0,0.3)';}else{header.style.background='rgba(10,10,15,0.9)';header.style.boxShadow='none';}
        });
    };
    document.addEventListener('DOMContentLoaded',()=>{animateStats();initScrollReveal();initParallax();initHeaderScroll();});
})();