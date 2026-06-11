(function() {
  'use strict';

  var CONSENT_KEY = 'ng_cookie_consent';
  var CONSENT_EXPIRY_DAYS = 365;
  var GA_MEASUREMENT_ID = 'G-JEGRXN6Y21';

  // Inizializza Consent Mode v2 in modalità "denied" PRIMA di tutto
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });

  // Lettura consenso salvato
  function getStoredConsent() {
    try {
      var stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) return null;
      var data = JSON.parse(stored);
      if (!data.timestamp || !data.choice) return null;
      var ageMs = Date.now() - data.timestamp;
      var maxAgeMs = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (ageMs > maxAgeMs) return null;
      return data.choice;
    } catch (e) {
      return null;
    }
  }

  function storeConsent(choice) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        choice: choice,
        timestamp: Date.now()
      }));
    } catch (e) {}
  }

  // Carica GA4 (solo dopo consenso accettato)
  function loadGA4() {
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      'anonymize_ip': true,
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false
    });
  }

  // Costruisce il DOM del banner
  function buildBanner() {
    var banner = document.createElement('div');
    banner.id = 'ng-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'ng-cookie-title');
    banner.setAttribute('aria-describedby', 'ng-cookie-desc');
    banner.innerHTML = [
      '<div class="ng-cookie-inner">',
      '  <div class="ng-cookie-text">',
      '    <p id="ng-cookie-title" class="ng-cookie-title">COOKIE E PRIVACY</p>',
      '    <p id="ng-cookie-desc" class="ng-cookie-desc">',
      '      Usiamo cookie tecnici per il funzionamento del sito e, con il tuo consenso, cookie di analisi (Google Analytics, IP anonimizzato) per capire come migliorare il sito. Puoi accettare tutto o solo i cookie necessari. Leggi la nostra <a href="/cookie.html">Cookie Policy</a>.',
      '    </p>',
      '  </div>',
      '  <div class="ng-cookie-actions">',
      '    <button type="button" class="ng-cookie-btn ng-cookie-btn-secondary" id="ng-cookie-reject">SOLO NECESSARI</button>',
      '    <button type="button" class="ng-cookie-btn ng-cookie-btn-primary" id="ng-cookie-accept">ACCETTA TUTTI</button>',
      '  </div>',
      '</div>'
    ].join('');
    return banner;
  }

  // Inietta il CSS del banner
  function injectStyles() {
    if (document.getElementById('ng-cookie-styles')) return;
    var style = document.createElement('style');
    style.id = 'ng-cookie-styles';
    style.textContent = [
      '#ng-cookie-banner{',
      '  position:fixed;left:0;right:0;bottom:0;z-index:9999;',
      '  background:#1a1a1a;color:#f5f0e6;',
      '  border-top:3px solid #c8102e;',
      '  box-shadow:0 -4px 24px rgba(0,0,0,.3);',
      '  font-family:"IBM Plex Sans",system-ui,sans-serif;',
      '  transform:translateY(100%);transition:transform .35s ease-out;',
      '}',
      '#ng-cookie-banner.ng-cookie-visible{transform:translateY(0);}',
      '.ng-cookie-inner{',
      '  max-width:1200px;margin:0 auto;padding:20px 24px;',
      '  display:flex;gap:24px;align-items:center;flex-wrap:wrap;',
      '}',
      '.ng-cookie-text{flex:1;min-width:280px;}',
      '.ng-cookie-title{',
      '  font-family:"Big Shoulders Display",sans-serif;font-weight:900;',
      '  font-size:18px;letter-spacing:.06em;margin:0 0 6px 0;color:#c8102e;',
      '}',
      '.ng-cookie-desc{',
      '  font-size:14px;line-height:1.5;margin:0;color:#e8e0d2;',
      '}',
      '.ng-cookie-desc a{color:#f5f0e6;text-decoration:underline;}',
      '.ng-cookie-desc a:hover{color:#fff;}',
      '.ng-cookie-actions{display:flex;gap:10px;flex-wrap:wrap;}',
      '.ng-cookie-btn{',
      '  font-family:"Big Shoulders Display",sans-serif;font-weight:900;',
      '  font-size:14px;letter-spacing:.08em;',
      '  padding:12px 22px;border:none;cursor:pointer;',
      '  transition:opacity .15s,transform .15s;',
      '}',
      '.ng-cookie-btn:hover{opacity:.88;transform:translateY(-1px);}',
      '.ng-cookie-btn-primary{background:#c8102e;color:#fff;}',
      '.ng-cookie-btn-secondary{background:transparent;color:#f5f0e6;border:2px solid #f5f0e6;}',
      '@media (max-width:600px){',
      '  .ng-cookie-inner{padding:16px;gap:14px;}',
      '  .ng-cookie-title{font-size:16px;}',
      '  .ng-cookie-desc{font-size:13px;}',
      '  .ng-cookie-actions{width:100%;}',
      '  .ng-cookie-btn{flex:1;text-align:center;padding:12px 14px;}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  // Mostra banner
  function showBanner() {
    injectStyles();
    var banner = buildBanner();
    document.body.appendChild(banner);
    // Trigger animazione slide-up
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        banner.classList.add('ng-cookie-visible');
      });
    });
    document.getElementById('ng-cookie-accept').addEventListener('click', function() {
      storeConsent('accepted');
      hideBanner(banner);
      loadGA4();
    });
    document.getElementById('ng-cookie-reject').addEventListener('click', function() {
      storeConsent('rejected');
      hideBanner(banner);
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('ng-cookie-visible');
    setTimeout(function() {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  }

  // Init
  function init() {
    var consent = getStoredConsent();
    if (consent === 'accepted') {
      loadGA4();
    } else if (consent === 'rejected') {
      // Niente da fare, GA4 resta inattivo
    } else {
      // Primo accesso o consenso scaduto
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBanner);
      } else {
        showBanner();
      }
    }
  }

  init();
})();
