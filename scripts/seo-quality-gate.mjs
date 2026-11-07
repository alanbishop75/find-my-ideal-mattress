#!/usr/bin/env node
// Fail-closed PR handoff check; Hub is the decision owner, not this script.
// PR_BODY is JSON encoded by Actions to preserve multiline content safely.
import { execFileSync } from 'node:child_process';
const repo=process.env.GH_REPO, number=process.env.PR_NUMBER;
if(!repo||!number){console.error('Missing PR context');process.exit(2);}
let body='';
try{body=JSON.parse(process.env.PR_BODY||'null')||'';}catch{console.error('Malformed PR body');process.exit(2);}
const url='https://api.github.com/repos/'+repo+'/pulls/'+number+'/files?per_page=100';
let files=[],page=1;
try{
 while(true){
  const raw=execFileSync('curl',['--fail','--silent','--show-error','-H','Authorization: Bearer '+process.env.GH_TOKEN,'-H','Accept: application/vnd.github+json',url+'&page='+page],{encoding:'utf8'});
  const rows=JSON.parse(raw);if(!Array.isArray(rows))throw Error('Invalid files response');
  files.push(...rows.map(x=>x.filename));if(rows.length<100)break;
  if(++page>30)throw Error('PR too large to classify safely');
 }
}catch(e){console.error('Unable to classify PR files:',e.message);process.exit(1);}
const isSeoRelevant=p=>/^(app\/|pages\/|src\/|content\/|config\/|data\/|public\/|components\/|lib\/|scripts\/|next\.config|middleware|robots|sitemap)/i.test(p) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(p);
const affected=files.filter(p=>isSeoRelevant(p) && !/^scripts\/seo-quality-gate(?:\.test)?\.mjs$/.test(p));
if(!affected.length){console.log('No SEO-relevant page or application files changed; handoff not required.');process.exit(0);}
const hub=/https:\/\/github\.com\/alanbishop75\/find-my-ideal-hub\/pull\/(\d+)/i.exec(body);
const review=/SEO Quality Gate verdict:\s*(PASS|FAIL|INSUFFICIENT_EVIDENCE)/i.exec(body);
const evidence=/SEO Quality Gate evidence:\s*\S+/i.test(body);
if(!hub||!review||review[1].toUpperCase()!=='PASS'||!evidence){
 console.error('SEO-relevant files changed: '+affected.join(', '));
 console.error('BLOCKED: PR body must link Hub quality-gate PR and include "SEO Quality Gate verdict: PASS" and "SEO Quality Gate evidence: <review reference>".');
 process.exit(1);
}
console.log('SEO handoff present; Hub PR #'+hub[1]+' cited. NOTE: this check does not authenticate Hub review or enforce reviewer approval; protect branch separately.');
