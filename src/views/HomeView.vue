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
      <label for="fullName">Full name</label>
      <input type="text" id="fullName" v-model="myForm.fullName" />
      <label for="age">Age</label>
      <input type="number" id="age" v-model="myForm.age" />
      <label for="phoneNumber">Phone number</label>
      <input
        type="tel"
        id="phoneNumber"
        v-model="myForm.phoneNumber"
        v-maska
        data-maska="+998 ## ### ## ##"
      />
      <label for="address">address</label>
      <textarea name="address" id="address" v-model="myForm.address"></textarea>
      <label for="whereDidYouStudy">whereDidYouStudy</label>
      <textarea
        name="whereDidYouStudy"
        id="whereDidYouStudy"
        v-model="myForm.whereDidYouStudy"
      ></textarea>
      <label for="whereDidYouWork">whereDidYouWork</label>
      <textarea
        name="whereDidYouWork"
        id="whereDidYouWork"
        v-model="myForm.whereDidYouWork"
      ></textarea>
      <label for="for">Qaysivacansiya uchun</label>
      <select
        v-model="myForm.vacancy"
        name="for"
        id="for"
        class="select"
        placeholder="Qaysi vakansiya uchunligini tanlang"
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
  if (file.value === "") {
    alert("Error");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file.value);
  formData.append(
    "caption",
    `	📩 Haydovchi malumotlari

  📍Ismi: ${myForm.fullName}

  📍Yoshi: ${myForm.age}

  📍Manzili: ${myForm.address}

  📍Telefon: ${myForm.phone}

  📍Tugallagan o'quv dargohlari: ${myForm.whereDidYouStudy}

  📍Ishlagan joylari va malakasi: ${myForm.whereDidYouWork}

  📍Ushbu vacansiya uchun: ${myForm.vacancy}
  `
  );
  formData.append(
    "reply_markup",
    JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "Qabul qilish",
            callback_data: JSON.stringify({
              com: "test",
              id: "testid",
            }),
          },
        ],
      ],
    })
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
    tg.sendData(JSON.stringify(res.data.result));
  } catch (error) {
    console.error("Error sending picture:", error);
  } finally {
    tg.close();
  }
};
const showButton = () => {
  const { fullName, age, address, phone, studyOrWork, vacancy } = myForm.value;
  if (
    fullName &&
    age &&
    address &&
    phone &&
    studyOrWork &&
    vacancy &&
    file.value
  ) {
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
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
