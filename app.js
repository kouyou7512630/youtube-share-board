import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ■ パスワード保護
window.onload = function(){
  const password = "54315"; // 任意のパスワード
  const userPass = prompt("サイト閲覧にはパスワードが必要です:");
  if(userPass !== password){
    alert("パスワードが間違っています。サイトを閉じます。");
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:50px;color:red;'>パスワードが違います</h2>";
    return;
  }
}

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBONAWg79Un6Tag0vPP0PB0UiqJLL6KvtM",
  authDomain: "shareboard-ee031.firebaseapp.com",
  projectId: "shareboard-ee031",
  storageBucket: "shareboard-ee031.firebasestorage.app",
  messagingSenderId: "972674645025",
  appId: "1:972674645025:web:468e8a52a964e4a53e3760"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const videosRef = collection(db,"videos");

let currentDate = null;

// 投稿
window.addVideo = async function(){
const url = document.getElementById("url").value;
const comment = document.getElementById("comment").value;
const date = document.getElementById("date").value;
if(!url || !date){alert("日付とURLを入力してください"); return;}
await addDoc(videosRef,{url, comment, date});
document.getElementById("url").value="";
document.getElementById("comment").value="";
}

// コメント編集
window.editComment = function(id){
const commentDiv = document.getElementById("comment-"+id);
const text = commentDiv.innerText;
commentDiv.innerHTML = `<input type="text" id="editInput-${id}" value="${text}">
<button class="save" onclick="saveComment('${id}')">保存</button>`;
}

window.saveComment = async function(id){
const input = document.getElementById("editInput-"+id);
await updateDoc(doc(db,"videos",id), {comment: input.value});
}

// 削除
window.deleteVideo = async function(id){
await deleteDoc(doc(db,"videos",id));
}

// カレンダー表示
function renderCalendar(snapshot){
const calendarDiv = document.getElementById("calendar");
calendarDiv.innerHTML="";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const daysInMonth = new Date(year, month+1, 0).getDate();

for(let d=1; d<=daysInMonth; d++){
const dayDiv = document.createElement("div");
dayDiv.className="calendar-day";
const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
dayDiv.innerText=d;

// 動画がある日を強調
snapshot.forEach(doc=>{
if(doc.data().date===dateStr){ dayDiv.classList.add("hasVideo"); }
});

dayDiv.onclick=()=>{
currentDate=dateStr;
renderVideos(snapshot);
highlightCalendarDay(dateStr);
};
calendarDiv.appendChild(dayDiv);
}
}

// カレンダー選択日強調
function highlightCalendarDay(dateStr){
const days = document.querySelectorAll(".calendar-day");
days.forEach(day=>{
if(day.innerText==parseInt(dateStr.split('-')[2])){day.classList.add("active");}
else{day.classList.remove("active");}
});
}

// 動画一覧表示
function renderVideos(snapshot){
const list=document.getElementById("videoList");
list.innerHTML="";
snapshot.forEach(docSnap=>{
const data=docSnap.data();
const id=docSnap.id;
if(currentDate && data.date!==currentDate) return;

const div=document.createElement("div");
div.className="videoCard";

div.innerHTML=`
<div class="videoInfo">
<strong>📅 ${data.date}</strong>
<div class="url">${data.url}</div>
<div class="comment" id="comment-${id}">${data.comment || ""}</div>
</div>
<div>
<button class="edit" onclick="editComment('${id}')">編集</button>
<button class="delete" onclick="deleteVideo('${id}')">削除</button>
</div>
`;

list.appendChild(div);
});
}

// Firestoreリアルタイム同期
onSnapshot(videosRef,(snapshot)=>{
renderCalendar(snapshot);
renderVideos(snapshot);
});

/*const firebaseConfig = {
  apiKey: "AIzaSyBONAWg79Un6Tag0vPP0PB0UiqJLL6KvtM",
  authDomain: "shareboard-ee031.firebaseapp.com",
  projectId: "shareboard-ee031",
  storageBucket: "shareboard-ee031.firebasestorage.app",
  messagingSenderId: "972674645025",
  appId: "1:972674645025:web:468e8a52a964e4a53e3760"
};*/
