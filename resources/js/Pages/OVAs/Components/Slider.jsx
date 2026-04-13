import { useEffect } from "react";

const BASE_OVA = "/OVAs/Matematicas/Adicion-Sustraccion";
const BASE_SHR = "/OVAs/Shared";

export default function Slider() {

  useEffect(() => {
    // Neutralizar padding que Inertia agrega al #app
    const app = document.getElementById("app");
    if (app) { app.style.padding = "0"; app.style.margin = "0"; }

    // Cargar jQuery + FlexSlider igual que el blade original
    function loadScript(src, onload) {
      const s = document.createElement("script");
      s.src = src;
      s.onload = onload;
      document.body.appendChild(s);
      return s;
    }

    let jqScript, fsScript;

    jqScript = loadScript(
      `${BASE_OVA}/js/jquery-1.10.2.min.js`,
      () => {
        fsScript = loadScript(
          `${BASE_OVA}/js/slider/jquery.flexslider-min.js`,
          () => {
            window.$(".flexslider").flexslider({
              animation: "fade",
              controlsContainer: ".flexslider",
            });

            function pausar() {
              window.$("audio").trigger("pause");
              window.$("audio").prop("currentTime", 0);
            }

            [1, 2, 3, 4].forEach((n) => {
              window.$(`.repro_audio${n}`).on("click", function () {
                pausar();
                window.$(`#audio${n}`).get(0).play();
              });
            });
          }
        );
      }
    );

    return () => {
      if (jqScript) jqScript.remove();
      if (fsScript) fsScript.remove();
      if (app) { app.style.padding = ""; app.style.margin = ""; }
    };
  }, []);

  return (
    <div className="flex-container">
      <div className="flexslider">
        <ul className="slides">

          <li>
            <a href="#">
              <img src={`${BASE_SHR}/slider/slide_modal_conoce.png`} alt="Conoce el OVA" />
              <img src={`${BASE_OVA}/images/sound/sound_icon.png`} className="sonidoslider repro_audio1" alt="" draggable={false} />
              <audio id="audio1" src={`${BASE_OVA}/sounds/tutorial/tutorial_conoce.mp3`} />
            </a>
          </li>

          <li>
            <img src={`${BASE_OVA}/images/sound/sound_icon.png`} className="sonidoslider repro_audio2" alt="" draggable={false} />
            <img src={`${BASE_SHR}/slider/slide_modal_aprende_mas.png`} alt="Aprende más" />
            <audio id="audio2" src={`${BASE_OVA}/sounds/tutorial/tutorial_aprende_mas.mp3`} />
          </li>

          <li>
            <img src={`${BASE_OVA}/images/sound/sound_icon.png`} className="sonidoslider repro_audio3" alt="" draggable={false} />
            <img src={`${BASE_SHR}/slider/slide_modal_repasemos.png`} alt="Repasemos" />
            <audio id="audio3" src={`${BASE_OVA}/sounds/tutorial/tutorial_repasemos.mp3`} />
          </li>

          <li>
            <img src={`${BASE_OVA}/images/sound/sound_icon.png`} className="sonidoslider repro_audio4" alt="" draggable={false} />
            <img src={`${BASE_SHR}/slider/slide_modal_evaluemos.png`} alt="Evaluemos" />
            <audio id="audio4" src={`${BASE_OVA}/sounds/tutorial/tutorial_evaluemos.mp3`} />
          </li>

        </ul>
      </div>
    </div>
  );
}