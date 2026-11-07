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
const isSeoRelevant=p=> !/^(\.github\/|docs\/|scripts\/seo-quality-gate(?:\.test)?\.mjs$)/.test(p) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(p);
const affected=files.filter(p=>isSeoRelevant(p) && !/^scripts\/seo-quality-gate(?:\.test)?\.mjs$/.test(p));
if(!affected.length){console.log('No SEO-relevant page or application files changed; handoff not required.');process.exit(0);}
const hub=/https:\/\/github\.com\/alanbishop75\/find-my-ideal-hub\/pull\/(\d+)/i.exec(body);
const record=/SEO Quality Gate record:\s*(docs\/seo\/quality-reviews\/[a-zA-Z0-9._-]+\.json)/i.exec(body);
if(!hub||!record){console.error('BLOCKED: require Hub review PR URL and SEO Quality Gate record: docs/seo/quality-reviews/<name>.json');process.exit(1);}
const api=async u=>{
 const raw=execFileSync('curl',['--fail','--silent','--show-error','-H','Authorization: Bearer '+process.env.GH_TOKEN,'-H','Accept: application/vnd.github+json',u],{encoding:'utf8'});
 return JSON.parse(raw);
};
try {
 const pr=await api('https://api.github.com/repos/alanbishop75/find-my-ideal-hub/pulls/'+hub[1]);
 if(!pr.merged_at||pr.base?.ref!=='main')throw Error('Hub review PR not merged to main');
 const approvals=await api('https://api.github.com/repos/alanbishop75/find-my-ideal-hub/pulls/'+hub[1]+'/reviews?per_page=100');
 if(!Array.isArray(approvals)||!approvals.some(x=>x.state==='APPROVED'&&x.user?.login&&x.user.login!==pr.user?.login))throw Error('Independent GitHub approval missing');
 const changed=await api('https://api.github.com/repos/alanbishop75/find-my-ideal-hub/pulls/'+hub[1]+'/files?per_page=100');
 if(!Array.isArray(changed)||!changed.some(x=>x.filename===record[1]))throw Error('Hub PR did not introduce the cited review record');
 const source=await api('https://api.github.com/repos/alanbishop75/find-my-ideal-hub/contents/'+record[1]+'?ref=main');
 if(source.encoding!=='base64')throw Error('Hub review record not available');
 const review=JSON.parse(Buffer.from(source.content.replace(/\s/g,''),'base64').toString('utf8'));
 if(review.verdict!=='PASS'||review.release?.approval!=='APPROVED'||review.release?.ci!=='PASS'||review.release?.preview!=='PASS')throw Error('Hub release gate not approved and verified');
 if(review.siteRepository!==repo)throw Error('Hub review belongs to different repository');
 if(!Array.isArray(review.changedPaths)||affected.some(p=>!review.changedPaths.includes(p)))throw Error('Unreviewed changed path');
 if(review.release?.approvalReference===undefined)throw Error('Missing approval provenance');
 console.log('Verified merged Hub review #'+hub[1]+' and approved record '+record[1]);
}catch(e){console.error('BLOCKED: central review authentication failed: '+e.message);process.exit(1);}
