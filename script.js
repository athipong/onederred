import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();
const db = getFirestore(app);

let currentUser = null;

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;
    document.getElementById("formSection").style.display = "block";
    loadTransactions();
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});

window.addTransaction = async function () {
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const note = document.getElementById("note").value;
  const date = new Date(document.getElementById("date").value);

  if (!amount || !type || !category || !date) return alert("กรุณากรอกข้อมูลให้ครบ");

  await addDoc(collection(db, "transactions"), {
    uid: currentUser.uid,
    type,
    amount,
    category,
    note,
    created_at: Timestamp.fromDate(date)
  });

  alert("บันทึกเรียบร้อย!");
  loadTransactions();
}

async function loadTransactions() {
  const q = query(collection(db, "transactions"), where("uid", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);

  const container = document.getElementById("records");
  container.innerHTML = "";

  let chartData = { labels: [], income: [], expense: [] };

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const d = data.created_at.toDate().toISOString().split("T")[0];
    container.innerHTML += `<div class="record">${d}: ${data.type === "income" ? '+' : '-'}${data.amount} (${data.category})</div>`;

    const i = chartData.labels.indexOf(d);
    if (i === -1) {
      chartData.labels.push(d);
      chartData.income.push(data.type === "income" ? data.amount : 0);
      chartData.expense.push(data.type === "expense" ? data.amount : 0);
    } else {
      if (data.type === "income") chartData.income[i] += data.amount;
      else chartData.expense[i] += data.amount;
    }
  });

  renderChart(chartData);
}

function renderChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'รายรับ',
          data: data.income,
          backgroundColor: 'green'
        },
        {
          label: 'รายจ่าย',
          data: data.expense,
          backgroundColor: 'red'
        }
      ]
    }
  });
}
