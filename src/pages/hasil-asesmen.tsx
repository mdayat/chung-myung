import { AssessmentResultContent } from "@components/AssessmentResultContent";
import { AssessmentResultProfileCard } from "@components/AssessmentResultProfileCard";

const assessmentResultProfileData = {
  createdAt: "7 Juli 2024",
  materialName: "Bidang Ruang",
  assessmentType: "asesmen-kesiapan-belajar",
  nilai: 80,
  attempt: 3,
};
const assessmentResultContentData = {
  subtest1: {
    judulSubtest: "Bidang Ruang Part 3",
    jumlahSoal: 10,
    waktuPengerjaan: 20,
    soalSubtest: {
      1: {
        soal: "Objek dalam geometri dapat dikelompokkan sesuai dimensinya, ada yang berdimensi 0, 1, 2, dan 3. Dibawah ini manakah yang merupakan contoh dari objek geometri berdimensi 0?",
        options: {
          a: {
            title: "a. Sebuah garis lurus",
            isAnswer: false,
          },
          b: { title: "b. Sebuah titik", isAnswer: false },
          c: { title: "c. Sebuah bidang", isAnswer: true },
          d: { title: "d. Sebuah kurva", isAnswer: false },
          e: { title: "e. Sebuah ruang", isAnswer: false },
        },
        isTrue: false,
      },
      2: {
        soal: "Perhatikan pernyataan-pernyataan berikut ini! \n1. Memiliki titik puncak \n2. Memiliki sisi alas dan tutup \n3. Memiliki n+2 sisi \n4. Semua sisi tegak berbentuk segitiga \nBerdasarkan pernyataan di atas, ada berapa pernyataan yang benar mengenai prisma segi-n?",
        options: {
          a: {
            title: "a. 0",
            isAnswer: false,
          },
          b: { title: "b. 1", isAnswer: false },
          c: { title: "c. 2", isAnswer: true },
          d: { title: "d. 3", isAnswer: false },
          e: { title: "e. 4", isAnswer: false },
        },
        isTrue: false,
        pembahasan:
          "Dari opsi-opsi tersebut akan kita bedah: \n1. Memiliki titik puncak, adalah pernyataan yang salah mengenai prisma segi-n karena puncak prisma segi-n berbentuk segi-n tersebut maka dapat disimpulkan bahwa prisma segi-n tidak memiliki titik puncak \n2. Memiliki sisi alas dan tutup, adalah pernyataan yang benar mengenai prisma segi-n karena pasti prisma segi-n memiliki sisi alas dan tutup yang mana sisi alas dan tutupnya sama besar berbentuk segi-n tersebut \n3. Memiliki n+2 sisi, adalah pernyataan yang benar karena n menyatakan sisi dari bangun tersebut, dan 2 adalah alas dan tutup bangun tersebut \n4. Semua sisi tegak berbentuk segitiga, adalah pernyataan yang salah mengenai prisma segi-n karena jika prisma segi-4 sisi tegaknya berbentuk segi-4 juga \nJadi, pernyataan yang benar mengenai prisma segi-n ada 2 pernyataan (d).",
      },
      3: {
        soal: "Perhatikan gambar berikut! \nDari gambar di atas, pernyataan yang salah adalah…",
        options: {
          a: {
            title: "a. r dan t tegak lurus",
            isAnswer: false,
          },
          b: { title: "b. Memiliki 2 sudut", isAnswer: true },
          c: { title: "c. Memiliki 2 sisi", isAnswer: false },
          d: { title: "d. s² = r² + t²", isAnswer: false },
        },
        isTrue: true,
        pembahasan:
          'Sebuah kerucut memiliki dua sisi yang signifikan: alasnya yang berbentuk lingkaran dan bidang lengkungnya yang membentuk kerucut. Sudut-sudut dalam kerucut memang ada, tetapi mereka bukan karakteristik utama dari bentuk tersebut. \r\nKerucut memiliki satu sudut di verteksnya, yang dapat dianggap sebagai sudut tumpul. Namun, jika kita berbicara tentang sudut sebagai properti geometris yang ditemui pada bentuk 2D, seperti segitiga, maka pernyataan ini tidak tepat. Kerucut memiliki tepat satu sudut tumpul yang terletak di verteksnya. \r\nDengan demikian, pernyataan yang salah adalah "Memiliki 2 sudut," karena kerucut hanya memiliki satu sudut tumpul di verteksnya.',
      },
    },
  },
  subtest2: {
    judulSubtest: "Bidang Ruang Part 3",
    jumlahSoal: 10,
    waktuPengerjaan: 20,
    soalSubtest: {
      1: {
        soal: "Perhatikan gambar berikut! \rMelalui titik A dan B dapat dibuat satu garis, yaitu garis g. Pada garis g terdapat ruas garis AB. Jarak titik A dan B ditunjukkan oleh ruas garis AB tersebut. \r\nBerdasarkan ilustrasi tersebut, definisi jarak antara dua titik adalah…",
        options: {
          a: {
            title: "a. Lintasan terpendek yang menghubungkan dua titik",
            isAnswer: false,
          },
          b: {
            title: "b. Garis yang melalui salah satu titik",
            isAnswer: false,
          },
          c: {
            title: "c. Lintasan terpanjang yang menghubungkan dua titik",
            isAnswer: false,
          },
          d: {
            title: "d. Garis tak berujung yang memuat dua titik",
            isAnswer: true,
          },
          e: {
            title: "e. Lintasan yang dibentuk oleh sebuah titik",
            isAnswer: false,
          },
        },
        isTrue: false,
      },
      2: {
        soal: "Manakah garis yang dapat digunakan untuk mencari jarak antara titik H dan garis EC?",
        options: {
          a: {
            title: "a. EH",
            isAnswer: false,
          },
          b: { title: "b. HP", isAnswer: true },
          c: { title: "c. HQ", isAnswer: false },
          d: { title: "d. CH", isAnswer: false },
          e: { title: "e. GH", isAnswer: false },
        },
        isTrue: true,
        pembahasan:
          "Untuk menentukan garis yang tepat untuk mencari jarak antara titik H dan garis EC, kita perlu memperhatikan sifat-sifat garis pada kubus ABCDEFG. Garis yang tepat adalah garis HP.\nPertama, kita perhatikan posisi titik H dan garis EC. Titik H berada di bidang yang sejajar dengan bidang ABFE, sedangkan garis EC adalah diagonal bidang ABFE. Garis HP berada tegak lurus dengan bidang ABFE pada titik H, sehingga garis HP merupakan garis yang paling tepat untuk mencari jarak antara titik H dan garis EC.\nSelain itu, garis HP membentuk sudut siku-siku dengan bidang ABFE, sehingga garis HP merupakan garis yang tegak lurus dengan bidang EC, yang mana merupakan garis yang tepat untuk mencari jarak antara titik H dan garis EC.\nDengan demikian, garis HP adalah garis yang tepat untuk mencari jarak antara titik H dan garis EC..",
      },
    },
  },
};

export default function HasilAsesmen() {
  console.log(assessmentResultContentData);
  console.log(assessmentResultProfileData);
  return (
    <>
      <AssessmentResultProfileCard />
      <AssessmentResultContent />
    </>
  );
}
