<template>
  <div class="wrapper">
    <div :class="{ hide: !hide }" class="inputViewControl">
      <div class="imgInputControl">
        <div class="a1">
          <input
            id="imgInput1"
            type="file"
            @change="handleFiles"
            multiple
            style="display: none"
          />
          <img v-if="images.length > 0" :src="images[0]?.src" alt="" />
          <label v-else class="imageLabel" for="imgInput1">
            <img
              src="https://t4.ftcdn.net/jpg/05/69/90/73/360_F_569907313_fl7W3gX7YIVw2r05B4Ij1c21ix4xRUqD.jpg"
              alt="Default avatar image"
            />
          </label>
        </div>
        <div class="a2">
          <input
            id="imgInput2"
            type="file"
            @change="handleFiles"
            multiple
            style="display: none"
          />
          <img v-if="images.length > 1" :src="images[1]?.src" alt="" />
          <label v-else class="imageLabel" for="imgInput2">
            <img
              src="https://t4.ftcdn.net/jpg/05/69/90/73/360_F_569907313_fl7W3gX7YIVw2r05B4Ij1c21ix4xRUqD.jpg"
              alt="Default avatar image"
            />
          </label>
        </div>
        <div class="a3">
          <input
            id="imgInput3"
            type="file"
            @change="handleFiles"
            multiple
            style="display: none"
          />
          <img v-if="images.length > 2" :src="images[2]?.src" alt="" />
          <label v-else class="imageLabel" for="imgInput3">
            <img
              src="https://t4.ftcdn.net/jpg/05/69/90/73/360_F_569907313_fl7W3gX7YIVw2r05B4Ij1c21ix4xRUqD.jpg"
              alt="Default avatar image"
            />
          </label>
        </div>
        <div class="a4">
          <input
            id="imgInput4"
            type="file"
            @change="handleFiles"
            multiple
            style="display: none"
          />
          <img v-if="images.length > 3" :src="images[3]?.src" alt="" />
          <label v-else class="imageLabel" for="imgInput4">
            <img
              src="https://t4.ftcdn.net/jpg/05/69/90/73/360_F_569907313_fl7W3gX7YIVw2r05B4Ij1c21ix4xRUqD.jpg"
              alt="Default avatar image"
            />
          </label>
        </div>
      </div>
    </div>

    <div :class="{ hide: hide }">
      <button style="display: none" @click="mergeImages">
        Birlashtirish / <span>{{ images.length }}</span>
      </button>
      <canvas
        style="object-fit: cover; border-radius: 15px"
        ref="canvas"
        width="400"
        height="300"
      ></canvas>
    </div>
    <form @submit.prevent="placeInChannel">
      <label for="carType">Mashina turi</label>
      <input
        type="text"
        id="carType"
        placeholder="Mashina turini kiriting"
        v-model="myForm.carType"
      />
      <label for="carColor">Mashina rangi</label>
      <input
        type="text"
        id="carColor"
        placeholder="Mashina rangini kiriting"
        v-model="myForm.carColor"
      />
      <label for="fuelType">Yoqilg'i turi</label>
      <input
        type="text"
        id="fuelType"
        placeholder="Yoqilg'i turini kiriting"
        v-model="myForm.fuelType"
      />

      <label for="yearManufacture">Ishlabchiqarilgan yili:</label>
      <input
        type="number"
        id="yearManufacture"
        placeholder="Ishlab chiqarilgan yilini kiriting"
        v-model="myForm.yearManufacture"
      />
      <label for="distanceTraveled">Qancha masofa yurgani (km) da:</label>
      <input
        type="number"
        id="distanceTraveled"
        placeholder="Qancha masofa yurganini kiriting"
        v-model="myForm.distanceTraveled"
      />

      <label for="technicalCondition">Texnik holati:</label>
      <textarea
        name="technicalCondition"
        id="technicalCondition"
        placeholder="Texnik holati haqida batafsil yozin (bo'yoq necha foiz yoki toza)"
        v-model="myForm.technicalCondition"
      ></textarea>

      <label for="transmissionType">Uzatma turini tanlang:</label>
      <select
        v-model="myForm.transmissionType"
        name="transmissionType"
        id="transmissionType"
        class="select"
        placeholder="Mashinani uzatma turini tanlang"
      >
        <option value="mechanic">Mexanik uzatma</option>
        <option value="automatic">Avtomatik uzatma</option>
      </select>

      <label for="telephone">Telefon:</label>
      <input
        type="tel"
        id="telephone"
        v-model="myForm.telephone"
        v-maska
        data-maska="+998 ## ### ## ##"
        placeholder="Telefon raqamingizni kiriting"
      />

      <label for="exchange">Ayirboshlash:</label>
      <select
        v-model="myForm.exchange"
        name="exchange"
        id="exchange"
        class="select"
        placeholder="Mashinani ayirboshlaysizmi (obmen)"
      >
        <option value="no">Yo'q</option>
        <option value="yes">Ha</option>
      </select>

      <label for="price">Mashina narxi / $ da</label>
      <input
        type="number"
        id="price"
        placeholder="Mashina turini kiriting"
        v-model="myForm.price"
      />

      <label for="address">Manzil:</label>
      <input
        type="text"
        name="address"
        id="address"
        placeholder="Manzilingizni batafsil kiriting"
        v-model="myForm.address"
      />
      <label for="description">Qo'shimcha izoh:</label>
      <textarea
        name="description"
        id="description"
        placeholder="Buyerda izox kiritishingiz mumkin (izoh ixtiyoriy)"
        v-model="myForm.description"
      ></textarea>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";
import axios from "axios";
import { vMaska } from "maska";
const tg = window.Telegram.WebApp;
const BOT_TOKEN = "7050630309:AAEqP-6OzBc5Tc-b5AiY_EI3j_lpeb8SRWY";
const CHAT_ID = "177482674";

const canvas = ref(null);
const images = ref([]);
const hide = ref(true);
const canvasData = ref(null);

const test = ref(false);

const myForm = ref({
  carType: "",
  yearManufacture: "",
  distanceTraveled: "",
  transmissionType: "",
  technicalCondition: "",
  carColor: "",
  fuelType: "",
  price: "",
  exchange: "no",
  telephone: "+998 ",
  address: "",
  description: "",
});

const handleFiles = (event) => {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        images.value = [...images.value, { src: e.target.result }];
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(files[i]);
  }
};

const mergeImages = async () => {
  const ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  const width = canvas.value.width / 2;
  const height = canvas.value.height / 2;

  const loadImagePromises = images.value.map((img, index) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = img.src;
      image.onload = () => {
        const x = (index % 2) * width;
        const y = Math.floor(index / 2) * height;
        ctx.drawImage(image, x, y, width, height);
        resolve();
      };
    });
  });

  await Promise.all(loadImagePromises);
  canvasData.value = canvas.value.toDataURL("image/png");
};

const placeInChannel = async () => {
  try {
    const formData = new FormData();
    const blob = await (await fetch(canvasData)).blob();
    formData.append("photo", blob, "merged_image.png");
    formData.append(
      "caption",
      `📩 Yangi elon mavjud
  
🚘 Mashina turi: ${myForm.value.carType}
🎨 Rangi: ${myForm.value.carColor}
📆 Ishlab chiqarilgan yili: ${myForm.value.yearManufacture}
📟 Yurgan masofasi: ${myForm.value.distanceTraveled}
🕹 Uzatma turi: ${myForm.value.transmissionType}
⚙️ Texnik holati: ${myForm.value.technicalCondition}
⛽️ Yoqilgi turi: ${myForm.value.fuelType}
💰 Narxi: ${myForm.value.price}
🔄 Ayirboshlash: ${myForm.value.exchange}
☎️ Telefon: ${myForm.value.telephone}
📍 Manzil: ${myForm.value.address}
✏️ Izoh: ${myForm.value.description}`
    );

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
    const response = await axios.post(url, formData, {
      params: {
        chat_id: CHAT_ID,
      },
    });
    console.log(response.data);
  } catch (error) {
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage=test`,
      {
        params: {
          chat_id: CHAT_ID,
        },
      }
    );
    console.error("Error sending photo:", error);
  }
};

watch(images, (newValue) => {
  if (newValue.length >= 4) {
    hide.value = false;
    mergeImages();
  } else {
    hide.value = true;
  }
});

watch(
  myForm,
  (newMyForm) => {
    const {
      carType,
      yearManufacture,
      distanceTraveled,
      transmissionType,
      technicalCondition,
      carColor,
      fuelType,
      price,
      exchange,
      telephone,
      address,
    } = newMyForm;
    if (
      carType &&
      yearManufacture &&
      distanceTraveled &&
      transmissionType &&
      technicalCondition &&
      carColor &&
      fuelType &&
      price &&
      exchange &&
      telephone &&
      address
    ) {
      test.value = true;
      tg.MainButton.show();
    } else {
      test.value = false;
      tg.MainButton.hide();
    }
  },
  { deep: true }
);

watchEffect(() => {
  tg.MainButton.setParams({
    text: "Tayyor",
  });
  tg.expand();
  tg.ready();
  tg.onEvent("mainButtonClicked", placeInChannel);
});
</script>

<style>
.hide {
  display: none;
}

.imgInputControl {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  object-fit: cover;
}

.imgInputControl .a1,
.a2,
.a3,
.a4 {
  width: 25%;
  height: 100%;
  padding: 2px;
}
.a1 img,
.a2 img,
.a3 img,
.a4 img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.imageLabel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
