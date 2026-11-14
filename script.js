
// ======================================
// DINSS NO MERCY - WEBSITE SCRIPT
// ======================================

const SUPABASE_URL = "https://qysosxigmhowkixfgnbl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_07uDY6VmHmZCz7qY928caw_PN68h_4c";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const message = "Halo DINSS NO MERCY, saya ingin bertanya tentang layanan.";

// ======================================
// WHATSAPP
// ======================================

function setWhatsAppLinks(number) {
  const clean = String(number || "").replace(/\D/g, "");
  const valid = /^62\d{8,15}$/.test(clean);

  document.querySelectorAll(".wa-link").forEach((link) => {
    if (!valid) {
      link.href = "#contact";
      link.removeAttribute("target");
      link.onclick = (event) => {
        event.preventDefault();
        alert("Nomor WhatsApp belum diatur. Silakan hubungi admin website.");
      };
      return;
    }

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
    console.error("Gagal membaca WhatsApp:", error.message);
    return "";
  }

  return data?.whatsapp_number || "";
}

// ======================================
// KELOLA LAYANAN DARI SUPABASE
// ======================================

async function loadServices() {
  const container = document.querySelector(".service-grid");
  if (!container) return;

  const { data, error } = await db
    .from("services")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Gagal memuat layanan:", error.message);
    return;
  }

  container.replaceChildren();

  if (!data || data.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Belum ada layanan tersedia.";
    container.append(empty);
    return;
  }

  data.forEach((service) => {
    const card = document.createElement("article");
    card.className = "service-card";

    const icon = document.createElement("div");
    icon.className = "service-icon";
    icon.textContent = "◆";

    const name = document.createElement("h3");
    name.textContent = service.name || "Layanan";

    const description = document.createElement("p");
    description.textContent = service.description || "";

    const details = document.createElement("p");
    details.className = "service-details";

    const price = Number(service.price || 0);
    const category = service.category || "Umum";

    details.textContent =
      "Rp " + price.toLocaleString("id-ID") + " · " + category;

    const link = document.createElement("a");
    link.className = "text-link wa-link";
    link.href = "#contact";
    link.textContent = "Tanya layanan ↗";

    card.append(icon, name, description, details, link);
    container.append(card);
  });
}

// ======================================
// KELOLA GAME DARI SUPABASE
// ======================================

async function loadGames() {
  const container = document.querySelector(".game-grid");
  if (!container) return;

  const { data, error } = await db
    .from("games")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Gagal memuat game:", error.message);
    return;
  }

  container.replaceChildren();

  if (!data || data.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Belum ada game tersedia.";
    container.append(empty);
    return;
  }

  data.forEach((game) => {
    const tile = document.createElement("div");
    tile.className = "game-tile";

    if (game.logo_url) {
      try {
        const logoUrl = new URL(game.logo_url);

        if (logoUrl.protocol === "https:") {
          const image = document.createElement("img");
          image.src = logoUrl.href;
          image.alt = "Logo " + (game.name || "game");
          image.loading = "lazy";
          image.style.width = "58px";
          image.style.height = "58px";
          image.style.objectFit = "contain";

          image.onerror = () => {
            image.replaceWith(createGameSymbol(game.name));
          };

          tile.append(image);
        } else {
          tile.append(createGameSymbol(game.name));
        }
      } catch {
        tile.append(createGameSymbol(game.name));
      }
    } else {
      tile.append(createGameSymbol(game.name));
    }

    const name = document.createElement("span");
    name.textContent = game.name || "Game";
    tile.append(name);

    container.append(tile);
  });
}

function createGameSymbol(name) {
  const symbol = document.createElement("div");
  symbol.className = "game-symbol";
  symbol.textContent = String(name || "GM").slice(0, 4).toUpperCase();
  return symbol;
}

// ======================================
// MENU MOBILE
// ======================================

const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ======================================
// TAHUN FOOTER
// ======================================

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// ======================================
// JALANKAN SEMUA FITUR
// ======================================

async function initializeWebsite() {
  if (!window.supabase) {
    console.error("Library Supabase belum dimuat.");
    return;
  }

  const [whatsappNumber] = await Promise.all([
    loadWhatsAppNumber(),
    loadServices(),
    loadGames()
  ]);

  setWhatsAppLinks(whatsappNumber);
}

initializeWebsite();
    
