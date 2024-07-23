import { AssessmentResultContent } from "@components/AssessmentResultContent";
import { AssessmentResultProfileCard } from "@components/AssessmentResultProfileCard";

export const typeAssessment = {
  kesiapanBelajar: "Asesmen \nKesiapan Belajar",
  akhir: "Asesmen Akhir",
} as const;

const assessmentResultProfileData = {
  createdAt: "7 Juli 2024",
  materialName: "Bidang Ruang",
  assessmentType: typeAssessment.kesiapanBelajar,
  nilai: 100,
  attempt: 1,
};
const assessmentResultContentData = [
  {
    judulSubtest: "Bidang Ruang Part 3",
    jumlahSoal: 10,
    waktuPengerjaan: 20,
    soalSubtest: [
      {
        soal: "Objek dalam geometri dapat dikelompokkan sesuai dimensinya, ada yang berdimensi 0, 1, 2, dan 3. Dibawah ini manakah yang merupakan contoh dari objek geometri berdimensi 0?",
        options: [
          {
            title: "a. Sebuah garis lurus",
            isAnswer: false,
          },
          { title: "b. Sebuah titik", isAnswer: false },
          { title: "c. Sebuah bidang", isAnswer: true },
          { title: "d. Sebuah kurva", isAnswer: false },
          { title: "e. Sebuah ruang", isAnswer: false },
        ],
        isTrue: false,
      },
      {
        soal: "Perhatikan pernyataan-pernyataan berikut ini! \n1. Memiliki titik puncak \n2. Memiliki sisi alas dan tutup \n3. Memiliki n+2 sisi \n4. Semua sisi tegak berbentuk segitiga \nBerdasarkan pernyataan di atas, ada berapa pernyataan yang benar mengenai prisma segi-n?",
        options: [
          {
            title: "a. 0",
            isAnswer: false,
          },
          { title: "b. 1", isAnswer: false },
          { title: "c. 2", isAnswer: true },
          { title: "d. 3", isAnswer: false },
          { title: "e. 4", isAnswer: false },
        ],
        isTrue: true,
        pembahasan:
          "Dari opsi-opsi tersebut akan kita bedah: \n1. Memiliki titik puncak, adalah pernyataan yang salah mengenai prisma segi-n karena puncak prisma segi-n berbentuk segi-n tersebut maka dapat disimpulkan bahwa prisma segi-n tidak memiliki titik puncak \n2. Memiliki sisi alas dan tutup, adalah pernyataan yang benar mengenai prisma segi-n karena pasti prisma segi-n memiliki sisi alas dan tutup yang mana sisi alas dan tutupnya sama besar berbentuk segi-n tersebut \n3. Memiliki n+2 sisi, adalah pernyataan yang benar karena n menyatakan sisi dari bangun tersebut, dan 2 adalah alas dan tutup bangun tersebut \n4. Semua sisi tegak berbentuk segitiga, adalah pernyataan yang salah mengenai prisma segi-n karena jika prisma segi-4 sisi tegaknya berbentuk segi-4 juga \nJadi, pernyataan yang benar mengenai prisma segi-n ada 2 pernyataan (d).",
      },
      {
        soal: "Perhatikan gambar berikut! \nDari gambar di atas, pernyataan yang salah adalah…",
        options: [
          {
            title: "a. r dan t tegak lurus",
            isAnswer: false,
          },
          { title: "b. Memiliki 2 sudut", isAnswer: true },
          { title: "c. Memiliki 2 sisi", isAnswer: false },
          { title: "d. s² = r² + t²", isAnswer: false },
        ],
        isTrue: true,
        pembahasan:
          'Sebuah kerucut memiliki dua sisi yang signifikan: alasnya yang berbentuk lingkaran dan bidang lengkungnya yang membentuk kerucut. Sudut-sudut dalam kerucut memang ada, tetapi mereka bukan karakteristik utama dari bentuk tersebut. \r\nKerucut memiliki satu sudut di verteksnya, yang dapat dianggap sebagai sudut tumpul. Namun, jika kita berbicara tentang sudut sebagai properti geometris yang ditemui pada bentuk 2D, seperti segitiga, maka pernyataan ini tidak tepat. Kerucut memiliki tepat satu sudut tumpul yang terletak di verteksnya. \r\nDengan demikian, pernyataan yang salah adalah "Memiliki 2 sudut," karena kerucut hanya memiliki satu sudut tumpul di verteksnya.',
      },
    ],
  },
  {
    judulSubtest: "Bidang Ruang Part 3",
    jumlahSoal: 10,
    waktuPengerjaan: 20,
    soalSubtest: [
      {
        soal: "Perhatikan gambar berikut! \rMelalui titik A dan B dapat dibuat satu garis, yaitu garis g. Pada garis g terdapat ruas garis AB. Jarak titik A dan B ditunjukkan oleh ruas garis AB tersebut. \r\nBerdasarkan ilustrasi tersebut, definisi jarak antara dua titik adalah…",
        options: [
          {
            title: "a. Lintasan terpendek yang menghubungkan dua titik",
            isAnswer: false,
          },
          {
            title: "b. Garis yang melalui salah satu titik",
            isAnswer: false,
          },
          {
            title: "c. Lintasan terpanjang yang menghubungkan dua titik",
            isAnswer: false,
          },
          {
            title: "d. Garis tak berujung yang memuat dua titik",
            isAnswer: true,
          },
          {
            title: "e. Lintasan yang dibentuk oleh sebuah titik",
            isAnswer: false,
          },
        ],
        isTrue: false,
      },
      {
        soal: "Manakah garis yang dapat digunakan untuk mencari jarak antara titik H dan garis EC?",
        options: [
          {
            title: "a. EH",
            isAnswer: false,
          },
          { title: "b. HP", isAnswer: true },
          { title: "c. HQ", isAnswer: false },
          { title: "d. CH", isAnswer: false },
          { title: "e. GH", isAnswer: false },
        ],
        isTrue: true,
        pembahasan:
          "Untuk menentukan garis yang tepat untuk mencari jarak antara titik H dan garis EC, kita perlu memperhatikan sifat-sifat garis pada kubus ABCDEFG. Garis yang tepat adalah garis HP.\nPertama, kita perhatikan posisi titik H dan garis EC. Titik H berada di bidang yang sejajar dengan bidang ABFE, sedangkan garis EC adalah diagonal bidang ABFE. Garis HP berada tegak lurus dengan bidang ABFE pada titik H, sehingga garis HP merupakan garis yang paling tepat untuk mencari jarak antara titik H dan garis EC.\nSelain itu, garis HP membentuk sudut siku-siku dengan bidang ABFE, sehingga garis HP merupakan garis yang tegak lurus dengan bidang EC, yang mana merupakan garis yang tepat untuk mencari jarak antara titik H dan garis EC.\nDengan demikian, garis HP adalah garis yang tepat untuk mencari jarak antara titik H dan garis EC..",
      },
    ],
  },
];

export default function HasilAsesmen() {
  return (
    <main className='min-h-screen w-full'>
      <div className='gap-6 bg-secondary-100 px-6 pt-[88px]'>
        <div className='fixed'>
          <AssessmentResultProfileCard
            createdAt={assessmentResultProfileData.createdAt}
            materialName={assessmentResultProfileData.materialName}
            assessmentType={assessmentResultProfileData.assessmentType}
            nilai={assessmentResultProfileData.nilai}
            attempt={assessmentResultProfileData.attempt}
          />
        </div>
        <div className='ml-[448px] max-w-[1366px]'>
          <AssessmentResultContent data={assessmentResultContentData} />
        </div>
      </div>
    </main>
  );
}
