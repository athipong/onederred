// ✅ Firebase config → ใส่ของแป๊บจาก Firebase Console
const firebaseConfig = {
  apiKey: "PAEP-APIKEY-HERE",
  authDomain: "YOURAPP.firebaseapp.com",
  projectId: "YOURAPP",
};

// ✅ Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ เพิ่มข้อมูล
function addExpense() {
  const amount = parseInt(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!amount || !category) return alert("กรุณากรอกให้ครบ");

  db.collection("expenses").add({
    amount,
    category,
    date: new Date().toISOString()
  }).then(() => {
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    loadExpenses();
  });
}

// ✅ โหลดข้อมูลล่าสุด
function loadExpenses() {
  db.collection("expenses")
    .orderBy("date", "desc")
    .limit(10)
    .get()
    .then(snapshot => {
      const list = document.getElementById("expenseList");
      list.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        list.innerHTML += `
          <div class="record">
            <strong>${data.amount}฿</strong> - ${data.category}<br/>
            <small>${new Date(data.date).toLocaleString()}</small>
          </div>
        `;
      });
    });
}

// ✅ โหลดเมื่อเปิดหน้า
window.onload = loadExpenses;
