import { allowedTypes, jobTypes, validateEnquiry, validateAttachments, enquiryText, createRequestId } from './contact-rules.js';
const draftKey = 'finnz-enquiry-v1';
const fields = ['name', 'email', 'phone', 'jobType', 'length', 'width', 'height', 'message'];
const errorMarkup = name => `<span class="field-error" id="${name}-error"></span>`;
export function contactFormMarkup(arrow) {
  return `<form id="contact-form" aria-labelledby="form-title" novalidate>
    <div class="form-material"><span class="eyebrow">DIT FARVEØNSKE</span><div><span id="material-summary">Vi finder farven sammen.</span><button class="material-edit" type="button">Tilpas ↗</button></div><input type="hidden" name="material"><input type="hidden" name="finish"></div>
    <fieldset class="enquiry-fields">
      <div class="form-fields">
        <label>Dit navn<input name="name" autocomplete="name" maxlength="100" required aria-describedby="name-error" placeholder="Navn">${errorMarkup('name')}</label>
        <label>Din e-mail<input name="email" type="email" autocomplete="email" maxlength="254" required aria-describedby="email-error" placeholder="dig@eksempel.dk">${errorMarkup('email')}</label>
      </div>
      <fieldset class="job-options"><legend>Hvad har du i tankerne? <span>(valgfrit)</span></legend><div class="job-chips">${jobTypes.map(type => `<label><input type="radio" name="jobType" value="${type}"><span>${type}</span></label>`).join('')}</div>${errorMarkup('jobType')}</fieldset>
      <div class="callback-row"><label class="callback-choice"><input type="checkbox" name="callback"> Ring mig gerne op</label><label class="callback-number" hidden>Dit telefonnummer<input name="phone" type="tel" autocomplete="tel" maxlength="30" aria-describedby="phone-error" placeholder="Fx 41 35 20 25">${errorMarkup('phone')}</label></div>
      <fieldset class="dimension-fields"><legend>Omtrentlige mål <span>(valgfrit, i cm)</span></legend><div>${[['length', 'Længde'], ['width', 'Bredde'], ['height', 'Højde']].map(([key, label]) => `<label>${label}<input name="${key}" inputmode="decimal" maxlength="8" aria-describedby="${key}-error" placeholder="cm">${errorMarkup(key)}</label>`).join('')}</div></fieldset>
      <label>Fortæl lidt om din idé<textarea name="message" rows="4" minlength="10" maxlength="4000" required aria-describedby="message-error" placeholder="Hvad vil du gerne have lavet? …"></textarea>${errorMarkup('message')}</label>
      <div class="attachment-field"><label class="upload-label" for="enquiry-files">Billeder eller skitser <span>(valgfrit)</span></label><label class="upload-button" for="enquiry-files"><span aria-hidden="true">＋</span> Vælg filer<input id="enquiry-files" type="file" multiple accept="${allowedTypes.join(',')}" aria-describedby="attachment-help files-error"></label><p id="attachment-help">JPG, PNG, WebP eller PDF. Højst 4 filer, 3 MB pr. fil og 8 MB i alt.</p><div class="attachment-list" aria-live="polite"></div>${errorMarkup('files')}</div>
      <label class="form-trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <div class="form-error-summary" role="alert" hidden></div>
      <div class="form-actions"><div><p class="form-availability" role="status">Henter kontaktmuligheder …</p><p class="response-time" hidden></p></div><button type="submit" class="form-submit" disabled><span>Et øjeblik …</span>${arrow}</button></div>
    </fieldset>
    <div class="form-result" hidden><p role="status"></p><textarea rows="6" readonly aria-label="Din klargjorte besked" hidden></textarea><button type="button" class="text-link" id="copy-message" hidden>Kopiér beskeden ${arrow}</button></div>
    <div class="draft-bar"><p class="draft-note" aria-live="polite">Din kladde gemmes kun i denne browser i 7 dage. Billeder gemmes ikke.</p><button type="button" class="draft-clear">Slet kladde</button></div>
  </form>`;
}
function readDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(draftKey));
    if (!draft || draft.version !== 1 || !Number.isFinite(draft.updated) || Date.now() - draft.updated > 7 * 86400000) { localStorage.removeItem(draftKey); return null; }
    return draft;
  } catch { return null; }
}
export function setupContactForm({ onResetColor }) {
  const form = document.querySelector('#contact-form');
  const result = form.querySelector('.form-result');
  const summary = form.querySelector('.form-error-summary');
  const submit = form.querySelector('.form-submit');
  const responseTime = form.querySelector('.response-time');
  const draftNote = form.querySelector('.draft-note');
  const fileInput = form.querySelector('#enquiry-files');
  let selectedFiles = [], ready = false, requestId = createRequestId(), draftTimer;
  const restored = readDraft();
  const value = name => form.elements.namedItem(name);
  if (restored) {
    for (const key of fields) if (typeof restored[key] === 'string') {
      if (key === 'jobType') { const option = [...form.querySelectorAll('[name=jobType]')].find(input => input.value === restored[key]); if (option) option.checked = true; }
      else value(key).value = restored[key].slice(0, key === 'message' ? 4000 : 254);
    }
    value('callback').checked = restored.callback === true;
    draftNote.textContent = restored.hadAttachments ? 'Din kladde er gendannet. Vælg billederne igen, hvis de skal med.' : 'Din kladde er gendannet fra denne browser.';
  }
  function callbackState() {
    form.querySelector('.callback-number').hidden = !value('callback').checked;
    value('phone').required = value('callback').checked;
    if (!value('callback').checked) showError('phone', '');
  }
  function data() {
    return Object.fromEntries([...fields, 'material'].map(key => [key, String(value(key).value || '').trim()]).concat([['callback', value('callback').checked]]));
  }
  function saveDraft() {
    clearTimeout(draftTimer);
    const current = data();
    const draft = { ...current, color: current.material, version: 1, updated: Date.now(), hadAttachments: selectedFiles.length > 0 };
    delete draft.material;
    const meaningful = fields.some(key => current[key]) || current.callback || ['Lys', 'Sort'].includes(current.material) || selectedFiles.length;
    try {
      if (meaningful) localStorage.setItem(draftKey, JSON.stringify(draft)); else localStorage.removeItem(draftKey);
    } catch { draftNote.textContent = 'Denne browser kunne ikke gemme kladden. Behold siden åben, indtil du er færdig.'; }
  }
  function invalidate() {
    result.hidden = true; requestId = createRequestId();
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraft, 250);
  }
  function showError(key, message) {
    const node = document.getElementById(`${key}-error`);
    if (node) node.textContent = message;
    const input = key === 'files' ? fileInput : value(key);
    if (input?.setAttribute) { if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
  }
  function showErrors(errors) {
    for (const key of [...fields, 'files']) showError(key, errors[key] || '');
    summary.hidden = !Object.keys(errors).length;
    summary.textContent = 'Ret de markerede felter, før du sender.';
    const first = Object.keys(errors)[0];
    const target = first === 'files' ? fileInput : value(first);
    target?.focus?.();
  }
  function renderFiles() {
    const list = form.querySelector('.attachment-list');
    list.replaceChildren(...selectedFiles.map((item, index) => {
      const card = document.createElement('div'); card.className = 'attachment-card';
      if (item.file.type.startsWith('image/')) {
        const img = document.createElement('img'); img.src = item.url; img.alt = ''; img.width = 56; img.height = 56; card.append(img);
      } else { const icon = document.createElement('span'); icon.className = 'pdf-label'; icon.textContent = 'PDF'; card.append(icon); }
      const label = document.createElement('span'); label.textContent = `${item.file.name} · ${(item.file.size / 1024 / 1024).toFixed(1)} MB`;
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Fjern ${item.file.name}`);
      remove.addEventListener('click', () => { URL.revokeObjectURL(item.url); selectedFiles.splice(index, 1); renderFiles(); showError('files', ''); invalidate(); });
      card.append(label, remove); return card;
    }));
  }
  fileInput.addEventListener('change', () => {
    const incoming = [...fileInput.files].filter(file => !selectedFiles.some(item => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified));
    const error = validateAttachments([...selectedFiles.map(item => item.file), ...incoming]);
    fileInput.value = '';
    if (error) { showError('files', error); return; }
    selectedFiles.push(...incoming.map(file => ({ file, url: URL.createObjectURL(file) })));
    showError('files', ''); renderFiles(); invalidate();
  });
  form.addEventListener('input', event => {
    callbackState(); invalidate();
    const key = event.target.name;
    if (document.getElementById(`${key}-error`)?.textContent) showError(key, validateEnquiry(data())[key] || '');
  });
  form.addEventListener('focusout', event => {
    const key = event.target.name;
    if (fields.includes(key) && (event.target.value.trim() || event.target.hasAttribute('aria-invalid'))) showError(key, validateEnquiry(data())[key] || '');
  });
  window.addEventListener('pagehide', saveDraft);
  function clearEnquiry() {
    clearTimeout(draftTimer); form.reset();
    selectedFiles.forEach(item => URL.revokeObjectURL(item.url)); selectedFiles = []; renderFiles();
    callbackState(); onResetColor();
    for (const key of [...fields, 'files']) showError(key, '');
    summary.hidden = true; saveDraft();
  }
  form.querySelector('.draft-clear').addEventListener('click', () => {
    clearEnquiry(); result.hidden = true; draftNote.textContent = 'Din kladde er slettet fra denne browser.'; value('name').focus();
  });
  callbackState();
  async function configure() {
    try {
      const response = await fetch('/api/contact', { signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error('Unavailable');
      const config = await response.json(); ready = config.ready === true;
      if (ready && typeof config.responseTime === 'string' && config.responseTime) { responseTime.hidden = false; responseTime.textContent = config.responseTime; }
    } catch { ready = false; }
    form.querySelector('.form-availability').textContent = ready ? 'Vi bruger oplysningerne til at svare på din henvendelse.' : 'Onlineafsendelse åbner snart. Du kan klargøre din besked her eller ringe til os.';
    submit.querySelector('span').textContent = ready ? 'Send din forespørgsel' : 'Klargør besked'; submit.disabled = false;
  }
  configure();
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (submit.disabled) return;
    const current = data();
    const errors = validateEnquiry(current);
    const fileError = validateAttachments(selectedFiles.map(item => item.file));
    if (fileError) errors.files = fileError;
    showErrors(errors); if (Object.keys(errors).length) return;
    saveDraft();
    if (!ready) {
      result.hidden = false;
      result.querySelector('[role=status]').textContent = 'Din besked er klargjort, men ikke sendt. Vedhæftninger bliver ikke sendt eller gemt.';
      const text = result.querySelector('textarea'); text.hidden = false; text.value = enquiryText(current);
      form.querySelector('#copy-message').hidden = false; return;
    }
    const payload = new FormData();
    for (const [key, entry] of Object.entries(current)) payload.set(key, String(entry));
    payload.set('website', value('website').value); payload.set('requestId', requestId);
    selectedFiles.forEach(item => payload.append('files', item.file));
    const controls = form.querySelector('.enquiry-fields'); controls.disabled = true; form.setAttribute('aria-busy', 'true');
    form.querySelector('.draft-clear').disabled = form.querySelector('.material-edit').disabled = true;
    submit.querySelector('span').textContent = 'Sender …'; summary.hidden = true; result.hidden = true;
    try {
      const response = await fetch('/api/contact', { method: 'POST', body: payload, signal: AbortSignal.timeout(25000) });
      const body = await response.json();
      if (!response.ok || body.sent !== true || !body.reference) {
        if (body.errors) showErrors(body.errors);
        const failure = new Error(body.message || 'Beskeden kunne ikke sendes. Prøv igen, eller ring til os.'); failure.fromServer = true; throw failure;
      }
      clearEnquiry();
      result.querySelector('textarea').hidden = true; form.querySelector('#copy-message').hidden = true;
      result.querySelector('[role=status]').textContent = 'Tak! Din henvendelse er sendt. Vi vender tilbage til dig.';
      result.hidden = false; result.scrollIntoView({ behavior: 'instant', block: 'nearest' });
      draftNote.textContent = 'Din sendte kladde er slettet fra denne browser.';
    } catch (error) {
      summary.hidden = false;
      summary.textContent = error.name === 'TimeoutError' ? 'Vi kunne ikke bekræfte afsendelsen. Prøv igen med samme besked, eller ring til os. Dine oplysninger er bevaret.' : error.fromServer ? error.message : 'Vi kunne ikke bekræfte afsendelsen. Prøv igen, eller ring til os. Dine oplysninger er bevaret.';
      saveDraft();
    } finally {
      controls.disabled = false; form.querySelector('.draft-clear').disabled = form.querySelector('.material-edit').disabled = false; form.removeAttribute('aria-busy'); submit.querySelector('span').textContent = 'Send din forespørgsel';
      const invalid = form.querySelector('[aria-invalid=true]'); if (!summary.hidden && invalid) invalid.focus();
    }
  });
  form.querySelector('#copy-message').addEventListener('click', async event => {
    const textarea = result.querySelector('textarea');
    try { await navigator.clipboard.writeText(textarea.value); event.currentTarget.textContent = 'Besked kopieret ✓'; }
    catch { textarea.focus(); textarea.select(); result.querySelector('[role=status]').textContent = 'Markér teksten, og kopiér den med Ctrl+C eller Cmd+C.'; }
  });
  return { invalidate, saveDraft, restoredColor: ['Lys', 'Sort'].includes(restored?.color) ? restored.color : null };
}
