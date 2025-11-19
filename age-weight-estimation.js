// -----------------------------
// ربط زر اختيار الصورة بحقل الملف
// -----------------------------
const selectBtn = document.getElementById("selectBtn");
const fileInput = document.getElementById("fileInput");
const previewArea = document.getElementById("previewArea");
const previewImage = document.getElementById("previewImage");

// عند الضغط على الزر، يفتح نافذة اختيار الصورة
selectBtn.addEventListener("click", () => {
  fileInput.click();
});

// عند تغيير الملف (اختيار صورة)، عرض المعاينة وتحليل الصورة
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // عرض المعاينة
  const reader = new FileReader();
  reader.onload = function (event) {
    previewImage.src = event.target.result;
    previewArea.style.display = "block";
  };
  reader.readAsDataURL(file);

  // تحليل الصورة محليًا
  analyzeImageLocally(file);
});

// -----------------------------
// دالة تحليل الصورة محليًا (تقديري)
async function analyzeImageLocally(file) {
  try {
    // تحويل الصورة إلى Canvas لتحليل الحجم
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // تقدير الوزن بناءً على حجم الصورة (تقريبية)
      const weight = ((width * height) / 100000).toFixed(1); // كغ

      // تقدير العمر بناءً على حجم الصورة (تقريبية)
      const ageWeeks = Math.min(12, Math.max(1, Math.floor((width + height) / 200)));
      
      // تقدير السلالة بشكل عشوائي من قائمة
      const breeds = ["أردني", "إيرلندي", "هولندي", "فرنسي", "هجين"];
      const breed = breeds[Math.floor(Math.random() * breeds.length)];

      // عرض النتائج في HTML
      document.getElementById("breedBadge").innerText = breed;
      document.getElementById("ageBadge").innerText = ageWeeks + " أسابيع";
      document.getElementById("weightBadge").innerText = weight + " كغ";
      document.getElementById("ageDetailsContent").innerText =
        `العمر التقديري محسوب بناءً على حجم الصورة (${width}x${height})`;

      // إظهار قسم النتائج
      document.getElementById("resultsSection").style.display = "block";
    };
  } catch (error) {
    console.error("Error:", error);
    alert("حدث خطأ أثناء التحليل، حاول مرة أخرى.");
  }
}

// -----------------------------
// زر إعادة التحليل
// -----------------------------
const newAnalysisBtn = document.getElementById("newAnalysisBtn");
if (newAnalysisBtn) {
  newAnalysisBtn.addEventListener("click", () => {
    fileInput.value = ""; // إعادة تعيين حقل الصورة
    previewArea.style.display = "none"; // إخفاء المعاينة
    document.getElementById("resultsSection").style.display = "none"; // إخفاء النتائج
  });
}
