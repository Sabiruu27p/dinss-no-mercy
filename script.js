// Konfigurasi publik Supabase. Publishable key memang boleh dipakai di browser.
// Keamanan perubahan data tetap dijaga oleh RLS di Supabase.
const SUPABASE_URL = "https://qysosxigmhowkixfgnbl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_07uDY6VmHmZCz7qY928caw_PN68h_4c";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const message = "Halo DINSS NO MERCY, saya ingin bertanya tentang layanan.";

function setWhatsAppLinks(number) {
  const valid = /^62\d{8,15}$/.test(String(number || "").replace(/\D/g, ""));
  document.querySelectorAll(".wa-link").forEach((link) => {
    if (!valid) {
      link.href = "#contact";
      link.onclick = (event) => {
        event.preventDefault();
        alert("Nomor WhatsApp belum diatur. Silakan hubungi admin website.");
      };
      return;
    }
    const clean = String(number).replace(/\D/g, "");
    link.href = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.onclick = null;
  });
}

async function loadWhatsAppNumber() {
  const { data, error } = await db
    .from("site_settings")
    .select("whatsapp_number")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Gagal membaca pengaturan WhatsApp:", error.message);
    setWhatsAppLinks("");
    return;
  }
  setWhatsAppLinks(data?.whatsapp_number || "");
}

const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
loadWhatsAppNumber();
