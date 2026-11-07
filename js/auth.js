/* Optional Supabase authentication for HymnFlow.
 * Set SUPABASE_URL and SUPABASE_ANON_KEY from Supabase Project Settings > API.
 * NEVER put a service_role or secret key here.
 */
const SUPABASE_URL="";
const SUPABASE_ANON_KEY="";
(()=>{
let client=null,user=null,signUp=false,pending=null;
const $=s=>document.querySelector(s);
const configured=Boolean(SUPABASE_URL&&SUPABASE_ANON_KEY&&window.supabase?.createClient);
if(configured)client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const setMsg=(m,error=false)=>{const el=$("#authMessage");el.textContent=m;el.style.color=error?"#ffadb6":"#91e5d9"};
const logged=()=>Boolean(user);
function open(after){pending=typeof after==="function"?after:null;$("#authOverlay").classList.remove("hidden");setMsg(configured?"":"Accounts are not connected yet. The site owner needs to configure Supabase.",!configured);$("#authEmail").focus()}
function close(){pending=null;$("#authOverlay").classList.add("hidden")}
function update(){const b=$("#accountBtn");b.classList.toggle("hidden",!logged());b.textContent=logged()?"Log out":"";if(logged()){b.title=user.email+" — Log out";b.onclick=async()=>{if(client)await client.auth.signOut();user=null;window.dispatchEvent(new CustomEvent("hymnauthchange",{detail:{user:null}}));update()}}}
async function readSaved(table){if(!client||!logged())return [];const {data,error}=await client.from(table).select("hymn_id").eq("user_id",user.id);if(error){console.warn("Failed to read "+table,error.message);return []}return (data||[]).map(x=>x.hymn_id)}
async function saveToggle(table,id,isAdding){
 if(!client||!logged())return false;
 const result=isAdding?await client.from(table).insert({user_id:user.id,hymn_id:id}):await client.from(table).delete().eq("user_id",user.id).eq("hymn_id",id);
 if(result.error){setMsg(result.error.message,true);throw Error(result.error.message)}
 return true
}
async function sync(){if(!logged())return;const [favorites,playlist]=await Promise.all([readSaved("favorites"),readSaved("playlist_items")]);window.dispatchEvent(new CustomEvent("hymnsavedloaded",{detail:{favorites,playlist}}))}
const auth={isLoggedIn:logged,requireLogin(callback){if(logged()){if(typeof callback==="function")callback();return true}open(callback);return false},saveToggle,open,ready:configured};
window.HymnAuth=auth;
$("#authClose").addEventListener("click",close);$("#authGuest").addEventListener("click",close);
$("#authOverlay").addEventListener("click",e=>{if(e.target.id==="authOverlay")close()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#authOverlay").classList.contains("hidden"))close()});
function selectTab(s){signUp=s;$("#authSignInTab").classList.toggle("selected",!s);$("#authSignUpTab").classList.toggle("selected",s);$("#authSubmit").textContent=s?"Create account":"Log in";$("#authPassword").autocomplete=s?"new-password":"current-password";setMsg(configured?"":"Supabase is not configured yet.",!configured)}
$("#authSignInTab").addEventListener("click",()=>selectTab(false));
$("#authSignUpTab").addEventListener("click",()=>selectTab(true));
$("#authForm").addEventListener("submit",async e=>{
e.preventDefault();
if(!configured){setMsg("Supabase setup is required before account creation or login can work.",true);return}
const email=$("#authEmail").value.trim(),password=$("#authPassword").value;
$("#authSubmit").disabled=true;setMsg("Connecting...");
try{
 const {data,error}=signUp?await client.auth.signUp({email,password}):await client.auth.signInWithPassword({email,password});
 if(error)throw error;
 if(signUp&&!data.session){setMsg("Check your email to confirm your account, then log in.");return}
 user=data.user||data.session?.user||null;update();await sync();const run=pending;close();if(typeof run==="function")run();
}catch(err){setMsg(err.message||"Unable to sign in.",true)}
finally{$("#authSubmit").disabled=false}
});
if(client){client.auth.getUser().then(({data,error})=>{if(!error&&data?.user){user=data.user;update();sync()}});client.auth.onAuthStateChange((event,session)=>{if(event==="SIGNED_OUT"){user=null;update();window.dispatchEvent(new CustomEvent("hymnauthchange",{detail:{user:null}}))}})}
update();
})();