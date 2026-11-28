### Proyek Kuliner Nusantara di Jakarta versi *Next.js* 

## Tentang "run" website
- Lakukan ```git clone https://github.com/Frontend-Kelompok5-KelasA/Frontend-Programming-Kel5``` pada terminal anda
- jalankan...
```cd Frontend-Programming-Kel5```

```cd UAS_Kuliner_Nusantara```

```cd nextjs```

untuk masuk pada direktori tujuan website

- jalankan perintah ```npm run dev``` untuk menjalankan website, perintah ini dapat sekaligus menginstall depedencies yang dibutuhkan web ini
## Tentang akun *"register/sign in"*
- Jika dilakukan register, maka role anda akan tersimpan sebagai user
- Login dengan role *admin* dapat melihat email pada folder ```data/users.json``` dan password berupa "Admin123"
- Login dengan role "restaurant", email juga dapat dilihat juga pada ```data/users.json```, setiap restoran memiliki password "resto123". Jika ingin login menggunakan restoran lain, maka buatlah urutan baru seperti berikut:
```{
    "userId": [sesuaikan dengan anggka setelah userId terakhir],
    "email": "[nama resto yang ada di daftar data.json lower case tanpa spasi]@resto.com",
    "username": "resto",
    "password": "$2b$12$wCLBO1SSj2X/LMlWikNlTeb9dhIo6QkYziMJF340uZI3LVWQKSmvu",
    "role": "restaurant",
    "profile": "",
    "createdAt": "2026-11-28 10:10:00"
  }
```
Lalu, pada file ```data.json```, nama restoran yang dituju tambahkan variabel berikut:
```
"user_id": 3, --> sesuaikan dengan userId pada file users.json (angka 3 berupa contoh)
```
