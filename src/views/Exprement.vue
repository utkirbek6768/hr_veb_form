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
      </div>
      <div class="imgInputControl">
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
      <button @click="mergeImages" style="display: none">
        Birlashtirish / <span>{{ images.length }}</span>
      </button>
      <canvas
        style="object-fit: cover"
        ref="canvas"
        width="400"
        height="300"
      ></canvas>
    </div>
  </div>
  <div>
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
import { ref, watch } from "vue";
import axios from "axios";
const tg = window.Telegram.WebApp;
const BOT_TOKEN = "7050630309:AAEqP-6OzBc5Tc-b5AiY_EI3j_lpeb8SRWY";
const CHAT_ID = "177482674"; // utkir 1

const canvas = ref(null);
const images = ref([]);
const hide = ref(true);

const myForm = ref({
  carType: "",
  yearManufacture: "",
  distanceTraveled: "",
  transmissionType: "",
  technicalCondition: "",
  carColor: "",
  fuelType: "",
  price: "",
  exchange: "",
  telephone: "",
  address: "",
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
};

const placeInChannel = (canvasData) => {
  try {
    canvasData.value.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("photo", blob, "merged_image.png");
      formData.append(
        "caption",
        `📩 Yangi elon mavjud

🚘 Mashina turi: ${carType}
🎨 Rangi: ${carColor}
📆 Ishlab chiqarilgan yili: ${yearManufacture}
📟 Yurgan masofasi: ${distanceTraveled}
🕹 Uzatma turi: ${transmissionType}
🛠 Texnik holati (kraskasi): ${technicalCondition}
⛽️ Yoqilg'i turi: ${fuelType}

💰 Narxi: ${price}

♻️ Almashish kelishuvi: ${exchange}
📞 Telefon: ${telephone}
🏡 Manzil: ${Address}
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
        console.log("Photo sent successfully:", res.data);
      } catch (error) {
        console.error("Error sending picture:", error);
      }
    }, "image/png");
  } catch (error) {
    console.log(error);
  }
};
watch(images, (newValue) => {
  if (newValue.length >= 4) {
    mergeImages();
    hide.value = false;
  } else {
    hide.value = true;
  }
});
watch(myForm, (newForm) => {
  const {} = newForm.value;
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
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
});
</script>

<style scoped>
.hide {
  display: none;
}
.canvas_wrapper {
  text-align: center;
}

.imgInputControl {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  object-fit: cover;
}

.imgInputControl .a1,
.a2,
.a3,
.a4 {
  width: 50%;
  height: 100%;
}
.a1 img,
.a2 img,
.a3 img,
.a4 img {
  width: 100%;
  height: 100%;
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
