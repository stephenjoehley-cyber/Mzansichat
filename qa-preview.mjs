import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE='https://b5acfd06.mzansichat.pages.dev';
const PROD='https://www.mzansichat.co.za';
const paths=['/','/growth-setup','/about-us','/contact-us','/privacy-policy','/terms-of-service'];
const wa="https://wa.me/27663303413?text=Hi%20MzansiChat%20%E2%80%94%20I%27d%20like%20to%20learn%20more%20about%20WhatsApp%20Growth.";
const failures=[],results=[];
fs.mkdirSync('qa-output',{recursive:true});
const browser=await chromium.launch({headless:true});
for(const device of [{name:'desktop',width:1440,height:900,isMobile:false},{name:'mobile',width:393,height:852,isMobile:true}]){
  const context=await browser.newContext({viewport:{width:device.width,height:device.height},isMobile:device.isMobile,deviceScaleFactor:1,hasTouch:device.isMobile});
  const page=await context.newPage();
  for(const path of paths){
    const errors=[];
    const onError=e=>errors.push('runtime '+e.message);
    const onConsole=m=>{if(m.type()==='error')errors.push('console '+m.text())};
    const onResponse=r=>{if(r.status()>=400 && r.url().startsWith(BASE))errors.push('network '+r.status()+' '+r.url())};
    page.on('pageerror',onError);page.on('console',onConsole);page.on('response',onResponse);
    try {
      const response=await page.goto(BASE+path,{waitUntil:'networkidle',timeout:45000});
      if(!response||response.status()!==200)throw new Error('HTTP '+response?.status());
      const m=await page.evaluate(()=>{
        const prop=p=>document.querySelector('meta[property="'+p+'"]')?.content;
        const meta=p=>document.querySelector('meta[name="'+p+'"]')?.content;
        const canon=document.querySelector('link[rel=canonical]')?.href;
        const ld=[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent));
        const allA=[...document.querySelectorAll('a[href]')].map(a=>({href:a.getAttribute('href'),text:a.innerText?.trim()||'',nav:!!a.closest('header'),footer:!!a.closest('footer')}));
        return {title:document.title,props:Object.fromEntries(['og:title','og:description','og:image','og:url','og:type'].map(p=>[p,prop(p)])),
         twitter:{card:meta('twitter:card'),image:meta('twitter:image')},canon,ld,
         allA,nav:document.querySelectorAll('header .mc-nav-links a').length,
         footer:document.querySelectorAll('footer nav a').length,
         float:[...document.querySelectorAll('.mc-floating-wa')].map(x=>({href:x.href,label:x.getAttribute('aria-label')})),
         phone:document.querySelector('.mc-footer-contact')?.innerText,
         horizontalOverflow:document.documentElement.scrollWidth-innerWidth,
         favicon:!!document.querySelector('link[rel=icon]')};
      });
      if(m.canon!==PROD+path)failures.push(device.name+path+' canonical '+m.canon);
      if(m.props['og:url']!==PROD+path||m.props['og:type']!=='website')failures.push(device.name+path+' og url/type');
      for(const p of ['og:title','og:description'])if(!m.props[p])failures.push(device.name+path+' '+p+' empty');
      if(m.props['og:image']!==PROD+'/mzansichat-share-1200x630.png'||m.twitter.image!==m.props['og:image']||m.twitter.card!=='summary_large_image')failures.push(device.name+path+' share meta');
      if(m.nav!==4||m.footer!==6)failures.push(device.name+path+' header/footer nav '+m.nav+'/'+m.footer);
      if(m.float.length!==1||m.float[0].href!==wa)failures.push(device.name+path+' floating WhatsApp');
      if(!m.phone?.includes('+27 66 330 3413'))failures.push(device.name+path+' footer telephone');
      if(!m.favicon)failures.push(device.name+path+' favicon missing');
      if(m.horizontalOverflow>6)failures.push(device.name+path+' horizontal overflow '+m.horizontalOverflow);
      const l=m.ld.find(x=>x['@type']==='LocalBusiness');if(!l||l.name!=='MzansiChat'||l.telephone!=='+27663303413'||l.url!==PROD||l.address?.addressLocality!=='Johannesburg'||l.address?.addressRegion!=='Gauteng')failures.push(device.name+path+' JSON-LD invalid values');
      for(const a of m.allA){
        if(!a.href)failures.push(device.name+path+' empty link');
        if(a.href.startsWith('#')&&!(await page.locator('[id="'+a.href.slice(1)+'"]').count()))failures.push(device.name+path+' broken fragment '+a.href);
        if(a.href.startsWith('/')&&!paths.includes(a.href.split('#')[0]))failures.push(device.name+path+' broken internal path '+a.href);
      }
      if(errors.length)failures.push(...errors.map(e=>device.name+path+' '+e));
      if(path==='/')await page.screenshot({path:'qa-output/home-'+device.name+'.png',fullPage:true});
      results.push({device:device.name,path,status:'loaded',errors,links:m.allA.length,overflow:m.horizontalOverflow});
    }catch(e){failures.push(device.name+path+' failed '+e.message);}
    page.off('pageerror',onError);page.off('console',onConsole);page.off('response',onResponse);
  }
  for(const selector of ['header .mc-nav-links a','footer nav a']){
    await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});
    const links=await page.locator(selector).evaluateAll(els=>els.map(a=>({label:a.innerText.trim(),href:a.getAttribute('href')})));
    for(const l of links){
      try{
        await page.goto(BASE+'/',{waitUntil:'domcontentloaded'});
        await page.locator(selector).filter({hasText:l.label}).first().click({timeout:10000});
        await page.waitForLoadState('domcontentloaded');
        const expected=new URL(l.href,BASE).pathname;const actual=new URL(page.url()).pathname;
        if(expected!==actual)failures.push(device.name+' navigation '+l.label+' expected '+expected+' got '+actual);
      }catch(e){failures.push(device.name+' click '+l.label+': '+e.message);}
    }
  }
  await context.close();
}
const ctx=await browser.newContext();const rp=await ctx.request.get(BASE+'/mzansichat-share-1200x630.png');if(rp.status()!==200)failures.push('share PNG HTTP '+rp.status());else{const bytes=await rp.body();if(bytes.toString('ascii',1,4)!=='PNG')failures.push('share image not PNG');else{const w=bytes.readUInt32BE(16),h=bytes.readUInt32BE(20);if(w!==1200||h!==630)failures.push('share size '+w+'x'+h)}}
await browser.close();
fs.writeFileSync('qa-output/results.json',JSON.stringify({results,failures},null,2));
console.log(JSON.stringify({tested:results.length,failures},null,2));
if(failures.length)process.exit(1);