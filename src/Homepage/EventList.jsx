import React from "react";
import poster1 from '../assets/poster1.png';
import poster2 from '../assets/poster2.png';
import poster3 from '../assets/poster3.png';
import poster4 from '../assets/poster4.png';
import poster5 from '../assets/poster5.png';
import poster6 from '../assets/poster6.png';
import poster7 from '../assets/poster7.png';
import poster8 from '../assets/poster8.png';
import poster9 from '../assets/poster9.png';
import poster10 from '../assets/poster10.png';
import poster11 from '../assets/poster11.png';
import poster12 from '../assets/poster12.png';
import poster13 from '../assets/poster13.png';

import bg1 from '../assets/bg1.jpeg';
import bg2 from '../assets/bg2.jpg';
import bg3 from '../assets/bg3.jpg';
import bg4 from '../assets/bg4.jpg';
import bg5 from '../assets/bg5.jpg';
import bg6 from '../assets/bg6.jpg';
import bg7 from '../assets/bg7.jpeg';
import bg8 from '../assets/bg8.jpg';
import bg9 from '../assets/bg9.jpg';
import bg10 from '../assets/bg10.jpeg';
import bg11 from '../assets/bg11.jpeg';
import bg12 from '../assets/bg12.jpg';
import bg13 from '../assets/bg13.jpg';

const event_list = [
  {
    id: 1,
    title: "Festival Nasyid Interkolej",
    date_time: "28 Nov 2025 | 8.30 Malam - 11.00 Malam",
    isoDate: "2025-11-28T09:00:00.000Z",
    fulldescription: "Suara bergema, hati bersama. Siapakah Juara Nasyid tahun ini? Saksikan pertembungan vokal terbaik antara kolej.",
    shortdescription: "Suara bergema, hati bersama. Siapakah Juara Nasyid tahun ini? Saksikan..",
    poster: poster1,
    location: "Dewan Utama UPM",
    bg: bg1,
    align: "left",
    showInSlider: false,
  },
  {
    id: 2,
    title: "Rumah Seram",
    date_time: "28 Nov - 5 Dis 2025",
    isoDate: "2025-11-28T20:00:00.000Z",
    fulldescription: "Berani masuk? Rasai debaran di setiap sudut rumah seram kami! Takut, teruja, dan penuh misteri menanti!",
    shortdescription: "Berani masuk? Rasai debaran..",
    poster: poster2,
    location: "Perkarangan Canselori Putra",
    bg: bg2,
    align: "left",
    showInSlider: true,
  },
  {
    id: 3,
    title: "Pertandingan Boria Interkolej 2025",
    date_time: "29 Nov 2025 | 7.30 Malam - 11.00 Malam",
    isoDate: "2025-12-29T10:00:00.000Z",
    fulldescription: "Gelak tawa dan persembahan boria penuh warna menanti, tradisi lama diberi nafas baharu!",
    shortdescription: "Gelak tawa dan persembahan boria..",
    poster: poster3,
    location: "Dewan Utama UPM",
    bg: bg3,
    align: "left",
    showInSlider: false,
  },
  {
    id: 4,
    title: "Mobile Legend Match Day",
    date_time: "29&30 Nov 2025 | 9.00 Pagi - 4.00 Petang",
    isoDate: "2025-11-29T09:00:00.000Z",
    fulldescription: "Siapakah juara sebenar? Saksikan pertempuran sengit dalam perlawanan Mobile Legends!",
    shortdescription: "Siapakah juara sebenar? Saksikan..",
    poster: poster4,
    location: "Khemah Utama PESKON, UPM",
    bg: bg4,
    align: "right",
    showInSlider: true,
  },
  {
    id: 5,
    title: "Pertandingan Tarian Etnik Kreatif Interkolej",
    date_time: "30 Nov 2025 | 8.00 Malam - 12.00 Pagi",
    isoDate: "2025-11-30T08:00:00.000Z",
    fulldescription: "Setiap langkah membawa cerita, setiap persembahan menyatukan tradisi dan kreativiti dalam satu pentas yang penuh warna.",
    shortdescription: "Setiap langkah membawa cerita..",
    poster: poster5,
    location: "Khemah Utama PESKON",
    bg: bg5,
    align: "left",
    showInSlider: false,
  },
  {
    id: 6,
    title: "Pertandingan Tilawah Al-Quran",
    date_time: "1 Dis 2025 | 8.00 Malam - 11.00 Malam",
    isoDate: "2025-12-01T08:00:00.000Z",
    fulldescription: "Alunan ayat suci, hati tersentuh. Saksikan peserta bersaing dengan penuh tumpuan dan kesungguhan dalam tilawah Al-Quran",
    shortdescription: "Alunan ayat suci, hati tersentuh..",
    poster: poster6,
    location: "Pentas Utama PESKON, 2025",
    bg: bg6,
    align: "left",
    showInSlider: true,
  },
  {
    id: 7,
    title: "Pertandingan Mencanting Batik Alam",
    date_time: "1 Dis 2025 | 8.00 Pagi - 1.00 Petang",
    isoDate: "2025-12-02T09:00:00.000Z",
    fulldescription: "Setiap sapuan canting membawa cerita, setiap warna melakar keindahan semula jadi yang menginspirasi.",
    shortdescription: "Setiap sapuan canting membawa cerita..",
    poster: poster7,
    location: "Dewan Seni Budaya UPM",
    bg: bg7,
    align: "right",
    showInSlider: false,
  },
  {
    id: 8,
    title: "Pertandingan Gema Seni Dikir Barat Interkolej",
    date_time: "2 Dis 2025 | 8.00 Malam - 11.00 Malam",
    isoDate: "2025-12-02T10:00:00.000Z",
    fulldescription: "Saksikan kehebatan pasukan Dikir Barat dari seluruh kolej berentap!",
    shortdescription: "Saksikan kehebatan pasukan..",
    poster: poster8,
    location: "Dewan Utama UPM",
    bg: bg8,
    align: "left",
    showInSlider: false,
  },
  {
    id: 9,
    title: "Agriculture Innovation",
    date_time: "3 Dis 2025 | 7.00 Pagi - 2.00 Petang",
    isoDate: "2025-12-03T07:00:00.000Z",
    fulldescription: "Saksikan idea kreatif bertemu teknologi hijau. Siapakah yang bakal memenangi pertandingan inovasi pertanian?",
    shortdescription: "Saksikan idea kreatif bertemu teknologi..",
    poster: poster9,
    location: "PESKON Main Camp",
    bg: bg9,
    align: "right",
    showInSlider: true,
  },
  {
    id: 10,
    title: "MySTEM Putra Competition",
    date_time: "3 Dis 2025 | 9.00 Pagi - 4.30 Petang",
    isoDate: "2025-12-03T08:00:00.000Z",
    fulldescription: "Saksikan bagaimana idea kecil mencetus inovasi besar dalam MySTEM Putra Competition.",
    shortdescription: "Saksikan bagaimana idea kecil mencetus inovasi..",
    poster: poster10,
    location: "Pentas Utama PESKON, 2025",
    bg: bg10,
    align: "left",
    showInSlider: false,
  },
  {
    id: 11,
    title: "Putra Got Talent",
    date_time: "3 Dis 2025 | 8.00 Malam",
    isoDate: "2025-12-03T09:00:00.000Z",
    fulldescription: "Bakat luar biasa, pentas penuh kejutan! Dari suara emas ke aksi luar jangka, siapa bakal mencuri perhatian dan menawan hati juri?",
    shortdescription: "Bakat luar biasa, pentas penuh kejutan..",
    poster: poster11,
    location: "Dewan Utama UPM",
    bg: bg11,
    align: "right",
    showInSlider: false,
  },
  {
    id: 12,
    title: "Know 'N' Go Health Screening",
    date_time: "4 Dis 2025 | 7.00 Pagi - 5.00 Petang",
    isoDate: "2025-12-04T08:00:00.000Z",
    fulldescription: "Langkah kecil untuk perubahan besar. Dapatkan saringan kesihatan percuma dan ketahui status kesihatan anda.",
    shortdescription: "Langkah kecil untuk perubahan besar..",
    poster: poster12,
    location: "Perkarangan Fakulti Kesihatan",
    bg: bg12,
    align: "left",
    showInSlider: false,

  },
  {
    id: 13,
    title: "Makeup Battle X Mary Kay",
    date_time: "5 Dis 2025 | 9.00 Pagi",
    isoDate: "2025-12-05T20:00:00.000Z",
    fulldescription: "Siapakah bakal menawan semua mata? Saksikan sendiri!",
    shortdescription: "Siapakah bakal menawan semua mata?..",
    poster: poster13,
    location: "Khemah Utama PESKON, UPM",
    bg: bg13,
    align: "left",
    showInSlider: true,
  },
];

export default event_list;