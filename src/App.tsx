import { FormEvent, useEffect, useMemo, useState } from "react";
import { achievements, donationUses, futurePlans, site } from "./siteContent";

type Page = "home" | "about" | "donate" | "contact";
type WorkHighlight = {
  id: string;
  title: string;
  detail: string;
  images: string[];
};

const pages: { key: Page; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "About us" },
  { key: "donate", label: "Donate us" },
  { key: "contact", label: "Contact us" },
];

const fallbackHighlights: WorkHighlight[] = [
  {
    id: "blood-donation",
    title: "रक्तदान सेवा",
    detail: "28 सफल स्वैच्छिक रक्तदान शिविरों के माध्यम से अब तक 1,460 यूनिट रक्त जरूरतमंद मरीजों तक पहुंचाया गया।",
    images: [site.assets.w1, site.assets.w2, site.assets.w3, site.assets.w4],
  },
  {
    id: "community-support",
    title: "भोजन, वस्त्र और सहायता",
    detail: "वस्त्र-वितरण, कोरोना काल की भोजन सेवा और जरूरतमंद परिवारों के लिए आर्थिक सहयोग संस्था के प्रमुख सेवा कार्य रहे हैं।",
    images: [site.assets.w4, site.assets.w5, site.assets.w6, site.assets.w7],
  },
];

function getPageFromHash(): Page {
  const key = window.location.hash.replace("#", "") as Page;
  return pages.some((page) => page.key === key) ? key : "home";
}

function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setPage(getPageFromHash());
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <Header activePage={page} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} />
      <main>
        {page === "home" && <HomePage />}
        {page === "about" && <AboutPage />}
        {page === "donate" && <DonatePage />}
        {page === "contact" && <ContactPage />}
      </main>
      {/* <Footer /> */}
    </>
  );
}

function Header({
  activePage,
  menuOpen,
  onToggleMenu,
}: {
  activePage: Page;
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="प्रयास सहयोग सेवा समिति मुख्य पृष्ठ">
        <img src={site.assets.logo} alt="प्रयास सहयोग सेवा समिति लोगो" />
        <span>
          <strong>
            {site.name} <small>{site.registration}</small>
          </strong>
          <small>{site.tagline}</small>
        </span>
      </a>

      <button className="menu-button" type="button" onClick={onToggleMenu} aria-expanded={menuOpen} aria-controls="site-nav">
        <span />
        <span />
        <span />
      </button>

      <nav id="site-nav" className={menuOpen ? "open" : ""} aria-label="Primary navigation">
        {pages.map((navPage) => (
          <a key={navPage.key} className={activePage === navPage.key ? "active" : ""} href={`#${navPage.key}`}>
            {navPage.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <div className="page-shell home-shell">
      <section className="work-showcase" aria-labelledby="work-title">
        <ImageSlideshow />
      </section>

      <section className="future-work-section" aria-labelledby="future-title">
        <div className="section-heading compact">
          <p className="eyebrow">आगे की अन्य योजनाएं</p>
        </div>
        <div className="plan-list">
          {futurePlans.map((plan) => (
            <article className="plan-item" key={plan.title}>
              <h3>{plan.title}</h3>
              <p>{plan.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ImageSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [highlights, setHighlights] = useState<WorkHighlight[]>(fallbackHighlights);

  useEffect(() => {
    let cancelled = false;

    fetch("/data/work-highlights.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load work highlights");
        }

        return response.json() as Promise<WorkHighlight[]>;
      })
      .then((records) => {
        if (!cancelled && Array.isArray(records) && records.length > 0) {
          setHighlights(records);
          setActiveIndex(0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHighlights(fallbackHighlights);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % highlights.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [highlights.length]);

  const activeSlide = highlights[activeIndex] ?? highlights[0];

  return (
    <div className="slideshow" aria-label="NGO work slideshow" aria-live="polite">
      <div className="slide-copy">
        <h2>{activeSlide.title}</h2>
        <p>{activeSlide.detail}</p>
      </div>
      <div className="slide-gallery">
        {activeSlide.images.slice(0, 4).map((image, index) => (
          <img key={`${activeSlide.id}-${image}`} src={image} alt={`${activeSlide.title} ${index + 1}`} />
        ))}
      </div>
      {/* <div className="slide-controls" aria-label="Slideshow controls">
        {highlights.map((slide, index) => (
          <button
            key={slide.id}
            className={activeIndex === index ? "active" : ""}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show work record ${index + 1}: ${slide.title}`}
          >
            <span>{index + 1}</span>
          </button>
        ))}
      </div> */}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="page-shell content-page">
      <section className="page-heading">
        <p className="eyebrow">About us</p>
        <h1>{site.name}</h1>
        <p>
          संस्था वर्ष 2013 से जनपद बरेली और आसपास के क्षेत्रों में निःस्वार्थ भाव से सामाजिक सेवा कर रही है।
          जून 2026 तक यह प्रयास रेवो के नाम से कार्यरत थी और पंजीकरण के बाद जुलाई 2026 से प्रयास सहयोग सेवा
          समिति के नाम से वही सेवा कार्य जारी हैं।
        </p>
      </section>

      <section className="two-column">
        <div>
          <h2>हमारा उद्देश्य</h2>
          <p>
            समाज के ऐसे लोगों तक सहायता पहुंचाना जिन्हें रक्त, भोजन, वस्त्र, शिक्षा, स्वास्थ्य या आर्थिक सहयोग की
            तत्काल आवश्यकता है। संस्था अपने सदस्यों और सहयोगियों की भागीदारी से सेवा कार्यों को सुचारू और पारदर्शी
            रूप से आगे बढ़ाने के लिए प्रतिबद्ध है।
          </p>
        </div>
        <div className="image-strip">
          <img src={site.assets.logo} alt="प्रयास सहयोग सेवा समिति लोगो" />
        </div>
      </section>

      <section className="timeline-section" aria-labelledby="timeline-title">
        <h2 id="timeline-title">प्रमुख उपलब्धियां</h2>
        <div className="timeline">
          {achievements.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function DonatePage() {
  return (
    <div className="page-shell content-page">
      <section className="donate-hero">
        <div>
          <p className="eyebrow">Donate us</p>
          <h1>आपका सहयोग किसी जरूरतमंद के जीवन में नई आशा ला सकता है।</h1>
          <p>
            आजीवन सदस्यता शुल्क {site.lifetimeMembership} है। सहयोग राशि संस्था के बैंक खाते, UPI या QR कोड के
            माध्यम से जमा की जा सकती है।
          </p>
          <div className="upi-box">
            <span>UPI ID</span>
            <strong>{site.upiId}</strong>
            <small>{site.bank}</small>
          </div>
        </div>
        <img src={site.assets.workPlanPoster} alt="सदस्यता और QR कोड विवरण" />
      </section>

      <section className="work-section">
        <p className="eyebrow">सहयोग का उपयोग</p>
        <h2>दान और सदस्यता से सेवा कार्यों को मजबूती</h2>
        <ul className="achievement-list compact">
          {donationUses.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ContactPage() {
  const [captchaSeed, setCaptchaSeed] = useState(() => Date.now());
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", captcha: "" });
  const [error, setError] = useState("");

  const captcha = useMemo(() => {
    const first = (captchaSeed % 7) + 3;
    const second = (Math.floor(captchaSeed / 10) % 6) + 2;
    return { first, second, answer: first + second };
  }, [captchaSeed]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Number(form.captcha) !== captcha.answer) {
      setError("कृपया सही captcha उत्तर भरें।");
      return;
    }

    const subject = encodeURIComponent(`Website enquiry from ${form.name || "visitor"}`);
    const body = encodeURIComponent(
      [`Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone}`, "", form.message].join("\n"),
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="page-shell content-page">
      <section className="page-heading">
        <p className="eyebrow">Contact us</p>
        <h1>संपर्क करें</h1>
        <p>सदस्यता, सहयोग, शिविर या सेवा कार्यों से जुड़ी जानकारी के लिए नीचे दिया गया enquiry form भरें।</p>
      </section>

      <section className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            नाम
            <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </label>
          <label>
            ईमेल
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>
          <label>
            मोबाइल नंबर
            <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </label>
          <label>
            संदेश
            <textarea required rows={5} value={form.message} onChange={(event) => updateField("message", event.target.value)} />
          </label>
          <div className="captcha-row">
            <label>
              Captcha: {captcha.first} + {captcha.second} =
              <input
                required
                inputMode="numeric"
                value={form.captcha}
                onChange={(event) => updateField("captcha", event.target.value)}
              />
            </label>
            <button type="button" className="text-button" onClick={() => setCaptchaSeed(Date.now())}>
              नया प्रश्न
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-action submit-action" type="submit">
            Email enquiry भेजें
          </button>
        </form>

        <aside className="address-panel">
          <h2>कार्यालय / सेवा क्षेत्र</h2>
          <p>
            {site.name}
            <br />
            {site.location}
            <br />
            {site.serviceArea}
          </p>
          {site.email && (
            <div>
              <span>Email</span>
              <strong>{site.email}</strong>
            </div>
          )}
          <div>
            <span>UPI</span>
            <strong>{site.upiId}</strong>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div>
        <strong>{site.name}</strong>
        <span>{site.tagline}</span>
      </div>
      <a href="#donate">सहयोग करें</a>
    </footer>
  );
}

export default App;
