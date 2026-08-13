"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    /* ---- mobile menu overlay ---- */
    const btn = document.getElementById("menuBtn");
    const ov = document.getElementById("overlay");
    const cl = document.getElementById("menuClose");
    const op = () => {
      ov?.classList.add("open");
      ov?.setAttribute("aria-hidden", "false");
      btn?.setAttribute("aria-expanded", "true");
    };
    const cs = () => {
      ov?.classList.remove("open");
      ov?.setAttribute("aria-hidden", "true");
      btn?.setAttribute("aria-expanded", "false");
    };
    const onOvClick = (e: MouseEvent) => {
      if (e.target === ov) cs();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cs();
    };
    btn?.addEventListener("click", op);
    cl?.addEventListener("click", cs);
    ov?.addEventListener("click", onOvClick);
    document.addEventListener("keydown", onKey);
    const links = ov ? Array.from(ov.querySelectorAll(".overlay-link")) : [];
    links.forEach((a) => a.addEventListener("click", cs));

    /* ---- scroll reveal ---- */
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (es) => {
          es.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io?.unobserve(en.target);
            }
          });
        },
        { threshold: 0.14 }
      );
      document.querySelectorAll(".reveal").forEach((el) => io!.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    }

    /* ---- monochrome dotted globe with orbit + nodes ---- */
    const c = document.getElementById("globe") as HTMLCanvasElement | null;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let onResize: (() => void) | null = null;

    if (c) {
      const x = c.getContext("2d")!;
      let W = 0,
        H = 0,
        dpr = 1,
        pts: number[][] = [],
        ang = 0;
      const tilt = 0.5;
      const size = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = c.clientWidth;
        H = c.clientHeight;
        c.width = Math.max(1, Math.round(W * dpr));
        c.height = Math.max(1, Math.round(H * dpr));
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const build = () => {
        size();
        const N = W < 420 ? 360 : 620,
          ga = Math.PI * (3 - Math.sqrt(5));
        pts = [];
        for (let i = 0; i < N; i++) {
          const y = 1 - (i / (N - 1)) * 2,
            r = Math.sqrt(Math.max(0, 1 - y * y)),
            th = i * ga;
          pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
        }
      };
      const draw = () => {
        x.clearRect(0, 0, W, H);
        const R = Math.min(W, H) * 0.4,
          cx = W / 2,
          cy = H / 2,
          ca = Math.cos(ang),
          sa = Math.sin(ang),
          ct = Math.cos(tilt),
          st = Math.sin(tilt);
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const xr = p[0] * ca - p[2] * sa,
            zr = p[0] * sa + p[2] * ca;
          const yr = p[1] * ct - zr * st,
            zr2 = p[1] * st + zr * ct;
          const depth = (zr2 + 1) / 2;
          const sx = cx + xr * R,
            sy = cy + yr * R,
            a = 0.05 + 0.28 * depth,
            sz = 0.5 + 1.2 * depth;
          x.fillStyle = "rgba(18,21,28," + a.toFixed(3) + ")";
          x.beginPath();
          x.arc(sx, sy, sz, 0, 6.283);
          x.fill();
        }
        x.save();
        x.translate(cx, cy);
        x.rotate(-0.5);
        const ra = R * 1.28,
          rb = R * 0.42;
        x.strokeStyle = "rgba(18,21,28,0.16)";
        x.lineWidth = 1;
        x.beginPath();
        x.ellipse(0, 0, ra, rb, 0, 0, 6.283);
        x.stroke();
        const na = ang * 1.6,
          nx = Math.cos(na) * ra,
          ny = Math.sin(na) * rb;
        x.fillStyle = "rgba(18,21,28,0.85)";
        x.beginPath();
        x.arc(nx, ny, 3.2, 0, 6.283);
        x.fill();
        const n2 = na + 2.1,
          nx2 = Math.cos(n2) * ra,
          ny2 = Math.sin(n2) * rb;
        x.fillStyle = "rgba(18,21,28,0.5)";
        x.beginPath();
        x.arc(nx2, ny2, 2.2, 0, 6.283);
        x.fill();
        x.restore();
        ang += 0.0016;
      };
      const frame = () => {
        draw();
        if (!reduce) raf = requestAnimationFrame(frame);
      };
      const start = () => {
        build();
        if (reduce) draw();
        else {
          if (raf) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(frame);
        }
      };
      onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(start, 180);
      };
      window.addEventListener("resize", onResize);
      start();
    }

    return () => {
      btn?.removeEventListener("click", op);
      cl?.removeEventListener("click", cs);
      ov?.removeEventListener("click", onOvClick);
      document.removeEventListener("keydown", onKey);
      links.forEach((a) => a.removeEventListener("click", cs));
      io?.disconnect();
      if (onResize) window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <>
      <nav>
        <a className="brand" href="#top" aria-label="Nums AI — home">
          <span className="brand-mark" aria-hidden="true"></span>
          <span className="brand-word" role="img" aria-label="nums ai"></span>
        </a>
        <div className="nav-links">
          <a href="#why">Why numbers</a>
          <a href="#what">What it does</a>
          <a href="#use">Use cases</a>
          <a href="#contact">Contact</a>
          <a href="/careers/">Careers</a>
        </div>
        <button
          className="menu-btn"
          id="menuBtn"
          aria-label="Open menu"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
        </button>
      </nav>

      <div
        className="overlay"
        id="overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden="true"
      >
        <button className="overlay-close" id="menuClose" aria-label="Close menu">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
        <nav className="overlay-menu" aria-label="Overlay menu">
          <a className="overlay-link" href="#why">
            Why numbers
          </a>
          <a className="overlay-link" href="#what">
            What it does
          </a>
          <a className="overlay-link" href="#use">
            Use cases
          </a>
          <a className="overlay-link" href="#contact">
            Contact
          </a>
          <a className="overlay-link" href="/careers/">
            Careers
          </a>
        </nav>
      </div>

      <header className="hero" id="top">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>
              Predicting the world
              <br />
              through numbers.
            </h1>
            <p className="hero-sub">
              A foundation model that predicts across every industry — in a
              single inference pass.
            </p>
          </div>
          <div className="globe-wrap">
            <canvas id="globe" aria-hidden="true"></canvas>
          </div>
        </div>
      </header>

      <section className="sec" id="why">
        <div className="wrap">
          <span className="eyebrow reveal">Why numbers</span>
          <h2 className="reveal">Numbers are the language of the world.</h2>
          <p className="lead reveal">
            Language lives in words; industry lives in numbers. What to price,
            who to treat, which unit will fail, where demand moves next — every
            decision that moves an industry is a question buried in a table.
          </p>
          <div
            className="why-viz reveal"
            role="img"
            aria-label="Five numeric inputs — price, demand, unit cost, fraud risk and capacity — converging into a single enterprise decision."
          >
            <svg viewBox="0 0 960 300" preserveAspectRatio="xMidYMid meet">
              <text className="lbl" x="58" y="26">
                INPUTS
              </text>
              <path
                className="link"
                pathLength={1}
                style={{ transitionDelay: "250ms" }}
                d="M268,54 C 430,54 528,150 690,150"
              />
              <path
                className="link"
                pathLength={1}
                style={{ transitionDelay: "340ms" }}
                d="M268,102 C 430,102 528,150 690,150"
              />
              <path
                className="link"
                pathLength={1}
                style={{ transitionDelay: "430ms" }}
                d="M268,150 C 430,150 528,150 690,150"
              />
              <path
                className="link"
                pathLength={1}
                style={{ transitionDelay: "520ms" }}
                d="M268,198 C 430,198 528,150 690,150"
              />
              <path
                className="link"
                pathLength={1}
                style={{ transitionDelay: "610ms" }}
                d="M268,246 C 430,246 528,150 690,150"
              />
              <rect className="tile" x="58" y="33" width="210" height="42" rx="8" />
              <text className="tlabel" x="74" y="59">
                Price
              </text>
              <text className="tval" x="252" y="59">
                $59
              </text>
              <circle className="dot" cx="268" cy="54" r="3" />
              <rect className="tile" x="58" y="81" width="210" height="42" rx="8" />
              <text className="tlabel" x="74" y="107">
                Demand
              </text>
              <text className="tval" x="252" y="107">
                8,240
              </text>
              <circle className="dot" cx="268" cy="102" r="3" />
              <rect className="tile" x="58" y="129" width="210" height="42" rx="8" />
              <text className="tlabel" x="74" y="155">
                Unit cost
              </text>
              <text className="tval" x="252" y="155">
                $41
              </text>
              <circle className="dot" cx="268" cy="150" r="3" />
              <rect className="tile" x="58" y="177" width="210" height="42" rx="8" />
              <text className="tlabel" x="74" y="203">
                Fraud risk
              </text>
              <text className="tval" x="252" y="203">
                0.07
              </text>
              <circle className="dot" cx="268" cy="198" r="3" />
              <rect className="tile" x="58" y="225" width="210" height="42" rx="8" />
              <text className="tlabel" x="74" y="251">
                Capacity
              </text>
              <text className="tval" x="252" y="251">
                12k
              </text>
              <circle className="dot" cx="268" cy="246" r="3" />
              <rect className="out" x="690" y="104" width="210" height="92" rx="10" />
              <text className="out-k" x="795" y="140">
                DECISION
              </text>
              <text className="out-v" x="795" y="170">
                Ship at $59
              </text>
            </svg>
          </div>
        </div>
      </section>

      <section className="features" id="what">
        <div className="wrap">
          <span className="eyebrow reveal">What it does</span>
          <h2 className="reveal">
            One foundation model.
            <br />
            Every table. No pipelines.
          </h2>
          <p className="lead reveal">
            One model, pre-trained once, reads any table and fills in the value
            you need — with no task-specific training and no pipeline to
            maintain. The workflow that once took months collapses into a single
            inference.
          </p>
          <div className="feat-grid">
            <div className="feat reveal">
              <span className="feat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
                </svg>
              </span>
              <h3>Numerical reasoning.</h3>
              <p>
                It sees the patterns of numbers and fills in the missing values.
                It answers predictive questions that LLMs cannot.
              </p>
            </div>
            <div className="feat reveal">
              <span className="feat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 3 7l9 5 9-5-9-5Z" />
                  <path d="M3 12l9 5 9-5M3 17l9 5 9-5" />
                </svg>
              </span>
              <h3>One model. Every industry.</h3>
              <p>
                A single foundation model that predicts across commerce,
                healthcare, finance, manufacturing, and defense.
              </p>
            </div>
            <div className="feat reveal">
              <span className="feat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
                </svg>
              </span>
              <h3>Seconds, not months.</h3>
              <p>
                Typical ML projects take weeks to months. It takes seconds — from
                raw data to predictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="use">
        <div className="wrap">
          <span className="eyebrow reveal">Use cases</span>
          <h2 className="reveal">Different questions. One answer.</h2>
          <p className="lead reveal">
            Across industries the questions look different, but the shape is
            always the same — a value missing from a table, waiting to be filled.
            Here is that one model, put to work.
          </p>
          <div className="uc-grid">
            <div className="uc reveal">
              <div className="uc-head">
                <span className="ind">Commerce</span>
                <span className="q">
                  What discount rate maximizes profit next month — and where does
                  it stop paying off?
                </span>
              </div>
              <div className="uc-table-wrap">
                <table className="uc-table">
                  <thead>
                    <tr>
                      <th>Price</th>
                      <th>Discount</th>
                      <th className="pred">
                        <span className="dot"></span>Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>$59</td>
                      <td>0%</td>
                      <td className="pred">$128K</td>
                    </tr>
                    <tr>
                      <td>$59</td>
                      <td>10%</td>
                      <td className="pred">$151K</td>
                    </tr>
                    <tr>
                      <td>$59</td>
                      <td>20%</td>
                      <td className="pred">$139K</td>
                    </tr>
                    <tr className="dots">
                      <td>⋯</td>
                      <td>⋯</td>
                      <td className="pred">⋯</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="uc reveal">
              <div className="uc-head">
                <span className="ind">Retail</span>
                <span className="q">
                  How many units will each SKU sell next month, given price and
                  promotion?
                </span>
              </div>
              <div className="uc-table-wrap">
                <table className="uc-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Promo</th>
                      <th className="pred">
                        <span className="dot"></span>Units
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SKU-19</td>
                      <td>$29</td>
                      <td>No</td>
                      <td className="pred">4,120</td>
                    </tr>
                    <tr>
                      <td>SKU-77</td>
                      <td>$59</td>
                      <td>Yes</td>
                      <td className="pred">1,880</td>
                    </tr>
                    <tr>
                      <td>SKU-08</td>
                      <td>$15</td>
                      <td>Yes</td>
                      <td className="pred">9,540</td>
                    </tr>
                    <tr className="dots">
                      <td>⋯</td>
                      <td>⋯</td>
                      <td>⋯</td>
                      <td className="pred">⋯</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="uc reveal">
              <div className="uc-head">
                <span className="ind">Finance</span>
                <span className="q">
                  Which transactions are anomalous versus each account&apos;s own
                  baseline?
                </span>
              </div>
              <div className="uc-table-wrap">
                <table className="uc-table">
                  <thead>
                    <tr>
                      <th>Txn</th>
                      <th>Avg 30d</th>
                      <th>Amount</th>
                      <th className="pred">
                        <span className="dot"></span>Anomaly
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TXN-41</td>
                      <td>$30K</td>
                      <td>$28K</td>
                      <td className="pred">0.04</td>
                    </tr>
                    <tr>
                      <td>TXN-77</td>
                      <td>$30K</td>
                      <td>$1.5M</td>
                      <td className="pred">0.96</td>
                    </tr>
                    <tr>
                      <td>TXN-90</td>
                      <td>$49K</td>
                      <td>$52K</td>
                      <td className="pred">0.07</td>
                    </tr>
                    <tr className="dots">
                      <td>⋯</td>
                      <td>⋯</td>
                      <td>⋯</td>
                      <td className="pred">⋯</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="contact">
        <div className="wrap">
          <span className="eyebrow reveal">Contact</span>
          <h2 className="reveal">Build with us.</h2>
          <p className="lead reveal">
            Bring us your data, or bring us your ambition. Run a proof of concept
            on your own tables, or join the team building the model — either way,
            we&apos;d like to hear from you.
          </p>
          <a className="mail reveal" href="mailto:contact@nums.world">
            contact@nums.world
          </a>
          <div className="contact-grid">
            <div className="contact-card reveal">
              <span className="ind">Proof of concept</span>
              <p>
                Have a prediction problem sitting in a table? We&apos;ll run it
                through the model with you and show what a single inference pass
                can do.
              </p>
            </div>
            <a className="contact-card contact-card-link reveal" href="/careers/">
              <span className="ind">Careers</span>
              <p>
                We&apos;re looking for researchers and engineers who want to shape
                a foundation model for the world&apos;s tables. Tell us what
                you&apos;d build.
              </p>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap foot">
          <a className="brand" href="#top" aria-label="Nums AI — home">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-word" role="img" aria-label="nums ai"></span>
          </a>
          <span className="copy">© 2026 Nums AI Inc.</span>
        </div>
      </footer>
    </>
  );
}
