import { FormEvent, useEffect, useMemo, useState } from "react";
import { achievements, donationUses, futurePlans, site, stats } from "./siteContent";

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
  { key: "contact", label: "Contact" },
  { key: "donate", label: "Support our work" },
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
      <Footer />
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
    <div className="home-page">
      <section className="hero-section page-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-mark" /> समाज सेवा • सहयोग • संवेदनशीलता</p>
          <h1>सेवा का संकल्प,<br /><em>समाज के नाम।</em></h1>
          <p className="hero-description">{site.mission}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#donate">हमारे कार्यों में सहयोग करें <span aria-hidden="true">↗</span></a>
            <a className="secondary-action" href="#about">हमारे बारे में जानें</a>
          </div>
          <div className="hero-note"><span className="note-icon" aria-hidden="true">✳</span><span><strong>वर्ष 2013 से</strong><small>बरेली और आसपास के क्षेत्रों में सेवा के लिए समर्पित</small></span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-main"><img src={site.assets.w1} alt="प्रयास सहयोग सेवा समिति की सामाजिक सेवा गतिविधि" /></div>
          <div className="hero-photo-small"><img src={site.assets.w5} alt="समुदाय के लिए सहायता गतिविधि" /></div>
          <div className="hero-seal"><span>प्रयास</span><strong>सेवा ही<br />संकल्प</strong><small>स्थापना • 2013</small></div>
          <div className="hero-visual-caption"><span className="caption-dot" /> वास्तविक प्रयास, वास्तविक बदलाव</div>
        </div>
      </section>
      <section className="impact-section"><div className="page-shell">
        <div className="section-intro"><p className="eyebrow">हमारे प्रयास, हमारा प्रभाव</p><h2>साथ मिलकर, बदलाव की ओर</h2></div>
        <div className="hero-stat-grid">{stats.map((item, index) => <article className="stat-tile" key={item.label}><span className="stat-index">0{index + 1}</span><strong>{item.value}</strong><span>{item.label}</span></article>)}</div>
      </div></section>
      <section className="work-section page-shell">
        <div className="section-heading"><div><p className="eyebrow">हम क्या करते हैं</p><h2>सेवा, जो लोगों तक पहुँचती है</h2></div><a className="text-link" href="#about">हमारी यात्रा <span aria-hidden="true">→</span></a></div>
        <div className="landing-grid">
          <article className="feature-panel"><div className="feature-image"><img src={site.assets.w2} alt="रक्तदान शिविर में भाग लेते स्वयंसेवक" loading="lazy" /></div><div className="feature-copy"><span className="feature-number">01 / स्वास्थ्य</span><h3>रक्तदान और स्वास्थ्य सहायता</h3><p>स्वैच्छिक रक्तदान शिविरों और स्वास्थ्य गतिविधियों के माध्यम से जरूरतमंद लोगों तक सहायता पहुँचाना।</p></div></article>
          <article className="feature-panel"><div className="feature-image"><img src={site.assets.w5} alt="जरूरतमंद परिवारों के लिए वस्त्र सहायता" loading="lazy" /></div><div className="feature-copy"><span className="feature-number">02 / राहत</span><h3>भोजन, वस्त्र और राहत</h3><p>कठिन समय में परिवारों को भोजन, सर्दियों के वस्त्र और जरूरी सहयोग उपलब्ध कराने का प्रयास।</p></div></article>
          <article className="feature-panel"><div className="feature-image"><img src={site.assets.w6} alt="समुदाय के साथ सामाजिक सेवा गतिविधि" loading="lazy" /></div><div className="feature-copy"><span className="feature-number">03 / समुदाय</span><h3>समुदाय के साथ, समुदाय के लिए</h3><p>सदस्यों और सहयोगियों की भागीदारी से स्थानीय जरूरतों पर आधारित सेवा कार्य।</p></div></article>
        </div>
      </section>
      <section className="work-showcase page-shell" aria-labelledby="work-title">
        <div className="section-heading"><div><p className="eyebrow">मैदान से झलकियाँ</p><h2 id="work-title">हमारे कार्यों की एक झलक</h2></div><span className="section-aside">काम की तस्वीरें, लोगों की कहानियाँ</span></div>
        <ImageSlideshow />
      </section>
      <section className="future-work-section"><div className="page-shell future-inner">
        <div className="future-intro"><p className="eyebrow">आगे की राह</p><h2>जहाँ जरूरत होगी,<br /><em>वहाँ प्रयास होगा।</em></h2><p>हमारी आगामी योजनाएँ स्थानीय जरूरतों को समझकर और सहयोगियों के साथ मिलकर आगे बढ़ने का संकल्प हैं।</p><a className="secondary-action" href="#contact">हमसे जुड़ें</a></div>
        <div className="plan-list">{futurePlans.map((plan, index) => <article className="plan-item" key={plan.title}><span className="plan-number">0{index + 1}</span><div><h3>{plan.title}</h3><p>{plan.text}</p></div><span className="plan-arrow" aria-hidden="true">↗</span></article>)}</div>
      </div></section>
      <section className="closing-cta page-shell"><div><p className="eyebrow">आपका सहयोग मायने रखता है</p><h2>एक बेहतर समाज की शुरुआत,<br />एक छोटे से प्रयास से होती है।</h2></div><a className="primary-action" href="#donate">सहयोग करें <span aria-hidden="true">↗</span></a></section>
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
        <span className="slide-kicker">सेवा कार्य {String(activeIndex + 1).padStart(2, "0")} / {String(highlights.length).padStart(2, "0")}</span>
        <h3>{activeSlide.title}</h3>
        <p>{activeSlide.detail}</p>
        <div className="slide-controls" aria-label="Slideshow controls">
          {highlights.map((slide, index) => <button key={slide.id} className={activeIndex === index ? "active" : ""} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show work record ${index + 1}: ${slide.title}`} />)}
        </div>
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
            रूप से आगे बढ़ाने के लिए प्रतिबद्ध है।8
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
    <div className="page-shell content-page donate-page">
      <section className="donate-layout">
        <div className="donate-copy">
          <section className="page-heading">
            <p className="eyebrow">Donate us</p>
            <h2>आपका सहयोग किसी जरूरतमंद के जीवन में नई आशा ला सकता है।</h2>
            <p>
              आजीवन सदस्यता शुल्क {site.lifetimeMembership} है। सहयोग राशि संस्था के बैंक खाते, UPI या QR कोड के
              माध्यम से जमा की जा सकती है।
            </p>
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

        <aside className="donate-hero" aria-label="Donate by QR code">
          <img src={site.assets.QRcode} alt="सदस्यता और QR कोड विवरण" />
        </aside>
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

    if (!site.email) {
      setError("ईमेल संपर्क अभी कॉन्फ़िगर नहीं है। कृपया संस्था से सीधे संपर्क करें।");
      return;
    }
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
            <span>Contact</span>
            <strong>{site.phoneNumbers}</strong>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={site.assets.logo} alt="" />
        <span><strong>{site.name}</strong><small>{site.tagline}</small></span>
      </div>
      <p>निःस्वार्थ सेवा • पारदर्शिता • सामुदायिक सहयोग</p>
      <a href="#donate">सहयोग करें <span aria-hidden="true">↗</span></a>
      <small className="copyright">© {new Date().getFullYear()} {site.name}. सर्वाधिकार सुरक्षित।</small>
    </footer>
  );
}

export default App;
