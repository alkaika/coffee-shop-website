const { useEffect, useMemo, useState } = React;

    const profileData = {
      name: "Juniper & Finch",
      tagline: "Good coffee. Good company.",
      welcomeText: "A little neighborhood coffee house with a big love for thoughtfully made things. Come in, settle down, and stay a while.",
      story: "We opened Juniper & Finch with one simple idea: the best cup is the one shared with someone. We partner with small, thoughtful roasters, bake a few favorite things fresh each morning, and believe that a warm welcome is just as important as a well-pulled shot. Find us on the sunny corner of Alder and 8th.",
      heroImage: null,
      aboutImage: null,
      address: "1842 Alder Street, Portland, OR 97205",
      phone: "(503) 555-0148",
      email: "hello@juniperfinch.coffee",
      currency: "USD",
      socialLinks: [
        { platform: "Instagram", url: "https://www.instagram.com/" },
        { platform: "Facebook", url: "https://www.facebook.com/" }
      ],
      openingHours: [
        { day: "Monday", opensAt: "07:00", closesAt: "16:00", isClosed: false },
        { day: "Tuesday", opensAt: "07:00", closesAt: "16:00", isClosed: false },
        { day: "Wednesday", opensAt: "07:00", closesAt: "16:00", isClosed: false },
        { day: "Thursday", opensAt: "07:00", closesAt: "16:00", isClosed: false },
        { day: "Friday", opensAt: "07:00", closesAt: "17:00", isClosed: false },
        { day: "Saturday", opensAt: "08:00", closesAt: "15:00", isClosed: false },
        { day: "Sunday", opensAt: "08:00", closesAt: "15:00", isClosed: false }
      ]
    };

    const categories = [
      { id: "all", name: "All", displayOrder: 0 },
      { id: "coffee", name: "Coffee", displayOrder: 1 },
      { id: "tea", name: "Tea & more", displayOrder: 2 },
      { id: "bakery", name: "Bakery", displayOrder: 3 },
      { id: "seasonal", name: "Seasonal", displayOrder: 4 }
    ];

    const menuData = [
      { id: "1", name: "House Drip", description: "A balanced, sweet daily coffee from our rotating small-batch roaster.", price: 3.5, categoryId: "coffee", labels: ["Vegan"], isAvailable: true, displayOrder: 1 },
      { id: "2", name: "Espresso", description: "Rich, silky, and full of toasted chocolate notes.", price: 3.25, categoryId: "coffee", labels: ["Vegan"], isAvailable: true, displayOrder: 2 },
      { id: "3", name: "Honey Oat Latte", description: "Double espresso, steamed oat milk, and a little local honey.", price: 5.75, categoryId: "coffee", labels: ["Vegetarian"], isAvailable: true, displayOrder: 3 },
      { id: "4", name: "Maple Cold Brew", description: "Slow-steeped for 18 hours, finished with a hint of maple.", price: 5.25, categoryId: "coffee", labels: ["Vegan"], isAvailable: true, displayOrder: 4 },
      { id: "5", name: "Matcha Cloud", description: "Ceremonial green tea whisked smooth and topped with oat foam.", price: 5.5, categoryId: "tea", labels: ["Caffeine"], isAvailable: true, displayOrder: 1 },
      { id: "6", name: "Chamomile & Honey", description: "A soothing, caffeine-free herbal infusion with local honey.", price: 4, categoryId: "tea", labels: ["Caffeine-free"], isAvailable: true, displayOrder: 2 },
      { id: "7", name: "Almond Croissant", description: "Buttery, flaky pastry filled with almond cream and toasted almonds.", price: 4.75, categoryId: "bakery", labels: ["Vegetarian"], isAvailable: true, displayOrder: 1 },
      { id: "8", name: "Morning Bun", description: "Soft, laminated layers rolled in cinnamon sugar and orange zest.", price: 4.25, categoryId: "bakery", labels: ["Vegetarian"], isAvailable: true, displayOrder: 2 },
      { id: "9", name: "Olive Oil Cake", description: "Tender citrus cake with a golden edge. Baked here every morning.", price: 5, categoryId: "bakery", labels: ["Dairy-free"], isAvailable: true, displayOrder: 3 }
    ];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    function formatTime(time) {
      if (!time) return "";
      const [hours, minutes] = time.split(":").map(Number);
      return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], {
        hour: "numeric", minute: "2-digit"
      });
    }

    function getShopStatus(hours, now = new Date()) {
      if (!hours || !hours.length) return { available: false, isOpen: null, nextOpeningTime: null };
      const today = days[now.getDay()];
      const minutesNow = now.getHours() * 60 + now.getMinutes();
      const todayHours = hours.find(h => h.day === today);
      if (todayHours && !todayHours.isClosed && todayHours.opensAt && todayHours.closesAt) {
        const [oh, om] = todayHours.opensAt.split(":").map(Number);
        const [ch, cm] = todayHours.closesAt.split(":").map(Number);
        const openAt = oh * 60 + om;
        const closeAt = ch * 60 + cm;
        if (minutesNow >= openAt && minutesNow < closeAt) {
          return { available: true, isOpen: true, nextOpeningTime: null };
        }
      }

      for (let offset = 0; offset < 8; offset++) {
        const date = new Date(now);
        date.setDate(now.getDate() + offset);
        const dayName = days[date.getDay()];
        const dayHours = hours.find(h => h.day === dayName);
        if (!dayHours || dayHours.isClosed || !dayHours.opensAt) continue;
        const [openHour, openMinute] = dayHours.opensAt.split(":").map(Number);
        const openingMinutes = openHour * 60 + openMinute;
        if (offset === 0 && openingMinutes <= minutesNow) continue;
        const label = offset === 0 ? "today" : offset === 1 ? "tomorrow" : dayName;
        return {
          available: true,
          isOpen: false,
          nextOpeningTime: `${label} at ${formatTime(dayHours.opensAt)}`
        };
      }
      return { available: true, isOpen: false, nextOpeningTime: null };
    }

    function CoffeeArt({ compact = false }) {
      return (
        <svg viewBox="0 0 720 560" role="img" aria-label="Illustration of a freshly poured cup of coffee" className="h-full w-full">
          <rect width="720" height="560" rx="28" fill="#dce2d2" />
          <circle cx="548" cy="122" r="73" fill="#efc58d" opacity=".8" />
          <path d="M0 393c108-56 175-52 278-9 102 42 205 61 442-28v204H0z" fill="#a9b49a" />
          <path d="M0 450c138-51 263-11 378 17 107 26 222-10 342-55v148H0z" fill="#8b987f" />
          <g transform={compact ? "translate(108 35) scale(.86)" : "translate(90 18)"}>
            <ellipse cx="292" cy="410" rx="204" ry="32" fill="#65745a" opacity=".18" />
            <path d="M168 227h255l-25 153c-5 31-32 53-63 53h-78c-31 0-58-22-63-53z" fill="#fbf8f1" />
            <path d="M423 258h47c39 0 59 26 53 61-5 31-26 49-69 48" fill="none" stroke="#fbf8f1" strokeWidth="26" />
            <ellipse cx="296" cy="229" rx="129" ry="30" fill="#fffdf8" />
            <ellipse cx="296" cy="230" rx="108" ry="19" fill="#684735" />
            <path d="M258 198c-22-20 22-32 0-54m53 54c-22-20 22-32 0-54m51 54c-22-20 22-32 0-54" fill="none" stroke="#fff9e9" strokeWidth="8" strokeLinecap="round" opacity=".85" />
            <path d="M235 267c35 20 90 20 124 0" fill="none" stroke="#e5cbb0" strokeWidth="5" strokeLinecap="round" />
            <path d="M207 350c50 21 130 27 184 1" fill="none" stroke="#e5cbb0" strokeWidth="5" strokeLinecap="round" />
          </g>
          <path d="M78 128c16-23 43-33 73-24-1 29-14 54-43 67-14 6-30 2-40-8 2-13 5-24 10-35z" fill="#65745a" />
          <path d="M93 157c18-13 36-27 51-42" fill="none" stroke="#dce2d2" strokeWidth="4" />
          <path d="M587 349c15-20 39-27 65-17-2 25-14 46-39 56-12 4-26 0-34-10 2-11 4-20 8-29z" fill="#65745a" />
          <path d="M600 373c17-10 32-22 45-35" fill="none" stroke="#dce2d2" strokeWidth="4" />
          <text x="36" y="520" fill="#475640" fontSize="17" fontFamily="Georgia,serif" letterSpacing="3">A GOOD CUP, A SLOW MORNING</text>
        </svg>
      );
    }

    function App() {
      const [activeCategory, setActiveCategory] = useState("all");
      const [query, setQuery] = useState("");
      const [mobileOpen, setMobileOpen] = useState(false);
      const [profileError, setProfileError] = useState(false);
      const [menuError, setMenuError] = useState(false);
      const [hoursError, setHoursError] = useState(false);
      const [now, setNow] = useState(() => new Date());

      useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
      }, []);

      useEffect(() => {
        function onKeyDown(event) {
          if (event.key === "Escape") setMobileOpen(false);
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
      }, []);

      const filteredItems = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return menuData
          .filter(item => item.isAvailable)
          .filter(item => activeCategory === "all" || item.categoryId === activeCategory)
          .filter(item => !normalized || `${item.name} ${item.description} ${item.labels.join(" ")}`.toLowerCase().includes(normalized))
          .sort((a, b) => a.displayOrder - b.displayOrder);
      }, [activeCategory, query]);

      const status = getShopStatus(profileData.openingHours, now);
      const currencySymbol = profileData.currency === "USD" ? "$" : profileData.currency === "EUR" ? "€" : profileData.currency === "GBP" ? "£" : "";
      const navLinks = [
        { href: "#menu", label: "Menu" },
        { href: "#about", label: "Our story" },
        { href: "#visit", label: "Visit us" }
      ];

      function closeMobile() { setMobileOpen(false); }

      function retryProfile() { setProfileError(false); }
      function retryMenu() { setMenuError(false); }
      function retryHours() { setHoursError(false); }

      const socialName = (platform) => platform.charAt(0).toUpperCase() + platform.slice(1);

      return (
        <div>
          <header className="sticky top-0 z-40 border-b border-[#e5dfd2] bg-oat/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
              <a href="#top" className="focus-ring rounded-sm text-xl font-semibold tracking-tight text-espresso" onClick={closeMobile}>
                <span className="serif">{profileData.name}</span>
                <span className="ml-2 hidden text-[10px] font-bold uppercase tracking-[.22em] text-sage sm:inline">Coffee House</span>
              </a>
              <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
                {navLinks.map(link => <a key={link.href} className="focus-ring rounded-sm text-sm font-medium text-[#655b50] transition hover:text-sage" href={link.href}>{link.label}</a>)}
                <a href="#visit" className="focus-ring rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#53614a]">Plan a visit</a>
              </nav>
              <button
                type="button"
                className="focus-ring flex min-h-11 items-center gap-2 rounded-full border border-[#d7d0c3] px-4 text-sm font-semibold text-espresso md:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setMobileOpen(value => !value)}
              >
                <span>{mobileOpen ? "Close" : "Menu"}</span>
                <span aria-hidden="true" className="text-lg leading-none">{mobileOpen ? "×" : "☰"}</span>
              </button>
            </div>
            {mobileOpen && (
              <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#e5dfd2] bg-cream px-5 py-3 md:hidden">
                <div className="mx-auto flex max-w-6xl flex-col">
                  {navLinks.map(link => (
                    <a key={link.href} className="focus-ring rounded-md px-2 py-3 font-medium text-espresso hover:bg-oat" href={link.href} onClick={closeMobile}>{link.label}</a>
                  ))}
                  <a className="focus-ring rounded-md px-2 py-3 font-semibold text-sage hover:bg-oat" href="#visit" onClick={closeMobile}>Plan a visit <span aria-hidden="true">↗</span></a>
                </div>
              </nav>
            )}
          </header>

          <main id="top">
            {profileError ? (
              <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
                <div role="alert" className="rounded-2xl border border-clay/30 bg-cream p-6">
                  <p className="font-semibold">We couldn’t display the shop details.</p>
                  <button className="focus-ring mt-3 rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white" onClick={retryProfile}>Try again</button>
                </div>
              </div>
            ) : (
              <>
                <section className="mx-auto grid max-w-6xl items-center gap-9 px-5 pb-14 pt-9 sm:px-8 sm:pb-20 sm:pt-14 md:grid-cols-[.92fr_1.08fr] md:gap-14 md:py-16">
                  <div className="order-2 md:order-1">
                    <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-sage">
                      <span className="h-px w-8 bg-clay"></span>{profileData.tagline}
                    </p>
                    <h1 className="serif max-w-xl text-5xl leading-[1.04] tracking-tight text-espresso sm:text-6xl lg:text-7xl">Your corner for a <em className="font-normal text-sage">slower</em> kind of morning.</h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-[#6c6257] sm:text-lg sm:leading-8">{profileData.welcomeText}</p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <a href="#menu" className="focus-ring inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-6 text-sm font-semibold text-white transition hover:bg-[#53614a]">
                        Explore the menu <span aria-hidden="true">↓</span>
                      </a>
                      <a href="#visit" className="focus-ring inline-flex min-h-12 items-center rounded-full border border-[#d6cfc2] px-6 text-sm font-semibold text-espresso transition hover:bg-cream">Find us</a>
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-sm text-[#766d61]">
                      <span className={`relative flex h-2.5 w-2.5 ${status.isOpen ? "bg-[#6f8a5c]" : "bg-clay"} rounded-full`}>
                        {status.isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6f8a5c] opacity-40"></span>}
                      </span>
                      <span>{status.available ? (status.isOpen ? "Open now — come on in" : `Closed now${status.nextOpeningTime ? ` · Opens ${status.nextOpeningTime}` : ""}`) : "Hours not available"}</span>
                    </div>
                  </div>
                  <div className="hero-art texture order-1 relative aspect-[1.16/1] overflow-hidden rounded-[2rem] shadow-[0_22px_60px_-35px_rgba(51,40,32,.35)] md:order-2 md:aspect-[1.12/1]">
                    {profileData.heroImage ? <img src={profileData.heroImage} alt="A cozy view inside Juniper & Finch" className="h-full w-full object-cover" /> : <CoffeeArt />}
                    <div className="absolute bottom-4 right-4 rounded-full bg-cream/90 px-4 py-2 text-xs font-semibold tracking-wide text-sage backdrop-blur sm:bottom-6 sm:right-6">POURED WITH CARE, DAILY</div>
                  </div>
                </section>

                <section id="menu" className="scroll-mt-24 bg-cream py-16 sm:py-20">
                  <div className="mx-auto max-w-6xl px-5 sm:px-8">
                    <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-clay">Made for the moment</p>
                        <h2 className="serif text-4xl tracking-tight sm:text-5xl">A little something good.</h2>
                        <p className="mt-3 max-w-lg text-[#71675b]">Thoughtful coffee, lovely tea, and something warm from the oven.</p>
                      </div>
                      <p className="text-sm text-[#766d61]">Seasonal things change with the day.</p>
                    </div>

                    {menuError ? (
                      <div role="alert" className="rounded-2xl border border-clay/30 bg-oat p-6">
                        <p className="font-semibold">Our menu couldn’t be displayed just now.</p>
                        <button className="focus-ring mt-3 rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white" onClick={retryMenu}>Try again</button>
                      </div>
                    ) : menuData.length === 0 ? (
                      <div className="rounded-2xl border border-[#e7e0d3] bg-oat p-8 text-center">
                        <p className="serif text-2xl">We’re refreshing the menu.</p>
                        <p className="mt-2 text-[#71675b]">Please check back soon for what’s brewing.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-5 border-b border-[#e7e0d3] pb-5">
                          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter menu by category">
                            {categories.slice().sort((a,b) => a.displayOrder - b.displayOrder).map(category => (
                              <button
                                type="button"
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                aria-pressed={activeCategory === category.id}
                                className={`focus-ring min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${activeCategory === category.id ? "bg-sage text-white" : "border border-[#ded7ca] bg-oat text-[#665c50] hover:border-sage hover:text-sage"}`}
                              >{category.name}</button>
                            ))}
                          </div>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <label className="relative block w-full sm:max-w-sm">
                              <span className="sr-only">Search menu by item name or description</span>
                              <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#887d70]">⌕</span>
                              <input
                                type="search"
                                value={query}
                                onChange={event => setQuery(event.target.value)}
                                placeholder="Search the menu"
                                className="focus-ring min-h-11 w-full rounded-full border border-[#ded7ca] bg-oat py-2 pl-10 pr-11 text-sm text-espresso placeholder:text-[#92887b]"
                              />
                              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear menu search" className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm font-semibold text-sage hover:bg-white">Clear</button>}
                            </label>
                            <p aria-live="polite" className="text-sm text-[#766d61]"><span className="font-semibold text-espresso">{filteredItems.length}</span> {filteredItems.length === 1 ? "item" : "items"}</p>
                          </div>
                        </div>

                        {filteredItems.length > 0 ? (
                          <div className="mt-2 grid gap-x-8 md:grid-cols-2">
                            {filteredItems.map(item => (
                              <article key={item.id} className="menu-card border-b border-[#e7e0d3] py-6">
                                <div className="flex items-start justify-between gap-4">
                                  <h3 className="serif text-xl font-semibold">{item.name}</h3>
                                  {item.price != null && <span className="shrink-0 pt-1 text-sm font-semibold text-sage">{currencySymbol}{item.price.toFixed(2)}</span>}
                                </div>
                                <p className="mt-2 max-w-md text-sm leading-6 text-[#71675b]">{item.description}</p>
                                {item.labels?.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2" aria-label={`${item.name} dietary and caffeine labels`}>
                                    {item.labels.map(label => <span key={label} className="rounded-full bg-[#e9ede3] px-2.5 py-1 text-[11px] font-semibold text-[#59674f]">{label}</span>)}
                                  </div>
                                )}
                              </article>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-8 rounded-2xl border border-[#e7e0d3] bg-oat px-6 py-9 text-center">
                            <p className="serif text-2xl">{query.trim() ? "Nothing on the menu by that name." : "Nothing in this category just yet."}</p>
                            <p className="mt-2 text-sm text-[#71675b]">{query.trim() ? "Try another search, or clear it to see the menu again." : "Try another category to see what we’re serving."}</p>
                            {query.trim() && <button type="button" onClick={() => setQuery("")} className="focus-ring mt-5 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#53614a]">Clear search</button>}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>

                <section id="about" className="scroll-mt-24 mx-auto grid max-w-6xl items-center gap-9 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-16">
                  <div className="relative order-2 aspect-[1.22/1] overflow-hidden rounded-[2rem] bg-[#e4d8c7] md:order-1">
                    {profileData.aboutImage ? <img src={profileData.aboutImage} alt="The welcoming neighborhood atmosphere at Juniper & Finch" className="h-full w-full object-cover" /> : (
                      <svg viewBox="0 0 640 520" role="img" aria-label="Illustration of a sunlit café table with a coffee cup and leafy branch" className="h-full w-full">
                        <rect width="640" height="520" fill="#e8dfd1" />
                        <circle cx="510" cy="90" r="60" fill="#edc68f" />
                        <path d="M0 334c120-75 224-61 332-13s210 57 308-12v211H0z" fill="#bdc5ad" />
                        <path d="M0 408c146-54 282-5 402 28 82 23 160-7 238-45v129H0z" fill="#87947b" />
                        <path d="M92 82v228m0-163c-38-42-57-50-75-39 5 37 31 60 75 68m0-12c34-41 58-48 79-34-10 37-37 59-79 63" fill="none" stroke="#65745a" strokeWidth="9" strokeLinecap="round" />
                        <path d="M176 288h228l-17 121c-4 26-25 45-51 45h-91c-26 0-47-19-51-45z" fill="#fbf8f1" />
                        <ellipse cx="290" cy="288" rx="114" ry="24" fill="#fffdf8" />
                        <ellipse cx="290" cy="289" rx="93" ry="15" fill="#684735" />
                        <path d="M403 314h36c30 0 47 21 41 49-5 23-23 37-54 35" fill="none" stroke="#fbf8f1" strokeWidth="21" />
                        <rect x="85" y="432" width="472" height="18" rx="9" fill="#725b46" />
                        <path d="M122 450v70m399-70v70" stroke="#725b46" strokeWidth="14" />
                        <text x="42" y="489" fill="#f9f5ed" fontSize="16" fontFamily="Georgia,serif" letterSpacing="2">MAKE YOURSELF AT HOME</text>
                      </svg>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-cream/90 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-sage">Since 2017</div>
                  </div>
                  <div className="order-1 md:order-2">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-clay">A neighborhood kind of place</p>
                    <h2 className="serif text-4xl leading-tight tracking-tight sm:text-5xl">Coffee is better when you feel at home.</h2>
                    <p className="mt-6 text-base leading-7 text-[#6c6257]">{profileData.story}</p>
                    <a href="#visit" className="focus-ring mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d6cfc2] px-5 text-sm font-semibold transition hover:bg-cream">Come say hello <span aria-hidden="true">↗</span></a>
                  </div>
                </section>

                <section id="visit" className="scroll-mt-24 bg-[#e9ede3] py-16 sm:py-20">
                  <div className="mx-auto max-w-6xl px-5 sm:px-8">
                    <div className="mb-9">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-clay">Your table is waiting</p>
                      <h2 className="serif text-4xl tracking-tight sm:text-5xl">Come find your corner.</h2>
                    </div>
                    <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                      <div>
                        <h3 className="serif text-2xl font-semibold">Find us</h3>
                        {profileData.address && <p className="mt-4 max-w-sm leading-7 text-[#625c50]">{profileData.address}</p>}
                        {profileData.address && (
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profileData.address)}`} target="_blank" rel="noreferrer" className="focus-ring mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-sage px-5 text-sm font-semibold text-white transition hover:bg-[#53614a]">
                            Get directions <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        <div className="mt-8 space-y-3 text-sm text-[#625c50]">
                          {profileData.phone && <p><span className="mr-2 text-sage">☎</span><a className="focus-ring rounded-sm underline decoration-[#b8c0ad] underline-offset-4 hover:text-sage" href={`tel:${profileData.phone.replace(/[^\d+]/g, "")}`}>{profileData.phone}</a></p>}
                          {profileData.email && <p><span className="mr-2 text-sage">✉</span><a className="focus-ring rounded-sm underline decoration-[#b8c0ad] underline-offset-4 hover:text-sage" href={`mailto:${profileData.email}`}>{profileData.email}</a></p>}
                        </div>
                      </div>
                      <div>
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <h3 className="serif text-2xl font-semibold">Hours</h3>
                          {hoursError ? null : status.available && (
                            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${status.isOpen ? "bg-[#d9e4d1] text-[#43583c]" : "bg-[#f1ddd5] text-[#8f4e39]"}`}>
                              <span className="mr-1.5" aria-hidden="true">●</span>{status.isOpen ? "Open now" : "Closed now"}
                            </span>
                          )}
                        </div>
                        {hoursError ? (
                          <div role="alert" className="rounded-xl border border-clay/30 bg-cream p-4">
                            <p className="text-sm">We couldn’t load our hours.</p>
                            <button className="focus-ring mt-2 rounded-full bg-sage px-4 py-2 text-xs font-semibold text-white" onClick={retryHours}>Try again</button>
                          </div>
                        ) : !profileData.openingHours?.length ? (
                          <p className="text-sm text-[#71675b]">Hours not available.</p>
                        ) : (
                          <>
                            <ul className="divide-y divide-[#d6ddcf]">
                              {profileData.openingHours.map(hour => (
                                <li key={hour.day} className={`flex items-center justify-between py-3 text-sm ${hour.day === days[now.getDay()] ? "font-semibold text-espresso" : "text-[#625c50]"}`}>
                                  <span>{hour.day}{hour.day === days[now.getDay()] && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-sage">Today</span>}</span>
                                  <span>{hour.isClosed || !hour.opensAt ? "Closed" : `${formatTime(hour.opensAt)} – ${formatTime(hour.closesAt)}`}</span>
                                </li>
                              ))}
                            </ul>
                            {!status.isOpen && status.nextOpeningTime && <p className="mt-4 text-sm font-medium text-sage">We open {status.nextOpeningTime}.</p>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </main>

          <footer className="bg-espresso text-[#f5f1e8]">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
              <div>
                <a href="#top" className="focus-ring rounded-sm serif text-xl font-semibold">{profileData.name}</a>
                <p className="mt-1 text-sm text-[#c9c0b3]">{profileData.tagline}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#e4ddd2]">
                {profileData.phone && <a className="focus-ring rounded-sm hover:text-white" href={`tel:${profileData.phone.replace(/[^\d+]/g, "")}`}>Call us</a>}
                {profileData.email && <a className="focus-ring rounded-sm hover:text-white" href={`mailto:${profileData.email}`}>Email</a>}
                {profileData.socialLinks.filter(link => link.url).map(link => <a key={link.platform} className="focus-ring rounded-sm hover:text-white" href={link.url} target="_blank" rel="noreferrer">{socialName(link.platform)} <span aria-hidden="true">↗</span></a>)}
              </div>
              <p className="text-xs text-[#bdb3a6]">© {new Date().getFullYear()} Juniper &amp; Finch</p>
            </div>
          </footer>
        </div>
      );
    }

export default App;
