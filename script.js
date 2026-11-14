
const SUPABASE_URL = "https://qysosxigmhowkixfgnbl.supabase.co";
const SUPABASE_KEY = "sb_publishable_07uDY6VmHmZCz7qY928caw_PN68h_4c";

const message = "Halo DINSS NO MERCY, saya ingin bertanya tentang layanan.";

const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

function setWhatsApp(number) {
  const clean = String(number || "").replace(/\D/g, "");
  const valid = /^62\d{8,15}$/.test(clean);

  document.querySelectorAll(".wa-link").forEach(link => {
    if (valid) {
      link.href = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.onclick = null;
    } else {
      link.href = "#contact";
    }
  });
}

function loadLibrary() {
  return new Promise((resolve, reject) => {
    if (window.supabase) return resolve();

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function startWebsite() {
  try {
    await loadLibrary();

    const db = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    const settings = await db
      .from("site_settings")
      .select("whatsapp_number")
      .eq("id", 1)
      .maybeSingle();

    if (!settings.error) {
      setWhatsApp(settings.data?.whatsapp_number || "");
    }

    const services = await db
      .from("services")
      .select("*")
      .order("id", { ascending: false });

    if (!services.error && services.data?.length) {
      const container = document.querySelector(".service-grid");

      if (container) {
        const cards = services.data.map(service => {
          const card = document.createElement("article");
          card.className = "service-card";

          const icon = document.createElement("div");
          icon.className = "service-icon";
          icon.textContent = "◆";

          const name = document.createElement("h3");
          name.textContent = service.name || "Layanan";

          const description = document.createElement("p");
          description.textContent = service.description || "";

          const link = document.createElement("a");
          link.className = "text-link wa-link";
          link.href = "#contact";
          link.textContent = "Tanya layanan ↗";

          card.append(icon, name, description, link);
          return card;
        });

        container.replaceChildren(...cards);
      }
    }

    const games = await db
      .from("games")
      .select("*")
      .order("id", { ascending: false });

    if (!games.error && games.data?.length) {
      const container = document.querySelector(".game-grid");

      if (container) {
        const tiles = games.data.map(game => {
          const tile = document.createElement("div");
          tile.className = "game-tile";

          const symbol = document.createElement("div");
          symbol.className = "game-symbol";
          symbol.textContent = String(game.name || "GM").slice(0, 4).toUpperCase();

          const name = document.createElement("span");
          name.textContent = game.name || "Game";

          tile.append(symbol, name);
          return tile;
        });

        container.replaceChildren(...tiles);
      }
    }

    setWhatsApp(settings.data?.whatsapp_number || "");

  } catch (error) {
    console.error("Supabase belum tersedia:", error);
  }
}

startWebsite();
