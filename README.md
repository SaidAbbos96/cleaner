# Page Cleaner Chrome Kengaytmasi

UzTeachers.Academy tomonidan yaratilgan ushbu Chrome kengaytmasi veb-sahifalardagi keraksiz HTML elementlarni (masalan, reklamalar) olib tashlaydi.

## O'rnatish

1. Chrome brauzerini oching va `chrome://extensions` manziliga o'ting
2. Yuqori o'ng burchakdaki "Developer mode" (Dasturchi rejimi) ni yoqing
3. "Load unpacked" (Yuklash) tugmasini bosing va ushbu papkani tanlang
4. Kengaytma o'rnatiladi va faollashadi

## Sozlash

### Mahalliy konfiguratsiya
Qaysi elementlarni olib tashlash kerakligini sozlash uchun `config.js` faylini tahrirlang.

### Masofaviy konfiguratsiya
Kengaytma masofaviy konfiguratsiyani serverdan yuklash imkonini beradi:

1. Fon skriptida (`background.js`) `REMOTE_CONFIG_URL` o'zgaruvchisini o'z serveringiz manziliga o'zgartiring
2. Yoki kengaytmani sozlash orqali masofaviy konfiguratsiya URL manzilini kiriting
3. Masofaviy konfiguratsiya JSON formatida bo'lishi kerak ([sample-remote-config.json](sample-remote-config.json) fayliga qarang)

Masofaviy konfiguratsiya mahalliy konfiguratsiyaga qaraganda ustunlik qiladi, lekin agar masofaviy konfiguratsiyani yuklab bo'lmasa, kengaytma avtomatik ravishda mahalliy konfiguratsiyaga qaytadi.

## Qo'llab-quvvatlash

Telegram kanalimiz: [UzTeachers.Academy](https://t.me/UzTeachersAcademy)