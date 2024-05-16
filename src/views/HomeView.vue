<template>
  <div class="wrapper">
    <div class="avtar_controller">
      <h1>Form title</h1>
      <div class="avatar">
        <img class="image" v-if="fileURL !== ''" :src="fileURL" alt="" />
        <label v-else class="imageLabel" for="image"
          ><img
            class="image"
            src="https://t4.ftcdn.net/jpg/05/69/90/73/360_F_569907313_fl7W3gX7YIVw2r05B4Ij1c21ix4xRUqD.jpg"
            alt="Default avatar image"
        /></label>
      </div>
      <input
        style="display: none"
        type="file"
        id="image"
        @change="handleFileUpload"
      />
    </div>
    <form @submit.prevent :model="myForm">
      <label for="fullName">F.I.O</label>
      <input
        type="text"
        id="fullName"
        placeholder="Isim sharifingizni kiriting"
        v-model="myForm.fullName"
      />

      <label for="age">Yosh:</label>
      <input
        v-maska
        data-maska="##"
        type="number"
        id="age"
        placeholder="Yoshingizni kiriting"
        v-model="myForm.age"
      />

      <label for="phone">Telefon:</label>
      <input
        type="tel"
        id="phone"
        v-model="myForm.phone"
        v-maska
        data-maska="+998 ## ### ## ##"
        placeholder="Telefon raqamingizni kiriting"
      />

      <label for="address">Manzil:</label>
      <input
        type="text"
        name="address"
        id="address"
        placeholder="Manzilingizni batafsil kiriting"
        v-model="myForm.address"
      />

      <label for="whereDidYouStudy">O'quv dargohlari:</label>
      <textarea
        name="whereDidYouStudy"
        id="whereDidYouStudy"
        placeholder="O'zingiz tamomlagan o'quv dargohilarini nomi va o'qishni tamomlagan yillaringizni kiriting"
        v-model="myForm.whereDidYouStudy"
      ></textarea>

      <label for="whereDidYouWork">Mehnat faoliyat:</label>
      <textarea
        name="whereDidYouWork"
        id="whereDidYouWork"
        placeholder="Ish tajribangiz bormi agar bo'lsa ishlagan korhonangiz nomi ish yillari va lavozimingizni kiriting"
        v-model="myForm.whereDidYouWork"
      ></textarea>

      <label for="for">Vakansiyani tanlang:</label>
      <select
        v-model="myForm.vacancy"
        name="for"
        id="for"
        class="select"
        placeholder="Qaysi sohada ishlamoqchisiz tanlang"
      >
        <option value="taxi">Royal Taxi</option>
        <option value="farm">Aptekalar tarmog'i (farmaseftika)</option>
      </select>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, watchEffect } from "vue";
import { vMaska } from "maska";
const tg = window.Telegram.WebApp;
const BOT_TOKEN = "7050630309:AAEqP-6OzBc5Tc-b5AiY_EI3j_lpeb8SRWY";
// const CHAT_ID = "7181292313"; // utkir 3
const CHAT_ID = "177482674"; // utkir 1

const file = ref("");
const fileURL = ref("");
const myForm = ref({
  fullName: "",
  age: "",
  address: "",
  whereDidYouStudy: "",
  whereDidYouWork: "",
  phone: "+998 ",
  photo: "",
  academicDegree: "",
  studyOrWork: "",
  documentPath: "",
  status: "",
  vacancy: "",
  chatId: "",
});

const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    file.value = selectedFile;
    fileURL.value = e.target.result;
  };
  reader.readAsDataURL(selectedFile);
};

const sendPicture = async () => {
  const {
    fullName,
    age,
    address,
    phone,
    vacancy,
    whereDidYouStudy,
    whereDidYouWork,
  } = myForm.value;
  const cleanPhone = phone.toString().replace(/[\s]/g, "");
  if (file.value === "") {
    alert("Error");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file.value);
  formData.append(
    "caption",
    `📩 Yangi nomzod mavjud

🔠Ismi: ${fullName}

🔢Yoshi: ${age} da

📍Manzili: ${address}

☎️Telefon: ${cleanPhone}

🎓Tugallagan o'quv dargohlari: ${whereDidYouStudy}

🏢Ishlagan joylari va malakasi: ${whereDidYouWork}

✅Ushbu vacansiya uchun: ${vacancy}
  `
  );

  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto?chat_id=${CHAT_ID}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = {
      result: res.data.result,
      myForm: myForm.value,
    };
    tg.sendData(JSON.stringify(data));
  } catch (error) {
    console.error("Error sending picture:", error);
  } finally {
    tg.close();
  }
};

const showButton = () => {
  try {
    const { fullName, age, address, phone, vacancy } = myForm.value;
    if (fullName && age && address && phone && vacancy && file.value) {
      tg.MainButton.show();
      sendPicture();
    } else {
      tg.MainButton.hide();
    }
  } catch (error) {
    console.log(error);
  }
};

watchEffect(() => {
  showButton();
  tg.MainButton.setParams({
    text: "Tayyor",
  });
  tg.expand();
  tg.ready();
  tg.onEvent("mainButtonClicked", sendPicture);
});
</script>

<style>
.avtar_controller {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 20px;
}
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}
.imageLabel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
}
.avatar {
  display: block;
  object-fit: cover;
  width: 100px;
  height: 100px;
}
</style>
