<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAuth, FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCKuK-XsRn1kpreS210wqP_uoiwUANQ5r8",
    authDomain: "tb-git.firebaseapp.com",
    projectId: "tb-git",
    storageBucket: "tb-git.appspot.com", // ❗ แก้ให้ถูกต้อง
    messagingSenderId: "311209997293",
    appId: "1:311209997293:web:90aaaea62c2a4f80d6ede4",
    measurementId: "G-FSSQZM86HR"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  // ✅ Facebook Auth
  const auth = getAuth();
  const provider = new FacebookAuthProvider();

  // ตัวอย่างการ login
  document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert("Logged in as: " + user.displayName);
    } catch (error) {
      console.error(error.message);
      alert("Login failed: " + error.message);
    }
  });
</script>
